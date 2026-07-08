// src/features/gallery/tool/talk-maker/types/index.ts

export type Sender = 'me' | 'other';

export interface TalkMessage {
  id: string;
  sender: Sender;
  text: string;
  /** "HH:MM" 形式の表示用時刻 */
  time: string;
  /** 既読かどうか（自分のメッセージにのみ表示される） */
  read: boolean;
}

export type ThemeId = 'blue' | 'dark' | 'green' | 'pink';

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
  partnerName: string;
  /** 相手アイコンとして表示する絵文字（1文字想定） */
  partnerIcon: string;
  themeId: ThemeId;
  showTime: boolean;
  showRead: boolean;
}
