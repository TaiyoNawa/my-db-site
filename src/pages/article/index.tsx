import { Box } from '@chakra-ui/react';
import { useState } from 'react';

import { SectionWrapper } from '@/components/SectionWrapper';

import { ArticleCardProps } from '@/features/article/components/list/ArticleCard';
import { ArticleList } from '@/features/article/components/list/ArticleList';
import { ArticlePagination } from '@/features/article/components/list/ArticlePagination';
import { articleSample } from '@/features/article/hooks/ArticleSample';

export default function Posts() {
  const [currentItems, setCurrentItems] = useState<ArticleCardProps[]>([]);

  return (
    <SectionWrapper>
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
  );
}
