// Spotify APIを使用して曲を検索する(search.tsとどこで繋がっている？)
import { Box, Text, Spinner, Heading, BoxProps } from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react';

import SpotifyPlayer from './SpotifyPlayer';

type Track = {
  id: string;
  name: string;
  url: string;
};

type SpotifyTrackListrops = {
  keyword?: string;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifyTrackList: FC<SpotifyTrackListrops> = ({
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
          `/api/spotify/search?keyword=${encodeURIComponent(keyword)}` //ここでsearch.tsにリクエストを送信!
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
      <Heading as="h3" fontSize="md">
        「{keyword}」の検索結果
      </Heading>
      <Box mt={3}>
        {tracks.length > 0 ? (
          tracks.map((track) => (
            <Box key={track.id} mb={3}>
              <SpotifyPlayer type="track" trackId={track.id} />
            </Box>
          ))
        ) : (
          <Text>該当する曲が見つかりませんでした。</Text>
        )}
      </Box>
    </Box>
  );
};
