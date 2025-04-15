import { Box } from '@chakra-ui/react';
import { useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

import { LinkCopyButton } from '@/features/article/components/detail/LinkCopyButton';
import { ArticleCardProps } from '@/features/article/components/list/ArticleCard';
import { ArticleList } from '@/features/article/components/list/ArticleList';
import { ArticlePagination } from '@/features/article/components/list/ArticlePagination';
import { articleSample } from '@/features/article/hooks/ArticleSample';

export default function Posts() {
  const [currentItems, setCurrentItems] = useState<ArticleCardProps[]>([]);
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Article" />

      <SectionWrapper>
        <LinkCopyButton mb="10" />

        <Box>
          <ArticleList
            articles={currentItems}
            mb={{ base: '44px', md: '64px', lg: '80px' }}
          />
          <ArticlePagination
            articles={articleSample}
            onPageItemsChange={setCurrentItems}
          />
        </Box>
      </SectionWrapper>
    </>
  );
}
