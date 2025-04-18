import { Box, Heading, Link } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

import { LinkCopyButton } from '@/features/article/components/detail/LinkCopyButton';
import TiltedCard from '@/features/gallery/components/TiltedCard';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <LinkCopyButton mb="10" />
        <Link href="https://www.reactbits.dev/components/tilted-card">
          Tilted Card
        </Link>
        <Box>
          <TiltedCard
            imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
            altText="Kendrick Lamar - GNX Album Cover"
            captionText="Kendrick Lamar - GNX"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <Heading fontSize="sm" paddingTop={30} paddingLeft={30}>
                Kendrick Lamar - GNX
              </Heading>
            }
          />
        </Box>
      </SectionWrapper>
    </>
  );
}
