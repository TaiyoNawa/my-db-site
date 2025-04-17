import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

import { LinkCopyButton } from '@/features/article/components/detail/LinkCopyButton';
import Stack from '@/features/gallery/components/Stack';
export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <LinkCopyButton mb="10" />
        <Stack sendToBackOnClick={true} />
        <Box></Box>
      </SectionWrapper>
    </>
  );
}
