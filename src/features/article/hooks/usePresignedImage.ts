// src/features/article/hooks/usePresignedImage.ts
import useSWR from 'swr';

import { getExpirationFromUrl } from '@/utils/getExpirationFromUrl';

interface RefreshThumbnailResponse {
  newUrl: string;
}

const fetcher = async (oldUrl: string): Promise<string> => {
  const res = await fetch(
    `/api/refresh-thumbnail?url=${encodeURIComponent(oldUrl)}`
  );
  if (!res.ok) throw new Error('Failed to fetch new image URL');
  const data = (await res.json()) as unknown as RefreshThumbnailResponse;
  return data.newUrl;
};

export const usePresignedImage = (initialUrl: string) => {
  const expiresAt = getExpirationFromUrl(initialUrl);
  const isExpired = expiresAt ? new Date() > expiresAt : false;

  const { data: updatedUrl } = useSWR(isExpired ? initialUrl : null, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return updatedUrl || initialUrl;
};
