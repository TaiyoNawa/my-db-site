import { Client } from '@notionhq/client';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID!;
const questionsDatabaseId = process.env.NOTION_QUESTIONS_DATABASE_ID!;
const answersDatabaseId = process.env.NOTION_ANSWERS_DATABASE_ID!;

interface AnswerData {
  questionUid: string;
  answer: string | string[] | number; // single_choice | multiple_choice | slider | text
}

interface SubmitRequestBody {
  voterId: string;
  answers: AnswerData[];
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
  const { voterId, answers } = req.body as SubmitRequestBody;

  if (
    !pollUid ||
    typeof pollUid !== 'string' ||
    !voterId ||
    !answers ||
    !Array.isArray(answers)
  ) {
    return res
      .status(400)
      .json({ message: 'Poll UID, Voter ID, and answers are required.' });
  }

  try {
    // 1. Find the poll page to get its ID
    const pollResponse = await notion.databases.query({
      database_id: pollsDatabaseId,
      filter: { property: 'PollUID', rich_text: { equals: pollUid } },
    });

    if (pollResponse.results.length === 0) {
      return res.status(404).json({ message: 'Poll not found.' });
    }
    const pollPage = pollResponse.results[0];

    // --- Deadline Check ---
    if (!('properties' in pollPage)) {
      // This should not happen if the query is correct, but it's a good safeguard.
      return res
        .status(500)
        .json({ message: 'Failed to retrieve full poll data.' });
    }
    const deadlineProp = pollPage.properties.Deadline;
    if (deadlineProp?.type === 'date' && deadlineProp.date?.start) {
      const deadline = new Date(deadlineProp.date.start);
      const now = new Date();
      if (now > deadline) {
        return res
          .status(403)
          .json({ message: 'このアンケートは締め切られました。' });
      }
    }

    // 2. Check for duplicate submission for this poll by this voter
    const existingAnswers = await notion.databases.query({
      database_id: answersDatabaseId,
      filter: {
        and: [
          { property: 'VoterID', rich_text: { equals: voterId } },
          { property: 'PollRef', relation: { contains: pollPage.id } },
        ],
      },
      page_size: 1,
    });

    if (existingAnswers.results.length > 0) {
      return res.status(409).json({ message: 'すでに回答しています。' });
    }

    // 3. Create answer pages and update total votes
    const createAnswerPromises = answers.map(async (ans) => {
      const questionResponse = await notion.databases.query({
        database_id: questionsDatabaseId,
        filter: {
          property: 'QuestionUID',
          rich_text: { equals: ans.questionUid },
        },
        page_size: 1,
      });

      if (questionResponse.results.length === 0) {
        console.warn(
          `Question with UID ${ans.questionUid} not found. Skipping.`
        );
        return null;
      }
      const questionPage = questionResponse.results[0];

      return notion.pages.create({
        parent: { database_id: answersDatabaseId },
        properties: {
          PollRef: { relation: [{ id: pollPage.id }] },
          QuestionRef: { relation: [{ id: questionPage.id }] },
          VoterID: { rich_text: [{ text: { content: voterId } }] },
          Answer: {
            title: [{ text: { content: JSON.stringify(ans.answer) } }],
          },
        },
      });
    });

    // Increment TotalVotes
    const totalVotesProp = pollPage.properties.TotalVotes;
    let currentTotalVotes = 0;
    if (totalVotesProp && totalVotesProp.type === 'number') {
      currentTotalVotes = Number(totalVotesProp.number) || 0;
    }

    const updateVotesPromise = notion.pages.update({
      page_id: pollPage.id,
      properties: {
        TotalVotes: {
          number: currentTotalVotes + 1,
        },
      },
    });

    // Run all promises concurrently
    const [results] = await Promise.all([
      Promise.all(createAnswerPromises),
      updateVotesPromise,
    ]);
    const filteredResults = results.filter(Boolean);

    if (filteredResults.length !== answers.length) {
      // This indicates some answers were skipped. Depending on requirements,
      // you might want to handle this differently (e.g., return a more specific error).
      console.warn(
        'Some answers were skipped because the corresponding questions were not found.'
      );
    }

    res.status(201).json({ message: 'Answers submitted successfully.' });
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      message: 'Failed to submit answers to Notion',
      error: (error as Error).message,
    });
  }
}
