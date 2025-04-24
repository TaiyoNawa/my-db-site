// Spotify APIを使用して曲を検索する
import { NextApiRequest, NextApiResponse } from 'next';

import { getSpotifyAccessToken } from '@/utils/getSpotifyToken';

type Track = {
  //SpotifyTrackItemから、external_urlsをexternal_urls.spotifyに変更した型
  id: string;
  name: string;
  url: string;
};
type SpotifyTrackItem = {
  //Itemの型
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
};
type SpotifyTrackResponseItem = {
  //Spotify APIのレスポンスの型
  tracks: {
    items: SpotifyTrackItem[];
  };
};

export default async function handler(
  req: NextApiRequest, //リクエスト用変数を引数として受け取る
  // NextApiRequestはNext.jsのAPIルートで使用されるリクエストオブジェクト
  // req.queryはクエリパラメータを取得するためのプロパティ
  // req.queryはオブジェクトで、クエリパラメータのキーと値を持つ
  // 例えば、/api/spotify/search?keyword=YOASOBI の場合、req.query.keywordは"YOASOBI"になる
  res: NextApiResponse //レスポンス用変数を引数として受け取る
  // NextApiResponseはNext.jsのAPIルートで使用されるレスポンスオブジェクト
  // res.status(200)はHTTPステータスコード200を返す
) {
  const { keyword = 'YOASOBI' } = req.query; //受け取ったクエリパラメータをkeywordに格納

  try {
    const token = await getSpotifyAccessToken(); //アクセストークンを取得する
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      String(keyword)
    )}&type=track&limit=12`; //検索URLを作成する

    const searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); //fetch()でSpotify APIにリクエストを送信する。引数にはURLとヘッダー情報を指定する

    if (!searchRes.ok) throw new Error('検索失敗'); //エラー処理

    const data = (await searchRes.json()) as SpotifyTrackResponseItem; //レスポンスをJSON形式で取得する
    const tracks: Track[] = (data.tracks?.items || [])
      .filter(
        //filterでnullやundefinedを除外する
        (item) => item && item.id && item.name && item.external_urls?.spotify
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        url: item.external_urls.spotify,
      }));

    res.status(200).json(tracks); //成功した場合は、HTTPステータスコード200を返し、取得した曲の情報をJSON形式でレスポンスする
  } catch (err) {
    //エラー処理
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
