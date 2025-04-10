import { Box, Flex, Link, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';

import { useLimitedLengthText } from '@/hooks/limitedLengthText';

export type ArticleCardProps = {
  eyeCatch: string;
  category: string;
  title: string;
  description: string;
  url: string;
};

export const ArticleCard: FC<ArticleCardProps> = ({
  eyeCatch,
  category,
  title,
  description,
  url,
  ...rest
}) => {
  const titleSummary = useLimitedLengthText(title, 100);
  const descriptionSummary = useLimitedLengthText(description, 100);
  return (
    <Box
      maxW="472px"
      maxH="472px"
      {...rest}
      bgColor="white"
      borderRadius="25px"
      overflow="hidden" //画像がボックス外に出ないように
      transition="box-shadow 0.3s ease"
      _hover={{
        boxShadow: 'lg',
        textDecoration: 'none',
      }}
    >
      <Flex
        justifyContent="center"
        flexDirection="column"
        as={Link}
        href={url}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Box
          overflow="hidden"
          transition="transform 0.3s ease"
          _hover={{
            transform: 'scale(1.03)',
          }}
        >
          <Image
            src={eyeCatch}
            alt={titleSummary}
            loading="eager"
            objectFit="cover" // 画像が親ボックスにぴったり収まるように
            aspectRatio={16 / 9}
            borderRadius="0"
          />
        </Box>
        <Flex
          flexDirection="column"
          gap="8px"
          justifyContent="flex-start"
          p="32px"
        >
          <Box>
            <Text fontSize="12px" mb="12px" _hover={{ textDecoration: 'none' }}>
              {category}
            </Text>
            <Text fontSize="24px" fontWeight="bold" lineHeight="short" mb="8px">
              {titleSummary}
            </Text>
          </Box>
          <Box fontSize="12px">{descriptionSummary}</Box>
        </Flex>
      </Flex>
    </Box>
  );
};
