import { render } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { DefaultMeta } from '../DefaultMeta';

// Mock generateUrl to return the original URL
vi.mock('@/utils/generateURL', () => ({
  generateUrl: (url: string) => url,
}));

// モック関数で呼び出し情報を追跡
const defaultSeoMock = vi.fn();

// モック化（DefaultSeo をダミーReactコンポーネントにして追跡）
vi.mock('next-seo', () => ({
  DefaultSeo: (props: import('next-seo').DefaultSeoProps) => {
    defaultSeoMock(props);
    return null; // 描画しない
  },
}));

describe('DefaultMeta', () => {
  beforeEach(() => {
    defaultSeoMock.mockClear();
  });

  test('calls DefaultSeo with correct default props', () => {
    render(<DefaultMeta />);

    expect(defaultSeoMock).toHaveBeenCalledWith({
      title: 'Alkyne',
      description: 'Always You are the best.',
      canonical: '',
      openGraph: {
        title: 'Alkyne',
        description: 'Always You are the best.',
        type: 'website',
        url: '',
        images: [
          {
            url: 'AlkyneLogo.png',
          },
        ],
        site_name: 'Alkyne',
        locale: 'ja_JP',
      },
      additionalMetaTags: [
        {
          name: 'charset',
          content: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1',
        },
      ],
      additionalLinkTags: [
        {
          rel: 'icon',
          href: '/AlkyneCircleLogo.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/AlkyneCircleLogo.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/AlkyneCircleLogo.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/AlkyneCircleLogo.png',
        },
      ],
    });
  });
});
