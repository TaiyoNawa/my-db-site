import { StoryFn } from '@storybook/react';
import React from 'react';

import { Footer } from './Footer';

const Default = {
  title: 'components/Footer',
  component: Footer,
  args: {},
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'フッターのコンポーネントです。',
      },
    },
  },
};

export default Default;
export const Template: StoryFn<typeof Footer> = () => <Footer />;
