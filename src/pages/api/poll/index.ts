import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID!;

// Utility type for Notion properties
type NotionProperty<T extends string, N> = { type: T } & { [key in T]: N };
type NotionTitle = NotionProperty<'title', { text: { content: string } }[]>;
type NotionRichText = NotionProperty<
  'rich_text',
  { text: { content: string } }[]
>;
type NotionSelect = NotionProperty<'select', { name: string } | null>;
type NotionDate = NotionProperty<'date', { start: string } | null>;
type NotionNumber = NotionProperty<'number', number | null>;

// Data structure for a single poll in the list
interface PollListItem {
  pollUid: string;
  title: string;
  description: string;
  status: string;
  deadline: string | null;
  questionCount: number;
  eyeCatchImage: string | null;
  totalVotes: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { sortBy = 'newest' } = req.query;

  const sorts =
    sortBy === 'popular'
      ? [{ property: 'TotalVotes', direction: 'descending' as const }]
      : [{ property: 'CreatedAt', direction: 'descending' as const }];

  try {
    const response = await notion.databases.query({
      database_id: pollsDatabaseId,
      filter: {
        property: 'Visibility',
        select: {
          equals: '全体公開',
        },
      },
      sorts: sorts,
    });

    const polls = (response.results as PageObjectResponse[]).map(
      (page): PollListItem => {
        const props = page.properties;
        const eyeCatchImageProp = props.EyeCatchImage as NotionRichText;
        const totalVotesProp = props.TotalVotes as NotionNumber;
        const descriptionProp = props.Description as NotionRichText;
        return {
          pollUid: (props.PollUID as NotionRichText).rich_text[0].text.content,
          title: (props.Title as NotionTitle).title[0].text.content,
          description: descriptionProp?.rich_text[0]?.text.content || '',
          status: (props.Status as NotionSelect).select?.name || '不明',
          deadline: (props.Deadline as NotionDate).date?.start || null,
          questionCount: (props.QuestionCount as NotionNumber).number || 0,
          eyeCatchImage: eyeCatchImageProp?.rich_text[0]?.text.content || null,
          totalVotes: totalVotesProp?.number || 0,
        };
      }
    );

    res.status(200).json(polls);
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      message: 'Failed to fetch polls from Notion',
      error: (error as Error).message,
    });
  }
}
