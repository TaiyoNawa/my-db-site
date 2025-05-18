import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';
export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="ギャラリー | Alkyne"
        description="ギャラリーを見つけましょう"
        ogUrl="/gallery"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <CurrentLinkCopyButton mb="10" />
        <Box>ギャラリページページ</Box>
      </SectionWrapper>
    </>
  );
}
