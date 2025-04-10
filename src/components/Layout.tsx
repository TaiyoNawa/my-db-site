import { Box, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { notoSansJP } from '../assets/data';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minH="100vh"
      className={notoSansJP.className}
    >
      <Text>これはStorybookのサンプルです</Text>
      <Header />
      <Box
        as="main"
        flex="1"
        display="flex"
        flexDirection="column"
        backgroundColor="gray.800"
      >
        <Box maxW={{ base: '100%' }}>{children}</Box>
      </Box>
      <Footer />
    </Box>
  );
};
