import { ImageSearchForm } from './ImageSearchForm';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ImageSearchForm> = {
  title: 'search/image/ImageSearchForm',
  component: ImageSearchForm,
  tags: ['autodocs'],
  args: {
    onSearch: (query: string) => {
      console.log('Search query:', query);
    },
  },
  argTypes: {
    onSearch: {
      description: '検索クエリを処理する関数',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'image用の検索欄コンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof ImageSearchForm> = (args) => {
  return <ImageSearchForm {...args} />;
};
