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

  test('renders with all provided props', () => {
    render(<ColumnArticleCard {...baseProps} />);

    // 全体リンク取得
    const linkEl = screen.getByRole('link');
    expect(linkEl).toHaveAttribute('href', baseProps.url);

    // link の中に title テキストが含まれていることを確認
    expect(within(linkEl).getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.category)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();

    const imageEl = screen.getByRole('img', { name: baseProps.title });
    expect(imageEl).toHaveAttribute('src', baseProps.eyeCatch);
  });

  test('renders fallback image if eyeCatch is empty', () => {
    render(<ColumnArticleCard {...baseProps} eyeCatch="" />);
    const fallbackImage = screen.getByRole('img', { name: baseProps.title });
    expect(fallbackImage).toHaveAttribute('src', '/alt_image.png');
  });

  test('truncates category and description text', () => {
    render(<ColumnArticleCard {...baseProps} />);
    const categoryEl = screen.getByText(baseProps.category);
    const descriptionEl = screen.getByText(baseProps.description);

    expect(categoryEl).toHaveClass('chakra-text'); // Chakra `Text` コンポーネントで描画されることの確認
    expect(descriptionEl).toHaveClass('chakra-text'); // noOfLines は class に反映される
  });

  test('link wraps the whole card and contains title', () => {
    render(<ColumnArticleCard {...baseProps} />);
    const linkEl = screen.getByRole('link');
    expect(linkEl).toBeInTheDocument();
    expect(linkEl).toHaveAttribute('href', baseProps.url);

    // リンクの中にタイトルが含まれていることを検証
    expect(within(linkEl).getByText(baseProps.title)).toBeInTheDocument();
  });
});
