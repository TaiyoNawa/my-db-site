//og:imageを取得するAPI
import * as cheerio from 'cheerio'; // HTMLパース用ライブラリ
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url' });
  }
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const ogImage = $('meta[property="og:image"]').attr('content');

    if (ogImage) {
      res.status(200).json({ ogImage });
    } else {
      res.status(404).json({ error: 'OG image not found' });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
}
