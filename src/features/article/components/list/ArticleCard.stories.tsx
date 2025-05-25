import { StoryFn } from '@storybook/react';
import React from 'react';

import { ArticleCard } from './ArticleCard';

const ArticleCardDefault = {
  title: 'article/ArticleCard',
  component: ArticleCard,
  args: {
    eyeCatch: '/sample/image1.png',
    category: 'レポート',
    title: '東京都ITサービス業売上高トップ100',
    description:
      '東京都のITサービス業の売上高ランキングを発表します。このランキングは、東京都内のITサービス業の売上高をもとにしています。データは2025/03/17時点のものです。詳細情報がほしい方はこちらをご覧ください。',
    url: '#',
  },
  argTypes: {
    eyeCatch: {
      description: '記事のアイキャッチ画像のパス',
    },
    category: {
      description: '記事のカテゴリ名',
    },
    title: {
      description: '記事のタイトル',
    },
    description: {
      description: '記事の説明',
    },
    url: {
      description: '記事のURL',
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '記事コンポーネント',
      },
    },
  },
};

export default ArticleCardDefault;
export const Default: StoryFn<typeof ArticleCard> = (args) => (
  <ArticleCard {...args} />
);
