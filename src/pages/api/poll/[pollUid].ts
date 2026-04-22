import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID!;
const questionsDatabaseId = process.env.NOTION_QUESTIONS_DATABASE_ID!;
const answersDatabaseId = process.env.NOTION_ANSWERS_DATABASE_ID!;

// Type definitions for Notion properties
type NotionProperty<T extends string, N> = { type: T } & { [key in T]: N };
type NotionTitle = NotionProperty<'title', { text: { content: string } }[]>;
type NotionRichText = NotionProperty<
  'rich_text',
  { text: { content: string } }[]
>;
type NotionSelect = NotionProperty<'select', { name: string } | null>;
type NotionDate = NotionProperty<'date', { start: string } | null>;
type NotionNumber = NotionProperty<'number', number | null>;
type NotionCheckbox = NotionProperty<'checkbox', boolean>;

// Frontend data structures
interface QuestionData {
  questionUid: string;
  text: string;
  type: string;
  options?: string[];
  min?: number;
  max?: number;
  isRequired: boolean;
  order: number;
}

interface PollDataV2 {
  pollUid: string;
  title: string;
  description: string;
  visibility: string;
  deadline: string | null;
  status: string;
  questions: QuestionData[];
  hasVoted: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { pollUid, voterId } = req.query;
  if (!pollUid || typeof pollUid !== 'string') {
    return res.status(400).json({ message: 'Poll UID is required.' });
  }

  try {
    // 1. Find the poll in the 'Polls' database
    const pollResponse = await notion.databases.query({
      database_id: pollsDatabaseId,
      filter: { property: 'PollUID', rich_text: { equals: pollUid } },
    });

    if (pollResponse.results.length === 0) {
      return res.status(404).json({ message: 'Poll not found.' });
    }
    const pollPage = pollResponse.results[0] as PageObjectResponse;

    // 2. Check if the user has already voted (if voterId is provided)
    let hasVoted = false;
    if (voterId && typeof voterId === 'string') {
      const answerResponse = await notion.databases.query({
        database_id: answersDatabaseId,
        filter: {
          and: [
            { property: 'VoterID', rich_text: { equals: voterId } },
            { property: 'PollRef', relation: { contains: pollPage.id } },
          ],
        },
        page_size: 1,
      });
      if (answerResponse.results.length > 0) {
        hasVoted = true;
      }
    }

    // 3. Find related questions in the 'Questions' database
    const questionsResponse = await notion.databases.query({
      database_id: questionsDatabaseId,
      filter: { property: 'PollRef', relation: { contains: pollPage.id } },
      sorts: [{ property: 'Order', direction: 'ascending' }],
    });

    // 3. Format poll and question data
    const pollProps = pollPage.properties;
    const formattedPoll: Omit<PollDataV2, 'questions'> = {
      pollUid: (pollProps.PollUID as NotionRichText).rich_text[0].text.content,
      title: (pollProps.Title as NotionTitle).title[0].text.content,
      description:
        (pollProps.Description as NotionRichText).rich_text[0]?.text.content ||
        '',
      visibility:
        (pollProps.Visibility as NotionSelect).select?.name || '限定公開',
      deadline: (pollProps.Deadline as NotionDate).date?.start || null,
      status: (pollProps.Status as NotionSelect).select?.name || '不明',
      hasVoted,
    };

    const formattedQuestions = (
      questionsResponse.results as PageObjectResponse[]
    ).map((q): QuestionData => {
      const qProps = q.properties;
      const optionsJson =
        (qProps.Options as NotionRichText).rich_text[0]?.text.content || '[]';
      let options: string[] = [];
      try {
        options = JSON.parse(optionsJson) as string[];
      } catch (e) {
        console.warn(
          `Failed to parse optionsJson for question ${q.id}:`,
          optionsJson,
          e
        );
        options = [];
      }
      return {
        questionUid: (qProps.QuestionUID as NotionRichText).rich_text[0].text
          .content,
        text: (qProps.Text as NotionTitle).title[0].text.content,
        type: (qProps.Type as NotionSelect).select?.name || 'text',
        options,
        min: (qProps.Min as NotionNumber).number ?? undefined,
        max: (qProps.Max as NotionNumber).number ?? undefined,
        isRequired: (qProps.IsRequired as NotionCheckbox).checkbox,
        order: (qProps.Order as NotionNumber).number || 0,
      };
    });

    const responseData: PollDataV2 = {
      ...formattedPoll,
      questions: formattedQuestions,
      hasVoted,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      message: 'Failed to fetch poll from Notion',
      error: (error as Error).message,
    });
  }
}
