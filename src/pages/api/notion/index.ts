// pages/api/notion/index.ts
import { fetchNotionDBItems } from '@/lib/notion/fetchNotionDBItems';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { pageSize, startCursor } = req.query;
    const size = pageSize ? parseInt(pageSize as string, 10) : undefined;
    const cursor = startCursor ? (startCursor as string) : undefined;

    const response = await fetchNotionDBItems(size, cursor);
    if (response && response.results && Array.isArray(response.results)) {
      res.status(200).json({
        results: response.results,
        next_cursor: response.next_cursor,
        has_more: response.has_more,
      });
    } else {
      console.error('Invalid response from fetchNotionDBItems:', response);
      res
        .status(500)
        .json({ message: 'Error fetching database items or invalid response' });
    }
  } catch (error) {
    console.error('Error fetching database items:', error);
    res.status(500).json({ message: 'Notion API error' });
  }
}
