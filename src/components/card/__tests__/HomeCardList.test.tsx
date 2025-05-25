import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { HomeCardList } from '../HomeCardList';

const testProps1 = [
  //レイアウト的に、各アイテムでカテゴリーの有無は統一した方が良い
  {
    eyeCatch:
      'https://cdn.pixabay.com/animation/2024/06/09/21/04/21-04-06-843_512.gif',
    title: 'ミュージック(Music)',
    description: 'Spotifyの音楽を検索・試聴できます',
    url: '/search/music',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'マンガ・アニメ(Manga/Anime)',
    description: 'AniListのマンガ・アニメを検索できます',
    url: '/search/manganime',
  },
  {
    eyeCatch:
      'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '画像(Image)',
    description: 'Unsplashの画像を検索できます',
    url: '/search/image',
  },
];

describe('HomeCardList.tsxのテスト', () => {
  it('各カードが表示される', () => {
    render(<HomeCardList items={testProps1} />);
    expect(screen.getByText(testProps1[0].title)).toBeInTheDocument();
    expect(screen.getByText(testProps1[1].title)).toBeInTheDocument();
    expect(screen.getByText(testProps1[2].title)).toBeInTheDocument();
  });

  it('リンクが適切である', () => {
    render(<HomeCardList items={testProps1} />);
    expect(screen.getByText(testProps1[0].title).closest('a')).toHaveAttribute(
      'href',
      testProps1[0].url
    );
    expect(screen.getByText(testProps1[1].title).closest('a')).toHaveAttribute(
      'href',
      testProps1[1].url
    );
  });

  it('全アイテムが表示されている', () => {
    render(<HomeCardList items={testProps1} />);
    //3件のカードがあるので、3件表示されていることを確認
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});
