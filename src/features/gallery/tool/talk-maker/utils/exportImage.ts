// src/features/gallery/tool/talk-maker/utils/exportImage.ts

/**
 * プレビューのDOMをPNG画像としてダウンロードする。
 * html-to-image は初期バンドルを軽く保つためエクスポート時に dynamic import する。
 * 失敗時は例外を投げるので、呼び出し側でトースト表示すること。
 */
export async function exportTalkImage(node: HTMLElement): Promise<void> {
  const { toPng } = await import('html-to-image');

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
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
