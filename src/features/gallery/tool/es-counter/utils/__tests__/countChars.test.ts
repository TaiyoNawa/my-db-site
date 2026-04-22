// src/features/gallery/tool/es-counter/utils/__tests__/countChars.test.ts
import { describe, expect, it } from 'vitest';

import { countChars, splitIntoSegments } from '../countChars';
import { DEFAULT_SETTINGS } from '../presets';

describe('countChars', () => {
  it('通常の文字列をカウントできる', () => {
    expect(countChars('abc', DEFAULT_SETTINGS)).toBe(3);
    expect(countChars('あいう', DEFAULT_SETTINGS)).toBe(3);
  });

  it('改行を1文字としてカウントする（デフォルト）', () => {
    expect(countChars('a\nb', DEFAULT_SETTINGS)).toBe(3);
  });

  it('改行を0文字としてカウントする', () => {
    const settings = { ...DEFAULT_SETTINGS, newlineMode: '0' as const };
    expect(countChars('a\nb', settings)).toBe(2);
  });

  it('改行を2文字としてカウントする', () => {
    const settings = { ...DEFAULT_SETTINGS, newlineMode: '2' as const };
    expect(countChars('a\nb', settings)).toBe(4);
  });

  it('半角スペースをカウントする（countSpaces: true）', () => {
    expect(countChars('a b', DEFAULT_SETTINGS)).toBe(3);
  });

  it('半角スペースをカウントしない（countSpaces: false）', () => {
    const settings = { ...DEFAULT_SETTINGS, countSpaces: false };
    expect(countChars('a b', settings)).toBe(2);
  });

  it('全角スペースをカウントする', () => {
    expect(countChars('a\u3000b', DEFAULT_SETTINGS)).toBe(3);
  });

  it('全角スペースをカウントしない（countSpaces: false）', () => {
    const settings = { ...DEFAULT_SETTINGS, countSpaces: false };
    expect(countChars('a\u3000b', settings)).toBe(2);
  });

  it('空文字は0を返す', () => {
    expect(countChars('', DEFAULT_SETTINGS)).toBe(0);
  });

  it('\\r\\n の \\r はカウントしない', () => {
    const settings = { ...DEFAULT_SETTINGS, newlineMode: '1' as const };
    expect(countChars('a\r\nb', settings)).toBe(3);
  });
});

describe('splitIntoSegments', () => {
  it('空テキストはセグメントなし', () => {
    const segments = splitIntoSegments('', DEFAULT_SETTINGS);
    expect(segments).toHaveLength(0);
  });

  it('counterUnit=null のとき1セグメントで返す', () => {
    const settings = { ...DEFAULT_SETTINGS, counterUnit: null };
    const segments = splitIntoSegments('abc', settings);
    expect(segments).toHaveLength(1);
    expect(segments[0].text).toBe('abc');
    expect(segments[0].endCount).toBe(3);
  });

  it('counterUnit=3 のとき3文字ごとに分割される', () => {
    const settings = { ...DEFAULT_SETTINGS, counterUnit: 3 };
    const segments = splitIntoSegments('abcdef', settings);
    expect(segments).toHaveLength(2);
    expect(segments[0].text).toBe('abc');
    expect(segments[0].endCount).toBe(3);
    expect(segments[1].text).toBe('def');
    expect(segments[1].endCount).toBe(6);
  });

  it('割り切れない場合、余りが最後のセグメントになる', () => {
    const settings = { ...DEFAULT_SETTINGS, counterUnit: 3 };
    const segments = splitIntoSegments('abcde', settings);
    expect(segments).toHaveLength(2);
    expect(segments[1].text).toBe('de');
    expect(segments[1].endCount).toBe(5);
  });

  it('改行0文字設定時、改行はカウントに含まれない', () => {
    const settings = { ...DEFAULT_SETTINGS, counterUnit: 3, newlineMode: '0' as const };
    // 'a\nb' は改行0文字なので 2文字。counterUnit=3 に達しないので1セグメント
    const segments = splitIntoSegments('a\nb', settings);
    expect(segments).toHaveLength(1);
    expect(segments[0].endCount).toBe(2);
  });

  it('デフォルト設定（counterUnit=100）で100文字ごとに分割される', () => {
    const text = 'a'.repeat(101);
    const segments = splitIntoSegments(text, DEFAULT_SETTINGS);
    expect(segments).toHaveLength(2);
    expect(segments[0].endCount).toBe(100);
    expect(segments[1].endCount).toBe(101);
  });
});
