import { StoryFn } from '@storybook/react';
import React from 'react';

import { ArticleCardProps } from './ArticleCard';
import { ArticlePagination } from './ArticlePagination';
import { articleSample } from '../../hooks/ArticleSample';

export default {
  title: 'newsletter/ArticlePagination',
  component: ArticlePagination,
  args: {
    articles: articleSample,
    onPageItemsChange: (items: ArticleCardProps[]) => {
      console.log('Current page items:', items);
    },
  },
  argTypes: {
    articles: {
      description: '記事リスト（全体）',
      control: { type: 'object' },
    },
    onPageItemsChange: {
      description: '現在のページに対応する記事リストを返すコールバック',
      action: 'ページアイテム変更',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '記事ページネーションコンポーネント（現在ページのアイテム配列を外部に渡します）',
      },
    },
  },
};

export const Default: StoryFn<typeof ArticlePagination> = (args) => {
  return <ArticlePagination {...args} />;
};
