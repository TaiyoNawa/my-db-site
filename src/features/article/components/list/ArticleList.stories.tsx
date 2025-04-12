import { StoryFn } from '@storybook/react';
import React from 'react';

import { ArticleList } from './ArticleList';
import { articleSample } from '../../hooks/ArticleSample';

export default {
  title: 'newsletter/ArticleList',
  component: ArticleList,
  args: {
    articles: articleSample,
  },
  argTypes: {
    articles: {
      description: '記事の配列',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '記事一覧コンポーネント',
      },
    },
  },
};

export const Default: StoryFn<typeof ArticleList> = (args) => (
  <ArticleList {...args} />
);
