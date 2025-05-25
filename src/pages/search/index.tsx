import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { SearchMeta } from '@/components/meta/SearchMeta';
export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SearchMeta
        title="検索 | Haruhate"
        description="検索しましょう"
        ogUrl="/search"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <Box>検索ページ</Box>
      </SectionWrapper>
    </>
  );
}
