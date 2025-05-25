// src/features/gallery/game/neko-punch/components/__tests__/ResultPage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { ResultPage } from '../ResultPage';

describe('ResultPage', () => {
  beforeEach(() => {
    // LocalStorageをモック化
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders reaction time when provided', () => {
    render(<ResultPage reactionTime={301} onRetry={() => {}} />);
    expect(screen.getByText('あなたの反応速度: 0.301 s')).toBeInTheDocument();
  });

  test('renders failure message when reaction time is null', () => {
    render(<ResultPage reactionTime={null} onRetry={() => {}} />);
    expect(
      screen.getByText('残念！ネコパンチは出なかったニャ...')
    ).toBeInTheDocument();
  });

  test('renders high score from LocalStorage', () => {
    const getItemMock = vi.fn().mockReturnValue('200.1');
    Object.defineProperty(window, 'localStorage', {
      value: {
        ...localStorage,
        getItem: getItemMock,
      },
    });
    render(<ResultPage reactionTime={200.5} onRetry={() => {}} />);
    expect(screen.getByText(/ハイスコア: 0.200 s/)).toBeInTheDocument();
    expect(getItemMock).toHaveBeenCalledWith('nekoPunchHighScore');
  });

  test('updates high score in LocalStorage if current time is better', () => {
    const setItemMock = vi.fn(() => {});
    Object.defineProperty(window, 'localStorage', {
      value: {
        ...localStorage,
        getItem: vi.fn().mockReturnValue('300.0'),
        setItem: setItemMock,
      },
    });
    render(<ResultPage reactionTime={250.5} onRetry={() => {}} />);
    //値は四捨五入される
    expect(screen.getByText(/ハイスコア: 0.251 s/)).toBeInTheDocument();
    expect(screen.getByText('✨新記録ニャ！✨')).toBeInTheDocument();
    expect(setItemMock).toHaveBeenCalledWith('nekoPunchHighScore', '250.5');
  });

  test('does not update high score if current time is not better', () => {
    const setItemMock = vi.fn(() => {});
    Object.defineProperty(window, 'localStorage', {
      value: {
        ...localStorage,
        getItem: vi.fn().mockReturnValue('200.0'),
        setItem: setItemMock,
      },
    });
    render(<ResultPage reactionTime={250.5} onRetry={() => {}} />);
    // テキストが分割されている可能性を考慮し、正規表現を使用
    expect(screen.getByText(/ハイスコア: 0.200 s/)).toBeInTheDocument();
    expect(screen.queryByText('✨新記録ニャ！✨')).not.toBeInTheDocument();
    expect(setItemMock).not.toHaveBeenCalled();
  });

  test('calls onRetry when retry button is clicked', async () => {
    const handleRetry = vi.fn();
    render(<ResultPage reactionTime={300.5} onRetry={handleRetry} />);
    const retryButton = screen.getByRole('button', { name: 'もう一度遊ぶ' });
    await userEvent.click(retryButton);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
