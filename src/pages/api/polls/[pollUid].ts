import { Client } from '@notionhq/client';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID;

// Define the expected structure of a poll page property value from Notion
interface NotionRichTextProperty {
  type: 'rich_text';
  rich_text: Array<{ type: 'text'; text: { content: string } }>;
}

interface NotionTitleProperty {
  type: 'title';
  title: Array<{ type: 'text'; text: { content: string } }>;
}

interface NotionDateProperty {
  type: 'date';
  date: { start: string; end: string | null } | null;
}

interface NotionNumberProperty {
  type: 'number';
  number: number | null;
}

interface NotionStatusProperty {
  type: 'status';
  status: { id: string; name: string; color: string } | null;
}

// Define the structure of the data to return to the frontend
interface PollData {
  pollUid: string;
  title: string;
  description?: string;
  options: Array<{ id: string; text: string; votes: number }>;
  deadline?: string | null;
  totalVotes: number;
  status: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { pollUid } = req.query;

  if (!pollUid || typeof pollUid !== 'string') {
    return res.status(400).json({ message: 'Poll UID is required.' });
  }

  try {
    // Search for the page with the matching PollUID
    const response = await notion.databases.query({
      database_id: pollsDatabaseId!, // Use non-null assertion
      filter: {
        property: 'PollUID',
        rich_text: {
          equals: pollUid,
        },
      },
    });

    const pollPage = response.results[0]; // Removed direct cast

    if (!pollPage) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Ensure the result is a PageObjectResponse to access properties
    if (!('properties' in pollPage)) {
      return res
        .status(500)
        .json({ message: 'Invalid page object received from Notion.' });
    }

    // Extract and format data from the Notion page properties
    // Access properties dynamically and assert their types
    const pollUidProperty = pollPage.properties['PollUID'] as
      | NotionRichTextProperty
      | undefined;
    const titleProperty = pollPage.properties['Title'] as
      | NotionTitleProperty
      | undefined;
    const descriptionProperty = pollPage.properties['Description'] as
      | NotionRichTextProperty
      | undefined;
    const optionsProperty = pollPage.properties['Options'] as
      | NotionRichTextProperty
      | undefined;
    const deadlineProperty = pollPage.properties['Deadline'] as
      | NotionDateProperty
      | undefined;
    const totalVotesProperty = pollPage.properties['TotalVotes'] as
      | NotionNumberProperty
      | undefined;
    const statusProperty = pollPage.properties['Status'] as
      | NotionStatusProperty
      | undefined;

    const title = titleProperty?.title[0]?.text.content || 'Untitled Poll';
    const description = descriptionProperty?.rich_text[0]?.text.content || '';
    const optionsJson = optionsProperty?.rich_text[0]?.text.content;
    const deadline = deadlineProperty?.date?.start || null;
    const totalVotes = totalVotesProperty?.number || 0;
    const status = statusProperty?.status?.name || '不明';

    let options: Array<{ id: string; text: string; votes: number }> = [];
    if (optionsJson) {
      try {
        options = JSON.parse(optionsJson) as Array<{
          id: string;
          text: string;
          votes: number;
        }>;
      } catch (parseError) {
        console.error('Failed to parse options JSON:', parseError);
        // Handle parsing error, maybe return an empty options array or an error response
      }
    }

    // Ensure pollUid is a string before using it
    const finalPollUid = pollUidProperty?.rich_text[0]?.text.content || '';

    const formattedPollData: PollData = {
      pollUid: finalPollUid,
      title,
      description,
      options,
      deadline,
      totalVotes,
      status,
    };

    res.status(200).json(formattedPollData);
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      message: 'Failed to fetch poll from Notion',
      error: (error as Error).message,
    });
  }
}
