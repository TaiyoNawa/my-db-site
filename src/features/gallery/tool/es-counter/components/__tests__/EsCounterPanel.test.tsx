// src/features/gallery/tool/es-counter/components/__tests__/EsCounterPanel.test.tsx
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen, waitFor } from '@/test/test-utils';

import { DEFAULT_SETTINGS } from '../../utils/presets';
import { EsCounterPanel } from '../EsCounterPanel';

const defaultPanel = {
  id: 'test-panel-1',
  title: '',
  text: '',
  settings: DEFAULT_SETTINGS,
  isPreviewVisible: false,
};

const defaultProps = {
  panel: defaultPanel,
  canMoveLeft: false,
  canMoveRight: false,
  canDelete: false,
  onTextChange: vi.fn(),
  onTitleChange: vi.fn(),
  onSettingsChange: vi.fn(),
  onTogglePreview: vi.fn(),
  onMoveLeft: vi.fn(),
  onMoveRight: vi.fn(),
  onDelete: vi.fn(),
  onCopy: vi.fn(),
};

describe('EsCounterPanel', () => {
  it('正しくレンダリングされる', () => {
    render(<EsCounterPanel {...defaultProps} />);
    expect(screen.getByTestId('es-counter-panel')).toBeInTheDocument();
  });

  it('テキストエリアが存在する', () => {
    render(<EsCounterPanel {...defaultProps} />);
    expect(screen.getByTestId('panel-textarea')).toBeInTheDocument();
  });

  it('タイトル入力欄が存在する', () => {
    render(<EsCounterPanel {...defaultProps} />);
    expect(screen.getByTestId('panel-title-input')).toBeInTheDocument();
  });

  it('空テキストで0文字と表示される', () => {
    render(<EsCounterPanel {...defaultProps} />);
    expect(screen.getByTestId('char-count')).toHaveTextContent('0文字');
  });

  it('テキストが入力されると文字数が更新される', () => {
    render(
      <EsCounterPanel
        {...defaultProps}
        panel={{ ...defaultPanel, text: 'テスト' }}
      />
    );
    expect(screen.getByTestId('char-count')).toHaveTextContent('3文字');
  });

  it('最大文字数超過時に超過表示される', () => {
    render(
      <EsCounterPanel
        {...defaultProps}
        panel={{
          ...defaultPanel,
          text: 'あいうえおかきくけこ',
          settings: { ...DEFAULT_SETTINGS, maxLength: 5 },
        }}
      />
    );
    expect(screen.getByTestId('char-count')).toHaveTextContent('超過');
  });

  it('タイトルが表示される', () => {
    render(
      <EsCounterPanel
        {...defaultProps}
        panel={{ ...defaultPanel, title: '自己PR' }}
      />
    );
    const titleInput =
      screen.getByTestId<HTMLInputElement>('panel-title-input');
    expect(titleInput.value).toBe('自己PR');
  });

  it('コピーボタンが存在する', () => {
    render(<EsCounterPanel {...defaultProps} />);
    expect(screen.getByText('コピー')).toBeInTheDocument();
  });

  it('canDelete=false のとき削除ボタンが無効になる', () => {
    render(<EsCounterPanel {...defaultProps} canDelete={false} />);
    const deleteBtn = screen.getByLabelText('リセット / 削除');
    expect(deleteBtn).toBeDisabled();
  });

  it('canDelete=true のとき削除ボタンが有効になる', () => {
    render(<EsCounterPanel {...defaultProps} canDelete={true} />);
    const deleteBtn = screen.getByLabelText('リセット / 削除');
    expect(deleteBtn).not.toBeDisabled();
  });

  it('削除ダイアログでリセットを選ぶとタイトルと本文がクリアされて閉じる', async () => {
    const user = userEvent.setup();
    const onTextChange = vi.fn();
    const onTitleChange = vi.fn();

    render(
      <EsCounterPanel
        {...defaultProps}
        canDelete={true}
        panel={{ ...defaultPanel, title: '自己PR', text: '入力済みテキスト' }}
        onTextChange={onTextChange}
        onTitleChange={onTitleChange}
      />
    );

    await user.click(screen.getByLabelText('リセット / 削除'));

    expect(
      screen.getByRole('button', { name: 'リセット' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'リセット' }));

    expect(onTitleChange).toHaveBeenCalledWith('');
    expect(onTextChange).toHaveBeenCalledWith('');

    await waitFor(() => {
      expect(
        screen.queryByText(
          'このパネルをリセットまたは削除しますか？入力済みのテキストは失われます。'
        )
      ).not.toBeInTheDocument();
    });
  });
});
