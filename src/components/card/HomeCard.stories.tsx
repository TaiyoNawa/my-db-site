import { StoryFn } from '@storybook/react';
import React from 'react';

import { HomeCard } from './HomeCard';

const items = {
  eyeCatch:
    'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  title: '画像(Image)',
  description: 'Unsplashの画像を検索できます',
  url: '/search/image',
  category: '',
};
const HomeCardDefault = {
  title: 'components/card/HomeCard',
  component: HomeCard,
  args: { ...items },
  argTypes: {
    eyeCatch: {
      description: 'カードのアイキャッチ画像のパス',
    },
    category: {
      description: 'カードのカテゴリ名',
    },
    title: {
      description: 'カードのタイトル',
    },
    description: {
      description: 'カードの説明',
    },
    url: {
      description: 'カードのURL',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'カードコンポーネント',
      },
    },
  },
};

export default HomeCardDefault;
export const Default: StoryFn<typeof HomeCard> = (args) => (
  <HomeCard {...args} />
);
