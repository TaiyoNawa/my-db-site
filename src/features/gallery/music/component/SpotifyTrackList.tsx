//Playlistの検索結果一覧を表示するコンポーネント
import {
  Box,
  Text,
  Spinner,
  Heading,
  BoxProps,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react';

import SpotifyPlayer from './SpotifyPlayer';

type Track = {
  id: string;
  name: string;
  url: string;
};

type SpotifyTrackListProps = {
  keyword?: string;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifyTrackList: FC<SpotifyTrackListProps> = ({
  keyword = '',
  ...rest
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchTracks = async () => {
      try {
        const res = await fetch(
          `/api/spotify/TrackSearch?keyword=${encodeURIComponent(keyword)}` //ここでsearch.tsにリクエストを送信!
        );
        const data = (await res.json()) as Track[];
        setTracks(data);
      } catch (err) {
        console.error('検索エラー:', err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    void fetchTracks();
  }, [keyword]);

  if (loading) return <Spinner color="teal.500" />;
  if (!keyword.trim()) return null;

  return (
    <Box {...rest}>
      <Heading fontSize="xl">&quot;{keyword}&quot;の検索結果</Heading>
      {tracks.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          columnGap={{ base: 0, md: '20px' }}
          mt={3}
        >
          {tracks.map((track) => (
            <Box key={track.id} role="group" _hover={{ cursor: 'pointer' }}>
              <SpotifyPlayer type="track" trackId={track.id} h="152px" />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text>該当する曲が見つかりませんでした。</Text>
      )}
    </Box>
  );
};
