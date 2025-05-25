import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

export default function Home() {
  const { isHeaderHidden } = useStickyHeader();
  return (
    <>
      <GalleryMeta
        title="ゲーム | Haruhate"
        description="ゲームをプレイしよう"
        ogUrl="/gallery/games"
        category="ゲーム"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box className="style">This isGame Page</Box>
        <Box h="400px"></Box>
      </SectionWrapper>
    </>
  );
}
