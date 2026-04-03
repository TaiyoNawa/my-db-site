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

  it('著作権テキストが Haruhate 名義で表示される', () => {
    render(<Footer />);
    // コピーライト表記を Haruhate に変更済み
    expect(
      screen.getByText(/Haruhate\. All rights reserved\./i)
    ).toBeInTheDocument();
  });

  it('主要リンクが正しいhrefを持つ', () => {
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
    // お問い合わせページを /contact に設定済み
    expect(
      screen.getByRole('link', { name: 'お問い合わせ・要望' })
    ).toHaveAttribute('href', '/contact');
  });

  it('ギャラリー配下のリンクが正しい', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'マンガ' })).toHaveAttribute(
      'href',
      '/gallery/manga'
    );
    expect(screen.getByRole('link', { name: 'ゲーム' })).toHaveAttribute(
      'href',
      '/gallery/game'
    );
    // 便利ツール（アンケート移動先）
    expect(screen.getByRole('link', { name: '便利ツール' })).toHaveAttribute(
      'href',
      '/gallery/tool'
    );
    // リンク集はギャラリー配下に移動済み
    expect(screen.getByRole('link', { name: 'リンク集' })).toHaveAttribute(
      'href',
      '/gallery/link'
    );
  });
});
