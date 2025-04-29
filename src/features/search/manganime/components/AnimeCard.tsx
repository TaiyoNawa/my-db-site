// AnimeCard.tsx
import { Heading, Text, Image, Link, Card } from '@chakra-ui/react';
import { FC } from 'react';

type AnimeCardProps = {
  title: string;
  href?: string;
  image?: string;
  studio?: string;
  seasonYear?: string;
};

export const AnimeCard: FC<AnimeCardProps> = ({
  title,
  href = '',
  image = '',
  studio = '',
  seasonYear = '',
}) => {
  return (
    <Link
      href={href}
      _hover={{ textDecoration: 'none' }}
      isExternal={href.startsWith('http')}
    >
      <Card
        as="article"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        maxW="100%"
        p={{
          base: '4px 8px 8px',
          sm: '6px 14px 14px',
          md: '10px 20px 20px',
        }}
        borderRadius="8px"
        bg="white"
        _hover={{ boxShadow: 'lg' }}
        transition="box-shadow 0.3s ease"
        border="1px solid"
        borderColor="gray.200"
      >
        {image && (
          <Image
            src={image}
            alt={title}
            objectFit="cover"
            borderRadius="md"
            mb={4}
            width="100%"
            height="auto"
            maxH="100%"
          />
        )}

        <Heading
          as="h3"
          fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
          textAlign="center"
          mt={2}
          noOfLines={2}
        >
          {title}
        </Heading>

        <Text
          fontSize={{ base: '10px', sm: 'xs', md: 'sm' }}
          color="gray.600"
          mt={2}
          noOfLines={1}
        >
          スタジオ: {studio || '-'}
        </Text>

        <Text
          fontSize={{ base: '10px', sm: 'xs', md: 'sm' }}
          color="gray.600"
          mt={1}
          noOfLines={1}
        >
          放送年: {seasonYear || '-'}
        </Text>
      </Card>
    </Link>
  );
};
