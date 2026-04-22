import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID!;
const questionsDatabaseId = process.env.NOTION_QUESTIONS_DATABASE_ID!;
const answersDatabaseId = process.env.NOTION_ANSWERS_DATABASE_ID!;

// Utility type for Notion properties
type NotionProperty<T extends string, N> = { type: T } & { [key in T]: N };
type NotionTitle = NotionProperty<'title', { text: { content: string } }[]>;
type NotionRichText = NotionProperty<
  'rich_text',
  { text: { content: string } }[]
>;
type NotionSelect = NotionProperty<'select', { name: string } | null>;
type NotionRelation = NotionProperty<'relation', { id: string }[]>;

interface QuestionInfo {
  questionUid: string;
  text: string;
  type: string;
  options?: string[];
}

interface ChoiceResult {
  [option: string]: number;
  submissionCount: number;
}

interface SliderResult {
  average: number;
  median: number;
  values: number[];
  submissionCount: number;
}

type TextResult = {
  texts: string[];
  submissionCount: number;
};

type QuestionResult = ChoiceResult | SliderResult | TextResult;

type ResultsData = {
  pollUid: string;
  title: string;
  description: string;
  questions: QuestionInfo[];
  results: {
    [questionUid: string]: QuestionResult;
  };
  totalSubmissions: number;
  deadline: string | null;
  hasVoted: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { pollUid, voterId: queryVoterId } = req.query;
  const voterId = Array.isArray(queryVoterId) ? queryVoterId[0] : queryVoterId;

  if (!pollUid || typeof pollUid !== 'string') {
    return res.status(400).json({ message: 'Poll UID is required.' });
  }

  try {
    // 1. Get Poll and Questions
    const pollResponse = await notion.databases.query({
      database_id: pollsDatabaseId,
      filter: { property: 'PollUID', rich_text: { equals: pollUid } },
    });
    if (pollResponse.results.length === 0) {
      return res.status(404).json({ message: 'Poll not found.' });
    }
    const pollPage = pollResponse.results[0] as PageObjectResponse;

    const questionsResponse = await notion.databases.query({
      database_id: questionsDatabaseId,
      filter: { property: 'PollRef', relation: { contains: pollPage.id } },
      sorts: [{ property: 'Order', direction: 'ascending' }],
    });
    const questions = (questionsResponse.results as PageObjectResponse[]).map(
      (q) => {
        const qProps = q.properties;
        const optionsContent =
          (qProps.Options as NotionRichText).rich_text[0]?.text.content || '[]';
        let options: string[] = [];
        try {
          options = JSON.parse(optionsContent) as string[];
        } catch {
          options = [];
        }
        return {
          questionUid: (qProps.QuestionUID as NotionRichText).rich_text[0].text
            .content,
          text: (qProps.Text as NotionTitle).title[0].text.content,
          type: (qProps.Type as NotionSelect).select?.name || 'text',
          options,
        };
      }
    );

    // 2. Get all Answers for the poll
    const allAnswers: PageObjectResponse[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;
    while (hasMore) {
      const answerResponse = await notion.databases.query({
        database_id: answersDatabaseId,
        filter: { property: 'PollRef', relation: { contains: pollPage.id } },
        start_cursor: startCursor,
      });
      answerResponse.results.forEach((r) => {
        if (r.object === 'page') {
          allAnswers.push(r as PageObjectResponse);
        }
      });
      hasMore = answerResponse.has_more;
      startCursor = answerResponse.next_cursor || undefined;
    }

    // 3. Process and aggregate results
    const results: { [questionUid: string]: QuestionResult } = {};
    const answersByQuestion: {
      [questionUid: string]: (string | number | string[])[];
    } = {};
    const voterIds = new Set<string>();
    let hasVoted = false;

    for (const answerPage of allAnswers) {
      const props = answerPage.properties;
      const questionRefId = (props.QuestionRef as NotionRelation).relation[0]
        ?.id;
      const currentVoterId = (props.VoterID as NotionRichText).rich_text[0]
        ?.text?.content;

      if (!questionRefId || !currentVoterId) continue;
      voterIds.add(currentVoterId);

      if (voterId && currentVoterId === voterId) {
        hasVoted = true;
      }

      const questionPage = questionsResponse.results.find(
        (q) => q.id === questionRefId
      ) as PageObjectResponse | undefined;
      const questionUid = (
        questionPage?.properties.QuestionUID as NotionRichText | undefined
      )?.rich_text[0]?.text.content;

      if (!questionUid) continue;

      if (!answersByQuestion[questionUid]) {
        answersByQuestion[questionUid] = [];
      }
      const answerContent = (props.Answer as NotionTitle).title[0]?.text
        ?.content;
      if (answerContent) {
        try {
          const parsedAnswer: unknown = JSON.parse(answerContent);
          answersByQuestion[questionUid].push(
            parsedAnswer as string | number | string[]
          );
        } catch {
          // Optionally log the error, but skip this answer
          // console.error('Failed to parse answerContent:', answerContent);
          continue;
        }
      }
    }

    for (const q of questions) {
      const answers = answersByQuestion[q.questionUid] || [];
      const submissionCount = answers.length;

      switch (q.type) {
        case 'single_choice':
        case 'multiple_choice': {
          const choiceCounts: Omit<ChoiceResult, 'submissionCount'> = {};
          if (Array.isArray(q.options)) {
            q.options.forEach((opt: string) => (choiceCounts[opt] = 0));
          }
          const flatAnswers: (string | number)[] = answers.flat();
          flatAnswers.forEach((ans: string | number) => {
            const ansStr = String(ans);
            if (choiceCounts[ansStr] !== undefined) {
              choiceCounts[ansStr]++;
            }
          });
          results[q.questionUid] = { ...choiceCounts, submissionCount };
          break;
        }
        case 'slider': {
          const values = answers.map((v) => Number(v)).filter((v) => !isNaN(v));
          values.sort((a, b) => a - b);
          const sum = values.reduce((acc, val) => acc + val, 0);
          const average = values.length > 0 ? sum / values.length : 0;

          let median = 0;
          if (values.length > 0) {
            const mid = Math.floor(values.length / 2);
            if (values.length % 2 === 0) {
              median = (values[mid - 1] + values[mid]) / 2;
            } else {
              median = values[mid];
            }
          }

          results[q.questionUid] = { average, median, values, submissionCount };
          break;
        }
        case 'text': {
          results[q.questionUid] = {
            texts: answers.map(String),
            submissionCount,
          };
          break;
        }
      }
    }

    const deadline =
      (
        pollPage.properties.Deadline as NotionProperty<
          'date',
          { start: string } | null
        >
      ).date?.start || null;

    const description =
      (
        pollPage.properties.Description as NotionProperty<
          'rich_text',
          { text: { content: string } }[]
        >
      ).rich_text[0]?.text.content || '';

    const responseData: ResultsData = {
      pollUid,
      title: (pollPage.properties.Title as NotionTitle).title[0].text.content,
      description,
      questions,
      results,
      totalSubmissions: voterIds.size,
      deadline,
      hasVoted,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      message: 'Failed to fetch poll results from Notion',
      error: (error as Error).message,
    });
  }
}
