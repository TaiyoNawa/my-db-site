// src/features/gallery/tool/talk-maker/utils/presets.ts
import { nanoid } from 'nanoid';

import {
  BackgroundTheme,
  CallStatus,
  FontId,
  FontOption,
  TalkMember,
  TalkSettings,
  ThemeId,
} from '../types';

export const THEMES: BackgroundTheme[] = [
  {
    id: 'blue',
    label: 'ブルー',
    bg: '#8CABD8',
    headerBg: '#2D4A6B',
    headerColor: '#FFFFFF',
    myBubbleBg: '#8DE055',
    myBubbleColor: '#1A202C',
    otherBubbleBg: '#FFFFFF',
    otherBubbleColor: '#1A202C',
    metaColor: '#3D5A80',
  },
  {
    id: 'dark',
    label: 'ダーク',
    bg: '#1E232B',
    headerBg: '#12161C',
    headerColor: '#E2E8F0',
    myBubbleBg: '#8DE055',
    myBubbleColor: '#1A202C',
    otherBubbleBg: '#3A4250',
    otherBubbleColor: '#E2E8F0',
    metaColor: '#8E99AB',
  },
  {
    id: 'green',
    label: 'グリーン',
    bg: '#A8CFA5',
    headerBg: '#3E6B4A',
    headerColor: '#FFFFFF',
    myBubbleBg: '#FFF176',
    myBubbleColor: '#1A202C',
    otherBubbleBg: '#FFFFFF',
    otherBubbleColor: '#1A202C',
    metaColor: '#4A6B50',
  },
  {
    id: 'pink',
    label: 'ピンク',
    bg: '#F3C4D3',
    headerBg: '#B05A79',
    headerColor: '#FFFFFF',
    myBubbleBg: '#FFFFFF',
    myBubbleColor: '#1A202C',
    otherBubbleBg: '#FDEDF2',
    otherBubbleColor: '#1A202C',
    metaColor: '#9C5570',
  },
];

export function getTheme(id: ThemeId): BackgroundTheme {
  // 不正なIDでも画面が壊れないよう先頭テーマにフォールバックする
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** 相手アイコンの絵文字候補（自由入力も可能） */
export const PARTNER_ICON_OPTIONS = [
  '🐱',
  '🐶',
  '🐰',
  '🐻',
  '🐼',
  '🦊',
  '😀',
  '😎',
  '👩',
  '👨',
  '👵',
  '🤖',
];

/**
 * フォントはシステムフォントのみ。外部フォントは html-to-image の
 * フォント埋め込みが不安定で、PNG出力時に崩れるリスクがあるため使わない。
 */
export const FONTS: FontOption[] = [
  {
    id: 'gothic',
    label: 'ゴシック',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Hiragino Kaku Gothic ProN', 'Yu Gothic', Meiryo, sans-serif",
  },
  {
    id: 'rounded',
    label: '丸ゴシック',
    fontFamily:
      "'Hiragino Maru Gothic ProN', 'HGMaruGothicMPRO', 'Yu Gothic', Meiryo, sans-serif",
  },
  {
    id: 'serif',
    label: '明朝',
    fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', 'MS PMincho', serif",
  },
  {
    id: 'mono',
    label: '等幅',
    fontFamily: "'SF Mono', Menlo, Consolas, 'Osaka-Mono', monospace",
  },
];

export function getFont(id: FontId): FontOption {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

export function createMember(override?: Partial<TalkMember>): TalkMember {
  return {
    id: nanoid(),
    name: '相手の名前',
    icon: '🐱',
    ...override,
  };
}

/** 特殊メッセージ挿入時のデフォルト文言（挿入後に吹き出しタップで編集できる） */
export const DEFAULT_DATE_TEXT = '今日';
export const DEFAULT_SYSTEM_TEXT = 'メンバーがグループに参加しました。';
export const DEFAULT_CALL_DURATION = '0:22';

/**
 * 通話結果ごとの表示ラベル。completed のみ通話時間を別枠で表示するため、
 * ここでは「不在着信」等の非完了ステータスのラベルとして使う。
 */
export const CALL_STATUS_LABELS: Record<Exclude<CallStatus, 'completed'>, string> = {
  missed: '不在着信',
  canceled: 'キャンセル',
  noAnswer: '応答なし',
};

export const DEFAULT_SETTINGS: TalkSettings = {
  partnerName: '相手の名前',
  partnerIcon: '🐱',
  themeId: 'blue',
  fontId: 'gothic',
  showTime: true,
  showRead: true,
  members: [createMember()],
};
