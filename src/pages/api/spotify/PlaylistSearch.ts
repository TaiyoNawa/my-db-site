import { NextApiRequest, NextApiResponse } from 'next';

import { getSpotifyAccessToken } from '@/utils/getSpotifyToken';

type Playlist = {
  id: string;
  name: string;
  url: string;
};
type SpotifyPlaylistItem = {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
};
type SpotifyPlaylistResponseItem = {
  playlists: {
    items: SpotifyPlaylistItem[];
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
    )}&type=playlist&limit=8`;

    const searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!searchRes.ok) throw new Error('検索失敗'); //エラー処理

    const data = (await searchRes.json()) as SpotifyPlaylistResponseItem; //レスポンス
    const playlists: Playlist[] = (data.playlists?.items || [])
      .filter(
        (item) => item && item.id && item.name && item.external_urls?.spotify
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        url: item.external_urls.spotify,
      }));

    res.status(200).json(playlists);
  } catch (err) {
    //エラー処理
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
