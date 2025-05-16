// src/utils/getExpirationFromUrl.ts
export const getExpirationFromUrl = (url: string): Date | null => {
  try {
    const parsed = new URL(url);
    const expires = parsed.searchParams.get('X-Amz-Expires');
    const date = parsed.searchParams.get('X-Amz-Date');

    if (!expires || !date) return null;

    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const hour = date.slice(9, 11);
    const minute = date.slice(11, 13);
    const second = date.slice(13, 15);

    const issuedAt = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
    );
    const expiresMs = parseInt(expires, 10) * 1000;

    return new Date(issuedAt.getTime() + expiresMs);
  } catch {
    return null;
  }
};
