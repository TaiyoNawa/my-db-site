import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { LinkCard } from '@/components/card/LinkCard';
import { SecondHeader } from '@/components/header/SecondHeader';
import { ArticleMeta } from '@/components/meta/ArticleMeta';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <ArticleMeta
        title="リンク集 | Haruhate"
        description="リンクを集めました。"
        ogUrl="/article/link"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Article" />

      <SectionWrapper>
        <Box>
          <LinkCard
            altImageUrl=""
            title="Sample Title"
            description="This is a sample description"
            url="https://github.com"
          />
          <LinkCard
            altImageUrl="/sample/image1.png"
            title="Sample Title"
            description="This is a sample description for the LinkCard component."
            url="https://oricon.co.jp/"
          />
        </Box>
      </SectionWrapper>
    </>
  );
}
