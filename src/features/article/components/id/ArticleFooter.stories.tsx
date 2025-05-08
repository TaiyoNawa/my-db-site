import type { Meta, StoryObj } from '@storybook/react';
import { ArticleFooter } from './ArticleFooter';

const meta: Meta<typeof ArticleFooter> = {
  title: 'Article/ArticleFooter',
  component: ArticleFooter,
  parameters: {
    docs: {
      description: {
        component: '記事詳細ページのフッター(下部)コンポーネント',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    article: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleFooter>;

export const Default: Story = {
  args: {
    article: [
      {
        page_id: '1',
        thumbnail: '/alt_image.png',
        category: 'Technology',
        title: 'Sample Article 1',
        description: 'This is a description for sample article 1.',
        url: '/article/1',
        status: 'Published',
        ogDescription: 'OG Description 1',
        ogImage: '/og_image1.png',
        releaseDate: '2023-10-27',
      },
      {
        page_id: '2',
        thumbnail: '/image1.png',
        category: 'Lifestyle',
        title: 'Sample Article 2',
        description: 'This is a description for sample article 2.',
        url: '/article/2',
        status: 'Published',
        ogDescription: 'OG Description 2',
        ogImage: '/og_image2.png',
        releaseDate: '2023-10-28',
      },
    ],
  },
};
