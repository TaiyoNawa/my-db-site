// src/features/gallery/tool/talk-maker/utils/__tests__/time.test.ts
import { describe, expect, it } from 'vitest';

import { getCurrentTime, normalizeTime } from '../time';

describe('getCurrentTime', () => {
  it('"HH:MM" 形式で返す', () => {
    expect(getCurrentTime(new Date(2026, 6, 9, 9, 5))).toBe('09:05');
    expect(getCurrentTime(new Date(2026, 6, 9, 23, 59))).toBe('23:59');
    expect(getCurrentTime(new Date(2026, 6, 9, 0, 0))).toBe('00:00');
  });
});

describe('normalizeTime', () => {
  it('正しい時刻をそのまま正規化する', () => {
    expect(normalizeTime('12:34')).toBe('12:34');
    expect(normalizeTime('00:00')).toBe('00:00');
    expect(normalizeTime('23:59')).toBe('23:59');
  });

  it('省略形をゼロ埋めする', () => {
    expect(normalizeTime('9:5')).toBe('09:05');
    expect(normalizeTime('1:30')).toBe('01:30');
  });

  it('前後の空白と全角コロンを許容する', () => {
    expect(normalizeTime(' 12:34 ')).toBe('12:34');
    expect(normalizeTime('12：34')).toBe('12:34');
  });

  it('不正な値は null を返す', () => {
    expect(normalizeTime('24:00')).toBeNull();
    expect(normalizeTime('12:60')).toBeNull();
    expect(normalizeTime('abc')).toBeNull();
    expect(normalizeTime('')).toBeNull();
    expect(normalizeTime('123:45')).toBeNull();
  });
});
