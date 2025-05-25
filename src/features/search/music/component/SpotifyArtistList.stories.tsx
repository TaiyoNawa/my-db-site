import { ChakraProvider } from '@chakra-ui/react';

import { SpotifyArtistList } from './SpotifyArtistList';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SpotifyArtistList> = {
  title: 'search/music/SpotifyArtistList',
  component: SpotifyArtistList,
  tags: ['autodocs'],
  args: {
    keyword: 'YOASOBI',
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
          'Spotifyのアーティスト検索結果を埋め込みプレイヤーで一覧表示するコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof SpotifyArtistList> = (args) => {
  //APIをStorybookでは叩けないので、検索結果が常に無いかのように表示される
  //Storybookにも表示させたいなら、Mock Service Worker（MSW） を使って fetch をモックする方法が定番です。
  return (
    <ChakraProvider>
      <SpotifyArtistList {...args} />
    </ChakraProvider>
  );
};
