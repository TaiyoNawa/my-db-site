import { NextApiRequest, NextApiResponse } from 'next';

import { getSpotifyAccessToken } from '@/utils/getSpotifyToken';

type Artist = {
  id: string;
  name: string;
  imageUrl: string;
  url: string;
};

type SpotifyArtistItem = {
  //Itemの型
  id: string;
  name: string;
  images: {
    url: string;
  }[];
  external_urls: {
    spotify: string;
  };
};
type SpotifyArtistResponseItem = {
  //Spotify APIのレスポンスの型
  artists: {
    items: SpotifyArtistItem[];
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { keyword = 'YOASOBI' } = req.query;

  try {
    const token = await getSpotifyAccessToken();
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      String(keyword)
    )}&type=artist&limit=24`;

    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!searchRes.ok) {
      const errBody = await searchRes.text();
      console.error('[spotify/ArtistSearch] 検索失敗:', searchRes.status, errBody);
      throw new Error('Artist search failed');
    }

    const data = (await searchRes.json()) as SpotifyArtistResponseItem;
    const artists: Artist[] = (data.artists?.items || [])
      .filter(
        (item) => item && item.id && item.name && item.external_urls?.spotify
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.images?.[0]?.url || '',
        url: item.external_urls.spotify,
      }));

    res.status(200).json(artists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
