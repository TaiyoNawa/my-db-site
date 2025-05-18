//pages/article/index.tsx
import { Box, Button, Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SectionWrapper } from '@/components/SectionWrapper';
import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';
import { SecondHeader } from '@/components/header/SecondHeader';
import { ArticleMeta } from '@/components/meta/ArticleMeta';

import { ArticleCardProps } from '@/features/article/components/list/ArticleCard';
import { ArticleList } from '@/features/article/components/list/ArticleList';
import { NotionDBItem } from '@/lib/notion/fetchNotionDBItems';

type NotionApiResponse = {
  results: NotionDBItem[];
  next_cursor: string | null;
  has_more: boolean;
};

export default function Posts() {
  const [articles, setArticles] = useState<ArticleCardProps[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { isHeaderHidden } = useStickyHeader();

  const fetchArticles = useCallback(
    async (cursor?: string, isFirstLoad = false) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('pageSize', '8');
        if (cursor) {
          params.append('startCursor', cursor);
        }
        const res = await fetch(`/api/notion?${params.toString()}`);
        const data = (await res.json()) as NotionApiResponse;

        const newArticles: ArticleCardProps[] = data.results.map((d) => ({
          eyeCatch: d.thumbnail,
          category: d.category,
          title: d.title,
          description: d.description,
          url: '/article/' + d.url,
        }));

        setArticles((prevArticles) =>
          isFirstLoad ? newArticles : [...prevArticles, ...newArticles]
        );
        setNextCursor(data.next_cursor);
        setHasMore(data.has_more);
      } catch (error) {
        console.error('NotionDB fetch error', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // 初回のみ上書き（isFirstLoad=true）
    void fetchArticles(undefined, true);
  }, [fetchArticles]);

  const handleLoadMore = () => {
    if (nextCursor) {
      void fetchArticles(nextCursor);
    }
  };

  return (
    <>
      <ArticleMeta
        title={'記事一覧 | Alkyne'}
        description={'記事を見つけましょう'}
        ogImage={'/AlkyneLogo.png'}
        ogUrl={'/article'}
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Article" />
      <SectionWrapper>
        <CurrentLinkCopyButton mb="10" />
        <Box>
          <ArticleList
            articles={articles}
            isLoading={isLoading}
            mb={{ base: '44px', md: '64px', lg: '80px' }}
          />
          {isLoading && (
            <LoadingSpinner h="400px" w="100%" pb={{ base: '12', md: '24' }} />
          )}
          {!isLoading && hasMore && (
            <Flex justifyContent="center" mt={6}>
              <Button onClick={handleLoadMore} colorScheme="blue">
                さらに読み込む
              </Button>
            </Flex>
          )}
        </Box>
      </SectionWrapper>
    </>
  );
}
