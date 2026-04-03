// src/pages/contact/index.tsx
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { ContactForm } from '@/components/contact/ContactForm';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

export default function ContactPage() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="お問い合わせ・要望 | Haruhate"
        description="バグ報告・機能要望・お問い合わせはこちらからどうぞ。"
        ogUrl="/contact"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Contact" />
      <SectionWrapper>
        <VStack spacing={8} align="stretch" mx="auto">
          <Box>
            <Heading as="h1" size="lg" mb={2}>
              お問い合わせ・要望
            </Heading>
            <Text color="gray.600" fontSize="sm">
              バグ報告・機能要望・ご意見等はこちらからお送りください。メールアドレスをご入力いただいた場合、返信できる場合があります。
            </Text>
          </Box>
          <ContactForm />
        </VStack>
      </SectionWrapper>
    </>
  );
}
