//pages/article/index.tsx
import { Box } from '@chakra-ui/react';
import { Spinner, Center } from '@chakra-ui/react'; // Spinnerをimport
import { useCallback, useEffect, useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';
import { SecondHeader } from '@/components/header/SecondHeader';

import { ArticleCardProps } from '@/features/article/components/list/ArticleCard';
import { ArticleList } from '@/features/article/components/list/ArticleList';
import { ArticlePagination } from '@/features/article/components/list/ArticlePagination';
import { NotionDBItem } from '@/lib/notion/fetchNotionDBItems';

export default function Posts() {
  // 1. 記事全体の状態を管理
  const [allItems, setAllItems] = useState<ArticleCardProps[]>([]);
  // 2. 現在のページに表示する記事のみを別管理
  const [currentItems, setCurrentItems] = useState<ArticleCardProps[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const { isHeaderHidden } = useStickyHeader();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notion`);
      const data = (await res.json()) as NotionDBItem[];
      // console.log('Fetched Data:', data);

      const articles: ArticleCardProps[] = data.map((d: NotionDBItem) => ({
        eyeCatch: d.thumbnail,
        category: d.category,
        title: d.title,
        description: d.description,
        url: '/article/' + d.url,
      }));
      setAllItems(articles);
    } catch (error) {
      console.error('NotionDB fetch error', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Article" />

      <SectionWrapper>
        <CurrentLinkCopyButton mb="10" />

        <Box>
          {isloading ? (
            <Center py="40">
              <Spinner size="xl" thickness="4px" color="teal.400" />
            </Center>
          ) : (
            <>
              <ArticleList
                articles={currentItems}
                mb={{ base: '44px', md: '64px', lg: '80px' }}
              />
              <ArticlePagination
                articles={allItems}
                onPageItemsChange={setCurrentItems}
              />
            </>
          )}
        </Box>
      </SectionWrapper>
    </>
  );
}
