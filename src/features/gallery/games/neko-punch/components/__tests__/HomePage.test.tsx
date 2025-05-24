// src/features/gallery/games/neko-punch/components/__tests__/HomePage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HomePage } from '../HomePage';

describe('HomePage', () => {
  test('ゲームタイトルとスタートボタンが表示される', () => {
    render(<HomePage onStart={() => {}} />);
    expect(
      screen.getByRole('heading', {
        name: 'ネコパンチ！一番反射が早いのは誰ニャ？',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'スタート' })
    ).toBeInTheDocument();
  });

  test('スタートボタンが押されるとhandleStartが呼ばれる', async () => {
    const handleStart = vi.fn();
    render(<HomePage onStart={handleStart} />);
    const startButton = screen.getByRole('button', { name: 'スタート' });
    await userEvent.click(startButton);
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  test('モーダルの説明表示ボタンが表示されている', () => {
    render(<HomePage onStart={() => {}} />);
    expect(screen.getByText('ルール説明')).toBeInTheDocument();
  });

  test('モーダルの文字が正しいことを確認', async () => {
    render(<HomePage onStart={() => {}} />);
    const explanationButton = screen.getAllByText('ルール説明');
    await userEvent.click(explanationButton[0]);
    expect(
      screen.getByText(
        '画面にネコの手(🐾)が表示されたら、黒枠内を素早くクリックしてください。反応速度が計測されます。'
      )
    ).toBeInTheDocument();
  });
});
