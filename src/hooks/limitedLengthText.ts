import { useMemo } from "react";

// 文字数に制限をかけて表示するカスタムフック
export const useLimitedLengthText = (
  children: string,
  limitedLength: number
) => {
  const summarize = useMemo(() => {
    const length = children.length;
    if (length <= limitedLength) {
      return children;
    } else {
      return children.slice(0, limitedLength) + "...";
    }
  }, [limitedLength, children]);
  return summarize;
};
