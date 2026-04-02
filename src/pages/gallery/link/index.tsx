// pages/gallery/link/index.tsx
import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { LinkCard } from '@/components/card/LinkCard';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

export default function LinkCollectionPage() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      {/* /article/link から /gallery/link に移動済み */}
      <GalleryMeta
        title="リンク集 | Haruhate"
        description="リンクを集めました。"
        ogUrl="/gallery/link"
        category="リンク集"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

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
