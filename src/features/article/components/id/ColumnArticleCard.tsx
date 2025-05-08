//features/article/components/id/ColumnArticleCard.tsx
import { Flex, Image, Text, Link, AspectRatio } from '@chakra-ui/react';
import { FC } from 'react';

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

  return (
    <Link
      href={url}
      _hover={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        // borderWidth="1.5px"
        borderRadius="lg"
        borderColor="gray.400"
        overflow="hidden"
        position="relative"
        bg="white"
        transition="filter 0.1s"
        _hover={{ '&:not(:has(button:hover))': { filter: 'brightness(90%)' } }}
      >
        <AspectRatio ratio={16 / 9} w={{ base: '100%', md: '35%' }}>
          <Image
            src={articleImage}
            alt={title}
            objectFit="cover"
            borderTopRadius={{ base: 'lg', md: 'none' }}
            borderLeftRadius={{ base: 'none', md: 'lg' }}
          />
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
