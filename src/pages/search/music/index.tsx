import { Heading, Flex } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

import { SpotifyPlayer } from '@/features/search/music/component/SpotifyPlayer';
import { SpotifySearchTabs } from '@/features/search/music/component/SpotifySearchTabs';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <Heading as="h4" fontSize="2xl" mb={2}>
          ヒット(Hits)
        </Heading>
        <Flex
          w="100%"
          gap={{ base: 0, md: 6 }}
          flexDirection={{ base: 'column', md: 'row' }}
          mb={{ base: 6, md: 12 }}
        >
          <SpotifyPlayer playlistId="37i9dQZF1DXcBWIGoYBM5M" type="playlist" />
          <SpotifyPlayer playlistId="37i9dQZEVXbKXQ4mDTEBXq" type="playlist" />
        </Flex>

        <Heading as="h4" fontSize="2xl" mb={2}>
          探す(Find)
        </Heading>
        <SpotifySearchTabs />
      </SectionWrapper>
    </>
  );
}
