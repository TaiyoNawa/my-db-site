// pages/api/image/random.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type UnsplashRandomImage = {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download_location: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return res.status(500).json({
      error: 'Server misconfiguration: UNSPLASH_ACCESS_KEY is not defined.',
    });
  }

  const { orientation = 'landscape', query = 'nature' } = req.query;

  const orientationString = Array.isArray(orientation)
    ? orientation[0]
    : orientation;
  const queryString = Array.isArray(query) ? query[0] : query;
  const url = `https://api.unsplash.com/photos/random?orientation=${orientationString}&query=${encodeURIComponent(
    queryString
  )}&client_id=${accessKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error('Unsplash APIからの取得に失敗しました。');

    const data = (await response.json()) as UnsplashRandomImage;

    res.status(200).json({
      id: data.id,
      imageUrl: data.urls.regular,
      alt: data.alt_description,
      authorName: data.user.name,
      authorLink: data.user.links.html,
      imageLink: data.links.html,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch from Unsplash' });
  }
}
