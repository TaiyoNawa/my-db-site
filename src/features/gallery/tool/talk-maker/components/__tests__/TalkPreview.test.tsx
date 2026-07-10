// src/features/gallery/tool/talk-maker/components/__tests__/TalkPreview.test.tsx
import { describe, expect, it, vi } from 'vitest';

import { render } from '@/test/test-utils';

import { DEFAULT_SETTINGS } from '../../utils/presets';
import { TalkPreview } from '../TalkPreview';

const defaultProps = {
  messages: [],
  onUpdateMessage: vi.fn(),
  onRemoveMessage: vi.fn(),
};

describe('TalkPreview 背景', () => {
  it('backgroundImage未設定時はbackground-imageを持たない', () => {
    const { getByTestId } = render(
      <TalkPreview {...defaultProps} settings={DEFAULT_SETTINGS} />
    );
    const messageArea = getByTestId('talk-preview-background');
    expect(messageArea.style.backgroundImage).toBeFalsy();
  });

  it('カンマを含むdata URLでもbackground-imageが壊れずに反映される', () => {
    // Chakra の bgImage 経由だと "url(...)" がグラデーション判定処理で
    // "url-gradient(data:image/jpeg;base64, XXXX)" のように壊れていた回帰テスト
    const dataUrl = 'data:image/jpeg;base64,ABCD1234EFGH==';
    const { getByTestId } = render(
      <TalkPreview
        {...defaultProps}
        settings={{ ...DEFAULT_SETTINGS, backgroundImage: dataUrl }}
      />
    );
    const messageArea = getByTestId('talk-preview-background');

    // ブラウザ/jsdom は url() の中身を正規化してダブルクォートで囲むため、
    // 中身の値が保持されていること・不正な"gradient"表記に壊れていないことを検証する
    expect(messageArea.style.backgroundImage).toContain(dataUrl);
    expect(messageArea.style.backgroundImage).not.toContain('gradient');
  });
});
