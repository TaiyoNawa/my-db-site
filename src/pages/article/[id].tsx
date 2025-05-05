//pages/article/[id].tsx
import { Box, Heading } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import ReactMarkdown from 'react-markdown';

import { SectionWrapper } from '@/components/SectionWrapper';

import { NotionDBItem } from '@/lib/notion/fetchNotionDBItems';

const ArticlePage: React.FC<{
  article: NotionDBItem & { markdown: string };
}> = ({ article }) => {
  return (
    <SectionWrapper>
      <Box>
        <Heading>{article.title}</Heading>
        <ReactMarkdown>{article.markdown}</ReactMarkdown>
      </Box>
    </SectionWrapper>
  );
};
export default ArticlePage;

//getStaticPathでビルド時に各[id]の全てのパスを取得
export const getStaticPaths: GetStaticPaths = async () => {
  const { fetchNotionDBItems } = await import(
    '@/lib/notion/fetchNotionDBItems'
  );
  const items = await fetchNotionDBItems();

  const paths = (items ?? []).map((item) => ({
    params: { id: item.url }, // 「URL名」を[id]として使う
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
/* fallbackの解説
    false→全て事前ビルド。未定義パスは404→記事数が少ない or ビルド時間に余裕あり
    'blocking'→初回アクセス時に生成、以後キャッシュ→記事数が多い、更新頻度高い
    true→先に空ページを表示して裏で生成→ユーザーに即時レスポンスが必要（UX重視）
 */

// getStaticPropsは"/article/[id]" に初回アクセス or 再生成タイミング（revalidate後のアクセス）時に実行される
export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string }; //URL名を取得し、idとする。contextは動的パラメータ[id]を含むparamsプロパティを持つ

  const { fetchNotionDBItems } = await import(
    '@/lib/notion/fetchNotionDBItems'
  );
  const { fetchNotionPageContent } = await import(
    '@/lib/notion/fetchNotionPageContent'
  );

  const items = await fetchNotionDBItems();
  const target = (items ?? []).find((item) => item.url === id);

  if (!target) {
    return { notFound: true };
  }

  const markdown = await fetchNotionPageContent(target.page_id);

  return {
    //このpropsはArticlePageコンポーネント(表示部分)に渡される
    props: {
      article: {
        ...target,
        markdown,
      },
    },
    revalidate: 60 * 30, // 30分
  };
};
