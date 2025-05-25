// __tests__/LinkCard.test.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';

import { LinkCard } from '@/components/card/LinkCard';

// axiosをモックする
vi.mock('axios');
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

describe('LinkCard.tsxのテスト', () => {
  const testProps = {
    title: 'テストタイトル',
    description: 'これは説明文です。',
    url: 'https',
  };

  it('タイトルと説明文とURLが表示される', async () => {
    mockedAxios.get = vi
      .fn()
      .mockResolvedValue({ data: { ogImage: undefined } });

    render(
      <ChakraProvider>
        <LinkCard {...testProps} />
      </ChakraProvider>
    );

    // タイトルと説明文
    expect(await screen.findByText(testProps.title)).toBeInTheDocument();
    expect(screen.getByText(testProps.description)).toBeInTheDocument();

    // URLが70文字以内で切られて表示されるので、普通にURL文字列を探してOK
    expect(screen.getByText(testProps.url)).toBeInTheDocument();
  });

  it('OG画像が取得できた場合、画像が表示される', async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: { ogImage: 'https/og-image.png' },
    });

    render(
      <ChakraProvider>
        <LinkCard {...testProps} />
      </ChakraProvider>
    );
    const image = await screen.findByRole('img');
    expect(image).toHaveAttribute('src', 'https/og-image.png');
  });

  it('OG画像が取得できない場合、fallback画像が表示される', async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error('fetch error'));
    render(
      <ChakraProvider>
        <LinkCard {...testProps} />
      </ChakraProvider>
    );
    const image = await screen.findByRole('img');
    expect(image).toHaveAttribute('src', '/alt/alt_image.png');
  });
});
