// src/features/gallery/tool/talk-maker/utils/image.ts

/** アイコン画像の出力サイズ（px） */
export const ICON_SIZE = 256;
/** 送信画像の最大辺（px） */
export const MESSAGE_IMAGE_MAX_SIZE = 640;

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
    img.src = src;
  });
}

/**
 * 画像を最大辺 maxSize 以下に縮小して dataURL で返す。
 * sessionStorage の容量制限（約5MB）に収めるため、保存する画像は必ず通すこと。
 */
export async function downscaleImage(
  dataUrl: string,
  maxSize: number,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(
    1,
    maxSize / Math.max(img.naturalWidth, img.naturalHeight)
  );
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('画像の変換に失敗しました');

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL(mimeType, 0.85);
}
