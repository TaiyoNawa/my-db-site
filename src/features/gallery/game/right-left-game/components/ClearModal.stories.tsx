import { ClearModal } from './ClearModal';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof ClearModal> = {
  title: 'gallery/game/right-left-game/ClearModal',
  component: ClearModal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: () => alert('Close clicked'),
    onRetry: () => alert('Retry clicked'),
  },
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: '右左どっちゲームのクリア時に表示されるモーダル',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof ClearModal> = (args) => {
  return <ClearModal {...args} />;
};
