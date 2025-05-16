// pages/api/article.ts
import { fetchNotionDBItems } from '@/lib/notion/fetchNotionDBItems';
import { fetchNotionPageContent } from '@/lib/notion/fetchNotionPageContent';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const allItemsResponse = await fetchNotionDBItems();
    const allItems = allItemsResponse?.results ?? [];

    const target = allItems.find((item) => item.url === id);

    if (!target) {
      return res.status(404).json({ error: 'Not found' });
    }

    const markdown = await fetchNotionPageContent(target.page_id);
    const relatedArticles = allItems
      .filter((item) => item.url !== id)
      .slice(0, 3);

    return res.status(200).json({
      article: {
        ...target,
        markdown,
      },
      relatedArticles,
    });
  } catch (e) {
    console.error('記事取得APIエラー(article.ts):', e);
    return res.status(500).json({ error: 'Failed to fetch article data' });
  }
}
