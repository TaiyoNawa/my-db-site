// src/features/gallery/tool/talk-maker/utils/__tests__/talkJson.test.ts
import { describe, expect, it } from 'vitest';

import { TalkMember, TalkMessage } from '../../types';
import { parseTalkJson, serializeTalk } from '../talkJson';

const existingMembers: TalkMember[] = [
  { id: 'member-1', name: '太郎', icon: '🐱' },
];

describe('parseTalkJson', () => {
  it('基本的な配列形式をパースできる', () => {
    const raw = JSON.stringify([
      { sender: 'me', text: 'こんにちは', time: '12:34', read: false },
      { sender: 'other', text: 'やあ' },
    ]);
    const { messages } = parseTalkJson(raw, existingMembers);

    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({
      sender: 'me',
      text: 'こんにちは',
      time: '12:34',
      read: false,
    });
    expect(messages[1].sender).toBe('other');
    expect(messages[1].read).toBe(true);
    expect(messages[1].time).toMatch(/^\d{2}:\d{2}$/);
  });

  it('{ messages: [...] } 形式も受け付ける', () => {
    const raw = JSON.stringify({
      messages: [{ sender: '自分', text: 'テスト' }],
    });
    const { messages } = parseTalkJson(raw, existingMembers);
    expect(messages[0].sender).toBe('me');
  });

  it('日本語エイリアス（自分/相手）を解釈する', () => {
    const raw = JSON.stringify([
      { sender: '自分', text: 'a' },
      { sender: '相手', text: 'b' },
    ]);
    const { messages } = parseTalkJson(raw, existingMembers);
    expect(messages[0].sender).toBe('me');
    expect(messages[1].sender).toBe('other');
  });

  it('既存メンバー名を sender に書くと該当メンバーに紐づく', () => {
    const raw = JSON.stringify([{ sender: '太郎', text: 'やあ' }]);
    const { messages, members } = parseTalkJson(raw, existingMembers);

    expect(messages[0].sender).toBe('other');
    expect(messages[0].memberId).toBe('member-1');
    expect(members).toHaveLength(1);
  });

  it('未知のメンバー名は自動でメンバー登録される', () => {
    const raw = JSON.stringify([{ sender: '花子', text: 'はじめまして' }]);
    const { messages, members } = parseTalkJson(raw, existingMembers);

    expect(members).toHaveLength(2);
    const hanako = members.find((m) => m.name === '花子');
    expect(hanako).toBeDefined();
    expect(messages[0].memberId).toBe(hanako?.id);
  });

  it('不正なJSONは日本語エラーを投げる', () => {
    expect(() => parseTalkJson('{invalid', existingMembers)).toThrow(
      'JSONの形式が正しくありません'
    );
  });

  it('必須フィールド欠落は日本語エラーを投げる', () => {
    const raw = JSON.stringify([{ sender: 'me' }]);
    expect(() => parseTalkJson(raw, existingMembers)).toThrow(
      'データの形式が正しくありません'
    );
  });

  it('不正な時刻は何件目かを含むエラーを投げる', () => {
    const raw = JSON.stringify([
      { sender: 'me', text: 'ok', time: '12:00' },
      { sender: 'me', text: 'ng', time: '99:99' },
    ]);
    expect(() => parseTalkJson(raw, existingMembers)).toThrow(
      '2件目の time「99:99」が不正です'
    );
  });
});

describe('serializeTalk', () => {
  const messages: TalkMessage[] = [
    { id: '1', sender: 'me', text: 'こんにちは', time: '12:34', read: true },
    {
      id: '2',
      sender: 'other',
      memberId: 'member-1',
      text: 'やあ',
      time: '12:35',
      read: true,
    },
    {
      id: '3',
      sender: 'me',
      text: '',
      imageUrl: 'data:image/jpeg;base64,xxx',
      time: '12:36',
      read: true,
    },
  ];

  it('メンバー名で書き出し、画像メッセージはスキップする', () => {
    const json = serializeTalk(messages, existingMembers);
    const parsed = JSON.parse(json) as Array<{ sender: string; text: string }>;

    expect(parsed).toHaveLength(2);
    expect(parsed[0].sender).toBe('me');
    expect(parsed[1].sender).toBe('太郎');
  });

  it('serialize → parse で往復できる', () => {
    const json = serializeTalk(messages, existingMembers);
    const { messages: reimported } = parseTalkJson(json, existingMembers);

    expect(reimported).toHaveLength(2);
    expect(reimported[1].memberId).toBe('member-1');
  });
});
