// src/pages/gallery/game/index.tsx
import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { HomeCardList } from '@/components/card/HomeCardList';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';
export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="ゲーム | Haruhate"
        description="ゲームをプレイしよう"
        ogUrl="/gallery/game"
        category="ゲーム"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box>
          <HomeCardList
            items={items}
            mb={{ base: '44px', md: '64px', lg: '80px' }}
          />
        </Box>
      </SectionWrapper>
    </>
  );
}

const items = [
  //レイアウト的に、各アイテムでカテゴリーの有無は統一した方が良い
  {
    eyeCatch: 'https://furiirakun.com/wp/wp-content/uploads/2021/07/zunzun.gif',
    title: 'ネコパンチ！一番反射が早いのは誰ニャ？',
    description: '反射神経を試しましょう',
    url: '/gallery/game/neko-punch',
    objectFit: 'contain' as const,
  },
];
