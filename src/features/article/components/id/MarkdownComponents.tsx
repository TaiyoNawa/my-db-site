import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  ListItem,
  OrderedList,
  UnorderedList,
  Table,
  Tbody,
  Td,
  Th as ChakraTh,
  Thead,
  Tr,
  Text,
  Heading,
  Image,
  useClipboard,
  Button,
} from '@chakra-ui/react';
import React, {
  useState,
  PropsWithChildren,
  ReactNode,
  isValidElement,
} from 'react';

import { generateAnchorId } from '@/features/article/components/id/ArticleContents';

type MarkdownProps = PropsWithChildren<{ id?: string }>;

const CustomTh: React.FC<MarkdownProps> = ({ children, ...props }) => {
  return (
    <ChakraTh textTransform="none" {...props}>
      {children}
    </ChakraTh>
  );
};

// ── ReactNode の配列／要素を再帰的に文字列化するユーティリティ ───────────
function flattenToString(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(flattenToString).join('');
  }
  if (isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    return flattenToString(element.props.children);
  }
  return '';
}

// ── インラインコード(`〇〇`) ────────────────────────────────────────────────
const InlineCode: React.FC<MarkdownProps> = ({ children }) => {
  const text = flattenToString(children);
  return (
    <Box
      as="code"
      bg="gray.100"
      color="red.600"
      fontSize="0.95em"
      px={1}
      py={0.5}
      borderRadius="sm"
      fontFamily="mono"
    >
      {text}
    </Box>
  );
};

// ── 複数行コード(```〇〇```) ─────────────────────────────────────────────────
const BlockCode: React.FC<MarkdownProps> = ({ children }) => {
  const raw = flattenToString(children);
  const codeText = raw.trim();
  const { hasCopied, onCopy } = useClipboard(codeText);
  const [hover, setHover] = useState(false);

  return (
    <Box
      position="relative"
      bg="gray.900"
      color="white"
      fontSize={{ base: 'xs', md: 'sm' }}
      borderRadius="md"
      fontFamily="mono"
      mb={6}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* ここだけスクロールさせる */}
      <Box
        as="pre"
        whiteSpace="pre"
        overflowX="auto"
        p={5}
        // copy ボタンと重なる部分をパディングであける
        pr="3rem"
      >
        {codeText}
      </Box>

      {/* 親コンテナに対して絶対配置するのでスクロールに追従しない */}
      {hover && (
        <Button
          transition="0s"
          size="xs"
          position="absolute"
          top="0"
          right="0"
          onClick={onCopy}
          leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          colorScheme={hasCopied ? 'green' : 'blue'}
          // hasCopied のときはホバー時も色を変えない
          _hover={hasCopied ? { bg: 'green.500' } : undefined}
          zIndex={1}
          borderTopLeftRadius="0"
          borderBottomLeftRadius="0"
          borderTopRightRadius="md"
          borderBottomRightRadius="0"
        >
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      )}
    </Box>
  );
};

export const MarkdownComponents = {
  h2: (props: MarkdownProps) => (
    <Heading
      as="h2"
      fontSize="3xl"
      mt={{ base: 16, md: 20 }}
      mb={{ base: 4, md: 6 }}
      pl={4}
      py={1}
      borderLeft="4px solid"
      borderColor="blue.600"
      fontWeight="bold"
      scrollMarginTop={{ base: 20, md: 24 }}
      id={generateAnchorId(props.children as string)} // idを動的に生成
    >
      {props.children}
    </Heading>
  ),
  h3: (props: MarkdownProps) => (
    <Heading as="h3" fontSize="xl" mt={8} mb={3} fontWeight="semibold">
      {props.children}
    </Heading>
  ),
  p: (props: MarkdownProps) => <Text mb={5}>{props.children}</Text>,
  ul: (props: MarkdownProps) => (
    <UnorderedList pl={2} mb={4}>
      {props.children}
    </UnorderedList>
  ),
  ol: (props: MarkdownProps) => (
    <OrderedList pl={2} mb={4}>
      {props.children}
    </OrderedList>
  ),
  li: (props: MarkdownProps) => <ListItem mb={2}>{props.children}</ListItem>,
  a: (props: MarkdownProps) => (
    <Box as="a" color="teal.600" textDecoration="underline" {...props} />
  ),
  code: ({ children }: { children: ReactNode }) => {
    const text = flattenToString(children);
    const isMultiline = text.includes('\n');
    return isMultiline ? (
      <BlockCode>{children}</BlockCode>
    ) : (
      <InlineCode>{children}</InlineCode>
    );
  },
  blockquote: (props: MarkdownProps) => (
    <Box
      pl={4}
      borderLeft="4px solid #CBD5E0"
      color="gray.600"
      fontStyle="italic"
      mb={6}
    >
      {props.children}
    </Box>
  ),
  table: (props: MarkdownProps) => (
    <Box overflowX="auto" w="100%" mb={6}>
      <Table variant="simple" size="sm" minW={{ base: '500px', md: '100%' }}>
        {props.children}
      </Table>
    </Box>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <Image
      src={src ?? ''}
      alt={alt ?? ''}
      maxH="500px"
      mx="auto"
      borderRadius="md"
      objectFit="contain"
    />
  ),
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: CustomTh,
  td: Td,
};
