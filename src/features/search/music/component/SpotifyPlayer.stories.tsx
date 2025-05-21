import { SpotifyPlayer } from './SpotifyPlayer';

import type { Meta, StoryFn } from '@storybook/react';

const meta: Meta<typeof SpotifyPlayer> = {
  title: 'components/SpotifyPlayer',
  component: SpotifyPlayer,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['track', 'playlist'],
      description: '埋め込みタイプ（track または playlist）',
    },
    trackId: {
      control: 'text',
      description: 'トラックのID（typeが"track"のとき）',
    },
    playlistId: {
      control: 'text',
      description: 'プレイリストのID（typeが"playlist"のとき）',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Spotifyのトラックまたはプレイリストを埋め込み表示するiframeコンポーネント。',
      },
    },
  },
};

export default meta;

export const TrackEmbed: StoryFn<typeof SpotifyPlayer> = () => (
  <SpotifyPlayer type="track" trackId="7ouMYWpwJ422jRcDASZB7P" />
);

export const PlaylistEmbed: StoryFn<typeof SpotifyPlayer> = () => (
  <SpotifyPlayer type="playlist" playlistId="37i9dQZF1DXcBWIGoYBM5M" />
);
