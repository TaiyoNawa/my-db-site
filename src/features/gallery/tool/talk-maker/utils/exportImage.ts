// src/features/gallery/tool/talk-maker/utils/exportImage.ts

/**
 * pixelRatio=1 で絵文字のズレが軽減されるか実験したが、保存画像の解像度が
 * 大きく下がり画質が悪化する方が問題だったため 2 に戻した。
 * アイコンのズレはアバター周りの構造修正（余白調整・中央揃え等）で
 * 解消した可能性が高く、pixelRatio 自体が原因ではなかったとみられる。
 */
const EXPORT_PIXEL_RATIO = 2;

/**
 * プレビューのDOMをPNG画像としてダウンロードする。
 * html-to-image は初期バンドルを軽く保つためエクスポート時に dynamic import する。
 * 失敗時は例外を投げるので、呼び出し側でトースト表示すること。
 */
export async function exportTalkImage(node: HTMLElement): Promise<void> {
  const { toPng } = await import('html-to-image');

  const dataUrl = await toPng(node, {
    pixelRatio: EXPORT_PIXEL_RATIO,
    cacheBust: true,
    width: node.offsetWidth,
    height: node.offsetHeight,
    // 中央寄せ(margin: auto)の計算済みマージンがクローンDOMへ引き継がれ、
    // 描画が右へずれて見切れるため、キャプチャ時はマージンを打ち消す
    style: { margin: '0' },
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T]/g, '')
    .slice(0, 14);

  const link = document.createElement('a');
  link.download = `talk-maker-${timestamp}.png`;
  link.href = dataUrl;
  link.click();
}
