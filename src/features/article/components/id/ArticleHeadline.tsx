import {
  Box,
  Heading,
  Text,
  HStack,
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { FC } from 'react';

import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';

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
  // '||' で分割して複数タグを生成
  const categories = category
    .split(', ')
    .map((c) => c.trim())
    .filter((c) => c);

  return (
    <Box mb={{ base: '6', md: '10' }}>
      <HStack justify="space-between" align="start" mb="4">
        {/* 分割したカテゴリごとにTagを表示。Wrapを使って折り返し対応 */}
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

      <NextImage
        src={thumbnail}
        alt={title}
        layout="responsive"
        width={1200}
        height={675}
        style={{
          borderRadius: '1rem',
          objectFit: 'cover',
        }}
      />
      {/* 現状早いのでnextのImageを使っているが、Chakraに変える可能性もあり */}
    </Box>
  );
};
