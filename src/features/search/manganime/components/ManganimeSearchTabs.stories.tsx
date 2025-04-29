import { ChakraProvider } from '@chakra-ui/react';

import { ManganimeSearchTabs } from './ManganimeSearchTabs';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ManganimeSearchTabs> = {
  title: 'search/manganime/ManganimeSearchTabs',
  component: ManganimeSearchTabs,
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

export const Default: StoryFn<typeof ManganimeSearchTabs> = () => (
  <ChakraProvider>
    <ManganimeSearchTabs />
  </ChakraProvider>
);
