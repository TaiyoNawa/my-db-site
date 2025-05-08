//pages/article/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

import { ArticleMeta } from '@/features/article/components/ArticleMeta';
import { ArticleContents } from '@/features/article/components/id/ArticleContents';
import { ArticleFooter } from '@/features/article/components/id/ArticleFooter';
import { ArticleHeadline } from '@/features/article/components/id/ArticleHeadline';
import { NotionDBItem } from '@/lib/notion/fetchNotionDBItems';

const ArticlePage: React.FC<{
  article: NotionDBItem & { markdown: string };
  relatedArticles: NotionDBItem[];
}> = ({ article, relatedArticles }) => {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <ArticleMeta
        title={article.title}
        description={article.description || article.title}
        ogImage={article.ogImage || article.thumbnail}
        ogUrl={`/article/${article.url}`}
        category={article.category}
      />
      <SecondHeader title="Article" isHeaderHidden={isHeaderHidden} />
      <SectionWrapper backgroundColor="white">
        <ArticleHeadline
          title={article.title}
          category={article.category}
          createdAt={article.releaseDate}
          thumbnail={article.thumbnail}
        />
        <ArticleContents markdown={article.markdown} />
        <ArticleFooter article={relatedArticles} />
      </SectionWrapper>
    </>
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

  // 関連記事（現在のものを除外、最新3件）
  const relatedArticles = (items ?? [])
    .filter((item) => item.url !== id)
    .slice(0, 3);

  const markdown = await fetchNotionPageContent(target.page_id);

  return {
    //このpropsはArticlePageコンポーネント(表示部分)に渡される
    props: {
      article: {
        ...target,
        markdown,
      },
      relatedArticles,
    },
    revalidate: 60 * 30, // 30分
  };
};
