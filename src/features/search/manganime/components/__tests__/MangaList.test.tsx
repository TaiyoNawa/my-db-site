import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import { MangaList } from '../MangaList';

//beforeAll と afterEach は、主に以下の2つの目的で使用されています：
// beforeAll:window.matchMedia をモックして、レスポンシブのメディアクエリをテスト環境でも正しく動作させるためです。これにより、テスト中に matchMedia を利用するコードが問題なく動作します。特に、Chakra UI やレスポンシブデザインを使用する場合、このモックが役立ちます。
// afterEach:vi.resetAllMocks() を使って、各テスト後にモックをリセットし、次のテストに影響が出ないようにします。テスト間で状態が影響し合わないようにするため、良い習慣です。
// 必要か否かの判断
// window.matchMediaのモック: レスポンシブなUIコンポーネント（Chakra UIのFlexやGridなど）をテストする場合、このモックが必要です。もしレスポンシブデザインに関係ないテストであれば、このモックは不要です。
// vi.resetAllMocks(): モックをリセットすることは、テスト間の干渉を防ぐために重要です。もしモックを使わないテストが多ければ、省略しても構いませんが、基本的にはリセットしておくと安心です。
beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});
afterEach(() => {
  vi.resetAllMocks();
});
// Chakra UI の context を適用
const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

describe('MangaList.tsxのテスト', () => {
  it('キーワードが空のときは何も表示されない', () => {
    renderWithChakra(<MangaList keyword="" />);
    expect(screen.queryByText(/検索結果/)).not.toBeInTheDocument();
  });

  it('検索結果の見出しが表示される', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: '1',
                title: 'Test Manga',
                imageUrl: 'https://example.com/image.jpg',
                author: 'Test Author',
                releaseDate: '1997-07-22',
                url: 'https://example.com',
              },
            ]),
        })
      )
    );

    renderWithChakra(<MangaList keyword="test" />);

    await waitFor(() =>
      expect(screen.getByText('"test"の検索結果')).toBeInTheDocument()
    );
  });

  it('該当するマンガが見つからないときの表示', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      )
    );

    renderWithChakra(<MangaList keyword="noresult" />);

    await waitFor(() =>
      expect(
        screen.getByText('該当するマンガが見つかりませんでした。')
      ).toBeInTheDocument()
    );
  });

  it('さらに読み込むボタンが表示される', async () => {
    // `handleLoadMore` をモック
    const mockHandleLoadMore = vi.fn();
    // fetchモック
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve(
              Array.from({ length: 12 }, (_, index) => ({
                id: `${index + 1}`,
                title: `Test Manga ${index + 1}`,
                imageUrl: 'https://example.com/image.jpg',
                author: 'Test Author',
                releaseDate: '1997-07-22',
                url: 'https://example.com',
              }))
            ),
        })
      )
    );

    renderWithChakra(<MangaList keyword="test" onReset={mockHandleLoadMore} />);
    await waitFor(() =>
      expect(screen.getByText('"test"の検索結果')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText('さらに読み込む')).toBeInTheDocument()
    );
    // handleLoadMoreのモック関数を「さらに読み込む」ボタンに設定
    const loadMoreButton = screen.getByText('さらに読み込む');
    loadMoreButton.onclick = mockHandleLoadMore;
    fireEvent.click(loadMoreButton);
    //handleLoadMore(「さらに読み込む」ボタン)が1回呼ばれることを確認
    expect(mockHandleLoadMore).toHaveBeenCalledTimes(1);
  });

  it('リセットボタンが表示され、クリック時にリセットされる', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: '1',
                title: 'Test Manga',
                imageUrl: 'https://example.com/image.jpg',
                author: 'Test Author',
                releaseDate: '1997-07-22',
                url: 'https://example.com',
              },
            ]),
        })
      )
    );
    renderWithChakra(<MangaList keyword="test" />);
    await waitFor(() =>
      expect(screen.getByText('"test"の検索結果')).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText('Reset'));
    await waitFor(() =>
      expect(screen.queryByText('"test"の検索結果')).not.toBeInTheDocument()
    );
  });
});
