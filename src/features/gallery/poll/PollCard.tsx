import {
  Box,
  Link,
  Text,
  LinkProps,
  AspectRatio,
  Skeleton,
  Tag,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { FC, useState } from 'react';

import { useLimitedLengthText } from '@/hooks/limitedLengthText';

export type PollCardProps = {
  eyeCatch: string;
  title: string;
  description: string;
  url: string;
  numberOfQuestions: number;
  deadline: string | null;
  isVotingOpen: boolean;
  totalVotes?: number;
} & LinkProps;

export const PollCard: FC<PollCardProps> = ({
  eyeCatch,
  title,
  description,
  url,
  totalVotes,
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

        <Box
          p={{ base: '24px', md: '32px' }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          gap={{ base: 1, md: 2 }}
        >
          <Box>
            <Text
              fontSize={{ base: '18px', sm: '21px' }}
              fontWeight="bold"
              lineHeight="short"
              mb="8px"
            >
              {titleSummary}
            </Text>
          </Box>
          {descriptionSummary && (
            <Text fontSize={{ base: '12px', lg: '14px' }}>
              {descriptionSummary}
            </Text>
          )}
          <Text>{`質問数： ${rest.numberOfQuestions}`}</Text>
          <Text>{`回答数： ${totalVotes || 0}`}</Text>
          <Text>
            {`締切： ${rest.deadline ? new Date(rest.deadline).toLocaleString() : 'なし'}`}
          </Text>
          {rest.isVotingOpen ? (
            <Tag w="fit-content" colorScheme="blue" mt={1}>
              {'投票受付中'}
            </Tag>
          ) : (
            <Tag w="fit-content" colorScheme="red" mt={1}>
              {'投票終了'}
            </Tag>
          )}
        </Box>
      </Box>
    </Link>
  );
};
