import { Box, Flex, SimpleGrid, Heading } from '@chakra-ui/react';
import { FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';

import { ArticleCardProps } from './ArticleCard';
import { ArticleCard } from './ArticleCard';

type ArticleListProps = Omit<
  FlexProps,
  'justifyContent' | 'flexDirection' | 'alignItem'
> & {
  articles: ArticleCardProps[];
};

const GAP_SIZE = { base: '24px', md: '26px', lg: '36px' };
const FONT_SIZE = { base: '24px', md: '28px', lg: '32px' };

export const ArticleList: FC<ArticleListProps> = ({ articles, ...rest }) => {
  return (
    <Flex
      {...rest}
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      {articles.length === 0 ? (
        <Box w="100%" textAlign="left">
          <Heading as="h1" fontSize={FONT_SIZE} textAlign="left">
            記事はありません
          </Heading>
        </Box>
      ) : (
        <>
          <Box w="100%" mb={{ base: '24px', md: '32px' }}>
            <Heading as="h1" fontSize={FONT_SIZE} textAlign="left">
              記事一覧
            </Heading>
          </Box>

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing="36px"
            justifyItems="center"
            columnGap={GAP_SIZE}
            rowGap={GAP_SIZE}
          >
            {articles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
