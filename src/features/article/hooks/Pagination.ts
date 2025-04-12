import { useEffect, useState } from 'react';

import { ArticleCardProps } from '../components/list/ArticleCard';

export const ITEMS_PER_PAGE = 20;

export const usePagination = (
  articles: ArticleCardProps[],
  onPageItemsChange: (items: ArticleCardProps[]) => void
) => {
  const [itemOffset, setItemOffset] = useState(0);
  const pageCount = Math.ceil(articles.length / ITEMS_PER_PAGE); // 総ページ数

  useEffect(() => {
    const endOffset = itemOffset + ITEMS_PER_PAGE; //現在のページの最後の記事番号
    const currentItems = articles.slice(itemOffset, endOffset); //現在のページの最初から最後の記事までを取得
    onPageItemsChange(currentItems); //現在のページに表示する記事を渡す
  }, [itemOffset, articles, onPageItemsChange]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % articles.length; //新しいページの最初の記事番号
    setItemOffset(newOffset);
  };

  return {
    pageCount,
    handlePageClick,
  };
};
