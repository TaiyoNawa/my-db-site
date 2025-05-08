//features/article/components/id/ArticleFooter.tsx
import { Box, Text, Heading, Stack } from '@chakra-ui/react';
import { FC } from 'react';

import { ColumnArticleCard } from '@/features/article/components/id/ColumnArticleCard';
import { NotionDBItem } from '@/lib/notion/fetchNotionDBItems';

type ArticleFooterProps = {
  article: NotionDBItem[];
};

export const ArticleFooter: FC<ArticleFooterProps> = ({ article }) => {
  return (
    <Box mt="16" pt="8" borderTop="1px solid" borderColor="gray.200">
      <Text fontSize="sm" color="gray.500">
        この記事がお役に立ちましたか？ ぜひシェアや感想をお聞かせください。
      </Text>

      {/* 今後：シェアボタンや次の記事へのリンクなどを追加可 */}
      <Box mt="16">
        {article.length > 0 && (
          <Heading fontSize="2xl" mb="6">
            最近の記事
          </Heading>
        )}
        <Stack spacing="4">
          {article.map((item, index) => (
            <Box key={item.page_id}>
              <ColumnArticleCard
                eyeCatch={item.thumbnail}
                category={item.category}
                title={item.title}
                description={item.description}
                url={item.url}
              />
              {index !== article.length - 1 && (
                <Box
                  data-testid="article-divider"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  mt="4"
                />
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
