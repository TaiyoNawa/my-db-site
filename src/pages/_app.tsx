import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

import { Layout } from '@/components/Layout';

import { theme } from '../styles/theme';

import type { AppProps } from 'next/app';

const options = {
  focusThrottleInterval: 60_000,
  revalidateIfStale: false,
  revalidateOnFocus: false,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <SWRConfig value={options}>
          <Component {...pageProps} />
        </SWRConfig>
        {/* <GoogleTagManagerLoader sec={2} /> */}
      </Layout>
    </ChakraProvider>
  );
}
