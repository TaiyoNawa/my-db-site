import { MangaList } from './MangaList';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MangaList> = {
  component: MangaList,
  title: 'search/manganime/MangaList',
};

export default meta;

type Story = StoryObj<typeof MangaList>;

export const WithKeyword: Story = {
  render: () => <MangaList keyword="One Piece" />,
};

export const EmptyKeyword: Story = {
  render: () => <MangaList keyword="" />,
};
