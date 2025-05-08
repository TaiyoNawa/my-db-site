import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';
import { SectionWrapper } from '../SectionWrapper';

type FooterLink = {
  label: string;
  href: string;
  children?: FooterLink[];
};

type FooterSectionProps = {
  item: FooterLink;
};

const FooterSection: FC<FooterSectionProps> = ({ item }) => (
  <Stack align="flex-start">
    {/* 親リンク */}
    <ChakraLink
      as={NextLink}
      href={item.href}
      fontWeight="600"
      fontSize="lg"
      mb={2}
    >
      {item.label}
    </ChakraLink>

    {/* 子リンク */}
    {item.children?.map((child, idx) => (
      <ChakraLink
        as={NextLink}
        href={child.href}
        fontSize="sm"
        display="block"
        key={idx}
      >
        {child.label}
      </ChakraLink>
    ))}
  </Stack>
);

export const Footer: FC = () => {
  return (
    <SectionWrapper>
      <Box color={useColorModeValue('gray.700', 'gray.200')}>
        <Container as={Stack} maxW="6xl" py={10}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
            {footerLinks.map((item, idx) => (
              <FooterSection item={item} key={idx} />
            ))}
          </SimpleGrid>
        </Container>

        <Box py={10}>
          <Box
            borderBottom="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            mx="auto"
            maxW="6xl"
            mb={6}
          />
          <Text fontSize="sm" textAlign="center">
            © {new Date().getFullYear()} TaiyoNawa. All rights reserved.
          </Text>
        </Box>
      </Box>
    </SectionWrapper>
  );
};

const footerLinks: FooterLink[] = [
  {
    label: '記事',
    href: '/article',
    children: [
      { label: 'ランキング', href: '#' },
      { label: 'リンク', href: '/article/link' },
    ],
  },
  {
    label: 'ギャラリー',
    href: '/gallery',
    children: [
      { label: 'マンガ', href: '/gallery/manga' },
      { label: 'ミュージック', href: '/gallery/music' },
    ],
  },
  {
    label: '検索',
    href: '/search',
    children: [
      { label: 'マンガ・アニメ', href: '/search/manganime' },
      { label: '画像', href: '/search/image' },
    ],
  },
  {
    label: 'Hire Designers',
    href: '#',
  },
];
