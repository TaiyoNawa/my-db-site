import { Box, Flex, SimpleGrid, Heading } from '@chakra-ui/react';
import { FC } from 'react';

import { MangaItemsProps } from '@/assets/data/MangaItems';

import { StackCard } from './StackCard';

const GAP_SIZE = { base: '24px', md: '26px', lg: '36px' };
const FONT_SIZE = { base: '24px', md: '28px', lg: '32px' };

type MangaItem = MangaItemsProps;

type StackCardListProps = {
  mangaItems: MangaItem[];
};

export const StackCardList: FC<StackCardListProps> = ({ mangaItems }) => {
  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      width="100%"
    >
      {mangaItems.length === 0 ? (
        <Box w="100%" textAlign="left">
          <Heading as="h1" fontSize={FONT_SIZE} textAlign="left">
            マンガはありません
          </Heading>
        </Box>
      ) : (
        <>
          <Box w="100%" mb={{ base: '24px', md: '32px' }}>
            <Heading as="h1" fontSize={FONT_SIZE} textAlign="left">
              マンガ一覧
            </Heading>
          </Box>

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing="36px"
            justifyItems="center"
            columnGap={GAP_SIZE}
            rowGap={GAP_SIZE}
            width="100%"
          >
            {mangaItems.map((item, index) => (
              <StackCard
                key={index}
                title={item.title}
                cardsData={item.cardsData}
                href={`/manga/${index}`} // ページ遷移先（仮）
              />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
