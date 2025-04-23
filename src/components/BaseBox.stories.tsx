import { BaseBox } from './BaseBox';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof BaseBox> = {
  title: 'components/BaseBox',
  component: BaseBox,
  tags: ['autodocs'],
  args: {},
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'ベースとなるBoxコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof BaseBox> = (args) => {
  return <BaseBox {...args}>Hello</BaseBox>;
};
