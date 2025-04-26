import { StoryFn } from '@storybook/react';

import { CurrentLinkCopyButton } from './CurrentLinkCopyButton';

const Default = {
  title: 'button/CurrentLinkCopyButton',
  component: CurrentLinkCopyButton,
  args: {},
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '現在のページのリンクをコピーするボタンコンポーネント',
      },
    },
  },
};

export default Default;

export const Template: StoryFn<typeof CurrentLinkCopyButton> = () => (
  <CurrentLinkCopyButton />
);
