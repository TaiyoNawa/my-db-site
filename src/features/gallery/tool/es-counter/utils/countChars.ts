// src/features/gallery/tool/es-counter/utils/countChars.ts
import { CountSettings } from '../types';

/** 1文字のカウント値を返す */
function getCharCount(char: string, settings: CountSettings): number {
  if (char === '\r') return 0; // \r\n の \r は \n 側でカウント
  if (char === '\n') return parseInt(settings.newlineMode, 10);
  if (char === ' ' || char === '\u3000') return settings.countSpaces ? 1 : 0; // 半角・全角スペース
  return 1;
}

/** テキスト全体の文字数をカウントする */
export function countChars(text: string, settings: CountSettings): number {
  let count = 0;
  for (const char of text) {
    count += getCharCount(char, settings);
  }
  return count;
}

export interface TextSegment {
  /** セグメント内のテキスト */
  text: string;
  /** このセグメントが終わった時点での累積文字数 */
  endCount: number;
}

/**
 * テキストを counterUnit 文字ごとのセグメントに分割する（プレビュー表示用）
 * counterUnit が null の場合はテキスト全体を1セグメントとして返す
 */
export function splitIntoSegments(
  text: string,
  settings: CountSettings
): TextSegment[] {
  if (!text) return [];

  const { counterUnit } = settings;

  // counterUnit が null の場合は分割しない（色分けのみ、ラベルなし）
  if (counterUnit === null) {
    return [{ text, endCount: countChars(text, settings) }];
  }

  const segments: TextSegment[] = [];
  let currentText = '';
  let currentSegmentCount = 0;
  let totalCount = 0;

  for (const char of text) {
    const charCount = getCharCount(char, settings);
    currentText += char;
    currentSegmentCount += charCount;
    totalCount += charCount;

    if (currentSegmentCount >= counterUnit) {
      segments.push({ text: currentText, endCount: totalCount });
      currentText = '';
      currentSegmentCount = 0;
    }
  }

  if (currentText) {
    segments.push({ text: currentText, endCount: totalCount });
  }

  return segments;
}
