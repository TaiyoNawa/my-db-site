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
        title="ギャラリー一覧 | Haruhate"
        description="ギャラリーをご覧ください。"
        ogUrl="/gallery"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box>
          <HomeCardList
            title="ギャラリー"
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
    eyeCatch:
      'https://images.unsplash.com/photo-1723608026017-4ec4a7fb0c36?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'マンガ紹介',
    description: 'マンガの紹介やレビューを掲載しています。',
    url: '/gallery/manga',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1533237264985-ee62f6d342bb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGdhbWV8ZW58MHx8MHx8fDI%3D',
    title: '自作ゲーム',
    description: '自作のゲームで遊べます',
    url: '/gallery/game',
  },
];
