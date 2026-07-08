// src/features/gallery/tool/talk-maker/utils/presets.ts
import { BackgroundTheme, TalkSettings, ThemeId } from '../types';

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

export const DEFAULT_SETTINGS: TalkSettings = {
  partnerName: '相手の名前',
  partnerIcon: '🐱',
  themeId: 'blue',
  showTime: true,
  showRead: true,
};
