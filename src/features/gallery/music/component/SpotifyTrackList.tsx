//Playlistの検索結果一覧を表示するコンポーネント
import {
  Box,
  Link,
  Text,
  Spinner,
  Heading,
  BoxProps,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react';

import { ResetButton } from '@/components/button/ResetButton';

import { Track } from '@/assets/type/SpotifyTypes';

import SpotifyPlayer from './SpotifyPlayer';

type SpotifyTrackListProps = {
  keyword?: string;
  onReset?: () => void;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifyTrackList: FC<SpotifyTrackListProps> = ({
  keyword = '',
  onReset,
  ...rest
}) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false); //リセットフラグを追加

  //リセットボタンが押されたときのハンドラー
  const handleReset = () => {
    setIsReset(true);
    setTracks([]);
    if (onReset) onReset(); //検索欄のリセット
  };

  useEffect(() => {
    setIsReset(false); //新しいキーワード検索時はリセットフラグをオフ
    //keywordが空ならfetchもしないしloadingもfalseのまま
    if (!keyword.trim()) {
      setTracks([]);
      return;
    }
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
  if (!keyword.trim() || isReset) {
    return (
      <Box textAlign="center" py={{ base: '8%', sm: 10, md: 24 }} px={4}>
        <Heading as="h2" size={{ base: '16px', sm: 'lg', md: 'xl' }} mb={4}>
          Find Tracks by <Link href="https://open.spotify.com/">Spotify</Link>.
        </Heading>
        <Text fontSize={{ base: '10px', sm: 'sm', md: 'lg' }} color="gray.600">
          キーワードを入力して楽曲を検索しましょう。
        </Text>
      </Box>
    );
  }

  return (
    <Box {...rest}>
      <Flex
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'left', md: 'center' }}
      >
        {!isReset && (
          <>
            <Heading fontSize="xl" maxW={{ md: '80%' }}>
              &quot;{keyword}&quot;の検索結果
            </Heading>
            <ResetButton
              onClick={handleReset}
              w={{ base: '80px' }}
              mt={{ base: '8px', md: '0px' }}
            />
          </>
        )}
      </Flex>
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
        !isReset && <Text>該当する曲が見つかりませんでした。</Text>
      )}
    </Box>
  );
};
