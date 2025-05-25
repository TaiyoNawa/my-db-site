import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { HomeCardList } from '@/components/card/HomeCardList';
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
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Search" />

      <SectionWrapper>
        <Box>
          <HomeCardList
            title="検索"
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
      'https://cdn.pixabay.com/animation/2024/06/09/21/04/21-04-06-843_512.gif',
    title: 'ミュージック(Music)',
    description: 'Spotifyの音楽を検索・試聴できます',
    url: '/search/music',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'マンガ・アニメ(Manga/Anime)',
    description: 'AniListのマンガ・アニメを検索できます',
    url: '/search/manganime',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '画像(Image)',
    description: 'Unsplashの画像を検索できます',
    url: '/search/image',
  },
];
