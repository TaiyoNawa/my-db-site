import { IndexOfContent } from './IndexOfContents';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IndexOfContent> = {
  title: 'Article/IndexOfContents',
  component: IndexOfContent,
  parameters: {
    docs: {
      description: {
        component: '記事詳細ページの目次を表示するコンポーネント',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    headings: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof IndexOfContent>;

export const Default: Story = {
  args: {
    headings: [
      { text: 'Section 1', id: 'section-1' },
      { text: 'Section 2', id: 'section-2' },
      { text: 'Section 3', id: 'section-3' },
    ],
  },
};

export const Empty: Story = {
  args: {
    headings: [],
  },
};
