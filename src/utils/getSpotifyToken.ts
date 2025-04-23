// utils/getSpotifyToken.ts
//トークン取得関数
export async function getSpotifyAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    //↑fetch()でgetやpostリクエストを送信
    method: 'POST', //POSTメソッドを指定
    headers: {
      //リクエストヘッダーを指定
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials', //リクエストボディを指定
  });

  if (!res.ok) {
    throw new Error('アクセストークンの取得に失敗しました');
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token; // これをAPIに使う！
}
