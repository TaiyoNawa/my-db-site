import { Box } from '@chakra-ui/react';
import { useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';
import { SecondHeader } from '@/components/header/SecondHeader';

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
        <CurrentLinkCopyButton mb="10" />

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
