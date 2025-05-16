import { render, screen, within } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

import { ColumnArticleCard } from '../ColumnArticleCard';

describe('ColumnArticleCard', () => {
  const baseProps = {
    eyeCatch: '/test-image.png',
    category: 'Testing',
    title: 'Test Article Title',
    description: 'This is a test description.',
    url: '/test-article',
  };

  describe('ColumnArticleCard', () => {
    const baseProps = {
      eyeCatch: '/test-image.png',
      category: 'Testing',
      title: 'Test Article Title',
      description: 'This is a test description.',
      url: '/test-article',
    };

    test('すべてのプロパティが指定された場合に正しくレンダリングされる', () => {
      render(<ColumnArticleCard {...baseProps} />);

      const linkEl = screen.getByRole('link');
      expect(linkEl).toHaveAttribute('href', baseProps.url);

      expect(within(linkEl).getByText(baseProps.title)).toBeInTheDocument();
      expect(screen.getByText(baseProps.category)).toBeInTheDocument();
      expect(screen.getByText(baseProps.description)).toBeInTheDocument();

      const imageEl = screen.getByRole('img', { name: baseProps.title });

      expect(imageEl).toHaveAttribute('src');

      const encodedPath = encodeURIComponent(baseProps.eyeCatch);
      expect(imageEl.getAttribute('src')).toContain(encodedPath);
    });

    test('eyeCatch が空の場合はフォールバック画像が表示される', () => {
      render(<ColumnArticleCard {...baseProps} eyeCatch="" />);
      const fallbackImage = screen.getByRole('img', { name: baseProps.title });
      expect(fallbackImage).toHaveAttribute('src');
      expect(fallbackImage.getAttribute('src')).toContain(
        encodeURIComponent('/fallback_image.png')
      );
    });

    test('カテゴリと説明文が省略されて表示される', () => {
      render(<ColumnArticleCard {...baseProps} />);
      const categoryEl = screen.getByText(baseProps.category);
      const descriptionEl = screen.getByText(baseProps.description);

      expect(categoryEl).toHaveClass('chakra-text');
      expect(descriptionEl).toHaveClass('chakra-text');
    });

    test('カード全体がリンクでラップされ、タイトルが含まれている', () => {
      render(<ColumnArticleCard {...baseProps} />);
      const linkEl = screen.getByRole('link');
      expect(linkEl).toBeInTheDocument();
      expect(linkEl).toHaveAttribute('href', baseProps.url);
      expect(within(linkEl).getByText(baseProps.title)).toBeInTheDocument();
    });

    test('画像の alt 属性が正しく設定されている', () => {
      render(<ColumnArticleCard {...baseProps} />);
      const imageEl = screen.getByRole('img', { name: baseProps.title });
      expect(imageEl).toHaveAttribute('alt', baseProps.title);
    });

    test('異なるカテゴリと説明文が正しく表示される', () => {
      const props = {
        ...baseProps,
        category: '別のカテゴリ',
        description: '異なる説明文の内容。',
      };
      render(<ColumnArticleCard {...props} />);
      expect(screen.getByText('別のカテゴリ')).toBeInTheDocument();
      expect(screen.getByText('異なる説明文の内容。')).toBeInTheDocument();
    });

    test('長いタイトルでも正しく表示される', () => {
      const longTitle = 'A'.repeat(100);
      render(<ColumnArticleCard {...baseProps} title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  test('カード全体がリンクでラップされ、タイトルが含まれている', () => {
    render(<ColumnArticleCard {...baseProps} />);
    const linkEl = screen.getByRole('link');
    expect(linkEl).toBeInTheDocument();
    expect(linkEl).toHaveAttribute('href', baseProps.url);

    // リンクの中にタイトルが含まれていることを検証
    expect(within(linkEl).getByText(baseProps.title)).toBeInTheDocument();
  });
});
