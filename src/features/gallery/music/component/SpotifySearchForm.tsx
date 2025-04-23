import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  BoxProps,
} from '@chakra-ui/react';
import { FC, useState } from 'react';

type SpotifySearchFormProps = {
  onSearch: (query: string) => void;
} & Omit<BoxProps, 'borderRadius' | 'bg'>;

export const SpotifySearchForm: FC<SpotifySearchFormProps> = ({
  onSearch,
  ...rest
}) => {
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  return (
    <Box w="full" p={5} {...rest}>
      🔍検索
      <form onSubmit={submit}>
        <InputGroup>
          <Input
            type="search"
            placeholder="キーワードを入力"
            maxLength={100}
            bgColor="white"
            _placeholder={{ color: 'gray.200' }}
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
