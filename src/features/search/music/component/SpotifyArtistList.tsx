import {
  Box,
  Link,
  Flex,
  Text,
  Spinner,
  Heading,
  Image,
  HStack,
  SimpleGrid,
  BoxProps,
} from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react';

import { ResetButton } from '@/components/button/ResetButton';

import { Artist } from '@/assets/type/SpotifyTypes';

type SpotifyArtistListProps = {
  keyword: string;
  onReset?: () => void;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifyArtistList: FC<SpotifyArtistListProps> = ({
  keyword = '',
  onReset,
  ...rest
}) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false); //リセットフラグを追加

  const handleReset = () => {
    setIsReset(true);
    setArtists([]);
    if (onReset) onReset();
  };

  useEffect(() => {
    setIsReset(false);
    if (!keyword.trim()) {
      setArtists([]);
      return;
    }
    setLoading(true);
    const fetchArtists = async () => {
      try {
        const res = await fetch(
          `/api/spotify/ArtistSearch?keyword=${encodeURIComponent(keyword)}`
        );
        const data = (await res.json()) as Artist[];
        setArtists(data);
      } catch (err) {
        console.error('アーティスト検索エラー:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchArtists();
  }, [keyword]);

  if (loading) return <Spinner color="teal.500" />;
  if (!keyword.trim() || isReset) {
    return (
      <Box textAlign="center" py={{ base: '8%', sm: 10, md: 24 }} px={4}>
        <Heading as="h2" size={{ base: '16px', sm: 'lg', md: 'xl' }} mb={4}>
          Find Artists by <Link href="https://open.spotify.com/">Spotify</Link>.
        </Heading>
        <Text fontSize={{ base: '10px', sm: 'sm', md: 'lg' }} color="gray.600">
          キーワードを入力してアーティストを検索しましょう。
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
      {artists.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          columnGap="20px"
          rowGap="32px"
          mt={3}
        >
          {artists.map((artist) => (
            <Box key={artist.id} role="group" _hover={{ cursor: 'pointer' }}>
              <Link href={artist.url} isExternal>
                <HStack spacing={3}>
                  <Image
                    src={artist.imageUrl || '/stranger_icon.png'}
                    boxSize="100px"
                    borderRadius="full"
                    alt={artist.name}
                    transition="0.2s ease"
                    _groupHover={{ filter: 'brightness(85%)' }} // Boxホバー時に変化
                  />
                  <Text>{artist.name}</Text>
                </HStack>
              </Link>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        !isReset && <Text>該当するアーティストが見つかりませんでした。</Text>
      )}
    </Box>
  );
};
