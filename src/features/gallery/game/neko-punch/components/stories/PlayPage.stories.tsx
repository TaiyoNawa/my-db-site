import { PlayPage } from '../PlayPage';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PlayPage> = {
  title: 'gallery/game/neko-punch/PlayPage',
  component: PlayPage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onEnd: { action: 'ended' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // TODO: ゲームの状態（カウントダウン、待機、表示、ペナルティ）を制御するargsを追加
  },
};
