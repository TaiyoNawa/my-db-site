// src/features/gallery/tool/talk-maker/utils/__tests__/presets.test.ts
import { describe, expect, it } from 'vitest';

import { CallStatus } from '../../types';
import {
  CALL_STATUS_LABELS,
  getFont,
  getIconFontSize,
  getTheme,
} from '../presets';

describe('CALL_STATUS_LABELS', () => {
  it('completed 以外の全ステータスにラベルを持つ', () => {
    const nonCompleted: Exclude<CallStatus, 'completed'>[] = [
      'missed',
      'canceled',
      'noAnswer',
    ];
    nonCompleted.forEach((status) => {
      expect(CALL_STATUS_LABELS[status]).toBeTruthy();
    });
  });

  it('想定した日本語ラベルを返す', () => {
    expect(CALL_STATUS_LABELS.missed).toBe('不在着信');
    expect(CALL_STATUS_LABELS.canceled).toBe('キャンセル');
    expect(CALL_STATUS_LABELS.noAnswer).toBe('応答なし');
  });
});

describe('getTheme', () => {
  it('存在するIDのテーマを返す', () => {
    expect(getTheme('dark').id).toBe('dark');
  });

  it('不正なIDは先頭テーマにフォールバックする', () => {
    // @ts-expect-error 不正な値を渡すケースを検証する
    expect(getTheme('unknown').id).toBe('blue');
  });
});

describe('getFont', () => {
  it('存在するIDのフォントを返す', () => {
    expect(getFont('mono').id).toBe('mono');
  });

  it('不正なIDは先頭フォントにフォールバックする', () => {
    // @ts-expect-error 不正な値を渡すケースを検証する
    expect(getFont('unknown').id).toBe('gothic');
  });
});

describe('getIconFontSize', () => {
  it('絵文字1個（サロゲートペア含む）は基準サイズのまま', () => {
    expect(getIconFontSize('🐱', 20)).toBe('20px');
    expect(getIconFontSize('あ', 20)).toBe('20px');
    expect(getIconFontSize('', 20)).toBe('20px');
  });

  it('2文字以上は丸窓に収まるよう縮小する', () => {
    expect(getIconFontSize('ファ', 20)).toBe('12px');
    expect(getIconFontSize('ああ', 20)).toBe('12px');
    expect(getIconFontSize('🐱🐶', 18)).toBe('11px');
  });
});
