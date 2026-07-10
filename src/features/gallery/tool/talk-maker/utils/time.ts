// src/features/gallery/tool/talk-maker/utils/time.ts

/** 現在時刻を "HH:MM" 形式で返す */
export function getCurrentTime(now: Date = new Date()): string {
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * ユーザー入力の時刻文字列を "HH:MM" に正規化する。
 * "9:5" → "09:05" のような省略形も受け付け、不正な値は null を返す。
 */
export function normalizeTime(input: string): string | null {
  const match = /^\s*(\d{1,2})[:：](\d{1,2})\s*$/.exec(input);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
