import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Text, Icon, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { HomeCardList } from '@/components/card/HomeCardList';
import { SecondHeader } from '@/components/header/SecondHeader';

const MotionBox = motion(Box);

export default function Home() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Home" />

      {/* Hero セクション */}
      <Box
        bgImage="/HomeImage.jpg"
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
            Welcome to Haruhate.
          </Text>
          <Text
            fontSize={['md', 'xl']}
            mt={4}
            textShadow="1px 1px 5px rgba(0,0,0,0.6)"
          >
            日常の楽しみを見つけてください。
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
            冒険を始めましょう。
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
    title: '記事',
    description: '私たちの記事を読んでください。',
    url: '/article',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1723608026017-4ec4a7fb0c36?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'ギャラリー',
    description: '自作のゲームやツールなどを公開しています。',
    url: '/gallery',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '検索',
    description: 'お気に入りのコンテンツを見つけてください。',
    url: '/search',
  },
];
/* 英語版
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
]; */
