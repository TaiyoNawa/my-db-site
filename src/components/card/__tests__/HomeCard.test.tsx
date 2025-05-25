import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { HomeCard } from '../HomeCard';

const testProps1 = {
  eyeCatch:
    'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  title: '画像(Image)',
  description: 'Unsplashの画像を検索できます',
  url: '/search/image',
  category: 'カテゴリー',
};

const testProps2 = {
  //文字が長いときに省略されるかのテスト用
  eyeCatch:
    'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  title:
    '画像(Image)画像(Image)画像(Image)画像(Image)画像(Image)画像(Image)画像(Image)',
  description:
    'Unsplashの画像を検索できますUnsplashの画像を検索できますUnsplashの画像を検索できますUnsplashの画像を検索できます',
  url: '/search/image',
};

describe('HomeCard.tsxのテスト', () => {
  it('画像が適切に表示される', () => {
    render(<HomeCard {...testProps1} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    // Next.js <Image>のsrc属性に画像パスが含まれていることを確認
    expect(image.getAttribute('src')).toContain(
      encodeURIComponent(testProps1.eyeCatch)
    );
    expect(image).toHaveAttribute('alt', testProps1.title);
  });

  it('category, title, descriptionの文字がそれぞれ表示される', () => {
    render(<HomeCard {...testProps1} />);
    expect(screen.getByText(testProps1.category)).toBeInTheDocument();
    expect(screen.getByText(testProps1.title)).toBeInTheDocument();
    expect(screen.getByText(testProps1.description)).toBeInTheDocument();
  });

  it('リンクが適切である', () => {
    render(<HomeCard {...testProps1} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', testProps1.url);
  });
  it('titleが40文字以内で表示される', () => {
    render(<HomeCard {...testProps2} />);
    const title = screen.getByText(testProps2.title.slice(0, 40) + '...');
    expect(title).toBeInTheDocument();
    expect(title.textContent?.length).toBeLessThanOrEqual(43);
  });
  it('descriptionが60文字以内で表示される', () => {
    render(<HomeCard {...testProps2} />);
    const description = screen.getByText(
      testProps2.description.slice(0, 60) + '...'
    );
    expect(description).toBeInTheDocument();
    expect(description.textContent?.length).toBeLessThanOrEqual(63);
  });
});
