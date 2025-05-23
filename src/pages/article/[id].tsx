// pages/article/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { ArticleMeta } from '@/components/meta/ArticleMeta';

import { ArticleContents } from '@/features/article/components/id/ArticleContents';
import { ArticleFooter } from '@/features/article/components/id/ArticleFooter';
import { ArticleHeadline } from '@/features/article/components/id/ArticleHeadline';
import { NotionDBItem } from '@/lib/notion/fetchNotionDBItems';

type ArticleData = {
  article: NotionDBItem & { markdown: string };
  relatedArticles: NotionDBItem[];
};

const fetcher = async (url: string): Promise<ArticleData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch article data');
  return res.json() as Promise<ArticleData>;
};

const ArticlePage: React.FC<ArticleData> = (initialData) => {
  const { isHeaderHidden } = useStickyHeader();
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR<ArticleData>(
    id ? `/api/notion/article?id=${Array.isArray(id) ? id[0] : id}` : null,
    fetcher,
    { fallbackData: initialData }
  );

  if (!data) return null;

  const { article, relatedArticles } = data;

  return (
    <>
      <ArticleMeta
        title={article.title + ' | Alkyne'}
        description={article.description || article.title}
        // ogImage={article.ogImage || article.thumbnail}//一旦ogImageはロゴを使用
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
        <ArticleContents markdown={article.markdown} pageId={article.page_id} />
      </SectionWrapper>
      <SectionWrapper>
        <ArticleFooter article={relatedArticles} />
      </SectionWrapper>
    </>
  );
};
export default ArticlePage;

//ISR設定(getStaticPathでビルド時に各[id]の全てのパスを取得)
export const getStaticPaths: GetStaticPaths = async () => {
  const { fetchNotionDBItems } = await import(
    '@/lib/notion/fetchNotionDBItems'
  );
  const response = await fetchNotionDBItems();
  const items = response?.results ?? [];

  const paths = items.map((item) => ({
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
  const { id } = context.params as { id: string };

  const { fetchNotionDBItems } = await import(
    '@/lib/notion/fetchNotionDBItems'
  );
  const { fetchNotionPageContent } = await import(
    '@/lib/notion/fetchNotionPageContent'
  );

  // 記事内容の取得
  // fetchNotionDBItemsで全件取得するのではなく、idからpage_idを取得してfetchNotionPageContentを呼び出す必要がある
  // 現状のfetchNotionDBItemsはページネーション対応しているため、全件取得は非効率
  // TODO: idからpage_idを取得する効率的な方法を検討
  // 一旦、fetchNotionDBItemsで全件取得してからfindする（非効率だが現状のコード構造を大きく変えないため）
  const allItemsResponse = await fetchNotionDBItems();
  const allItems = allItemsResponse?.results ?? [];
  const target = allItems.find((item) => item.url === id);

  if (!target) {
    return { notFound: true };
  }

  // 関連記事（現在のものを除外、最新3件）
  const relatedArticles = allItems
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
    revalidate: 60 * 30, // 30分ごとに再生成
  };
};
