// __tests__/MangaCard.test.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { MangaCard } from '@/features/search/manganime/components/MangaCard';

describe('MangaCard.tsxのテスト', () => {
  const testProps = {
    title: '進撃の巨人',
    href: 'https://example.com/attack-on-titan',
    image: 'https://placehold.co/300x400?text=Attack+on+Titan',
    author: '諫山 創',
    releaseDate: '2009-03-17',
  };

  const renderComponent = () =>
    render(
      <ChakraProvider>
        <MangaCard {...testProps} />
      </ChakraProvider>
    );

  it('タイトル・著者・発売日が表示される', () => {
    renderComponent();

    expect(screen.getByText(testProps.title)).toBeInTheDocument();
    expect(screen.getByText(`作者: ${testProps.author}`)).toBeInTheDocument();
    expect(
      screen.getByText(`出版日: ${testProps.releaseDate}`)
    ).toBeInTheDocument();
  });

  it('画像が正しく表示される', () => {
    renderComponent();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', testProps.image);
    expect(image).toHaveAttribute('alt', testProps.title);
  });

  it('リンクが正しいURLに設定されている', () => {
    renderComponent();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', testProps.href);
  });

  it('authorとreleaseDateが空でも "-" 表示される', () => {
    render(
      <ChakraProvider>
        <MangaCard title="デモ" />
      </ChakraProvider>
    );

    expect(screen.getByText('作者: -')).toBeInTheDocument();
    expect(screen.getByText('出版日: -')).toBeInTheDocument();
  });
});
