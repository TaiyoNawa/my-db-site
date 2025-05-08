import { Box, Flex, Image, Text, Link, AspectRatio } from '@chakra-ui/react';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';

import { LinkCopyButton } from '@/components/button/LinkCopyButton';

type LinkCardProps = {
  title: string;
  description: string;
  url: string;
  altImageUrl?: string;
};
type FetchOgImageResponse = {
  ogImage?: string;
};

export const LinkCard: FC<LinkCardProps> = ({
  title,
  description,
  url,
  altImageUrl,
}) => {
  const [ogImage, setOgImage] = useState<string>('');

  const fallbackImage = altImageUrl || '/alt_image.png';

  useEffect(() => {
    const fetchOgImage = async () => {
      try {
        const res = await axios.get<FetchOgImageResponse>(
          `/api/fetch-og-image?url=${encodeURIComponent(url)}`
        );
        if (res.data.ogImage) {
          setOgImage(res.data.ogImage);
        } else {
          setOgImage(fallbackImage);
        }
      } catch {
        setOgImage(fallbackImage);
      }
    };
    void fetchOgImage();
  }, [url, fallbackImage]);

  return (
    <Link
      href={url}
      isExternal
      _hover={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        borderWidth="1.5px"
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
            src={ogImage || fallbackImage}
            alt={title}
            objectFit="cover"
            borderTopRadius={{ base: 'lg', md: 'none' }}
            borderLeftRadius={{ base: 'none', md: 'lg' }}
          />
        </AspectRatio>
        <Flex
          p={4}
          pb={2}
          flex="1"
          flexDirection="column"
          justifyContent="space-between"
          position="relative"
        >
          <Box>
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
          </Box>
          <Flex mt={2} justify="space-between" align="center">
            <Text
              fontSize={{ base: 'xs', lg: 'sm' }}
              color="blue.600"
              isTruncated
            >
              {url.length > 70 ? `${url.slice(0, 70)}...` : url}
              {/*70文字以内に制限*/}
            </Text>
            {/* リンクコピーボタン */}
            <Box onClick={(e) => e.preventDefault()}>
              <LinkCopyButton href={url} />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};
