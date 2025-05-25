import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

import { ArticleFooter } from '../ArticleFooter';

describe('ArticleFooter', () => {
  test('renders with article data', () => {
    const article = [
      {
        page_id: '1',
        thumbnail: '/sample/image1.png',
        category: 'Technology',
        title: 'Sample Article 1',
        description: 'This is a description for sample article 1.',
        url: '/article/1',
        status: 'Published',
        ogDescription: 'OG Description 1',
        ogImage: '/sample/image1.png',
        releaseDate: '2023-10-27',
      },
      {
        page_id: '2',
        thumbnail: '/sample/image2.png',
        category: 'Lifestyle',
        title: 'Sample Article 2',
        description: 'This is a description for sample article 2.',
        url: '/article/2',
        status: 'Published',
        ogDescription: 'OG Description 2',
        ogImage: '/sample/image2.png',
        releaseDate: '2023-10-28',
      },
    ];
    render(<ArticleFooter article={article} />);
    const headingElement = screen.getByText('最近の記事');
    const article1Title = screen.getByText('Sample Article 1');
    const article2Title = screen.getByText('Sample Article 2');
    expect(headingElement).toBeInTheDocument();
    expect(article1Title).toBeInTheDocument();
    expect(article2Title).toBeInTheDocument();
  });

  test('each article card has correct link', () => {
    const article = [
      {
        page_id: '1',
        thumbnail: '/alt/alt_image.png',
        category: 'Technology',
        title: 'Sample Article 1',
        description: 'This is a description for sample article 1.',
        url: '/article/1',
        status: 'Published',
        ogDescription: '',
        ogImage: '',
        releaseDate: '',
      },
    ];
    render(<ArticleFooter article={article} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/article/1');
    expect(link).toHaveTextContent('Sample Article 1');
  });

  test('does not render divider when only one article', () => {
    const article = [
      {
        page_id: '1',
        thumbnail: '/alt/alt_image.png',
        category: 'Technology',
        title: 'Sample Article',
        description: 'Description here.',
        url: '/article/1',
        status: 'Published',
        ogDescription: '',
        ogImage: '',
        releaseDate: '',
      },
    ];
    render(<ArticleFooter article={article} />);
    const dividers = screen.queryAllByTestId('article-divider');
    expect(dividers.length).toBe(0);
  });

  test('does not render article section when no articles', () => {
    render(<ArticleFooter article={[]} />);
    expect(screen.queryByText('最近の記事')).not.toBeInTheDocument();
  });

  test('renders article description', () => {
    const article = [
      {
        page_id: '1',
        thumbnail: '/thumb.png',
        category: 'Tech',
        title: 'Article Title',
        description: 'This is a test description.',
        url: '/article/test',
        status: 'Published',
        ogDescription: '',
        ogImage: '',
        releaseDate: '',
      },
    ];
    render(<ArticleFooter article={article} />);
    expect(screen.getByText('This is a test description.')).toBeInTheDocument();
  });
});
