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

export const ArticleList: FC<ArticleListProps> = ({ articles, ...rest }) => {
  const contentWidth = { base: '83%', sm: '366px', md: '690px', lg: '976px' };

  return (
    <Flex
      {...rest}
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      {articles.length === 0 ? (
        <Box w={contentWidth} textAlign="left">
          <Heading
            as="h1"
            fontSize={{ base: '24px', md: '28px', lg: '32px' }}
            textAlign="left"
          >
            記事はありません
          </Heading>
        </Box>
      ) : (
        <>
          <Box w={contentWidth} mb={{ base: '24px', md: '32px' }}>
            <Heading
              as="h1"
              fontSize={{ base: '24px', md: '28px', lg: '32px' }}
              textAlign="left"
            >
              記事一覧
            </Heading>
          </Box>

          <SimpleGrid
            w={contentWidth}
            columns={{ base: 1, md: 2 }}
            spacing="36px"
            justifyItems="center"
            columnGap={{ base: '24px', lg: '32px' }}
            rowGap={{ base: '24px', lg: '32px' }}
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
