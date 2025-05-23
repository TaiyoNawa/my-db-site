// src/utils/extractImageKey.ts
// 画像のsrcから、画像のキー（path）を抽出するutility関数
export const extractImageKey = (url: string): string | null => {
  try {
    const { pathname } = new URL(url);
    // 例: /bucket-id/画像ごとにユニーク/image.png
    // → 「画像ごとにユニーク」な部分をキーに使いたい
    const parts = pathname.split('/').filter(Boolean); // 空要素を除く
    if (parts.length >= 3) {
      // /{bucketId}/{uniqueId}/{filename}
      return parts[1]; // uniqueId 部分（画像ごとに固定）
    }
    return null;
  } catch (error) {
    console.warn('extractImageKey failed', { url, error });
    return null;
  }
};
