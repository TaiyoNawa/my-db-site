import { StoryFn } from '@storybook/react';
import React from 'react';

import { Header } from './Header';

const Default = {
  title: 'components/Header',
  component: Header,
  args: {},
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ヘッダーのコンポーネントです。',
      },
    },
  },
};

export default Default;
export const Template: StoryFn<typeof Header> = () => <Header />;
