// src/components/meta/GalleryMeta.tsx
import { NextSeo } from 'next-seo';
import { FC } from 'react';

import { generateUrl } from '@/utils/generateURL';

type GalleryMetaProps = {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl: string;
  category?: string;
};

export const GalleryMeta: FC<GalleryMetaProps> = ({
  title,
  description,
  ogImage = '/HaruhateTitleLogo.png',
  ogUrl,
  category,
}) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={generateUrl(ogUrl)}
      openGraph={{
        url: generateUrl(ogUrl),
        title,
        description,
        images: [
          {
            url: generateUrl(ogImage),
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      additionalMetaTags={
        category ? [{ name: 'category', content: category }] : undefined
      }
    />
  );
};
