// src/features/gallery/tool/talk-maker/utils/talkJson.ts
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { TalkMember, TalkMessage } from '../types';
import { createMember } from './presets';
import { getCurrentTime, normalizeTime } from './time';

const jsonMessageSchema = z.object({
  sender: z.string().min(1),
  text: z.string().min(1),
  time: z.string().optional(),
  read: z.boolean().optional(),
  member: z.string().optional(),
});

const talkJsonSchema = z
  .union([
    z.array(jsonMessageSchema),
    z.object({ messages: z.array(jsonMessageSchema) }),
  ])
  .transform((v) => (Array.isArray(v) ? v : v.messages));

export interface ParsedTalkJson {
  messages: TalkMessage[];
  /** 既存メンバー + JSON内の未知の名前から自動生成したメンバー */
  members: TalkMember[];
}

const ME_ALIASES = ['me', '自分'];
const OTHER_ALIASES = ['other', '相手'];

/** JSONインポート用のサンプル（モーダルのプレースホルダーに表示する） */
export const SAMPLE_TALK_JSON = `[
  { "sender": "相手", "text": "今日ひま？", "time": "12:30" },
  { "sender": "自分", "text": "ひまだよ〜", "time": "12:34", "read": true },
  { "sender": "太郎", "text": "メンバー名も書けます（グループ）" }
]`;

/**
 * JSON文字列をトークに変換する。
 * sender は "me"/"自分"/"other"/"相手" のほか、メンバー名を直接指定できる。
 * 未知のメンバー名は自動でメンバー登録される。
 * 不正な内容は日本語メッセージの Error を投げる。
 */
export function parseTalkJson(
  raw: string,
  existingMembers: TalkMember[]
): ParsedTalkJson {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(
      'JSONの形式が正しくありません。カンマや括弧を確認してください。'
    );
  }

  const result = talkJsonSchema.safeParse(json);
  if (!result.success) {
    throw new Error(
      'データの形式が正しくありません。各メッセージに sender と text（1文字以上）が必要です。'
    );
  }

  const members = [...existingMembers];
  const messages: TalkMessage[] = result.data.map((item, index) => {
    const no = index + 1;

    let time = getCurrentTime();
    if (item.time !== undefined) {
      const normalized = normalizeTime(item.time);
      if (!normalized) {
        throw new Error(
          `${no}件目の time「${item.time}」が不正です。"12:34" の形式で指定してください。`
        );
      }
      time = normalized;
    }

    const senderRaw = item.sender.trim();
    const isMe = ME_ALIASES.includes(senderRaw.toLowerCase());
    // "other"/"相手" 以外の文字列はメンバー名として扱う（グループ対応）
    const memberName = OTHER_ALIASES.includes(senderRaw.toLowerCase())
      ? item.member
      : isMe
        ? undefined
        : senderRaw;

    let memberId: string | undefined;
    if (!isMe && memberName) {
      let member = members.find((m) => m.name === memberName);
      if (!member) {
        member = createMember({ name: memberName, icon: '👤' });
        members.push(member);
      }
      memberId = member.id;
    }

    return {
      id: nanoid(),
      sender: isMe ? 'me' : 'other',
      memberId,
      text: item.text,
      time,
      read: item.read ?? true,
    };
  });

  return { messages, members };
}

/**
 * トークをJSON文字列に変換する。
 * 画像（dataURLが巨大）と特殊メッセージ（通話・日付・システム）は
 * インポート形式で表現できないため対象外（スキップ）とする。
 */
export function serializeTalk(
  messages: TalkMessage[],
  members: TalkMember[]
): string {
  const items = messages
    .filter((m) => !m.imageUrl && (!m.kind || m.kind === 'text'))
    .map((m) => {
      const member = members.find((mem) => mem.id === m.memberId);
      return {
        sender: m.sender === 'me' ? 'me' : (member?.name ?? '相手'),
        text: m.text,
        time: m.time,
        read: m.read,
      };
    });
  return JSON.stringify(items, null, 2);
}
