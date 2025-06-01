// src/pages/gallery/game/right-left-game/index.tsx
import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { RightLeftGame } from '@/features/gallery/game/right-left-game/components/RightLeftGame';

const RightLeftGamePage = () => {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="右・左どっち？！ | Haruhate"
        description="右か左か、運試し！"
        ogUrl="/gallery/game/right-left-game"
        category="ゲーム"
      />
      <SecondHeader title="Gallery" isHeaderHidden={isHeaderHidden} />
      <SectionWrapper>
        <Box minH="100vh">
          <RightLeftGame />
        </Box>
      </SectionWrapper>
    </>
  );
};

export default RightLeftGamePage;
