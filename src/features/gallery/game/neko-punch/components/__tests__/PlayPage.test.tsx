// src/features/gallery/game/neko-punch/components/__tests__/PlayPage.test.tsx
import { render, screen, act } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

import { PlayPage } from '../PlayPage';

describe('PlayPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('カウントダウンが表示される', () => {
    render(<PlayPage onEnd={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('カウントダウンから待機状態に遷移する', () => {
    render(<PlayPage onEnd={() => {}} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('ネコパンチを待て！')).toBeInTheDocument();
  });

  test('待機状態からランダム時間後に🐾が表示される', () => {
    render(<PlayPage onEnd={() => {}} />);
    act(() => {
      vi.advanceTimersByTime(3000); // カウントダウン終了
    });

    act(() => {
      vi.advanceTimersByTime(8000); // ランダム遅延最大値
    });

    expect(screen.getByText('🐾')).toBeInTheDocument();
  });

  //TODO: 実際のクリック時の挙動のテスト
});
