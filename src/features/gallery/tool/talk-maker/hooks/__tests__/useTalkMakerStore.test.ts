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
});
