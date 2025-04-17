import { StoryFn } from '@storybook/react';
import React from 'react';

import Stack from './Stack';

const images = [
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
  title: 'gallery/Stack',
  component: Stack,
  args: {
    randomRotation: false,
    sensitivity: 100,
    sendToBackOnClick: true,
    cardDimensions: { width: 200, height: 200 },
    cardsData: images,
  },
  argTypes: {
    randomRotation: {
      description: 'カードの回転をランダムにするかどうか',
    },
    sensitivity: {
      description: 'カードの感度',
    },
    cardDimensions: {
      description: 'カードのサイズ',
    },
    sendToBackOnClick: {
      description: 'カードをクリックしたときに、最背面に移動するかどうか',
    },
    cardsData: {
      description: 'カードのデータ',
    },
    animationConfig: {
      description: 'アニメーションの設定',
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

export const Default: StoryFn<typeof Stack> = (args) => <Stack {...args} />;
