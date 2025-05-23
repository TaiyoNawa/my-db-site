// pages/api/notion/fetch-markdown.ts
import { fetchNotionPageContent } from '@/lib/notion/fetchNotionPageContent';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId } = req.query;
  if (!pageId || typeof pageId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid pageId' });
  }

  try {
    const markdown = await fetchNotionPageContent(pageId);
    res.status(200).json({ markdown });
  } catch (error) {
    console.error('Error fetching markdown:', error);
    res.status(500).json({ error: 'Failed to fetch markdown' });
  }
}
