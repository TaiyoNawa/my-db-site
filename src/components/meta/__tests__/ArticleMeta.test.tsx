// src/components/meta/ArticleMeta.tsx
import { render } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { ArticleMeta } from '@/components/meta/ArticleMeta';

// Mock generateUrl to return the original URL
vi.mock('@/utils/generateURL', () => ({
  generateUrl: (url: string) => url,
}));

// モック関数で呼び出し情報を追跡
const nextSeoMock = vi.fn();

// モック化（NextSeo をダミーReactコンポーネントにして追跡）
vi.mock('next-seo', () => ({
  NextSeo: (props: import('next-seo').NextSeoProps) => {
    nextSeoMock(props);
    return null; // 描画しない
  },
}));

describe('ArticleMeta', () => {
  beforeEach(() => {
    nextSeoMock.mockClear();
  });

  test('calls NextSeo with correct props', () => {
    const title = 'Test Article Title';
    const description = 'Test Description';
    const ogImage = '/test-og-image.png';
    const ogUrl = 'https://example.com/test-article';
    const category = 'Test Category';

    render(
      <ArticleMeta
        title={title}
        description={description}
        ogImage={ogImage}
        ogUrl={ogUrl}
        category={category}
      />
    );

    expect(nextSeoMock).toHaveBeenCalledWith({
      title,
      description,
      canonical: ogUrl, // generateUrlはページコンポーネントで使用されるため、ここでは元のogUrlを期待
      openGraph: {
        url: ogUrl, // generateUrlはページコンポーネントで使用されるため、ここでは元のogUrlを期待
        title,
        description,
        images: [
          {
            url: ogImage, // generateUrlはページコンポーネントで使用されるため、ここでは元のogImageを期待
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      additionalMetaTags: [{ name: 'category', content: category }],
    });
  });

  test('calls NextSeo without category if not provided', () => {
    const title = 'Test Article Title';
    const description = 'Test Description';
    const ogImage = '/test-og-image.png';
    const ogUrl = 'https://example.com/test-article';

    render(
      <ArticleMeta
        title={title}
        description={description}
        ogImage={ogImage}
        ogUrl={ogUrl}
      />
    );

    expect(nextSeoMock).toHaveBeenCalledWith({
      title,
      description,
      canonical: ogUrl, // generateUrlはページコンポーネントで使用されるため、ここでは元のogUrlを期待
      openGraph: {
        url: ogUrl, // generateUrlはページコンponentで使用されるため、ここでは元のogUrlを期待
        title,
        description,
        images: [
          {
            url: ogImage, // generateUrlはページコンポーネントで使用されるため、ここでは元のogImageを期待
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      additionalMetaTags: undefined,
    });
  });
});
