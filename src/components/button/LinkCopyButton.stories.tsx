import { StoryFn } from '@storybook/react';

import { LinkCopyButton } from './LinkCopyButton';

const Default = {
  title: 'button/LinkCopyButton',
  component: LinkCopyButton,
  args: {
    href: 'https://github.com',
  },
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

export const Template: StoryFn<typeof LinkCopyButton> = ({ ...args }) => (
  <LinkCopyButton {...args} />
);
