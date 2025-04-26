import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { LinkCard } from '@/components/LinkCard';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Article" />

      <SectionWrapper>
        <Box>
          <LinkCard
            altImageUrl=""
            title="Sample Title"
            description="This is a sample description"
            url="https://github.com"
          />
          <LinkCard
            altImageUrl="/image1.png"
            title="Sample Title"
            description="This is a sample description for the LinkCard component."
            url="https://oricon.co.jp/"
          />
        </Box>
      </SectionWrapper>
    </>
  );
}
