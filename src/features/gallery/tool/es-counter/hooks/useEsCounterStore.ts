// src/features/gallery/tool/es-counter/hooks/useEsCounterStore.ts
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';

import { CountSettings, Panel } from '../types';
import { DEFAULT_SETTINGS } from '../utils/presets';

const STORAGE_KEY = 'es-counter-panels';
const MAX_PANELS = 4;

function createPanel(override?: Partial<Panel>): Panel {
  return {
    id: nanoid(),
    title: '',
    text: '',
    settings: { ...DEFAULT_SETTINGS },
    isPreviewVisible: true, // デフォルトでプレビューON
    ...override,
  };
}

function loadFromStorage(): Panel[] {
  if (typeof window === 'undefined') return [createPanel()];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [createPanel()];
    const parsed = JSON.parse(raw) as Panel[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [createPanel()];
  } catch {
    return [createPanel()];
  }
}

function saveToStorage(panels: Panel[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(panels));
  } catch {
    // ストレージ容量超過などを無視
  }
}

interface EsCounterStore {
  panels: Panel[];
  initialized: boolean;
  canAddPanel: boolean;
  allPreviewVisible: boolean;
  addPanel: () => void;
  removePanel: (id: string) => void;
  updatePanelText: (id: string, text: string) => void;
  updatePanelTitle: (id: string, title: string) => void;
  updatePanelSettings: (id: string, settings: CountSettings) => void;
  togglePreview: (id: string) => void;
  toggleAllPreviews: (visible: boolean) => void;
  applySettingsToAll: (settings: CountSettings) => void;
  movePanel: (id: string, direction: 'left' | 'right') => void;
  clearAll: () => void;
}

export function useEsCounterStore(): EsCounterStore {
  const [panels, setPanels] = useState<Panel[]>([createPanel()]);
  const [initialized, setInitialized] = useState(false);

  // SSR を避けるため useEffect で localStorage から初期化
  useEffect(() => {
    setPanels(loadFromStorage());
    setInitialized(true);
  }, []);

  // panels が変わるたびに保存
  useEffect(() => {
    if (!initialized) return;
    saveToStorage(panels);
  }, [panels, initialized]);

  const addPanel = useCallback(() => {
    setPanels((prev) => {
      if (prev.length >= MAX_PANELS) return prev;
      return [...prev, createPanel()];
    });
  }, []);

  const removePanel = useCallback((id: string) => {
    setPanels((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const updatePanelText = useCallback((id: string, text: string) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, text } : p)));
  }, []);

  const updatePanelTitle = useCallback((id: string, title: string) => {
    setPanels((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
  }, []);

  const updatePanelSettings = useCallback(
    (id: string, settings: CountSettings) => {
      setPanels((prev) =>
        prev.map((p) => (p.id === id ? { ...p, settings } : p))
      );
    },
    []
  );

  const togglePreview = useCallback((id: string) => {
    setPanels((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isPreviewVisible: !p.isPreviewVisible } : p
      )
    );
  }, []);

  // 全パネルのプレビューを一括ON/OFF
  const toggleAllPreviews = useCallback((visible: boolean) => {
    setPanels((prev) => prev.map((p) => ({ ...p, isPreviewVisible: visible })));
  }, []);

  // 全パネルの設定を一括変更
  const applySettingsToAll = useCallback((settings: CountSettings) => {
    setPanels((prev) => prev.map((p) => ({ ...p, settings: { ...settings } })));
  }, []);

  const movePanel = useCallback((id: string, direction: 'left' | 'right') => {
    setPanels((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const next = [...prev];
      if (direction === 'left' && index > 0) {
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
      } else if (direction === 'right' && index < prev.length - 1) {
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setPanels([createPanel()]);
  }, []);

  return {
    panels,
    initialized,
    canAddPanel: panels.length < MAX_PANELS,
    allPreviewVisible: panels.every((p) => p.isPreviewVisible),
    addPanel,
    removePanel,
    updatePanelText,
    updatePanelTitle,
    updatePanelSettings,
    togglePreview,
    toggleAllPreviews,
    applySettingsToAll,
    movePanel,
    clearAll,
  };
}
