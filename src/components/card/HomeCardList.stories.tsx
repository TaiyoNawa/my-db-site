import { StoryFn } from '@storybook/react';
import React from 'react';

import { HomeCardList } from './HomeCardList';

const itemsExample = [
  {
    eyeCatch:
      'https://cdn.pixabay.com/animation/2024/06/09/21/04/21-04-06-843_512.gif',
    title: 'ミュージック(Music)',
    description: 'Spotifyの音楽を検索・試聴できます',
    url: '/search/music',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'マンガ・アニメ(Manga/Anime)',
    description: 'AniListのマンガ・アニメを検索できます',
    url: '/search/manganime',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '画像(Image)',
    description: 'Unsplashの画像を検索できます',
    url: '/search/image',
  },
];

export default {
  title: 'components/card/HomeCardList',
  component: HomeCardList,
  args: {
    title: '検索',
    items: itemsExample,
  },
  argTypes: {
    items: {
      description: '表示するカードのリスト',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ホームカード一覧表示コンポーネント',
      },
    },
  },
};

export const Default: StoryFn<typeof HomeCardList> = (args) => (
  <HomeCardList {...args} />
);
