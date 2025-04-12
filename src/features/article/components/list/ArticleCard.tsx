import { Box, Link, Image, Text } from '@chakra-ui/react';
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
  const titleSummary = useLimitedLengthText(title, 60);
  const descriptionSummary = useLimitedLengthText(description, 50);

  return (
    <Link href={url} _hover={{ textDecoration: 'none' }}>
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
        role="group" // ✅ 追加
        {...rest}
      >
        {/* 画像box */}
        <Box
          h={{ base: 'auto', sm: '205px', md: '187px', lg: '267px' }}
          w={{ base: 'auto', sm: '366px', md: '333px', lg: '472px' }}
          overflow="hidden"
          transition="transform 0.3s ease"
          _groupHover={{ transform: 'scale(1.03)' }} // ✅ 変更
        >
          <Image
            src={eyeCatch}
            alt={titleSummary}
            objectFit="cover"
            aspectRatio={16 / 9}
            width="100%"
          />
        </Box>

        {/* Text box */}
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
              fontSize={{ base: '21px' }}
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
