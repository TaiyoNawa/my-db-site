import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '@/test/test-utils';

import { ClearModal } from '../ClearModal';

describe('ClearModalコンポーネントのテスト', () => {
  it('モーダルが開いているとき、タイトルとメッセージが表示されること', () => {
    render(<ClearModal isOpen={true} onClose={() => {}} onRetry={() => {}} />);

    // タイトルとメッセージが表示されていること
    expect(screen.getByText('🎉 ゲームクリア！ 🎉')).toBeInTheDocument();
    expect(
      screen.getByText('10回連続正解しました！おめでとうございます！')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'もう一度プレイ' })
    ).toBeInTheDocument();
  });

  it('「もう一度プレイ」ボタンをクリックすると onRetry が呼び出されること', () => {
    const handleRetry = vi.fn();
    render(
      <ClearModal isOpen={true} onClose={() => {}} onRetry={handleRetry} />
    );

    const retryButton = screen.getByRole('button', { name: 'もう一度プレイ' });
    fireEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('isOpen=false のときモーダルが表示されないこと', () => {
    render(<ClearModal isOpen={false} onClose={() => {}} onRetry={() => {}} />);

    expect(screen.queryByText('🎉 ゲームクリア！ 🎉')).not.toBeInTheDocument();
  });
});
