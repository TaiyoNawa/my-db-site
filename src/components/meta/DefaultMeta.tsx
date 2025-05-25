import { DefaultSeo } from 'next-seo';
import { FC } from 'react';

import { generateUrl } from '@/utils/generateURL';

const SITE_NAME = 'Haruhate';

export const DefaultMeta: FC = () => {
  const defaultTitle = `${SITE_NAME}`;

  const description: string = `Always You are the best.`;

  return (
    <DefaultSeo
      title={defaultTitle}
      description={description}
      canonical={generateUrl('')}
      openGraph={{
        title: defaultTitle,
        description: description,
        type: 'website',
        url: generateUrl(''),
        images: [
          {
            url: generateUrl('/logo/HaruhateTitleLogo.png'),
          },
        ],
        site_name: SITE_NAME,
        locale: 'ja_JP',
      }}
      additionalMetaTags={[
        {
          name: 'charset',
          content: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1',
        },
      ]}
      additionalLinkTags={[
        {
          rel: 'icon',
          href: generateUrl('/logo/HaruhateLogo.png'),
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: generateUrl('/logo/HaruhateLogo.png'),
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: generateUrl('/logo/HaruhateLogo.png'),
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: generateUrl('/logo/HaruhateLogo.png'),
        },
      ]}
    />
  );
};
