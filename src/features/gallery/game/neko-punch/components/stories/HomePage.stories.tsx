import { HomePage } from '../HomePage';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof HomePage> = {
  title: 'gallery/game/neko-punch/HomePage',
  component: HomePage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onStart: { action: 'started' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // TODO: ハイスコアの表示状態を制御するargsを追加
  },
};
