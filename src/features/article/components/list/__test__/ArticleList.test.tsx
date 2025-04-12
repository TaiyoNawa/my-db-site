import { describe, it, expect } from 'vitest';

import { articleSample } from '@/features/article/hooks/ArticleSample';
import { render, screen } from '@/test/test-utils';

import { ArticleList } from '../ArticleList';

describe('ArticleList.tsxのテスト', () => {
  it('articlesが表示される', () => {
    render(<ArticleList articles={articleSample} />);
    expect(screen.getByText('Article A')).toBeInTheDocument();
    expect(screen.getByText('Article T')).toBeInTheDocument();
  });

  it('リンクが適切である', () => {
    render(<ArticleList articles={articleSample} />);
    expect(screen.getByText('Article A').closest('a')).toHaveAttribute(
      'href',
      '/article/a'
    );
    expect(screen.getByText('Article T').closest('a')).toHaveAttribute(
      'href',
      '/article/t'
    );
  });

  it('全アイテムが表示されている', () => {
    render(<ArticleList articles={articleSample} />);
    //26件の記事があるので、26件表示されていることを確認
    expect(screen.getAllByText(/This is Article/)).toHaveLength(26);
  });
});
