import { StoryFn } from '@storybook/react';
import React from 'react';

import { SecondHeader } from './SecondHeader';

const Default = {
  title: 'components/header/SecondHeader',
  component: SecondHeader,
  args: {
    title: 'ギャラリー',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'ヘッダーのタイトル',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'セカンドヘッダーのコンポーネントです。',
      },
    },
  },
};

export default Default;
export const Template: StoryFn<typeof SecondHeader> = (args) => (
  <SecondHeader {...args} />
);
