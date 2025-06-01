import type { Meta, StoryFn } from '@storybook/react';

import RightLeftGame from './index';

const meta: Meta<typeof RightLeftGame> = {
  title: 'gallery/game/RightLeftGame',
  component: RightLeftGame,
  tags: ['autodocs'],
  args: {},
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: '右左どっちゲームページ',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof RightLeftGame> = (args) => {
  return <RightLeftGame {...args} />;
};
