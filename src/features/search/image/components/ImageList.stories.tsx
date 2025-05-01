import { ImageList } from './ImageList';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ImageList> = {
  title: 'search/image/ImageList',
  component: ImageList,
  tags: ['autodocs'],
  args: {
    keyword: 'cat',
    onReset: () => {
      // リセットボタンが押されたときの処理
    },
  },
  argTypes: {
    keyword: {
      description: '検索キーワード',
    },
    onReset: {
      description: 'リセットボタンが押されたときの処理',
    },
  },
  parameters: {
    docs: {
      description: {
        component: '画像一覧をPinterest風に表示するコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof ImageList> = (args) => (
  <ImageList {...args} />
);
