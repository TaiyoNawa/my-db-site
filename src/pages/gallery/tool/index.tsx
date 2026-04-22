// pages/gallery/tool/index.tsx
import { Box } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { HomeCardList } from '@/components/card/HomeCardList';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

export default function ToolTopPage() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="便利ツール | Haruhate"
        description="日常で使える便利なツールを集めました。"
        ogUrl="/gallery/tool"
        category="便利ツール"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <Box>
          <HomeCardList
            title="便利ツール一覧"
            items={items}
            mb={{ base: '44px', md: '64px', lg: '80px' }}
          />
        </Box>
      </SectionWrapper>
    </>
  );
}

const items = [
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1585432959322-4db03962b004?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'アンケート',
    description: 'アンケートを回答/作成できます。',
    url: '/gallery/tool/poll',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'ES文字数カウンター',
    description: 'エントリーシート(ES)に特化した文字数カウントツール。',
    url: '/gallery/tool/es-counter',
  },
];
