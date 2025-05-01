import {
  Box,
  Link,
  Text,
  Heading,
  Button,
  Skeleton,
  Flex,
} from '@chakra-ui/react';
import { useEffect, useState, useCallback, FC } from 'react';
import Masonry from 'react-masonry-css';

import { ResetButton } from '@/components/button/ResetButton';

import { AnimeCard } from '@/features/search/manganime/components/AnimeCard';
import styles from '@/styles/masonry/Masonry.module.css';

const breakpointColumnsObj = {
  default: 4,
  1068: 3,
  734: 2,
  418: 2,
};

type Anime = {
  id: string;
  title: string;
  imageUrl?: string;
  seasonYear?: number;
  url?: string;
  studio?: string;
};

type AnimeListProps = {
  keyword?: string;
  onReset?: () => void;
};

const PER_PAGE = 12;
const MAX_ITEMS = 60;

export const AnimeList: FC<AnimeListProps> = ({ keyword = '', onReset }) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleReset = () => {
    setIsReset(true);
    setAnimes([]);
    setPage(1);
    if (onReset) onReset();
  };

  const fetchAnimes = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/manganime/AnimeSearch?keyword=${encodeURIComponent(
            keyword
          )}&page=${pageToFetch}&perPage=${PER_PAGE}`
        );
        const data = (await res.json()) as Anime[];
        if (pageToFetch === 1) {
          setAnimes(data);
        } else {
          setAnimes((prev) => [...prev, ...data]);
        }
      } catch (err) {
        console.error('アニメ検索エラー:', err);
      } finally {
        setLoading(false);
      }
    },
    [keyword]
  );

  useEffect(() => {
    setIsReset(false);
    if (!keyword.trim()) {
      setAnimes([]);
      return;
    }
    setPage(1);
    void fetchAnimes(1);
  }, [keyword, fetchAnimes]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchAnimes(nextPage);
  };

  const isLoadMoreVisible =
    animes.length < MAX_ITEMS && animes.length % PER_PAGE === 0;

  if (!keyword.trim() || isReset) {
    return (
      <Box textAlign="center" py={{ base: '8%', sm: 10, md: 24 }} px={4}>
        <Heading as="h2" size={{ base: '16px', sm: 'lg', md: 'xl' }} mb={4}>
          Find Animes by <Link href="https://anilist.co/">AniList</Link>.
        </Heading>
        <Text fontSize={{ base: '10px', sm: 'sm', md: 'lg' }} color="gray.600">
          キーワードを入力してアニメを検索しましょう。
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'flex-start', md: 'center' }}
        mb={4}
      >
        {!isReset && (
          <>
            <Heading fontSize="xl" maxW={{ md: '60%' }}>
              &quot;{keyword}&quot;の検索結果
            </Heading>
            <Flex gap={3} alignItems="center" mt={{ base: 2, md: 0 }}>
              <ResetButton
                onClick={handleReset}
                w={{ base: '80px' }}
                mt={{ base: '8px', md: '0px' }}
              />
            </Flex>
          </>
        )}
      </Flex>

      {animes.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {animes.map((anime) => (
            <Box key={anime.id} mb={{ base: '0.5rem', md: '1rem' }}>
              <AnimeCard
                title={anime.title}
                href={anime.url}
                image={anime.imageUrl}
                seasonYear={anime.seasonYear?.toString()}
                studio={anime.studio}
              />
            </Box>
          ))}
        </Masonry>
      ) : (
        !loading &&
        !isReset && <Text>該当するアニメが見つかりませんでした。</Text>
      )}

      {loading && (
        <Box
          sx={{
            '@media (max-width: 418px)': { columnCount: 1 },
            '@media (min-width: 419px) and (max-width: 734px)': {
              columnCount: 2,
            },
            '@media (min-width: 735px) and (max-width: 1068px)': {
              columnCount: 3,
            },
            '@media (min-width: 1069px)': { columnCount: 4 },
            columnGap: '1rem',
          }}
        >
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <Box
              key={i}
              sx={{
                breakInside: 'avoid',
                marginBottom: { base: '0', md: '1rem' },
              }}
            >
              <Skeleton borderRadius="md" height="360px" />
            </Box>
          ))}
        </Box>
      )}

      {!loading && isLoadMoreVisible && animes.length > 0 && (
        <Flex justifyContent="center" mt={6}>
          <Button onClick={handleLoadMore} colorScheme="blue">
            さらに読み込む
          </Button>
        </Flex>
      )}
    </Box>
  );
};
