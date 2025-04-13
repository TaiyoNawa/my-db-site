import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Tag,
  useColorModeValue,
} from '@chakra-ui/react';
import { FC } from 'react';

type FooterSectionProps = {
  title: string;
  links: (string | { label: string; tag?: string })[];
};

const FooterSection: FC<FooterSectionProps> = ({ title, links }) => {
  const tagBg = useColorModeValue('green.300', 'green.800');
  const tagColor = 'white';

  return (
    <Stack align="flex-start">
      <Text fontWeight="500" fontSize="lg" mb={2}>
        {title}
      </Text>
      {links.map((item, idx) => {
        if (typeof item === 'string') {
          return (
            <Box as="a" href="#" key={idx}>
              {item}
            </Box>
          );
        } else {
          return (
            <Stack direction="row" align="center" spacing={2} key={idx}>
              <Box as="a" href="#">
                {item.label}
              </Box>
              {item.tag && (
                <Tag size="sm" bg={tagBg} color={tagColor}>
                  {item.tag}
                </Tag>
              )}
            </Stack>
          );
        }
      })}
    </Stack>
  );
};

export const Footer: FC = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container as={Stack} maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <FooterSection
            title="Product"
            links={[
              'Overview',
              { label: 'Features', tag: 'New' },
              'Tutorials',
              'Pricing',
              'Releases',
            ]}
          />
          <FooterSection
            title="Company"
            links={['About Us', 'Press', 'Careers', 'Contact Us', 'Partners']}
          />
          <FooterSection
            title="Legal"
            links={[
              'Cookies Policy',
              'Privacy Policy',
              'Terms of Service',
              'Law Enforcement',
              'Status',
            ]}
          />
          <FooterSection
            title="Follow Us"
            links={['Facebook', 'Twitter', 'Dribbble', 'Instagram', 'LinkedIn']}
          />
        </SimpleGrid>
      </Container>

      <Box py={10}>
        <Flex
          align="center"
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            ml: 8,
          }}
        >
          {/* 空でもOK、線を表示 */}
        </Flex>
        <Text pt={6} fontSize="sm" textAlign="center">
          © {new Date().getFullYear()} TaiyoNawa. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};
