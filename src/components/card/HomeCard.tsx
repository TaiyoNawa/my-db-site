//src/components/card/HomeCard.tsx
import { Box, Link, Text, LinkProps, AspectRatio } from '@chakra-ui/react';
import NextImage from 'next/image';
import { FC } from 'react';

import { useLimitedLengthText } from '@/hooks/limitedLengthText';

export type HomeCardProps = {
  eyeCatch: string;
  category?: string;
  title: string;
  description: string;
  url: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
} & LinkProps;

export const HomeCard: FC<HomeCardProps> = ({
  eyeCatch,
  category,
  title,
  description,
  url,
  objectFit = 'cover',
  ...rest
}) => {
  const titleSummary = useLimitedLengthText(title, 40);
  const descriptionSummary = useLimitedLengthText(description, 60);

  return (
    <Link href={url} _hover={{ textDecoration: 'none' }} w="100%" {...rest}>
      <Box
        maxW="472px"
        w={{ base: '100%', sm: '366px', md: '333px', lg: '303px' }}
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
            <Box position="relative" w="100%" h="100%" bgColor="gray.70">
              <NextImage
                src={eyeCatch}
                alt={titleSummary}
                fill
                style={{ objectFit: objectFit }}
                sizes="(max-width: 768px) 100vw, 472px"
              />
            </Box>
          </AspectRatio>
        </Box>

        {/* Text Box */}
        <Box
          p={{ base: '24px', md: '32px', lg: '24px' }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          rowGap={{ base: '0', lg: '5px' }}
        >
          <Box>
            {category && (
              <Text fontSize={{ base: '12px', lg: '14px' }} mb="12px">
                {category}
              </Text>
            )}
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
