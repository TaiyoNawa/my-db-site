import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import { ImageList } from '../ImageList';

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

const renderWithChakra = (ui: React.ReactElement) =>
  render(<ChakraProvider>{ui}</ChakraProvider>);

describe('ImageList.tsx (Unsplash画像検索)', () => {
  it('キーワードが空のときは初期文言が表示される', () => {
    renderWithChakra(<ImageList keyword="" onReset={vi.fn()} />);
    expect(
      screen.getByText(/キーワードを入力して画像を検索しましょう/)
    ).toBeInTheDocument();
  });

  it('検索結果の見出しが表示される', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [
                {
                  id: '1',
                  urls: { small: 'https://example.com/image.jpg' },
                  alt_description: 'Test Image',
                  user: {
                    name: 'John Doe',
                    links: { html: 'https://unsplash.com/@johndoe' },
                  },
                  links: {
                    html: 'https://unsplash.com/photos/abc123',
                    download_location:
                      'https://api.unsplash.com/photos/abc123/download',
                  },
                },
              ],
            }),
        })
      )
    );

    renderWithChakra(<ImageList keyword="mountain" onReset={vi.fn()} />);

    await waitFor(() =>
      expect(screen.getByText(/"mountain" の画像検索結果/)).toBeInTheDocument()
    );
  });

  it('画像が見つからないときの表示', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [],
            }),
        })
      )
    );

    renderWithChakra(<ImageList keyword="noresult" onReset={vi.fn()} />);

    await waitFor(() =>
      expect(
        screen.getByText('画像が見つかりませんでした。')
      ).toBeInTheDocument()
    );
  });

  it('リセットボタンが機能する', async () => {
    const mockReset = vi.fn();

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [
                {
                  id: '1',
                  urls: { small: 'https://example.com/image.jpg' },
                  alt_description: 'Test Image',
                  user: {
                    name: 'John Doe',
                    links: { html: 'https://unsplash.com/@johndoe' },
                  },
                  links: {
                    html: 'https://unsplash.com/photos/abc123',
                    download_location:
                      'https://api.unsplash.com/photos/abc123/download',
                  },
                },
              ],
            }),
        })
      )
    );

    renderWithChakra(<ImageList keyword="mountain" onReset={mockReset} />);

    await waitFor(() =>
      expect(screen.getByText(/"mountain" の画像検索結果/)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(
        screen.getByText(/キーワードを入力して画像を検索しましょう/)
      ).toBeInTheDocument();
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });
});
