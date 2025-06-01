import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '@/test/test-utils';

import { RightLeftGame } from '../RightLeftGame';

describe('RightLeftGameページのテスト', () => {
  it('初期状態で正しく表示されること', () => {
    render(<RightLeftGame />);
    expect(screen.getByText('右・左どっち？！')).toBeInTheDocument();
    expect(screen.getByText('現在の連続正解数: 0')).toBeInTheDocument();
    expect(screen.getByText('最高記録: 0')).toBeInTheDocument();
    expect(screen.getByText('右か左を選んでください！')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '左' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '右' })).toBeInTheDocument();
  });

  it('左右ボタンを押すとメッセージが変化すること', () => {
    render(<RightLeftGame />);
    const leftButton = screen.getByRole('button', { name: '左' });
    const rightButton = screen.getByRole('button', { name: '右' });

    fireEvent.click(leftButton);
    const message = screen.getByText(/正解！|不正解... /);
    expect(message).toBeInTheDocument();

    fireEvent.click(rightButton);
    const message2 = screen.getByText(/正解！|不正解... /);
    expect(message2).toBeInTheDocument();
  });

  it('10連続正解でゲームクリアモーダルが表示されること', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // 正解を常に 右 にする
    render(<RightLeftGame />);
    const rightButton = screen.getByRole('button', { name: '右' });

    for (let i = 0; i < 10; i++) {
      fireEvent.click(rightButton);
    }

    expect(
      screen.getByText('10回連続正解！！ゲームクリア！')
    ).toBeInTheDocument();
    expect(screen.getByText(/🎉 ゲームクリア！ 🎉/)).toBeInTheDocument();
  });
  //TODO: 25回同じ方向を高速でクリックすると警告モーダルが表示されることのテストの作成

  //   it('25回同じ方向を高速でクリックすると警告モーダルが表示されること', () => {
  //     vi.spyOn(Math, 'random').mockReturnValue(0.1); // 正解を常に 右 にする
  //     render(<RightLeftGame />);
  //     act(() => {
  //       const now = Date.now();
  //       vi.useFakeTimers();
  //       for (let i = 0; i < 25; i++) {
  //         vi.setSystemTime(now + i * 100); // 100ms 間隔
  //         fireEvent.click(screen.getByRole('button', { name: '左' }));
  //         const oneMoreButton = screen.queryByRole('button', { name: 'もう一度プレイ' });
  //         fireEvent.click(oneMoreButton);
  //       }
  //     });

  //     expect(screen.getByText(/左ばっか連打してない？/)).toBeInTheDocument();
  //     expect(screen.getByText('⚠️警告⚠️')).toBeInTheDocument();
  //     vi.useRealTimers();
  //   });
});
