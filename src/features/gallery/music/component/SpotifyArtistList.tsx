import {
  Box,
  Text,
  Spinner,
  Heading,
  Image,
  HStack,
  Link,
  SimpleGrid,
  BoxProps,
} from '@chakra-ui/react';
import { useEffect, useState, FC } from 'react';

type Artist = {
  id: string;
  name: string;
  imageUrl?: string;
  url: string;
};

type SpotifyArtistListProps = {
  keyword: string;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifyArtistList: FC<SpotifyArtistListProps> = ({
  keyword = '',
  ...rest
}) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
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
  if (!keyword.trim()) return null;

  return (
    <Box {...rest}>
      <Heading fontSize="xl">&quot;{keyword}&quot;の検索結果</Heading>
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
        <Text>該当するアーティストが見つかりませんでした。</Text>
      )}
    </Box>
  );
};
