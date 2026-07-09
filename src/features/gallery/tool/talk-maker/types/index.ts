// src/features/gallery/tool/talk-maker/types/index.ts

export type Sender = 'me' | 'other';

export interface TalkMember {
  id: string;
  name: string;
  /** 絵文字アイコン */
  icon: string;
  /** 画像アイコン（dataURL）。設定時は絵文字より優先 */
  iconImage?: string;
}

export interface TalkMessage {
  id: string;
  sender: Sender;
  /** sender が 'other' のときの送信メンバー。未指定時は先頭メンバー扱い */
  memberId?: string;
  text: string;
  /** 画像メッセージ（dataURL）。指定時はバブルの代わりに画像を表示 */
  imageUrl?: string;
  /** "HH:MM" 形式の表示用時刻 */
  time: string;
  /** 既読かどうか（自分のメッセージにのみ表示される） */
  read: boolean;
}

export type ThemeId = 'blue' | 'dark' | 'green' | 'pink';

export type FontId = 'gothic' | 'rounded' | 'serif' | 'mono';

export interface FontOption {
  id: FontId;
  label: string;
  fontFamily: string;
}

export interface BackgroundTheme {
  id: ThemeId;
  label: string;
  /** トーク画面全体の背景色 */
  bg: string;
  headerBg: string;
  headerColor: string;
  myBubbleBg: string;
  myBubbleColor: string;
  otherBubbleBg: string;
  otherBubbleColor: string;
  /** 時刻・既読ラベルの文字色 */
  metaColor: string;
}

export interface TalkSettings {
  /** ヘッダーに表示するトーク名（1対1なら相手の名前） */
  partnerName: string;
  /** トークアイコンの絵文字 */
  partnerIcon: string;
  /** トークアイコンの画像（dataURL）。設定時は絵文字より優先 */
  partnerIconImage?: string;
  themeId: ThemeId;
  /** 背景画像（dataURL）。設定時はテーマ背景色の上に cover 表示 */
  backgroundImage?: string;
  fontId: FontId;
  showTime: boolean;
  showRead: boolean;
  /** 相手側メンバー。2人以上でグループ表示（吹き出し上に名前ラベル） */
  members: TalkMember[];
}
