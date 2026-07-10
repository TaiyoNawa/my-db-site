// src/features/gallery/tool/talk-maker/utils/__tests__/exportImage.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { exportTalkImage } from '../exportImage';

const toPngMock = vi.fn();

vi.mock('html-to-image', () => ({
  toPng: (...args: unknown[]) => toPngMock(...args) as Promise<string>,
}));

describe('exportTalkImage', () => {
  beforeEach(() => {
    toPngMock.mockReset();
  });

  it('toPng の結果をダウンロードリンクとして発火する', async () => {
    toPngMock.mockResolvedValue('data:image/png;base64,xxxx');
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    const node = document.createElement('div');
    await exportTalkImage(node);

    expect(toPngMock).toHaveBeenCalledWith(
      node,
      expect.objectContaining({ pixelRatio: 2 })
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);

    clickSpy.mockRestore();
  });

  it('toPng が失敗したら例外を再送出する（呼び出し側でトースト表示するため）', async () => {
    toPngMock.mockRejectedValue(new Error('render failed'));

    const node = document.createElement('div');
    await expect(exportTalkImage(node)).rejects.toThrow('render failed');
  });
});
