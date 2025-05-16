// src/features/article/hooks/usePresignedImage.ts
import useSWR from 'swr';

import { getExpirationFromUrl } from '@/utils/getExpirationFromUrl';

interface RefreshThumbnailResponse {
  newUrl: string;
}

// 引数を [oldUrl, title] に変更
const fetcher = async ([oldUrl, title]: [string, string]): Promise<string> => {
  const res = await fetch(
    `/api/notion/refresh-thumbnail?url=${encodeURIComponent(
      oldUrl
    )}&title=${encodeURIComponent(title)}`
  );
  if (!res.ok) throw new Error('Failed to fetch new image URL');
  const data = (await res.json()) as RefreshThumbnailResponse;
  return data.newUrl;
};

export const usePresignedImage = (oldUrl: string, title: string) => {
  const expiresAt = getExpirationFromUrl(oldUrl);
  const isExpired = expiresAt ? new Date() > expiresAt : false;

  const { data: updatedUrl } = useSWR(
    isExpired ? [oldUrl, title] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return updatedUrl || oldUrl;
};
