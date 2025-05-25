import { StoryFn } from '@storybook/react';
import React from 'react';

import { MangaItems } from '@/assets/data/MangaItems';

import { StackCardList } from './StackCardList';

export default {
  title: 'gallery/manga/StackCardList',
  component: StackCardList,
  args: {
    mangaItems: MangaItems,
  },
  argTypes: {
    mangaItems: {
      name: 'mangaItems',
      type: { name: 'array', required: true },
      description:
        'マンガのリストデータ。各アイテムは `{ title: string, cardsData: { id: number; img: string }[] }` の形式で構成される。',
      table: {
        type: {
          summary:
            'Array<{ title: string; cardsData: Array<{ id: number; img: string }> }>',
        },
        defaultValue: { summary: '[]' },
      },
      control: false,
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '複数の画像カードをカテゴリ（タイトル）ごとに、スタックカードとしてグリッド表示するコンポーネントです。主にギャラリー表示などで使用されます。',
      },
    },
  },
};

export const Default: StoryFn<typeof StackCardList> = (args) => (
  <StackCardList {...args} />
);
