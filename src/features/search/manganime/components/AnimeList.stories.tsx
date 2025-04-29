import { AnimeList } from './AnimeList';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof AnimeList> = {
  title: 'search/manganime/AnimeList',
  component: AnimeList,
  tags: ['autodocs'],
  args: {
    keyword: '進撃の巨人',
  },
  parameters: {
    docs: {
      description: {
        component: 'Animeの検索結果をリスト形式で表示するコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof AnimeList> = (args) => {
  return <AnimeList {...args} />;
};

export const Empty: StoryFn<typeof AnimeList> = () => {
  return <AnimeList keyword="" />;
};

export const WithLoading: StoryFn<typeof AnimeList> = () => {
  return <AnimeList keyword="読み込み中" />;
};
