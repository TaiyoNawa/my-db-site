// src/features/search/music/component/SpotifyPlayer.tsx
import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

type SpotifyPlayerProps =
  | ({ type: 'track'; trackId: string } & Omit<BoxProps, 'borderRadius' | 'bg'>)
  | ({ type: 'playlist'; playlistId: string } & Omit<BoxProps, 'w'>);

export const SpotifyPlayer: FC<SpotifyPlayerProps> = (props) => {
  const { type, ...rest } = props;

  const src =
    type === 'track'
      ? `https://open.spotify.com/embed/track/${props.trackId}`
      : `https://open.spotify.com/embed/playlist/${props.playlistId}`;

  return (
    <Box w="100%" h={{ base: '152px', md: '360px' }} mb={5} {...rest}>
      <iframe
        title="Spotify Embed"
        src={src}
        width="100%"
        height="100%"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </Box>
  );
};

export default SpotifyPlayer;
