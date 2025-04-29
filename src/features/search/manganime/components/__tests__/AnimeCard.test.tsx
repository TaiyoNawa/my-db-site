// __tests__/AnimeCard.test.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { AnimeCard } from '@/features/search/manganime/components/AnimeCard';

describe('AnimeCard コンポーネント', () => {
  const testProps = {
    title: '鬼滅の刃',
    href: 'https://example.com/anime/kimetsu',
    image: 'https://placehold.co/300x400?text=Kimetsu',
    studio: 'ufotable',
    seasonYear: '2019',
  };

  const renderComponent = () =>
    render(
      <ChakraProvider>
        <AnimeCard {...testProps} />
      </ChakraProvider>
    );

  it('タイトル・スタジオ・放送年が表示される', () => {
    renderComponent();

    expect(screen.getByText(testProps.title)).toBeInTheDocument();
    expect(
      screen.getByText(`スタジオ: ${testProps.studio}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`放送年: ${testProps.seasonYear}`)
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

  it('studioとseasonYearが空でも "-" 表示される', () => {
    render(
      <ChakraProvider>
        <AnimeCard title="デモアニメ" />
      </ChakraProvider>
    );

    expect(screen.getByText('スタジオ: -')).toBeInTheDocument();
    expect(screen.getByText('放送年: -')).toBeInTheDocument();
  });
});
