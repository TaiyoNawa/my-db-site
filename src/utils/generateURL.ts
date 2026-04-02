//src/utils/generateURL.ts
/**
 * 環境に応じたベースURLを取得する関数
 * OGタグのクローラーはSSR時のHTMLを参照するため、絶対URLが必須。
 * 優先順位: NEXT_PUBLIC_SITE_URL（固定本番URL）> NEXT_PUBLIC_VERCEL_URL（デプロイ自動生成）> localhost
 */
export const getBaseUrl = (): string => {
  // ブラウザ環境では location.origin を使用
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 本番の固定URL（Vercelの環境変数で明示的に指定する）
  // URLを変更する場合はこの環境変数だけ更新すればよい
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return siteUrl;
  }

  // NEXT_PUBLIC_VERCEL_URLはvercel側で自動で設定される環境変数。デプロイごとに異なる
  // 例： https://your-branch-name.vercel.app
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
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
