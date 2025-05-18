//src/utils/generateURL.ts
/**
 * 環境に応じたベースURLを取得する関数
 * ブラウザ環境では現在のドメインを使用し、サーバー環境では環境変数または'http://localhost:3000'を使用
 */
export const getBaseUrl = (): string => {
  // ブラウザ環境では location.origin を使用
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // サーバー環境(テスト・本番環境)
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  //NEXT_PUBLIC_VERCEL_URLはvercel側で自動で設定される環境変数。デプロイごとに異なる
  //例： https://your-branch-name.vercel.app
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  // ローカル開発(localhost)など
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

/**
 * 指定されたパスに基づいてURLを生成する関数
 * @param path URLのパス部分
 * @returns 完全なURL
 */
export const generateUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  // パスがスラッシュで始まっている場合は、baseUrlの末尾のスラッシュを削除しない
  const separator = path.startsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${path}`;
};

// 後方互換性のために残しておく
export const HOST = getBaseUrl();
