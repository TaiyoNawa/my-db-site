// Footer.test.tsx
import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { Footer } from '../Footer';

describe('Footer コンポーネント', () => {
  it('各セクションヘッダーが表示される', () => {
    render(<Footer />);

    expect(screen.getByText('記事')).toBeInTheDocument();
    expect(screen.getByText('ギャラリー')).toBeInTheDocument();
    expect(screen.getByText('検索')).toBeInTheDocument();
    expect(screen.getByText('お問い合わせ・要望')).toBeInTheDocument();
  });

  it('著作権テキストが表示される', () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 TaiyoNawa. All rights reserved./i)
    ).toBeInTheDocument();
  });

  it('リンクが正しく表示されている', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: '記事' })).toHaveAttribute(
      'href',
      '/article'
    );
    expect(screen.getByRole('link', { name: 'ギャラリー' })).toHaveAttribute(
      'href',
      '/gallery'
    );
    expect(screen.getByRole('link', { name: '検索' })).toHaveAttribute(
      'href',
      '/search'
    );
    expect(
      screen.getByRole('link', { name: 'お問い合わせ・要望' })
    ).toHaveAttribute('href', '#');
    expect(screen.getByRole('link', { name: 'ランキング' })).toHaveAttribute(
      'href',
      '#'
    );
    expect(screen.getByRole('link', { name: 'リンク' })).toHaveAttribute(
      'href',
      '/article/link'
    );
  });
});
