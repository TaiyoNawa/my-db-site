import { Client } from '@notionhq/client';

import type { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const getNewSignedImageUrlByTitle = async (title: string): Promise<string> => {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'タイトル',
      title: {
        equals: title,
      },
    },
  });

  if (res.results.length === 0)
    throw new Error('No page found with that title');

  const page = res.results[0];

  type NotionFile = {
    type: 'file' | 'external';
    file?: { url: string };
    external?: { url: string };
  };
  type ThumbnailProperty = {
    id: string;
    type: 'files';
    files: NotionFile[];
  };
  type PageProperties = {
    [key: string]: unknown;
    サムネイル画像?: ThumbnailProperty;
  };

  if (!('properties' in page)) {
    throw new Error('Page does not have properties');
  }

  const props = page.properties as PageProperties;
  const thumbnailProp = props['サムネイル画像'];

  const newUrl =
    thumbnailProp?.type === 'files' && thumbnailProp.files.length > 0
      ? thumbnailProp.files[0]?.type === 'file'
        ? thumbnailProp.files[0].file?.url
        : thumbnailProp.files[0]?.type === 'external'
          ? thumbnailProp.files[0].external?.url
          : ''
      : '';

  return typeof newUrl === 'string' ? newUrl : '';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, title } = req.query;

  if (!url || typeof url !== 'string' || !title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid URL or title' });
  }

  try {
    const newUrl = await getNewSignedImageUrlByTitle(title);
    res.status(200).json({ newUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch new thumbnail' });
  }
}
