import { Button, ButtonProps } from '@chakra-ui/react';
import { FC } from 'react';

type Props = Omit<ButtonProps, 'colorScheme' | 'bg' | '_hover'> & {
  isActive: boolean;
};

export const SortButton: FC<Props> = ({ isActive, ...props }) => (
  <Button
    colorScheme={isActive ? 'blue' : 'gray'}
    bg={!isActive ? 'gray.200' : undefined}
    _hover={!isActive ? { bg: 'gray.300' } : undefined}
    {...props}
  />
);
