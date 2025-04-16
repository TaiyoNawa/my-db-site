import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

export default function Home() {
  const { isHeaderHidden } = useStickyHeader();
  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Home" />
      <SectionWrapper>
        <Box className="style">This is Home</Box>
        <Box h="400px"></Box>
      </SectionWrapper>
    </>
  );
}
