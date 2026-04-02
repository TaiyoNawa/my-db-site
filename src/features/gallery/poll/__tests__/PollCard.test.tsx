import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { PollCard } from '../PollCard';

const testProps1 = {
  eyeCatch: '/article.webp',
  title: 'あなたの好きな色は？',
  description: '好きな色についてのアンケートです。',
  url: '/gallery/tool/poll/test-poll-1',
  numberOfQuestions: 3,
  deadline: '2025-08-20T12:00:00Z',
  isVotingOpen: true,
};

const testProps2 = {
  eyeCatch: '/article.webp',
  title:
    'あなたの好きな色は？あなたの好きな色は？あなたの好きな色は？あなたの好きな色は？あなたの好きな色は？あなたの好きな色は？',
  description:
    '好きな色についてのアンケートです。このアンケートは色の好みを調査するために作成されました。回答は匿名で行われ、統計的な分析に使用されます。',
  url: '/gallery/tool/poll/test-poll-2',
  numberOfQuestions: 5,
  deadline: null,
  isVotingOpen: false,
};

describe('PollCard.tsxのテスト', () => {
  it('画像が適切に表示される', () => {
    render(<PollCard {...testProps1} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    // Next.js <Image>のsrc属性に画像パスが含まれていることを確認
    expect(image.getAttribute('src')).toContain(
      encodeURIComponent(testProps1.eyeCatch)
    );
    expect(image).toHaveAttribute('alt', testProps1.title);
  });

  it('title, description, 質問数, 締切が表示される', () => {
    render(<PollCard {...testProps1} />);
    expect(screen.getByText(testProps1.title)).toBeInTheDocument();
    expect(screen.getByText(testProps1.description)).toBeInTheDocument();
    expect(screen.getByText('質問数： 3')).toBeInTheDocument();
    expect(screen.getByText(/締切： .+/)).toBeInTheDocument();
  });

  it('投票受付中のタグが表示される', () => {
    render(<PollCard {...testProps1} />);
    expect(screen.getByText('投票受付中')).toBeInTheDocument();
  });

  it('投票終了のタグが表示される', () => {
    render(<PollCard {...testProps2} />);
    expect(screen.getByText('投票終了')).toBeInTheDocument();
  });

  it('締切がnullの場合「なし」と表示される', () => {
    render(<PollCard {...testProps2} />);
    expect(screen.getByText('締切： なし')).toBeInTheDocument();
  });

  it('リンクが適切である', () => {
    render(<PollCard {...testProps1} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', testProps1.url);
  });

  it('titleが40文字以内で表示される', () => {
    render(<PollCard {...testProps2} />);
    const title = screen.getByText(testProps2.title.slice(0, 40) + '...');
    expect(title).toBeInTheDocument();
    expect(title.textContent?.length).toBeLessThanOrEqual(43);
  });

  it('descriptionが40文字以内で表示される', () => {
    render(<PollCard {...testProps2} />);
    const description = screen.getByText(
      testProps2.description.slice(0, 40) + '...'
    );
    expect(description).toBeInTheDocument();
    expect(description.textContent?.length).toBeLessThanOrEqual(43);
  });
});
