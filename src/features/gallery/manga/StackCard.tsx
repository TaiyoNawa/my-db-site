import { Link, Box, Heading } from '@chakra-ui/react';

import Stack from './Stack';

type StackCardProps = {
  cardsData: { id: number; img: string }[];
  title: string;
  href?: string;
};

export const StackCard = ({
  cardsData,
  title = '',
  href = '',
}: StackCardProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minW="220px"
      maxWidth="300px"
      margin="0 auto"
      padding="10px 20px 20px"
      borderRadius="8px"
      backgroundColor="white"
      _hover={{ boxShadow: 'lg' }}
      transition="box-shadow 0.3s ease"
      marginBottom="20px"
      border="1px solid #e2e8f0"
    >
      <Stack
        cardsData={cardsData}
        randomRotation={false}
        cardDimensions={{ width: 148, height: 210 }}
      />
      <Link href={href}>
        <Heading
          as="h3"
          textAlign="center"
          marginTop="8px"
          fontSize="md"
          fontWeight="normal"
        >
          {title}
        </Heading>
      </Link>
    </Box>
  );
};
