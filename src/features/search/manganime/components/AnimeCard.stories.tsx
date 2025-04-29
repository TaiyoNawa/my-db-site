// AnimeCard.stories.tsx
import { AnimeCard } from './AnimeCard';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof AnimeCard> = {
  title: 'search/manganime/AnimeCard',
  component: AnimeCard,
  tags: ['autodocs'],
  args: {
    title: '呪術廻戦',
    href: 'https://example.com/anime/jujutsu-kaisen',
    image: 'https://placehold.co/300x400?text=Anime+Image',
    studio: 'MAPPA',
    seasonYear: '2020',
  },
  parameters: {
    docs: {
      description: {
        component: 'Anime作品を表示するカードコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof AnimeCard> = (args) => {
  return <AnimeCard {...args} />;
};
