import { Box, BoxProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type HeaderWrapperProps = BoxProps & {
  children: ReactNode;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
};

export const HeaderWrapper: FC<HeaderWrapperProps> = ({
  children,
  id,
  ...props
}) => {
  return (
    <Box id={id} {...props} as="header" w="full">
      <Box
        w="full"
        maxW={{ base: 'full', sm: '980px' }}
        px={{ base: '16px', md: '22px', lg: '0' }}
        mx="auto"
      >
        {children}
      </Box>
    </Box>
  );
};
