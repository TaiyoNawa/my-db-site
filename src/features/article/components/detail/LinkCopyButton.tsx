import { LinkIcon } from '@chakra-ui/icons';
import { Button, useClipboard } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

export const LinkCopyButton: FC = () => {
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
      _hover={{ backgroundColor: hasCopied ? 'white' : 'gray.100' }}
    >
      {hasCopied ? 'Copied!' : <LinkIcon fontSize="sm" />}
    </Button>
  );
};
