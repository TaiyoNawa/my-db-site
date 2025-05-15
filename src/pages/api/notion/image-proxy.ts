// pages/api/image-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
  if (!url) {
    return res.status(400).send('Missing url query');
  }

  try {
    // S3等の外部一時URLをサーバー側でフェッチ
    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      return res.status(502).send('Bad gateway fetching image');
    }

    // オリジナルの Content-Type を引き継ぎ
    const contentType =
      imageRes.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // CDN キャッシュ（一日キャッシュ例）
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=3600'
    );

    // バイナリをそのまま返す
    const buffer = await imageRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Image proxy error:', err);
    res.status(500).send('Internal server error');
  }
}
