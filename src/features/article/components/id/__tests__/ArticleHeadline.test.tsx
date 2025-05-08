import { Image } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import { ArticleHeadline } from '../ArticleHeadline';

// Mock the next/image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image {...props} />;
  },
}));

describe('ArticleHeadline', () => {
  const title = 'Test Article Title';
  const category = 'Testing';
  const thumbnail = '/test-image.png';
  const createdAt = '2023-11-01';

  it('renders the article title correctly', () => {
    render(
      <ArticleHeadline
        title={title}
        category={category}
        thumbnail={thumbnail}
        createdAt={createdAt}
      />
    );

    const titleElement = screen.getByRole('heading', { name: title });
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the article category correctly', () => {
    render(
      <ArticleHeadline
        title={title}
        category={category}
        thumbnail={thumbnail}
        createdAt={createdAt}
      />
    );

    const categoryElement = screen.getByText(category);
    expect(categoryElement).toBeInTheDocument();
  });

  it('renders the article creation date correctly', () => {
    render(
      <ArticleHeadline
        title={title}
        category={category}
        thumbnail={thumbnail}
        createdAt={createdAt}
      />
    );

    const dateElement = screen.getByText(createdAt);
    expect(dateElement).toBeInTheDocument();
  });

  it('renders the article thumbnail with correct attributes', () => {
    render(
      <ArticleHeadline
        title={title}
        category={category}
        thumbnail={thumbnail}
        createdAt={createdAt}
      />
    );

    const thumbnailElement = screen.getByRole('img', { name: title });
    expect(thumbnailElement).toBeInTheDocument();
    expect(thumbnailElement).toHaveAttribute('src', thumbnail);
    expect(thumbnailElement).toHaveAttribute('alt', title);
  });

  it('renders the copy button for the article link', () => {
    render(
      <ArticleHeadline
        title={title}
        category={category}
        thumbnail={thumbnail}
        createdAt={createdAt}
      />
    );

    const copyButton = screen.getByRole('button');
    expect(copyButton).toBeInTheDocument();
  });
});
