//features/article/components/id/IndexOfContents.tsx
import { Box, Link, Text, ListItem, List, ListIcon } from '@chakra-ui/react';

type Heading = {
  text: string;
  id: string;
};

type Props = {
  headings: Heading[];
};

export const IndexOfContent = ({ headings }: Props) => {
  if (headings.length === 0) {
    return null;
  }
  return (
    <Box
      borderLeft="4px solid #4299E1"
      px={{ base: 4, md: 10 }}
      py={4}
      mb={{ base: '6', md: '10' }}
      bgColor="gray.50"
      borderRadius="md"
    >
      <Text fontWeight="bold" mb={2} fontSize={{ base: 'lg', md: 'xl' }}>
        目次
      </Text>
      <List spacing={1}>
        {headings.map((heading) => (
          <ListItem
            key={heading.id}
            display="flex"
            alignItems="center"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            {/* ListIconで丸を表示（colorで色も変えられます） */}
            <ListIcon
              as={Box}
              borderRadius="full"
              boxSize="3px"
              bg="blue.600"
            />

            <Link href={`#${heading.id}`} color="blue.600">
              {heading.text}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
