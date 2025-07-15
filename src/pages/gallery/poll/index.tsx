// src/pages/gallery/poll/index.tsx
import { Box, Button, Link } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { ArticleCard } from '@/features/article/components/list/ArticleCard';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="アンケート一覧 | Haruhate"
        description="アンケート一覧"
        ogUrl="/gallery/poll"
        category="アンケート"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box>
          <Link href="/gallery/poll/create" style={{ textDecoration: 'none' }}>
            <Button colorScheme="blue" variant="solid" minW="80px">
              アンケート作成
            </Button>
          </Link>
          {/* ここに公開アンケート一覧を表示する予定 */}
          <ArticleCard
            mt={10}
            eyeCatch="/alt/alt_image.png"
            title="アンケートの例"
            description="アンケートの説明A"
            url="/gallery/poll/xULqnw4r"
            objectFit="contain"
            category="アンケート"
          />
        </Box>
      </SectionWrapper>
    </>
  );
}
