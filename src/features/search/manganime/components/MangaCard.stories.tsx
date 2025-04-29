// MangaList.stories.tsx
import { MangaList } from './MangaList';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof MangaList> = {
  title: 'search/manganime/MangaList',
  component: MangaList,
  tags: ['autodocs'],
  args: {
    keyword: 'ワンピース',
  },
  parameters: {
    docs: {
      description: {
        component: 'Mangaの検索結果をリスト形式で表示するコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof MangaList> = (args) => {
  return <MangaList {...args} />;
};

export const Empty: StoryFn<typeof MangaList> = () => {
  return <MangaList keyword="" />;
};

export const WithLoading: StoryFn<typeof MangaList> = () => {
  return <MangaList keyword="読み込み中" />;
};
