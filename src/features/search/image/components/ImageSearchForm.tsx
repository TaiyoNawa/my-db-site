import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  BoxProps,
} from '@chakra-ui/react';
import { useState, FC } from 'react';

type Props = {
  onSearch: (query: string) => void;
  onReset?: () => void;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const ImageSearchForm: FC<Props> = ({ onSearch, ...rest }) => {
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <Box w="full" py={5} {...rest}>
      <form onSubmit={submit}>
        <InputGroup>
          <Input
            type="search"
            placeholder="キーワードを入力"
            maxLength={100}
            bgColor="white"
            _placeholder={{ color: 'gray.500' }}
            borderColor="gray.400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputRightElement>
            <Button type="submit" colorScheme="white">
              <SearchIcon color="gray.300" />
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    </Box>
  );
};
