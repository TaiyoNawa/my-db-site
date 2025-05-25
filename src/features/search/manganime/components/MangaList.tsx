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

import { MangaCard } from '@/features/search/manganime/components/MangaCard';
import styles from '@/styles/masonry/Masonry.module.css';

// レスポンシブカラム数の指定
const breakpointColumnsObj = {
  default: 4,
  1068: 3,
  734: 2,
  418: 2,
};

type Manga = {
  id: string;
  title: string;
  imageUrl?: string;
  author?: string;
  releaseDate?: string;
  url?: string;
};

type MangaListProps = {
  keyword?: string;
  onReset?: () => void;
};

const PER_PAGE = 12;
const MAX_ITEMS = 60;

export const MangaList: FC<MangaListProps> = ({ keyword = '', onReset }) => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleReset = () => {
    setIsReset(true);
    setMangas([]);
    setPage(1);
    if (onReset) onReset();
  };

  const fetchMangas = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/manganime/MangaSearch?keyword=${encodeURIComponent(
            keyword
          )}&page=${pageToFetch}&perPage=${PER_PAGE}`
        );
        const data = (await res.json()) as Manga[];
        if (pageToFetch === 1) {
          setMangas(data);
        } else {
          setMangas((prev) => [...prev, ...data]);
        }
      } catch (err) {
        console.error('マンガ検索エラー:', err);
      } finally {
        setLoading(false);
      }
    },
    [keyword]
  );

  useEffect(() => {
    setIsReset(false);
    if (!keyword.trim()) {
      setMangas([]);
      return;
    }
    setPage(1);
    void fetchMangas(1);
  }, [keyword, fetchMangas]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchMangas(nextPage);
  };

  const isLoadMoreVisible =
    mangas.length < MAX_ITEMS && mangas.length % PER_PAGE === 0;

  if (!keyword.trim() || isReset) {
    return (
      <Box textAlign="center" py={{ base: '8%', sm: 10, md: 24 }} px={4}>
        <Heading as="h2" size={{ base: '16px', sm: 'lg', md: 'xl' }} mb={4}>
          Find Mangas by <Link href="https://anilist.co/">AniList</Link>.
        </Heading>
        <Text fontSize={{ base: '10px', sm: 'sm', md: 'lg' }} color="gray.600">
          キーワードを入力してマンガを検索しましょう。
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

      {mangas.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {mangas.map((manga) => (
            <Box key={manga.id} mb={{ base: '0.5rem', md: '1rem' }}>
              <MangaCard
                title={manga.title}
                href={manga.url}
                image={manga.imageUrl}
                author={manga.author}
                releaseDate={manga.releaseDate}
              />
            </Box>
          ))}
        </Masonry>
      ) : (
        !loading &&
        !isReset && <Text>該当するマンガが見つかりませんでした。</Text>
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

      {!loading && isLoadMoreVisible && mangas.length > 0 && (
        <Flex justifyContent="center" mt={6}>
          <Button onClick={handleLoadMore} colorScheme="blue">
            さらに読み込む
          </Button>
        </Flex>
      )}
    </Box>
  );
};
