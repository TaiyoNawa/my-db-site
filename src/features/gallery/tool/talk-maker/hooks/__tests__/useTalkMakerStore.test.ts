// src/features/gallery/tool/talk-maker/hooks/__tests__/useTalkMakerStore.test.ts
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS } from '../../utils/presets';
import { useTalkMakerStore } from '../useTalkMakerStore';

const STORAGE_KEY = 'talk-maker-state';

describe('useTalkMakerStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('初期状態はメッセージ0件・デフォルト設定', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    expect(result.current.messages).toEqual([]);
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('メッセージを追加できる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addMessage('me', 'こんにちは'));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toMatchObject({
      sender: 'me',
      text: 'こんにちは',
      read: true,
    });
    expect(result.current.messages[0].time).toMatch(/^\d{2}:\d{2}$/);
  });

  it('空文字・空白のみのメッセージは追加しない', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addMessage('me', '   '));

    expect(result.current.messages).toHaveLength(0);
  });

  it('メッセージを更新できる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addMessage('me', '元のテキスト'));
    const id = result.current.messages[0].id;

    act(() =>
      result.current.updateMessage(id, {
        text: '更新後',
        sender: 'other',
        time: '12:34',
      })
    );

    expect(result.current.messages[0]).toMatchObject({
      id,
      text: '更新後',
      sender: 'other',
      time: '12:34',
    });
  });

  it('メッセージを削除できる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addMessage('me', '1件目'));
    act(() => result.current.addMessage('other', '2件目'));
    const id = result.current.messages[0].id;

    act(() => result.current.removeMessage(id));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toBe('2件目');
  });

  it('clearAll で全メッセージを削除する（設定は維持）', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addMessage('me', 'テスト'));
    act(() => result.current.updateSettings({ partnerName: '太郎' }));
    act(() => result.current.clearAll());

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.settings.partnerName).toBe('太郎');
  });

  it('設定を部分更新できる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() =>
      result.current.updateSettings({ themeId: 'dark', showTime: false })
    );

    expect(result.current.settings).toEqual({
      ...DEFAULT_SETTINGS,
      themeId: 'dark',
      showTime: false,
    });
  });

  it('sessionStorage に保存され、再マウント時に復元される', async () => {
    const first = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(first.result.current.initialized).toBe(true));

    act(() => first.result.current.addMessage('other', '保存テスト'));
    act(() => first.result.current.updateSettings({ partnerName: '花子' }));
    first.unmount();

    const second = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(second.result.current.initialized).toBe(true));

    expect(second.result.current.messages).toHaveLength(1);
    expect(second.result.current.messages[0].text).toBe('保存テスト');
    expect(second.result.current.settings.partnerName).toBe('花子');
  });

  it('壊れた保存データはデフォルト値にフォールバックする', async () => {
    sessionStorage.setItem(STORAGE_KEY, '{invalid json');

    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    expect(result.current.messages).toEqual([]);
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('v1形式（membersなし）の保存データからメンバーを自動生成する', async () => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages: [],
        settings: {
          partnerName: '太郎',
          themeId: 'dark',
          showTime: true,
          showRead: true,
        },
      })
    );

    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    expect(result.current.settings.members).toHaveLength(1);
    expect(result.current.settings.members[0].name).toBe('太郎');
    expect(result.current.settings.fontId).toBe('gothic');
  });

  it('画像メッセージを追加できる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() =>
      result.current.addImageMessage('me', 'data:image/jpeg;base64,xxx')
    );

    expect(result.current.messages[0]).toMatchObject({
      sender: 'me',
      text: '',
      imageUrl: 'data:image/jpeg;base64,xxx',
    });
  });

  it('通話メッセージを追加できる（completedはデフォルト時間付き）', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addCallMessage('me', 'completed'));
    act(() => result.current.addCallMessage('other', 'missed'));
    act(() => result.current.addCallMessage('other', 'noAnswer'));

    expect(result.current.messages[0]).toMatchObject({
      kind: 'call',
      callStatus: 'completed',
      callDuration: '0:22',
      text: '音声通話が終了しました',
    });
    expect(result.current.messages[1]).toMatchObject({
      kind: 'call',
      callStatus: 'missed',
      text: '',
    });
    expect(result.current.messages[1].callDuration).toBeUndefined();
    expect(result.current.messages[2]).toMatchObject({
      kind: 'call',
      callStatus: 'noAnswer',
    });
    expect(result.current.messages[2].callDuration).toBeUndefined();
  });

  it('日付ラベル・システムメッセージを追加できる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addDateMessage());
    act(() => result.current.addSystemMessage());

    expect(result.current.messages[0]).toMatchObject({
      kind: 'date',
      text: '今日',
    });
    expect(result.current.messages[1].kind).toBe('system');
    expect(result.current.messages[1].text).toContain('参加しました');
  });

  it('メッセージを一括更新・一括削除できる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addMessage('me', '1件目'));
    act(() => result.current.addMessage('me', '2件目'));
    act(() => result.current.addMessage('other', '3件目'));
    const [id1, id2] = result.current.messages.map((m) => m.id);

    act(() => result.current.updateMessages([id1, id2], { time: '09:00' }));
    expect(result.current.messages[0].time).toBe('09:00');
    expect(result.current.messages[1].time).toBe('09:00');
    expect(result.current.messages[2].time).not.toBe('09:00');

    act(() => result.current.removeMessages([id1, id2]));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toBe('3件目');
  });

  it('importMessages で置き換え・追記ができる', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    act(() => result.current.addMessage('me', '既存'));
    const imported = [
      {
        id: 'imp-1',
        sender: 'other' as const,
        text: 'インポート',
        time: '10:00',
        read: true,
      },
    ];
    const members = result.current.settings.members;

    act(() => result.current.importMessages(imported, members, 'append'));
    expect(result.current.messages).toHaveLength(2);

    act(() => result.current.importMessages(imported, members, 'replace'));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toBe('インポート');
  });

  it('メンバーの追加・更新・削除ができる（最低1人は維持）', async () => {
    const { result } = renderHook(() => useTalkMakerStore());
    await waitFor(() => expect(result.current.initialized).toBe(true));

    // 1人の状態では削除できない
    const firstId = result.current.settings.members[0].id;
    act(() => result.current.removeMember(firstId));
    expect(result.current.settings.members).toHaveLength(1);

    act(() => result.current.addMember());
    expect(result.current.settings.members).toHaveLength(2);
    const secondId = result.current.settings.members[1].id;

    act(() => result.current.updateMember(secondId, { name: '花子' }));
    expect(result.current.settings.members[1].name).toBe('花子');

    // 削除したメンバーのメッセージは memberId が外れる
    act(() => result.current.addMessage('other', 'テスト', secondId));
    act(() => result.current.removeMember(secondId));
    expect(result.current.settings.members).toHaveLength(1);
    expect(result.current.messages[0].memberId).toBeUndefined();
  });
});
