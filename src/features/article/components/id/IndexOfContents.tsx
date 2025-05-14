//features/article/components/id/IndexOfContents.tsx
import { Box, Link, Text } from '@chakra-ui/react';

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
      {headings.map((heading) => (
        <Box key={heading.id} mb={1} pl={2}>
          <Link
            href={`#${heading.id}`}
            color="blue.600"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            {heading.text}
          </Link>
        </Box>
      ))}
    </Box>
  );
};
