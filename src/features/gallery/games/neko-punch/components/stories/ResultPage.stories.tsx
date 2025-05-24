import { ResultPage } from '../ResultPage';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ResultPage> = {
  title: 'NekoPunchGame/ResultPage',
  component: ResultPage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRetry: { action: 'retried' },
    reactionTime: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    reactionTime: 250.5,
  },
};

export const Failure: Story = {
  args: {
    reactionTime: null,
  },
};

export const NewHighScore: Story = {
  args: {
    reactionTime: 150.3,
    // TODO: ハイスコア更新時の表示を制御するargsを追加
  },
};
