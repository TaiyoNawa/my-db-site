import type { AppProps } from "next/app";
import { theme } from "../styles/theme";
import { ChakraProvider, Box, Text } from "@chakra-ui/react";
import { Layout } from "@/components/Layout";
// import { GOOGLE_TAG_MANAGER_ID } from '@/config/constant';

// const options = {
//   focusThrottleInterval: 60_000,
//   revalidateIfStale: false,
//   revalidateOnFocus: false,
// };

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
        <Box as="footer" bg="teal.500" color="white" p="4" mt="24">
          <Text>&copy; 2024 My DB Site. All rights reserved.</Text>
        </Box>
      </Layout>
    </ChakraProvider>
  );
}
