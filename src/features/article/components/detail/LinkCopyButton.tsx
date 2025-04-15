import { LinkIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, useClipboard } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

export const LinkCopyButton: FC<ButtonProps> = ({ ...rest }) => {
  const { onCopy, setValue, hasCopied } = useClipboard('');

  useEffect(() => {
    setValue(location.href);
  }, [setValue]);
  return (
    <Button
      onClick={onCopy}
      color="black"
      borderRadius="full"
      variant="outline"
      fontSize="xs"
      aspectRatio={hasCopied ? '1.5' : '1/1'}
      backgroundColor={'white'}
      _hover={{ backgroundColor: hasCopied ? 'white' : 'gray.80' }}
      {...rest}
    >
      {hasCopied ? 'Copied!' : <LinkIcon fontSize="sm" />}
    </Button>
  );
};
