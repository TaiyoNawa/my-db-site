// src/pages/contact/thanks.tsx
// お問い合わせ送信後のサンクスページ
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

export default function ContactThanksPage() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="送信完了 | Haruhate"
        description="お問い合わせを受け付けました。"
        ogUrl="/contact/thanks"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Contact" />
      <SectionWrapper>
        <VStack spacing={8} align="center" maxW="600px" mx="auto" py={16}>
          <Box textAlign="center">
            <Heading as="h1" size="lg" mb={4}>
              送信が完了しました
            </Heading>
            <Text color="gray.600">
              お問い合わせありがとうございます。
              <br />
              内容を確認の上、必要に応じてご連絡いたします。
            </Text>
          </Box>
          <Button as={NextLink} href="/" colorScheme="pink" size="md">
            トップページへ戻る
          </Button>
        </VStack>
      </SectionWrapper>
    </>
  );
}
