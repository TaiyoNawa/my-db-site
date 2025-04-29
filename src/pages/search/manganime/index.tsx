import { Heading } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

import { ManganimeSearchTabs } from '@/features/search/manganime/components/ManganimeSearchTabs';

export default function ManganimeIndex() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Search" />

      <SectionWrapper>
        <Heading as="h4" fontSize="2xl" mb={2}>
          探す(Find)
        </Heading>
        <ManganimeSearchTabs />
      </SectionWrapper>
    </>
  );
}
