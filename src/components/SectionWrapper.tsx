import { Box, BoxProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { SECTION_WRAPPER_PADDING } from '@/assets/data/SectionWrapperAssets';

type SectionWrapperProps = Pick<BoxProps, 'backgroundColor'> & {
  children: ReactNode;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
};

export const SectionWrapper: FC<SectionWrapperProps> = ({
  children,
  backgroundColor,
  id,
  paddingTop = SECTION_WRAPPER_PADDING,
  paddingBottom = SECTION_WRAPPER_PADDING,
}) => {
  return (
    <Box
      as="section"
      pt={paddingTop}
      pb={paddingBottom}
      backgroundColor={backgroundColor}
      id={id}
    >
      <Box
        w="full"
        maxW={{ base: '87%', sm: '366px', md: '692px', lg: '980px' }} //ここがSectionの大きさを決める！
        mx="auto"
      >
        {children}
      </Box>
    </Box>
  );
};
