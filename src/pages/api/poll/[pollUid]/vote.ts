import { Client } from '@notionhq/client';
import { NextApiRequest, NextApiResponse } from 'next';
// nanoid is not used in this file, removed import

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID;
const votesDatabaseId = process.env.NOTION_VOTES_DATABASE_ID;

// Define the expected shape of the request body
interface VoteRequestBody {
  optionId: string;
  voterId: string; // Add voterId from cookie
}

// Define the expected structure of a poll page property value from Notion
interface NotionRichTextProperty {
  type: 'rich_text';
  rich_text: Array<{ type: 'text'; text: { content: string } }>;
}

interface NotionTitleProperty {
  type: 'title';
  title: Array<{ type: 'text'; text: { content: string } }>;
}

interface NotionNumberProperty {
  type: 'number';
  number: number | null;
}

interface NotionDateProperty {
  type: 'date';
  date: { start: string; end: string | null } | null;
}

interface NotionStatusProperty {
  type: 'status';
  status: { id: string; name: string; color: string } | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { pollUid } = req.query;
  const { optionId, voterId } = req.body as VoteRequestBody;

  if (!pollUid || typeof pollUid !== 'string' || !optionId || !voterId) {
    return res
      .status(400)
      .json({ message: 'Poll UID, Option ID, and Voter ID are required.' });
  }

  // Use the voterId from the cookie for duplicate checking
  const voterInfo = voterId;

  try {
    // 1. Check for duplicate vote using voterId
    if (voterInfo) {
      // Find the poll page ID first to filter votes by relation
      const pollPages = await notion.databases.query({
        database_id: pollsDatabaseId!,
        filter: {
          property: 'PollUID',
          rich_text: {
            equals: pollUid,
          },
        },
        page_size: 1,
      });

      const pollPage = pollPages.results[0];

      if (!pollPage) {
        return res.status(404).json({ message: 'Poll not found for voting.' });
      }

      // Now query votes using the poll page ID in the relation filter
      const existingVotesWithPoll = await notion.databases.query({
        database_id: votesDatabaseId!,
        filter: {
          and: [
            {
              property: 'VoterInfo',
              rich_text: {
                equals: voterInfo, // Check against the voterId from cookie
              },
            },
            {
              property: 'PollRef',
              relation: {
                contains: pollPage.id, // Filter by the poll page ID
              },
            },
          ],
        },
      });

      if (existingVotesWithPoll.results.length > 0) {
        return res.status(409).json({ message: 'すでに投票しています。' });
      }
    }

    // 2. Record the vote in the Votes database
    // Find the poll page ID again to create the relation
    const pollPagesForVoteRecord = await notion.databases.query({
      database_id: pollsDatabaseId!,
      filter: {
        property: 'PollUID',
        rich_text: {
          equals: pollUid,
        },
      },
      page_size: 1,
    });

    const pollPageForVoteRecord = pollPagesForVoteRecord.results[0];

    if (!pollPageForVoteRecord) {
      return res
        .status(404)
        .json({ message: 'Poll not found for vote recording.' });
    }

    await notion.pages.create({
      parent: {
        database_id: votesDatabaseId!,
      },
      properties: {
        PollRef: {
          type: 'relation',
          relation: [{ id: pollPageForVoteRecord.id }],
        },
        SelectedOptionID: {
          type: 'rich_text',
          rich_text: [{ type: 'text', text: { content: optionId } }],
        },
        // Conditionally add VoterInfo property
        ...(voterInfo && {
          VoterInfo: {
            type: 'rich_text',
            rich_text: [{ type: 'text', text: { content: voterInfo } }],
          },
        }),
        // VotedAt will be automatically set by Notion Created Time property
      },
    });

    // 3. Update the vote count in the Polls database
    // Retrieve the current poll data to update options and total votes
    const currentPollPage = await notion.pages.retrieve({
      page_id: pollPageForVoteRecord.id,
    });

    // Ensure the result is a PageObjectResponse to access properties
    if (!('properties' in currentPollPage)) {
      return res.status(500).json({
        message: 'Invalid page object received when retrieving for update.',
      });
    }

    // Access properties dynamically and assert their types
    const currentOptionsProperty = currentPollPage.properties['Options'] as
      | NotionRichTextProperty
      | undefined;
    const currentTotalVotesProperty = currentPollPage.properties[
      'TotalVotes'
    ] as NotionNumberProperty | undefined;

    const optionsJson = currentOptionsProperty?.rich_text[0]?.text.content;
    let options: Array<{ id: string; text: string; votes: number }> = [];
    if (optionsJson) {
      try {
        options = JSON.parse(optionsJson) as Array<{
          id: string;
          text: string;
          votes: number;
        }>;
      } catch (parseError) {
        console.error('Failed to parse options JSON for update:', parseError);
        // Decide how to handle this error - maybe abort update or log and continue
      }
    }

    // Find the selected option and increment its vote count
    const updatedOptions = options.map((option) => {
      if (option.id === optionId) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });

    const newTotalVotes = (currentTotalVotesProperty?.number || 0) + 1; // Increment total votes

    await notion.pages.update({
      page_id: pollPageForVoteRecord.id,
      properties: {
        Options: {
          type: 'rich_text',
          rich_text: [
            { type: 'text', text: { content: JSON.stringify(updatedOptions) } },
          ],
        },
        TotalVotes: {
          type: 'number',
          number: newTotalVotes,
        },
      },
    });

    // Return the updated poll data (optional, frontend can refetch)
    // For simplicity, let's refetch the updated data to return
    const updatedPollResponse = await notion.databases.query({
      database_id: pollsDatabaseId!,
      filter: {
        property: 'PollUID',
        rich_text: {
          equals: pollUid,
        },
      },
      page_size: 1,
    });

    const updatedPollPage = updatedPollResponse.results[0];

    if (!updatedPollPage || !('properties' in updatedPollPage)) {
      // Should not happen if update was successful, but handle defensively
      return res
        .status(500)
        .json({ message: 'Failed to retrieve updated poll data.' });
    }

    // Re-use the formatting logic from the GET endpoint
    // Access properties dynamically and assert their types
    const pollUidProperty = updatedPollPage.properties['PollUID'] as
      | NotionRichTextProperty
      | undefined;
    const titleProperty = updatedPollPage.properties['Title'] as
      | NotionTitleProperty
      | undefined;
    const descriptionProperty = updatedPollPage.properties['Description'] as
      | NotionRichTextProperty
      | undefined;
    const optionsProperty = updatedPollPage.properties['Options'] as
      | NotionRichTextProperty
      | undefined;
    const deadlineProperty = updatedPollPage.properties['Deadline'] as
      | NotionDateProperty
      | undefined;
    const totalVotesProperty = updatedPollPage.properties['TotalVotes'] as
      | NotionNumberProperty
      | undefined;
    const statusProperty = updatedPollPage.properties['Status'] as
      | NotionStatusProperty
      | undefined;

    const title = titleProperty?.title[0]?.text.content || 'Untitled Poll';
    const description = descriptionProperty?.rich_text[0]?.text.content || '';
    const optionsJsonUpdated = optionsProperty?.rich_text[0]?.text.content;
    const deadline = deadlineProperty?.date?.start || null;
    const totalVotesUpdated = totalVotesProperty?.number || 0;
    const status = statusProperty?.status?.name || '不明';

    let optionsUpdated: Array<{ id: string; text: string; votes: number }> = [];
    if (optionsJsonUpdated) {
      try {
        optionsUpdated = JSON.parse(optionsJsonUpdated) as Array<{
          id: string;
          text: string;
          votes: number;
        }>;
      } catch (parseError) {
        console.error('Failed to parse updated options JSON:', parseError);
      }
    }

    // Ensure pollUid is a string before using it
    const finalPollUidUpdated =
      pollUidProperty?.rich_text[0]?.text.content || '';

    const formattedUpdatedPollData = {
      pollUid: finalPollUidUpdated,
      title,
      description,
      options: optionsUpdated,
      deadline,
      totalVotes: totalVotesUpdated,
      status,
    };

    res.status(200).json(formattedUpdatedPollData);
  } catch (error: unknown) {
    console.error('Notion API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      message: 'Failed to process vote in Notion',
      error: errorMessage,
    });
  }
}
