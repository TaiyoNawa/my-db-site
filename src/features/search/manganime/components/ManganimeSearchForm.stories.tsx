import { ManganimeSearchForm } from './ManganimeSearchForm';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ManganimeSearchForm> = {
  title: 'search/manganime/ManganimeSearchForm',
  component: ManganimeSearchForm,
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
        component: 'Manganime用の検索欄コンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof ManganimeSearchForm> = (args) => {
  return <ManganimeSearchForm {...args}>Hello</ManganimeSearchForm>;
};
