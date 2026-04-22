// src/features/gallery/tool/es-counter/types/index.ts

export type NewlineMode = '0' | '1' | '2';

export interface CountSettings {
  /** 改行を何文字としてカウントするか */
  newlineMode: NewlineMode;
  /** スペース（半角・全角）をカウントするか */
  countSpaces: boolean;
  /** 最大文字数（nullは制限なし） */
  maxLength: number | null;
  /** N文字ごとにプレビュー内に文字数ラベルを表示する単位（nullは非表示） */
  counterUnit: number | null;
}

export interface Panel {
  id: string;
  title: string;
  text: string;
  settings: CountSettings;
  isPreviewVisible: boolean;
}
