//API設計メモ
// ImageList.tsx
//  └─ fetch('/api/image/search?query=cat&page=1&perPage=48')
//      ↓
// search.ts（APIルート）
// └─ handler(
//      req: NextApiRequest,
//      res: NextApiResponse
//    )
//    └─ req.query = { query: 'cat', page: '1', perPage: '48' }
//      ↓
//  Unsplash API へ fetch
//      ↓
//  res.json(...) でクライアントに戻す

// 💡補足：ファイル名（search.ts）の意味
// ファイル名（search.ts）は「ルーティング」の一部です：
//  pages/api/image/search.ts → /api/image/search にマップされる
// なので、fetch関数で明示的にファイル名 search.ts を書くわけではなく、
// URLパスに対応するAPIファイルが自動で呼び出されているわけです。
