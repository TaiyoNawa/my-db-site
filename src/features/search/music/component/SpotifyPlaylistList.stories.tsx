import { ChakraProvider } from '@chakra-ui/react';

import { SpotifyPlaylistList } from './SpotifyPlaylistList';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SpotifyPlaylistList> = {
  title: 'components/SpotifyPlaylistList',
  component: SpotifyPlaylistList,
  tags: ['autodocs'],
  args: {
    keyword: 'J-POP',
  },
  argTypes: {
    keyword: {
      description: '検索するキーワード',
      control: { type: 'text' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Spotifyのプレイリスト検索結果を埋め込みプレイヤーで一覧表示するコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof SpotifyPlaylistList> = (args) => {
  //APIをStorybookでは叩けないので、検索結果が常に無いかのように表示される
  //Storybookにも表示させたいなら、Mock Service Worker（MSW） を使って fetch をモックする方法が定番です。
  return (
    <ChakraProvider>
      <SpotifyPlaylistList {...args} />
    </ChakraProvider>
  );
};
