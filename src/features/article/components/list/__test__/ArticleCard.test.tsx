import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { ArticleCard } from '../ArticleCard';

const testProps1 = {
  eyeCatch: 'article.webp',
  category: 'レポート',
  title: '東京都ITサービス業売上高トップ100',
  description: '東京都のITサービス業の売上高ランキングを発表します。',
  url: 'https://db.futurewoods.co.jp/',
};

const testProps2 = {
  eyeCatch: 'article.webp',
  category: 'レポート',
  title:
    '東京都ITサービス業売上高トップ100東京都ITサービス業売上高トップ100東京都ITサービス業売上高トップ100東京都ITサービス業売上高トップ100東京都ITサービス業売上高トップ100東京都ITサービス業売上高トップ100',
  description:
    '東京都のITサービス業の売上高ランキングを発表します。このランキングは、東京都内のITサービス業の売上高をもとにしています。データは2025/03/17時点のものです。詳細はSales Radarをご覧ください。',
  url: 'https://db.futurewoods.co.jp/',
};

describe('ArticleCard.tsxのテスト', () => {
  it('画像が適切に表示される', () => {
    render(<ArticleCard {...testProps1} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', testProps1.eyeCatch);
    expect(image).toHaveAttribute('alt', testProps1.title);
  });

  it('category, title, descriptionの文字がそれぞれ表示される', () => {
    render(<ArticleCard {...testProps1} />);
    expect(screen.getByText(testProps1.category)).toBeInTheDocument();
    expect(screen.getByText(testProps1.title)).toBeInTheDocument();
    expect(screen.getByText(testProps1.description)).toBeInTheDocument();
  });

  it('リンクが適切である', () => {
    render(<ArticleCard {...testProps1} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', testProps1.url);
  });
  it('titleが60文字以内で表示される', () => {
    render(<ArticleCard {...testProps2} />);
    const title = screen.getByText(testProps2.title.slice(0, 60) + '...');
    expect(title).toBeInTheDocument();
    expect(title.textContent?.length).toBeLessThanOrEqual(103);
  });
  it('descriptionが50文字以内で表示される', () => {
    render(<ArticleCard {...testProps2} />);
    const description = screen.getByText(
      testProps2.description.slice(0, 50) + '...'
    );
    expect(description).toBeInTheDocument();
    expect(description.textContent?.length).toBeLessThanOrEqual(103);
  });
});
