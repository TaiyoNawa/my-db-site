import { Client } from '@notionhq/client';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const pollsDatabaseId = process.env.NOTION_POLLS_DATABASE_ID;

// Define the expected shape of the request body
interface CreatePollRequestBody {
  title: string;
  description?: string; // Optional
  options: string[];
  deadline?: string | null; // Optional
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { title, description, options, deadline } =
    req.body as CreatePollRequestBody;

  if (!title || !options || !Array.isArray(options) || options.length < 2) {
    return res
      .status(400)
      .json({ message: 'Title and at least two options are required.' });
  }

  const pollUid = nanoid(8); // Generate a short unique ID

  try {
    // Format options for Notion property
    const formattedOptions = options.map((optionText) => ({
      id: nanoid(6), // Unique ID for each option
      text: optionText,
      votes: 0,
    }));

    await notion.pages.create({
      parent: {
        database_id: pollsDatabaseId!, // Use non-null assertion as we expect this to be set in .env.local
      },
      properties: {
        PollUID: {
          type: 'rich_text',
          rich_text: [{ type: 'text', text: { content: pollUid } }],
        },
        Title: {
          type: 'title',
          title: [{ type: 'text', text: { content: title } }],
        },
        Description: {
          type: 'rich_text',
          rich_text: [{ type: 'text', text: { content: description || '' } }],
        },
        Options: {
          type: 'rich_text', // Storing as JSON string in a rich_text property
          rich_text: [
            {
              type: 'text',
              text: { content: JSON.stringify(formattedOptions) },
            },
          ],
        },
        Deadline: {
          type: 'date',
          date: deadline ? { start: deadline } : null,
        },
        TotalVotes: {
          type: 'number',
          number: 0,
        },
        Status: {
          type: 'status',
          status: { name: '受付中' }, // Default status
        },
      },
    });

    res.status(201).json({ pollUid });
  } catch (error) {
    console.error('Notion API Error:', error);
    // Provide a more specific error type if possible, or cast to Error
    res.status(500).json({
      message: 'Failed to create poll in Notion',
      error: (error as Error).message,
    });
  }
}
