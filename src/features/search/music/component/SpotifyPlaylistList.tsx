import {
  Box,
  Link,
  Flex,
  Text,
  Spinner,
  Heading,
  SimpleGrid,
  BoxProps,
} from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react';

import { ResetButton } from '@/components/button/ResetButton';

import { Playlist } from '@/assets/type/SpotifyTypes';

import SpotifyPlayer from './SpotifyPlayer';

type SpotifyPlaylistListProps = {
  keyword?: string;
  onReset?: () => void;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifyPlaylistList: FC<SpotifyPlaylistListProps> = ({
  keyword = '',
  onReset,
  ...rest
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false); //リセットフラグを追加

  //リセットボタンが押されたときのハンドラー
  const handleReset = () => {
    setIsReset(true);
    setPlaylists([]);
    if (onReset) onReset(); //検索欄のリセット
  };

  useEffect(() => {
    setIsReset(false);
    if (!keyword.trim()) {
      setPlaylists([]);
      return;
    }
    setLoading(true);
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(
          `/api/spotify/PlaylistSearch?keyword=${encodeURIComponent(keyword)}` //リクエスト送信
        );
        const data = (await res.json()) as Playlist[];
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

  if (loading) return <Spinner color="pink.400" />;
  if (!keyword.trim() || isReset) {
    return (
      <Box textAlign="center" py={{ base: '8%', sm: 10, md: 24 }} px={4}>
        <Heading as="h2" size={{ base: '16px', sm: 'lg', md: 'xl' }} mb={4}>
          Find Playlists by{' '}
          <Link href="https://open.spotify.com/">Spotify</Link>.
        </Heading>
        <Text fontSize={{ base: '10px', sm: 'sm', md: 'lg' }} color="gray.600">
          キーワードを入力してプレイリストを検索しましょう。
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
        !isReset && <Text>該当するプレイリストが見つかりませんでした。</Text>
      )}
    </Box>
  );
};
