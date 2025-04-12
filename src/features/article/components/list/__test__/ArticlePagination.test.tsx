import { describe, it, expect, vi } from 'vitest';

import { articleSample } from '@/features/article/hooks/ArticleSample';
import { render, screen, fireEvent } from '@/test/test-utils';

import { ITEMS_PER_PAGE } from '../../../hooks/Pagination';
import { ArticlePagination } from '../ArticlePagination';

describe('ArticlePagination.tsxのテスト', () => {
  it('ページネーションで1ページ目のデータを返す', () => {
    const onPageItemsChange = vi.fn();
    render(
      <ArticlePagination
        articles={articleSample}
        onPageItemsChange={onPageItemsChange}
      />
    );
    // 初期描画時にonPageItemsChangeが呼ばれる
    expect(onPageItemsChange).toHaveBeenCalledTimes(1);
    // 最初の10件を渡しているか確認
    expect(onPageItemsChange).toHaveBeenCalledWith(
      articleSample.slice(0, ITEMS_PER_PAGE)
    );
  });

  it('ページをクリックするとonPageItemsChangeが次の6件で呼ばれる', () => {
    const onPageItemsChange = vi.fn();
    render(
      <ArticlePagination
        articles={articleSample}
        onPageItemsChange={onPageItemsChange}
      />
    );
    // 最初の呼び出し（1ページ目）
    expect(onPageItemsChange).toHaveBeenCalledWith(
      articleSample.slice(0, ITEMS_PER_PAGE)
    );
    // ページ2をクリック
    fireEvent.click(screen.getByText('2'));
    // 2ページ目のデータを渡しているか確認（21〜26番目）
    expect(onPageItemsChange).toHaveBeenCalledWith(
      articleSample.slice(ITEMS_PER_PAGE, ITEMS_PER_PAGE * 2)
    );
  });
});
