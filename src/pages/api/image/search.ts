// pages/api/image/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type UnsplashImage = {
  id: string;
  urls: { small: string };
  alt_description: string;
  user: {
    name: string;
    links: { html: string };
  };
  links: {
    html: string;
    download_location: string;
  };
};

type UnsplashApiResponse = {
  results: UnsplashImage[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, page = '1', per_page = '30' } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'クエリが無効です。' });
  }

  const pageStr = Array.isArray(page) ? page[0] : page;
  const per_pageStr = Array.isArray(per_page) ? per_page[0] : per_page;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    //アクセスキーが未定義場合の処理
    return res.status(500).json({
      error: 'Server misconfiguration: UNSPLASH_ACCESS_KEY is not defined.',
    });
  }
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&page=${pageStr}&per_page=${per_pageStr}&client_id=${accessKey}`;

  try {
    const response = await fetch(url);
    // console.log('Returned:', response.headers.get('x-per-page')); // ← 実際の取得数を表示

    if (!response.ok) throw new Error('Unsplashからの取得失敗');

    const data = (await response.json()) as UnsplashApiResponse;
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch from Unsplash' });
  }
}
