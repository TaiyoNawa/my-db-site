import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

type BaseBoxProps = Omit<BoxProps, 'borderRadius' | 'bg'>;

export const BaseBox: FC<BaseBoxProps> = (rest) => {
  return <Box borderRadius={6} bg="white" w="full" p={5} {...rest}></Box>;
};
