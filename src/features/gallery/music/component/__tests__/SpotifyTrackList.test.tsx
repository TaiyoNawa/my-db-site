import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import { SpotifyTrackList } from '../SpotifyTrackList';

// Chakra UI の context を適用
const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

beforeAll(() => {
  // window.matchMedia のモック
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

describe('SpotifyTrackList.tsxのテスト', () => {
  it('キーワードが空のときは何も表示されない', () => {
    renderWithChakra(<SpotifyTrackList keyword="" />);
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
                id: '123',
                name: 'Fake Song',
                url: 'https://open.spotify.com/track/123',
              },
            ]),
        })
      )
    );

    renderWithChakra(<SpotifyTrackList keyword="test" />);

    await waitFor(() =>
      expect(screen.getByText('"test"の検索結果')).toBeInTheDocument()
    );
  });

  it('該当する曲が見つからないときの表示', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      )
    );

    renderWithChakra(<SpotifyTrackList keyword="noresult" />);

    await waitFor(() =>
      expect(
        screen.getByText('該当する曲が見つかりませんでした。')
      ).toBeInTheDocument()
    );
  });
});
