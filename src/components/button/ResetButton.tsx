import { Button, ButtonProps } from '@chakra-ui/react';
import { FC } from 'react';
import { FaArrowsRotate } from 'react-icons/fa6';

type ResetButtonProps = {
  onClick: () => void;
} & Omit<ButtonProps, 'leftIcon'>;

export const ResetButton: FC<ResetButtonProps> = ({ onClick, ...rest }) => {
  return (
    <Button
      size="sm"
      onClick={onClick}
      leftIcon={<FaArrowsRotate />}
      colorScheme="pink"
      variant="solid"
      minW="80px"
      {...rest}
    >
      Reset
    </Button>
  );
};
