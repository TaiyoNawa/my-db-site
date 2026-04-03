import { ButtonGroup } from '@chakra-ui/react';
import { StoryFn } from '@storybook/react';
import { useState } from 'react';

import { SortButton } from './SortButton';

const Default = {
  title: 'components/button/SortButton',
  component: SortButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ソート切り替えボタン。アクティブ時は blue、非アクティブ時は gray.200 で表示。',
      },
    },
  },
};

export default Default;

export const Active: StoryFn<typeof SortButton> = () => (
  <SortButton isActive>新着順</SortButton>
);

export const Inactive: StoryFn<typeof SortButton> = () => (
  <SortButton isActive={false}>人気順</SortButton>
);

export const Toggle: StoryFn = () => {
  const [sort, setSort] = useState<'newest' | 'popular'>('newest');
  return (
    <ButtonGroup>
      <SortButton isActive={sort === 'newest'} onClick={() => setSort('newest')}>
        新着順
      </SortButton>
      <SortButton isActive={sort === 'popular'} onClick={() => setSort('popular')}>
        人気順
      </SortButton>
    </ButtonGroup>
  );
};
