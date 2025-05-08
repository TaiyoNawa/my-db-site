//features/article/components/id/ArticleContents.tsx
import { Box } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import 'highlight.js/styles/github.css';
import { MarkdownComponents } from '@/features/article/components/id/MarkdownComponents';

import { IndexOfContent } from './IndexOfContents';

type Props = {
  markdown: string;
};

// h2の文字の不要な部分を消す関数

export const generateAnchorId = (text: string) => {
  return encodeURIComponent(text.replace(/\s+/g, ''));
};

export const ArticleContents: FC<Props> = ({ markdown }) => {
  // h2にidを付与
  const headings = useMemo(() => {
    const lines = markdown.split('\n');
    return lines
      .filter((line) => line.startsWith('## '))
      .map((line) => {
        const text = line.replace(/^## /, '').trim();
        const id = generateAnchorId(text); // idをエスケープして生成
        return { text, id };
      });
  }, [markdown]);

  return (
    <Box
      fontSize={{ base: 'md', md: 'lg' }}
      lineHeight="tall"
      fontFamily="body"
    >
      <IndexOfContent headings={headings} />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={MarkdownComponents}
        unwrapDisallowed={true}
      >
        {markdown}
      </ReactMarkdown>
    </Box>
  );
};
