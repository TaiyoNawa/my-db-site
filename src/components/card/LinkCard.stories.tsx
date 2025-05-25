import { StoryFn } from '@storybook/react';
import React from 'react';

import { LinkCard } from './LinkCard';

const Default = {
  title: 'components/card/LinkCard',
  component: LinkCard,
  args: {
    title: 'Sample Title',
    description: 'This is a sample description for the LinkCard component.',
    url: 'https://www.oricon.co.jp/',
    altImageUrl: '/alt/alt_image.png',
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'リンクをog:imageとともに表示するカード型のコンポーネント',
      },
    },
  },
};

export default Default;
export const Template: StoryFn<typeof LinkCard> = ({ ...args }) => (
  <LinkCard {...args} />
);
