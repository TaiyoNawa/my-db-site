// features/article/components/ArticleMeta.tsx
import { NextSeo } from 'next-seo';
import { FC } from 'react';

type Props = {
  title: string;
  description: string;
  ogImage: string;
  ogUrl: string;
  category?: string;
};

export const ArticleMeta: FC<Props> = ({
  title,
  description,
  ogImage,
  ogUrl,
  category,
}) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={ogUrl}
      openGraph={{
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
      }}
      additionalMetaTags={
        category ? [{ name: 'category', content: category }] : undefined
      }
    />
  );
};
