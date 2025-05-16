//src/features/article/components/list/ArticleCard.tsx
import {
  Box,
  Heading,
  Text,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  Skeleton,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { FC, useState } from 'react';

import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';

import { usePresignedImage } from '@/features/article/hooks/usePresignedImage';

type Props = {
  title: string;
  category: string;
  thumbnail: string;
  createdAt: string;
};

export const ArticleHeadline: FC<Props> = ({
  title,
  category,
  thumbnail,
  createdAt,
}) => {
  const categories = category
    .split(', ')
    .map((c) => c.trim())
    .filter((c) => c);

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  // ★期限チェック＆再取得
  const imageSrc = usePresignedImage(thumbnail) || '/fallback_image.png';

  return (
    <Box mb={{ base: '6', md: '10' }}>
      <HStack justify="space-between" align="start" mb="4">
        <Wrap spacing={2} maxW="100%">
          {categories.map((cat) => (
            <WrapItem key={cat}>
              <Tag size="md" colorScheme="blue">
                {cat}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
        <CurrentLinkCopyButton />
      </HStack>

      <Heading
        as="h1"
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight="bold"
        lineHeight="short"
        mb="2"
      >
        {title}
      </Heading>

      <Text fontSize="sm" color="gray.500" mb="6">
        {createdAt}
      </Text>

      {/* Skeletonと画像 */}
      <Box position="relative" width="100%" maxW="1200px" aspectRatio="16 / 9">
        {!isImageLoaded && (
          <Skeleton
            borderRadius="1rem"
            width="100%"
            height="100%"
            position="absolute"
            top="0"
            left="0"
            zIndex="1"
            speed={0}
          />
        )}
        <NextImage
          src={imageSrc}
          alt={title}
          width={1200}
          height={675}
          style={{
            borderRadius: '1rem',
            objectFit: 'cover',
          }}
          onLoad={() => setIsImageLoaded(true)}
        />
      </Box>
    </Box>
  );
};
