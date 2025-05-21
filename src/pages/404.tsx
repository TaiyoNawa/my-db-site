import { Box, Heading, Text } from '@chakra-ui/react';

import { SectionWrapper } from '@/components/SectionWrapper';

const NotFoundPage = () => {
  return (
    <SectionWrapper>
      <Box textAlign="center" py={{ base: 16, md: 24 }}>
        <Heading
          w="100%"
          as="h1"
          fontSize={{ base: '24px', sm: '32px', md: '40px', lg: '48px' }}
          mb={4}
        >
          404 Not Found.
        </Heading>
        <Text
          fontSize={{ base: '14px', sm: '16px', md: '24px', lg: '28px' }}
          color="gray.600"
        >
          お探しのページは見つかりませんでした。
        </Text>
      </Box>
    </SectionWrapper>
  );
};
export default NotFoundPage;
