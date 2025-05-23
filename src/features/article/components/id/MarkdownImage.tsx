// src/features/article/components/id/MarkdownImage.tsx
//Markdownの画像のカスタムコンポーネント。画像の期限切れを判定して期限切れの場合は再フェッチする。
import { Image } from '@chakra-ui/react';
import { FC } from 'react';

import { usePageId } from '@/features/article/contexts/PageIdContext';
import { useMarkdownImage } from '@/features/article/hooks/useMarkdownImage';

type Props = {
  src?: string;
  alt?: string;
};

const fallbackSrc = '/fallback_image.png';

export const MarkdownImage: FC<Props> = ({ src, alt }) => {
  //TODO: fallbackSrcをうまく表示できるようにする。(本番環境ではできているのかもしれないので、検証する)
  const pageId = usePageId();
  const safeSrc = src ?? fallbackSrc;
  const finalSrc = useMarkdownImage(safeSrc, pageId);

  return (
    <Image
      src={finalSrc}
      alt={alt ?? ''}
      maxH="500px"
      mx="auto"
      borderRadius="md"
      objectFit="contain"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        // すでにフォールバック画像なら何もしない
        if (!target.src.endsWith(fallbackSrc)) {
          target.src = fallbackSrc;
        }
      }}
    />
  );
};
