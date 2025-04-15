import { Noto_Sans_JP } from 'next/font/google';
export const COMPANY_URL = 'https://www.futurewoods.co.jp';

export const TERMS_OF_SERVICE_URL =
  'https://radar.futurewoods.co.jp/terms-of-service';

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'], //必要な太さを指定
  display: 'swap',
});

export const SECTION_WRAPPER_PADDING = { base: '32px', md: '40px', lg: '52px' };
