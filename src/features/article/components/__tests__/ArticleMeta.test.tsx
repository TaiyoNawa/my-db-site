import { render } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { ArticleMeta } from '../ArticleMeta';

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
      canonical: ogUrl,
      openGraph: {
        url: ogUrl,
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        site_name: 'Your Site Name',
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
      canonical: ogUrl,
      openGraph: {
        url: ogUrl,
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        site_name: 'Your Site Name',
      },
      additionalMetaTags: undefined,
    });
  });
});
