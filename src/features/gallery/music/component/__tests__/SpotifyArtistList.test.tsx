import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import { SpotifyArtistList } from '../SpotifyArtistList';

const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

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

describe('SpotifyArtistList.tsxのテスト', () => {
  it('キーワードが空のときは何も表示されない', () => {
    renderWithChakra(<SpotifyArtistList keyword="" />);
    expect(screen.queryByText(/検索結果/)).not.toBeInTheDocument();
  });

  it('検索結果の見出しが表示され、画像も表示される', async () => {
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
                imageUrl: 'https://example.com/image.jpg',
              },
            ]),
        })
      )
    );

    renderWithChakra(<SpotifyArtistList keyword="test" />);

    await waitFor(() => {
      // 見出しが表示される
      expect(screen.getByText('"test"の検索結果')).toBeInTheDocument();

      // 画像が表示される
      const image = screen.getByRole('img', { name: /Fake Song/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveAttribute('alt', 'Fake Song');
    });
  });

  it('該当するアーティストが見つからないときの表示', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      )
    );

    renderWithChakra(<SpotifyArtistList keyword="noresult" />);

    await waitFor(() =>
      expect(
        screen.getByText('該当するアーティストが見つかりませんでした。')
      ).toBeInTheDocument()
    );
  });
});
