// src/features/article/contexts/PageIdContext.tsx
// Notionの各ページのIDを取得するためのContext。
import { createContext, useContext } from 'react';

export const PageIdContext = createContext<string | null>(null);

export const usePageId = () => {
  const context = useContext(PageIdContext);
  if (!context) throw new Error('PageIdContext is not provided');
  return context;
};
