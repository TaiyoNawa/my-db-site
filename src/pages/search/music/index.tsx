// src/pages/search/music/index.tsx
import { Heading, Flex, Text } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { SearchMeta } from '@/components/meta/SearchMeta';

import { SpotifyPlayer } from '@/features/search/music/component/SpotifyPlayer';
import { SpotifySearchTabs } from '@/features/search/music/component/SpotifySearchTabs';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SearchMeta
        title="ミュージック | Haruhate"
        description="音楽を検索しましょう"
        ogUrl="/search/music"
        category="音楽"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <Heading as="h4" fontSize="2xl" mb={2}>
          ヒット(Hits)
        </Heading>
        <Flex
          w="100%"
          gap={{ base: 0, md: 6 }}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <SpotifyPlayer playlistId="37i9dQZF1DXcBWIGoYBM5M" type="playlist" />
          <SpotifyPlayer playlistId="37i9dQZEVXbKXQ4mDTEBXq" type="playlist" />
        </Flex>
        <Text fontSize={{ base: 'sm', md: 'lg' }} mb={{ base: 6, md: 12 }}>
          ⚠︎音量が大きい場合がありますのでご注意ください。(Please be careful as
          the volume may be loud.)
        </Text>
        <Heading as="h4" fontSize="2xl" mb={2}>
          探す(Find)
        </Heading>
        <SpotifySearchTabs />
      </SectionWrapper>
    </>
  );
}
