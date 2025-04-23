import { SpotifySearchForm } from './SpotifySearchForm';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SpotifySearchForm> = {
  title: 'components/SpotifySearchForm',
  component: SpotifySearchForm,
  tags: ['autodocs'],
  args: {
    onSearch: (query: string) => {
      console.log('Search query:', query);
    },
  },
  argTypes: {
    onSearch: {
      description: '検索クエリを処理する関数',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Spotify用の検索欄コンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof SpotifySearchForm> = (args) => {
  return <SpotifySearchForm {...args}>Hello</SpotifySearchForm>;
};
