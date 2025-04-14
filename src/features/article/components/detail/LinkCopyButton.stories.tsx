import { StoryFn } from '@storybook/react';

import { LinkCopyButton } from './LinkCopyButton';

const Default = {
  title: 'company/detail/LinkCopyButton',
  component: LinkCopyButton,
  args: {},
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'リンクをコピーするボタンコンポーネント',
      },
    },
  },
};

export default Default;

export const Template: StoryFn<typeof LinkCopyButton> = () => (
  <LinkCopyButton />
);
