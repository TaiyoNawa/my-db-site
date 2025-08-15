'use client';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FC } from 'react';

type BackButtonProps = {
  href?: string;
} & ButtonProps;

export const BackButton: FC<BackButtonProps> = ({
  href,
  children,
  ...props
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      void router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      leftIcon={<ArrowBackIcon />}
      onClick={handleClick}
      variant="outline"
      colorScheme="blue"
      {...props}
    >
      {children || '戻る'}
    </Button>
  );
};
