import { ChakraProvider } from '@chakra-ui/react';

import { SpotifyTrackList } from './SpotifyTrackList';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SpotifyTrackList> = {
  title: 'components/SpotifyTrackList',
  component: SpotifyTrackList,
  tags: ['autodocs'],
  args: {
    keyword: 'YOASOBI',
  },
  argTypes: {
    keyword: {
      description: 'Spotifyで検索するキーワード',
      control: { type: 'text' },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Spotify曲検索結果を埋め込みプレイヤーで一覧表示するコンポーネント',
      },
    },
  },
};

export default meta;

export const Default: StoryFn<typeof SpotifyTrackList> = (args) => {
  //APIをStorybookでは叩けないので、検索結果が常に無いかのように表示される
  //Storybookにも表示させたいなら、Mock Service Worker（MSW） を使って fetch をモックする方法が定番です。
  return (
    <ChakraProvider>
      <SpotifyTrackList {...args} />
    </ChakraProvider>
  );
};
