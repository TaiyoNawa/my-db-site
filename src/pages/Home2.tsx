// src/pages/Home2.tsx
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Text, Icon, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { HomeCardList } from '@/components/card/HomeCardList';
import { SecondHeader } from '@/components/header/SecondHeader';

type RandomImageData = {
  id: string;
  imageUrl: string;
  alt: string;
  authorName: string;
  authorLink: string;
  imageLink: string;
};
const MotionBox = motion(Box);

export default function Home() {
  const { isHeaderHidden } = useStickyHeader();

  const [heroImage, setHeroImage] = useState<string | null>(null);
  //この辺はunsplashの画像をランダムで取得するAPIだが、API制限があるので実際の運用時は画像を10枚ぐらい用意してランダムの方が良いかも
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const res = await fetch('/api/image/random?query=nature');
        const data = (await res.json()) as RandomImageData;
        setHeroImage(data.imageUrl);
      } catch (error) {
        console.error('画像取得失敗:', error);
      }
    };
    void fetchHeroImage();
  }, []);

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Home" />

      {/* Hero セクション */}
      <Box
        bgImage={`url(${heroImage ?? '/HomeImage.jpg'})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        h="100vh"
        position="relative"
      >
        {/* グラデーションオーバーレイ */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bgGradient="linear(to-b, rgba(0,0,0,0.6), rgba(0,0,0,0.2))"
          zIndex={0}
        />

        {/* Hero コンテンツ */}
        <MotionBox
          position="relative"
          zIndex={1}
          h="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          color="white"
          textAlign="center"
          px={4}
        >
          <Text
            fontSize={['3xl', '5xl']}
            fontWeight="bold"
            textShadow="2px 2px 8px rgba(0,0,0,0.7)"
          >
            Welcome to Our World
          </Text>
          <Text
            fontSize={['md', 'xl']}
            mt={4}
            textShadow="1px 1px 5px rgba(0,0,0,0.6)"
          >
            Discover beauty in everyday moments
          </Text>
          <Icon
            as={ChevronDownIcon}
            boxSize={10}
            mt={12}
            animation="bounce 2s infinite"
            color="whiteAlpha.800"
          />
        </MotionBox>
      </Box>

      {/* 下のセクション */}
      <SectionWrapper>
        <VStack spacing={8} mt={8}>
          <Text fontSize="2xl" fontWeight="semibold">
            Explore Our Features
          </Text>
          <HomeCardList items={items} />
        </VStack>
      </SectionWrapper>

      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}

const items = [
  //レイアウト的に、各アイテムでカテゴリーの有無は統一した方が良い
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9udGFnfGVufDB8fDB8fHw%3D',
    title: 'Article',
    description: 'Read our latest articles.',
    url: '/article',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1723608026017-4ec4a7fb0c36?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Gallery',
    description: 'Explore our gallery of stunning images.',
    url: '/gallery',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Search',
    description: 'Find your favorite content.',
    url: '/search',
  },
];
