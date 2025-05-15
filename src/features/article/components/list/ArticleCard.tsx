//src/features/article/components/list/ArticleCard.tsx
import {
  Box,
  Link,
  Text,
  LinkProps,
  AspectRatio,
  Skeleton,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { FC, useState } from 'react';

import { useLimitedLengthText } from '@/hooks/limitedLengthText';

export type ArticleCardProps = {
  eyeCatch: string;
  category: string;
  title: string;
  description: string;
  url: string;
} & LinkProps;

export const ArticleCard: FC<ArticleCardProps> = ({
  eyeCatch,
  category,
  title,
  description,
  url,
  ...rest
}) => {
  const titleSummary = useLimitedLengthText(title, 40);
  const descriptionSummary = useLimitedLengthText(description, 40);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Link href={url} _hover={{ textDecoration: 'none' }} w="100%" {...rest}>
      <Box
        maxW="472px"
        w={{ base: 'auto', sm: '366px', md: '333px', lg: '472px' }}
        display="flex"
        flexDirection="column"
        height="100%"
        borderRadius="25px"
        overflow="hidden"
        bgColor="white"
        transition="box-shadow 0.3s ease"
        _hover={{ boxShadow: 'lg' }}
        role="group"
      >
        <Box
          overflow="hidden"
          transition="transform 0.3s ease"
          _groupHover={{ transform: 'scale(1.03)' }}
        >
          <AspectRatio ratio={16 / 9} w="100%">
            <Box position="relative" w="100%" h="100%">
              {/* Skeleton表示 */}
              {!isImageLoaded && (
                <Skeleton
                  position="absolute"
                  w="100%"
                  h="100%"
                  borderRadius="0"
                />
              )}

              <NextImage
                src={eyeCatch}
                alt={titleSummary}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 472px"
                onLoad={() => setIsImageLoaded(true)}
              />
            </Box>
          </AspectRatio>
        </Box>

        {/* Text Box */}
        <Box
          p={{ base: '24px', md: '32px' }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Text fontSize={{ base: '12px', lg: '14px' }} mb="12px">
              {category}
            </Text>
            <Text
              fontSize={{ base: '18px', sm: '21px' }}
              fontWeight="bold"
              lineHeight="short"
              mb="8px"
            >
              {titleSummary}
            </Text>
          </Box>
          <Text fontSize={{ base: '12px', lg: '14px' }}>
            {descriptionSummary}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};
