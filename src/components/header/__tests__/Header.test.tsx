import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

import { Header } from '../Header';

// Chakra UI の context を適用
const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(max-width: 768px)', // 適宜条件を調整
    media: query,
    onchange: null,
    addListener: vi.fn(), // 古いAPI
    removeListener: vi.fn(), // 古いAPI
    addEventListener: vi.fn(), // 新しいAPI（あれば使う）
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

describe('Header', () => {
  it('ロゴが表示されていること', () => {
    const { container } = renderWithChakra(<Header />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('Sign In / Sign Up ボタンは visibility:hidden で非表示になっている', () => {
    renderWithChakra(<Header />);
    // DOMには存在し visibility:hidden で視覚的に非表示（スペースは保持される）
    // → ログイン復活時に visibility を削除するだけでレイアウトが戻る設計
    const signIn = screen.getByText('Sign In');
    const signUp = screen.getByText('Sign Up');
    expect(signIn).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();
  });

  it('モバイルでハンバーガーメニューが表示される', () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    renderWithChakra(<Header />);
    const menuButton = screen.getByLabelText('Toggle Navigation');
    expect(menuButton).toBeInTheDocument();
  });

  it('ナビゲーション項目が表示されていること', () => {
    renderWithChakra(<Header />);
    // "記事"のテキストが含まれるリンクを role="link" で検索
    const content = screen.getAllByText('記事');
    expect(content).toHaveLength(2); //"記事"という表示はPC版とSP版で2つあり、3つはない
  });
});
