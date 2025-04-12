import { Box, BoxProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type SectionWrapperProps = Pick<BoxProps, 'backgroundColor'> & {
  children: ReactNode;
  id?: string;
};

export const SectionWrapper: FC<SectionWrapperProps> = ({
  children,
  backgroundColor,
  id,
}) => {
  return (
    <Box
      as="section"
      py={{ base: '32px', md: '40px', lg: '52px' }}
      px="3%"
      mb="20px"
      backgroundColor={backgroundColor}
      id={id}
    >
      <Box w="full" maxW="1200px" mx="auto">
        {children}
      </Box>
    </Box>
  );
};
