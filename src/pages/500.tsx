import { Box, Heading, Text } from '@chakra-ui/react';

import { SectionWrapper } from '@/components/SectionWrapper';

const ServerErrorPage = () => {
  return (
    <SectionWrapper>
      <Box textAlign="center" py={{ base: '8%', sm: 10, md: 24 }} px={4}>
        <Heading
          w="100%"
          as="h1"
          fontSize={{ base: '24px', sm: '32px', md: '40px', lg: '48px' }}
          mb={4}
        >
          500 Internal Server Error.
        </Heading>
        <Text
          fontSize={{ base: '12px', sm: '16px', md: '24px', lg: '28px' }}
          color="gray.600"
        >
          サーバーエラーが発生しました。
        </Text>
      </Box>
    </SectionWrapper>
  );
};
export default ServerErrorPage;
