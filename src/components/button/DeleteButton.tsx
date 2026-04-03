import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { FC } from 'react';

type Props = Omit<IconButtonProps, 'aria-label' | 'icon'> & {
  'aria-label'?: string;
};

export const DeleteButton: FC<Props> = ({
  'aria-label': label = '削除',
  ...props
}) => (
  <IconButton
    aria-label={label}
    icon={<DeleteIcon />}
    colorScheme="red"
    _hover={{ bg: 'red.100' }}
    variant="outline"
    {...props}
  />
);
