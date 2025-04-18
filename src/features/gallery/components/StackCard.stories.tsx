import { StoryFn } from '@storybook/react';
import React from 'react';

import { StackCard } from './StackCard';

const cardsData = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format',
  },
];

export default {
  title: 'gallery/StackCard',
  component: StackCard,
  args: {
    cardsData: cardsData,
    title: 'THIS IS STACK CARD NAME',
  },
  argTypes: {
    cardsData: {
      description: 'カードの画像データ',
    },
    title: {
      description: 'カードのタイトル',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'スタックコンポーネント',
      },
    },
  },
};

export const Default: StoryFn<typeof StackCard> = (args) => (
  <StackCard {...args} />
);
