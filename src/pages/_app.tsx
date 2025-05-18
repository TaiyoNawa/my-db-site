import { ChakraProvider } from '@chakra-ui/react';
import { GoogleTagManager } from '@next/third-parties/google';
import { SWRConfig } from 'swr';

import { Layout } from '@/components/Layout';
import { DefaultMeta } from '@/components/meta/DefaultMeta';

import { theme } from '../styles/theme';

import type { AppProps } from 'next/app';
const gtmId: string = process.env.GOOGLE_TAG_MANAGER_ID || '';

const options = {
  focusThrottleInterval: 60_000,
  revalidateIfStale: false,
  revalidateOnFocus: false,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <DefaultMeta />
      <GoogleTagManager gtmId={gtmId} />
      <Layout>
        <SWRConfig value={options}>
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    </ChakraProvider>
  );
}
