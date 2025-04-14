import {} from '@chakra-ui/icons';
import { Box, Heading } from '@chakra-ui/react';
import { FC } from 'react';

type SecondHeaderProps = {
  title?: string;
};
export const SecondHeader: FC<SecondHeaderProps> = ({ title }) => {
  return title ? (
    <Box bgColor="white" w="100%" p={4}>
      <Heading as="h1" fontSize={{ base: '19px', md: '21px' }} textAlign="left">
        {title}
      </Heading>
    </Box>
  ) : null;
};
//SecondHeaderは画面を下にスクロールしても追従するようにする
//色も半透明にする
