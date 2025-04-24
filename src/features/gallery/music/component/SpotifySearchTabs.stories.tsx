import { ChakraProvider } from '@chakra-ui/react';

import { SpotifySearchTabs } from './SpotifySearchTabs';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SpotifySearchTabs> = {
  title: 'components/SpotifySearchTabs',
  component: SpotifySearchTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Spotifyの楽曲・プレイリスト・アーティストを切り替えて検索できるタブUI',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof SpotifySearchTabs> = () => (
  <ChakraProvider>
    <SpotifySearchTabs />
  </ChakraProvider>
);
