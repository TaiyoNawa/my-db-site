// src/components/LoadingSpinner.tsx
import { Box, BoxProps, Spinner } from '@chakra-ui/react';
import { FC } from 'react';

type LoadingSpinnerProps = BoxProps & {
  spinnerColor?: string;
  size?: string;
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  spinnerColor = 'pink.400',
  size = 'xl',
  ...props
}) => {
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      role="status"
      display="flex"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={spinnerColor}
        size={size}
      />
    </Box>
  );
};
