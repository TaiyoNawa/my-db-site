import { ColumnArticleCard } from './ColumnArticleCard';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColumnArticleCard> = {
  title: 'Article/ColumnArticleCard',
  component: ColumnArticleCard,
  parameters: {
    docs: {
      description: {
        component: 'カラム表示用の記事カードコンポーネント',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    eyeCatch: { control: 'text' },
    category: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    url: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ColumnArticleCard>;

export const Default: Story = {
  args: {
    eyeCatch: '/alt_image.png',
    category: 'Technology',
    title: 'Sample Article Title',
    description: 'This is a sample description for the article card.',
    url: '/article/sample-article',
  },
};
