// src/components/card/HomeCardList.tsx
import { Box, Flex, SimpleGrid, Heading } from '@chakra-ui/react';
import { FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';

import { HomeCardProps } from './HomeCard';
import { HomeCard } from './HomeCard';

type HomeCardListProps = Omit<
  FlexProps,
  'justifyContent' | 'flexDirection' | 'alignItem'
> & {
  title?: string;
  items: HomeCardProps[];
};

const GAP_SIZE = { base: '24px', md: '26px', lg: '35.5px' };
const FONT_SIZE = { base: '24px', md: '28px', lg: '32px' };

export const HomeCardList: FC<HomeCardListProps> = ({
  title,
  items,
  ...rest
}) => {
  return (
    <Flex
      {...rest}
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      {items.length === 0 ? (
        <Box w="100%" textAlign="left">
          <Heading as="h1" fontSize={FONT_SIZE} textAlign="left">
            {title}はありません
          </Heading>
        </Box>
      ) : (
        <>
          {title && (
            <Box w="100%" mb={{ base: '24px', md: '32px' }}>
              <Heading as="h1" fontSize={FONT_SIZE} textAlign="left">
                {title}
              </Heading>
            </Box>
          )}

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing="36px"
            justifyItems="center"
            columnGap={GAP_SIZE}
            rowGap={GAP_SIZE}
            w="100%"
          >
            {items.map((item, index) => (
              <HomeCard key={index} {...item} />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
