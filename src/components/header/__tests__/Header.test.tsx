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
    renderWithChakra(<Header />);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('デスクトップで Sign In / Sign Up ボタンが表示される', () => {
    renderWithChakra(<Header />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
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
    expect(content[0]).toBeInTheDocument();
    expect(content[1]).toBeInTheDocument(); //記事という表示PC版とSM版で2つある
    expect(content[2]).toBeUndefined(); //3つはない
  });
});
