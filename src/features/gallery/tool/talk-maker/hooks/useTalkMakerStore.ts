// src/features/gallery/tool/talk-maker/hooks/useTalkMakerStore.ts
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';

import { Sender, TalkMessage, TalkSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/presets';
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
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return defaultState();
  }
}

function saveToStorage(state: StoredState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ストレージ容量超過などを無視
  }
}

interface TalkMakerStore {
  messages: TalkMessage[];
  settings: TalkSettings;
  initialized: boolean;
  addMessage: (sender: Sender, text: string) => void;
  updateMessage: (id: string, patch: Partial<Omit<TalkMessage, 'id'>>) => void;
  removeMessage: (id: string) => void;
  clearAll: () => void;
  updateSettings: (patch: Partial<TalkSettings>) => void;
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

  const addMessage = useCallback((sender: Sender, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: nanoid(),
        sender,
        text: trimmed,
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

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setMessages([]);
  }, []);

  const updateSettings = useCallback((patch: Partial<TalkSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return {
    messages,
    settings,
    initialized,
    addMessage,
    updateMessage,
    removeMessage,
    clearAll,
    updateSettings,
  };
}
