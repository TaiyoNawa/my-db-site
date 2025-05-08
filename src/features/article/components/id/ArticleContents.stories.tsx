import { ArticleContents } from './ArticleContents';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ArticleContents> = {
  title: 'Article/ArticleContents',
  component: ArticleContents,
  parameters: {
    docs: {
      description: {
        component: '記事詳細ページのコンテンツを表示するコンポーネント',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    markdown: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleContents>;

export const Default: Story = {
  args: {
    markdown: `
# This is a test article

## Section 1

This is the content of section 1.

## Section 2

This is the content of section 2.

### Subsection 2.1

This is a subsection.

\`\`\`javascript
console.log('hello world');
\`\`\`
`,
  },
};
