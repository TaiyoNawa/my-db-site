// pages/api/notion/index.ts
import { fetchNotionDBItems } from '@/lib/notion/fetchNotionDBItems';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const items = await fetchNotionDBItems();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching database items:', error);
    res.status(500).json({ message: 'Notion API error' });
  }
}
