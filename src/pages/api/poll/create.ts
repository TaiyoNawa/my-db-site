import { Client } from '@notionhq/client';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID!;
const questionsDatabaseId = process.env.NOTION_QUESTIONS_DATABASE_ID!;

// Types for a single question in the request
interface QuestionData {
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'slider' | 'text';
  options?: string[]; // For single/multiple choice
  min?: number; // For slider
  max?: number; // For slider
  isRequired: boolean;
  order: number;
}

// Type for the entire request body
interface CreatePollRequestV2Body {
  title: string;
  description?: string;
  visibility: '全体公開' | '限定公開';
  deadline?: string | null;
  questions: QuestionData[];
  eyeCatchImage?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { title, description, visibility, deadline, questions, eyeCatchImage } =
    req.body as CreatePollRequestV2Body;

  // Deadline validation
  if (deadline) {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    if (deadlineDate <= now) {
      return res.status(400).json({
        message: '締切は現在時刻より未来に設定してください。',
      });
    }
  }

  // Basic validation
  if (
    !title ||
    !visibility ||
    !questions ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return res.status(400).json({
      message: 'Title, visibility, and at least one question are required.',
    });
  }

  // Ensure at least one question is required
  const hasRequiredQuestion = questions.some((q) => q.isRequired);
  if (!hasRequiredQuestion) {
    return res.status(400).json({
      message: '少なくとも一つの質問を必須回答に設定してください。',
    });
  }

  const pollUid = nanoid(10);

  try {
    // 1. Create the main poll page in the 'Polls' database
    const newPollPage = await notion.pages.create({
      parent: { database_id: pollsDatabaseId },
      properties: {
        PollUID: { rich_text: [{ text: { content: pollUid } }] },
        Title: { title: [{ text: { content: title } }] },
        Description: {
          rich_text: [{ text: { content: description || '' } }],
        },
        Visibility: { select: { name: visibility } },
        Deadline: { date: deadline ? { start: deadline } : null },
        Status: { select: { name: '受付中' } },
        QuestionCount: { number: questions.length },
        EyeCatchImage: {
          rich_text: eyeCatchImage
            ? [{ text: { content: eyeCatchImage } }]
            : [],
        },
      },
    });

    // 2. Create each question page in the 'Questions' database
    const questionPromises = questions.map((q) => {
      const questionUid = nanoid(10);
      return notion.pages.create({
        parent: { database_id: questionsDatabaseId },
        properties: {
          QuestionUID: { rich_text: [{ text: { content: questionUid } }] },
          PollRef: { relation: [{ id: newPollPage.id }] },
          Text: { title: [{ text: { content: q.text } }] },
          Type: { select: { name: q.type } },
          Options: {
            rich_text: q.options
              ? [{ text: { content: JSON.stringify(q.options) } }]
              : [],
          },
          Min: { number: q.min ?? null },
          Max: { number: q.max ?? null },
          IsRequired: { checkbox: q.isRequired },
          Order: { number: q.order },
        },
      });
    });

    await Promise.all(questionPromises);

    res.status(201).json({ pollUid });
  } catch (error) {
    console.error('Notion API Error:', error);
    res.status(500).json({
      message: 'Failed to create poll in Notion',
      error: (error as Error).message,
    });
  }
}
