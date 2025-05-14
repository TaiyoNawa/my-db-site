// src/components/LoadingSpinner.stories.tsx
import { StoryFn } from '@storybook/react';
import React from 'react';

import { LoadingSpinner } from './LoadingSpinner';

const Default = {
  title: 'components/LoadingSpinner',
  component: LoadingSpinner,
  args: {
    spinnerColor: '#60a5fa', // blue.400
    size: 60,
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ランダムなスピナーを表示するローディングコンポーネント。',
      },
    },
  },
};

export default Default;

export const Template: StoryFn<typeof LoadingSpinner> = ({ ...args }) => (
  <LoadingSpinner {...args} />
);
