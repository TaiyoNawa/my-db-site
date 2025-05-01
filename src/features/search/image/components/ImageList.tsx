import {
  Box,
  Image,
  Text,
  VStack,
  Skeleton,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import Masonry from 'react-masonry-css';

import { ResetButton } from '@/components/button/ResetButton';

import styles from '@/styles/masonry/Masonry.module.css';

type UnsplashImage = {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download_location: string;
  };
};

type UnsplashApiResponse = {
  results: UnsplashImage[];
};

const breakpointColumnsObj = {
  default: 4,
  1068: 3,
  734: 2,
  418: 2,
};

const PER_PAGE = 30; //一回のリクエストでの画像の取得数※最大30っぽい？

export const ImageList = ({
  keyword,
  onReset,
}: {
  keyword: string;
  onReset: () => void;
}) => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const fetchImages = useCallback(async () => {
    if (!keyword) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/image/search?query=${encodeURIComponent(keyword)}&page=1&per_page=${PER_PAGE}`
      );
      if (!res.ok) throw new Error('画像の取得に失敗しました');

      const data = (await res.json()) as UnsplashApiResponse;
      setImages(data.results || []);
    } catch (error) {
      console.error('画像の取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    setImages([]);
    setIsReset(false);
    if (keyword) {
      void fetchImages();
    }
  }, [keyword, fetchImages]);

  const handleReset = () => {
    setIsReset(true);
    setImages([]);
    onReset();
  };

  if (!keyword || isReset) {
    return (
      <Box textAlign="center" py={{ base: '8%', sm: 10, md: 24 }} px={4}>
        <Heading as="h2" size={{ base: '16px', sm: 'lg', md: 'xl' }} mb={4}>
          Find Images by <Link href="https://unsplash.com/">Unsplash</Link>.
        </Heading>
        <Text fontSize={{ base: '10px', sm: 'sm', md: 'lg' }} color="gray.600">
          キーワードを入力して画像を検索しましょう。
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
        <Heading fontSize="xl" maxW={{ md: '60%' }}>
          &quot;{keyword}&quot; の画像検索結果
        </Heading>
        <ResetButton
          onClick={handleReset}
          w={{ base: '80px' }}
          mt={{ base: '8px', md: '0px' }}
        />
      </Flex>

      {isLoading && images.length === 0 && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <Box key={i} mb={4}>
              <Skeleton height="250px" borderRadius="md" />
            </Box>
          ))}
        </Masonry>
      )}

      {!isLoading && images.length === 0 && (
        <VStack spacing={4} mt={4}>
          <Text>画像が見つかりませんでした。</Text>
        </VStack>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.masonryGrid}
        columnClassName={styles.masonryGridColumn}
      >
        {images.map((img) => (
          <Box key={img.id} mb={4}>
            <Link
              href={img.links.html}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={img.urls.small}
                alt={img.alt_description || 'Unsplash image'}
                borderRadius="md"
              />
            </Link>
            <Text fontSize="sm" mt={1}>
              Photo by{' '}
              <Link
                href={img.user.links.html}
                target="_blank"
                rel="noopener noreferrer"
                color="gray.500"
                borderBottom={'0.5px solid'}
                _hover={{ textDecoration: 'none' }}
              >
                {img.user.name}
              </Link>{' '}
              on{' '}
              <Link
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                color="gray.500"
                borderBottom={'0.5px solid'}
                _hover={{ textDecoration: 'none' }}
              >
                Unsplash
              </Link>
            </Text>
          </Box>
        ))}
      </Masonry>
    </Box>
  );
};
