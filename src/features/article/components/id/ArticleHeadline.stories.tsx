import type { Meta, StoryObj } from '@storybook/react';
import { ArticleHeadline } from './ArticleHeadline';

const meta: Meta<typeof ArticleHeadline> = {
  title: 'Article/ArticleHeadline',
  component: ArticleHeadline,
  parameters: {
    docs: {
      description: {
        component: '記事詳細ページのヘッドラインを表示するコンポーネント',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    category: { control: 'text' },
    thumbnail: { control: 'text' },
    createdAt: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleHeadline>;

export const Default: Story = {
  args: {
    title: 'Sample Article Title',
    category: 'Technology',
    thumbnail: '/image1.png',
    createdAt: '2023-10-27',
  },
};
