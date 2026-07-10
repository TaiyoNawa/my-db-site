// src/features/gallery/tool/talk-maker/hooks/useTalkMakerStore.ts
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';

import {
  CallStatus,
  Sender,
  TalkMember,
  TalkMessage,
  TalkSettings,
} from '../types';
import {
  DEFAULT_CALL_COMPLETED_TEXT,
  DEFAULT_CALL_DURATION,
  DEFAULT_DATE_TEXT,
  DEFAULT_SETTINGS,
  DEFAULT_SYSTEM_TEXT,
  createMember,
} from '../utils/presets';
import { getCurrentTime } from '../utils/time';

const STORAGE_KEY = 'talk-maker-state';

interface StoredState {
  messages: TalkMessage[];
  settings: TalkSettings;
}

function defaultState(): StoredState {
  return { messages: [], settings: { ...DEFAULT_SETTINGS } };
}

function loadFromStorage(): StoredState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    // 保存形式が変わっても壊れないよう、欠けたフィールドはデフォルトで補う
    const settings: TalkSettings = { ...DEFAULT_SETTINGS, ...parsed.settings };
    // v1形式（membersなし）からのマイグレーション: 相手情報から先頭メンバーを生成。
    // DEFAULT_SETTINGS のスプレッドで members が埋まるため、保存データ側を直接確認する
    const storedMembers = parsed.settings?.members;
    if (!Array.isArray(storedMembers) || storedMembers.length === 0) {
      settings.members = [createMember({ name: settings.partnerName })];
    }
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      settings,
    };
  } catch {
    return defaultState();
  }
}

function saveToStorage(state: StoredState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ストレージ容量超過などを無視（画像を多く登録した場合は永続化されない）
  }
}

interface TalkMakerStore {
  messages: TalkMessage[];
  settings: TalkSettings;
  initialized: boolean;
  addMessage: (sender: Sender, text: string, memberId?: string) => void;
  addImageMessage: (
    sender: Sender,
    imageUrl: string,
    memberId?: string
  ) => void;
  addCallMessage: (
    sender: Sender,
    status: CallStatus,
    memberId?: string
  ) => void;
  /** 中央表示の日付ラベル（「今日」など）を追加する */
  addDateMessage: () => void;
  /** 中央表示のシステムメッセージ（入室・退会など）を追加する */
  addSystemMessage: () => void;
  updateMessage: (id: string, patch: Partial<Omit<TalkMessage, 'id'>>) => void;
  /** 選択モード用: 複数メッセージへ同じ変更を一括適用する */
  updateMessages: (
    ids: string[],
    patch: Partial<Omit<TalkMessage, 'id'>>
  ) => void;
  removeMessage: (id: string) => void;
  removeMessages: (ids: string[]) => void;
  /** JSONインポート: replace は全置き換え、append は末尾に追記 */
  importMessages: (
    messages: TalkMessage[],
    members: TalkMember[],
    mode: 'replace' | 'append'
  ) => void;
  clearAll: () => void;
  updateSettings: (patch: Partial<TalkSettings>) => void;
  addMember: () => void;
  updateMember: (id: string, patch: Partial<Omit<TalkMember, 'id'>>) => void;
  removeMember: (id: string) => void;
}

export function useTalkMakerStore(): TalkMakerStore {
  const [messages, setMessages] = useState<TalkMessage[]>([]);
  const [settings, setSettings] = useState<TalkSettings>({
    ...DEFAULT_SETTINGS,
  });
  const [initialized, setInitialized] = useState(false);

  // SSR を避けるため useEffect で sessionStorage から初期化
  useEffect(() => {
    const stored = loadFromStorage();
    setMessages(stored.messages);
    setSettings(stored.settings);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    saveToStorage({ messages, settings });
  }, [messages, settings, initialized]);

  const addMessage = useCallback(
    (sender: Sender, text: string, memberId?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          sender,
          memberId: sender === 'other' ? memberId : undefined,
          text: trimmed,
          time: getCurrentTime(),
          read: true,
        },
      ]);
    },
    []
  );

  const addImageMessage = useCallback(
    (sender: Sender, imageUrl: string, memberId?: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          sender,
          memberId: sender === 'other' ? memberId : undefined,
          text: '',
          imageUrl,
          time: getCurrentTime(),
          read: true,
        },
      ]);
    },
    []
  );

  const addCallMessage = useCallback(
    (sender: Sender, status: CallStatus, memberId?: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          sender,
          memberId: sender === 'other' ? memberId : undefined,
          // completed のみ「音声通話が終了しました」のような文言を保持し、編集できるようにする
          text: status === 'completed' ? DEFAULT_CALL_COMPLETED_TEXT : '',
          kind: 'call',
          callStatus: status,
          callDuration:
            status === 'completed' ? DEFAULT_CALL_DURATION : undefined,
          time: getCurrentTime(),
          read: true,
        },
      ]);
    },
    []
  );

  const addDateMessage = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: nanoid(),
        sender: 'other',
        text: DEFAULT_DATE_TEXT,
        kind: 'date',
        time: getCurrentTime(),
        read: true,
      },
    ]);
  }, []);

  const addSystemMessage = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: nanoid(),
        sender: 'other',
        text: DEFAULT_SYSTEM_TEXT,
        kind: 'system',
        time: getCurrentTime(),
        read: true,
      },
    ]);
  }, []);

  const updateMessage = useCallback(
    (id: string, patch: Partial<Omit<TalkMessage, 'id'>>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
      );
    },
    []
  );

  const updateMessages = useCallback(
    (ids: string[], patch: Partial<Omit<TalkMessage, 'id'>>) => {
      const idSet = new Set(ids);
      setMessages((prev) =>
        prev.map((m) => (idSet.has(m.id) ? { ...m, ...patch } : m))
      );
    },
    []
  );

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const removeMessages = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setMessages((prev) => prev.filter((m) => !idSet.has(m.id)));
  }, []);

  const importMessages = useCallback(
    (
      imported: TalkMessage[],
      members: TalkMember[],
      mode: 'replace' | 'append'
    ) => {
      setMessages((prev) =>
        mode === 'replace' ? imported : [...prev, ...imported]
      );
      // インポートで自動生成されたメンバーを設定にも反映する
      setSettings((prev) => ({ ...prev, members }));
    },
    []
  );

  const clearAll = useCallback(() => {
    setMessages([]);
  }, []);

  const updateSettings = useCallback((patch: Partial<TalkSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const addMember = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        createMember({ name: `メンバー${prev.members.length + 1}` }),
      ],
    }));
  }, []);

  const updateMember = useCallback(
    (id: string, patch: Partial<Omit<TalkMember, 'id'>>) => {
      setSettings((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.id === id ? { ...m, ...patch } : m
        ),
      }));
    },
    []
  );

  const removeMember = useCallback((id: string) => {
    setSettings((prev) => {
      // 最低1人は維持する
      if (prev.members.length <= 1) return prev;
      return {
        ...prev,
        members: prev.members.filter((m) => m.id !== id),
      };
    });
    // 削除したメンバーのメッセージは先頭メンバー扱いに戻す
    setMessages((prev) =>
      prev.map((m) => (m.memberId === id ? { ...m, memberId: undefined } : m))
    );
  }, []);

  return {
    messages,
    settings,
    initialized,
    addMessage,
    addImageMessage,
    addCallMessage,
    addDateMessage,
    addSystemMessage,
    updateMessage,
    updateMessages,
    removeMessage,
    removeMessages,
    importMessages,
    clearAll,
    updateSettings,
    addMember,
    updateMember,
    removeMember,
  };
}
