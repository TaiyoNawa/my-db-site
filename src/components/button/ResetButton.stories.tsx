import { StoryFn } from '@storybook/react';

import { ResetButton } from './ResetButton';

const Default = {
  title: 'components/button/ResetButton',
  component: ResetButton,
  args: {
    onClick: () => {
      alert('Reset button clicked');
    },
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'リセットボタンコンポーネント',
      },
    },
  },
};

export default Default;

export const Template: StoryFn<typeof ResetButton> = ({ ...args }) => (
  <ResetButton {...args} />
);
