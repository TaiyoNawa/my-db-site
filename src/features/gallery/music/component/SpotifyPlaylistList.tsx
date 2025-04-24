import {
  Box,
  Text,
  Spinner,
  Heading,
  SimpleGrid,
  BoxProps,
} from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react';

import SpotifyPlayer from './SpotifyPlayer';

type Playlist = {
  id: string;
  name: string;
  url: string;
};

type SpotifyPlaylistListProps = {
  keyword?: string;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifyPlaylistList: FC<SpotifyPlaylistListProps> = ({
  keyword = '',
  ...rest
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(
          `/api/spotify/PlaylistSearch?keyword=${encodeURIComponent(keyword)}` //リクエスト送信
        );
        const data = (await res.json()) as Playlist[];
        console.log(data);
        setPlaylists(data);
      } catch (err) {
        console.error('プレイリスト検索エラー:', err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    void fetchPlaylists();
  }, [keyword]);

  if (loading) return <Spinner color="teal.500" />;
  if (!keyword.trim()) return null;

  return (
    <Box {...rest}>
      <Heading fontSize="xl">&quot;{keyword}&quot;の検索結果</Heading>
      {playlists.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          columnGap={{ base: 0, md: '20px' }}
          mt={3}
        >
          {playlists.map((playlist) => (
            <Box key={playlist.id} role="group" _hover={{ cursor: 'pointer' }}>
              <SpotifyPlayer type="playlist" playlistId={playlist.id} />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text>該当するプレイリストが見つかりませんでした。</Text>
      )}
    </Box>
  );
};
