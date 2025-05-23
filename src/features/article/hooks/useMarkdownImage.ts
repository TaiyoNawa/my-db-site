// src/features/article/hooks/useMarkdownImage.ts
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { extractImageKey } from '@/utils/extractImageKey';
import { getExpirationFromUrl } from '@/utils/getExpirationFromUrl';

// fetch-markdown.tsにpageIdを渡して、そのページのmarkdownを取得させてレスポンスとして受け取る。
const fetchMarkdown = async (pageId: string): Promise<string> => {
  const res = await fetch(`/api/notion/fetch-markdown?pageId=${pageId}`);
  if (!res.ok) throw new Error('Failed to fetch markdown');
  const data = (await res.json()) as { markdown: string };
  return data.markdown;
};

// 画像のURLから有効期限切れかを判定し、期限切れの場合は再fetchする。
export const useMarkdownImage = (oldUrl: string, pageId: string) => {
  const [newUrl, setNewUrl] = useState<string>(oldUrl);
  const expiresAt = getExpirationFromUrl(oldUrl);
  const isExpired = expiresAt ? new Date() > expiresAt : false; //期限切れ判定
  const key = extractImageKey(oldUrl); //画像のURLからキー(画像を一意に特定するための文字列)を抽出

  // 期限切れの場合は上で定義したfetchMarkdownを呼び出して、再度markdownを受け取らせる。
  const { data: markdown } = useSWR(
    isExpired ? pageId : null,
    () => fetchMarkdown(pageId),
    { revalidateOnFocus: false }
  );

  // 受け取ったmarkdownから、目的の画像のURLをキーを使って抽出し、それをnewURLとしてリターンする。
  useEffect(() => {
    if (!markdown || !key) return;
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `!\\[.*?\\]\\((https[^)]+${escapedKey}[^)"]*)\\)`,
      'g'
    );
    const match = regex.exec(markdown);
    if (match) {
      const updatedUrl = match[1];
      setNewUrl(updatedUrl);
    }
  }, [markdown, key]);

  return newUrl;
};
