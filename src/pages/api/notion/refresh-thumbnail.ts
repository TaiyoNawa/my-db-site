import { Client } from '@notionhq/client';

import type { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const getNewSignedImageUrl = async (slug: string): Promise<string> => {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'URL名',
      rich_text: {
        equals: slug,
      },
    },
  });

  if (res.results.length === 0) throw new Error('No page found with that slug');

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

  // Check if 'properties' exists on the page object
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
      : '/alt_image.png';

  return typeof newUrl === 'string' ? newUrl : '';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const parsed = new URL(url);
    const slug = parsed.pathname
      .split('/')
      .pop()
      ?.replace(/\.jpg|\.png|\.webp|\.jpeg$/, '');

    if (!slug) {
      return res.status(400).json({ error: 'Could not extract slug' });
    }

    const newUrl = await getNewSignedImageUrl(slug);
    res.status(200).json({ newUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch new thumbnail' });
  }
}
