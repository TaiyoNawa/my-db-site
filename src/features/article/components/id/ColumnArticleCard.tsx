//features/article/components/id/ColumnArticleCard.tsx
import { Flex, Text, Link, AspectRatio, Skeleton } from '@chakra-ui/react';
import NextImage from 'next/image';
import { FC, useState } from 'react';

type ColumnArticleCardProps = {
  eyeCatch: string;
  category: string;
  title: string;
  description: string;
  url: string;
};

export const ColumnArticleCard: FC<ColumnArticleCardProps> = ({
  eyeCatch,
  category,
  title,
  description,
  url,
}) => {
  const articleImage = eyeCatch || '/alt_image.png';
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const proxiedSrc = `/api/notion/image-proxy?url=${encodeURIComponent(articleImage)}`;

  return (
    <Link
      href={url}
      _hover={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        borderRadius="lg"
        borderColor="gray.400"
        overflow="hidden"
        position="relative"
        bg="white"
        transition="filter 0.1s"
        _hover={{ '&:not(:has(button:hover))': { filter: 'brightness(90%)' } }}
      >
        <AspectRatio
          ratio={16 / 9}
          w={{ base: '100%', md: '35%' }}
          position="relative"
        >
          <>
            {!isImageLoaded && (
              <Skeleton
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                borderRadius="inherit"
                zIndex="1"
              />
            )}
            <NextImage
              src={proxiedSrc}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              onLoad={() => setIsImageLoaded(true)}
            />
          </>
        </AspectRatio>

        <Flex
          p={6}
          flex="1"
          flexDirection="column"
          justifyContent={{ base: 'space-between', md: 'space-around' }}
          position="relative"
        >
          <Text
            fontSize={{ base: 'xs', lg: 'sm' }}
            color="blue.600"
            isTruncated
          >
            {category}
          </Text>
          <Text fontSize={{ base: 'xl', lg: '2xl' }} fontWeight="bold" mb={2}>
            {title}
          </Text>
          <Text
            fontSize={{ base: 'xs', lg: 'sm' }}
            color="gray.600"
            noOfLines={3}
          >
            {description}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
};
