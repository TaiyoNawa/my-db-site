# 設計書

## アーキテクチャ概要

既存ツール（es-counter, poll）と同じ `features/gallery/tool/` パターンに従う。
クライアントサイドのみ（APIルートなし）。Tone.js を用いた音声処理は `useAudioPlayer` フックに閉じ込め、コンポーネントからは直接 Tone を触らない。

```
pages/gallery/tool/chord-runner/index.tsx   ← 薄いページ（レイアウト + 状態を features に委譲）
features/gallery/tool/chord-runner/
  types/index.ts
  utils/chordData.ts
  utils/fretboardUtils.ts
  hooks/usePracticeSession.ts
  hooks/useAudioPlayer.ts
  components/ChordBuilder.tsx
  components/Fretboard.tsx
  components/FretDot.tsx
  components/BpmControl.tsx
  components/PlaybackControls.tsx
  components/__tests__/
```

## コンポーネント設計

### 1. types/index.ts

**責務**:
- FretPosition, ChordDefinition, PracticeSession, ResolvedDot 型を定義

**実装の要点**:
- `fret: 0` = 開放弦、`fret: -1` = ミュート（指板に表示しない）
- `beatsPerChord: 2 | 4` の union 型

### 2. utils/chordData.ts

**責務**:
- C, G, D, A, E, Am, Dm, Em, F, Bm の10コード定義を静的データとして提供

**実装の要点**:
- `Record<string, ChordDefinition>` 形式
- audioNote はルートノートを "C3" 形式で記述

### 3. utils/fretboardUtils.ts

**責務**:
- `resolveOverlap(current, next): ResolvedDot[]` を実装
- ゴーストドットのスタイル（ghost-filled / ghost-outline）を決定する

**実装の要点**:
- 同弦・同フレットの重複判定ロジック
- fret === -1 のミュート弦はゴーストからも除外

### 4. hooks/usePracticeSession.ts

**責務**:
- `sequence`, `bpm`, `beatsPerChord`, `isPlaying`, `currentIndex` の状態管理
- `start()`, `stop()`, `reset()` を提供
- Tone.Transport の開始・停止を `useAudioPlayer` に委譲

**実装の要点**:
- `useCallback` / `useRef` で beat カウントを管理
- `currentIndex` の更新には `useRef` を使い、Tone コールバック内で安全に参照する
- アンマウント時に必ず `Tone.Transport.stop()` と `Tone.Transport.cancel()` を実行

### 5. hooks/useAudioPlayer.ts

**責務**:
- Tone.js の動的インポート（SSR 回避）
- Tone.Synth でメトロノーム音（高音ピン）とコード音（低音ドーン）を生成
- `scheduleRepeat` で BPM に合わせてコールバックを呼び出す

**実装の要点**:
- `typeof window === 'undefined'` のサーバーサイドガード必須
- Tone.js は `import('tone')` の dynamic import を使う（Next.js 対応）
- AudioContext のユーザー操作起点（再生ボタンクリック）で `Tone.start()` を呼ぶ

### 6. components/FretDot.tsx

**責務**:
- 単一の押さえ位置ドットを SVG circle 要素として描画

**実装の要点**:
- Props: `cx`, `cy`, `r`, `variant: 'current' | 'ghost-filled' | 'ghost-outline'`
- `current`: fill="gray.800", opacity=1
- `ghost-filled`: fill="gray.400", opacity=0.3
- `ghost-outline`: fill="none", stroke="gray.400", strokeWidth=2

### 7. components/Fretboard.tsx

**責務**:
- 6弦×5フレットの指板を SVG で描画
- `FretDot` を並べて現在コード＋ゴーストドットを重ねて表示

**実装の要点**:
- SVG viewBox: "0 0 200 160"（固定スケール、responsive は `width="100%"`）
- 弦は縦線、フレットは横線で描画
- フレット番号ラベル（1〜5）を下端に表示

### 8. components/ChordBuilder.tsx

**責務**:
- コードボタン一覧（10個）の表示
- タイムライン（追加済みコードの配列）の表示と削除

**実装の要点**:
- `sequence.length >= 16` でボタンを disabled
- タイムライン各コードに ✕ ボタン
- Chakra UI の `Wrap` + `Button` で実装

### 9. components/BpmControl.tsx

**責務**:
- BPM スライダー（40〜200）と数値 Input

**実装の要点**:
- Chakra UI `Slider` + `NumberInput`
- 変更時は親（usePracticeSession の setBpm）へ通知

### 10. components/PlaybackControls.tsx

**責務**:
- 再生・停止ボタン、beatsPerChord の 2/4 切り替え

**実装の要点**:
- `isPlaying` フラグで再生中は停止ボタン、停止中は再生ボタンを表示
- `sequence.length === 0` のとき再生ボタンを disabled

## データフロー

### 再生フロー
```
1. ユーザーが ChordBuilder でコードをクリック → sequence に追加
2. BpmControl で BPM を設定
3. PlaybackControls の再生ボタン押下 → usePracticeSession.start()
4. usePracticeSession が useAudioPlayer.startTransport(bpm, beatsPerChord, onBeat) を呼ぶ
5. Tone.Transport が動き、4分音符ごとに onBeat コールバックが発火
6. beatCount % beatsPerChord === 0 のとき currentIndex を ++（mod sequence.length）
7. Fretboard が currentIndex から currentChord / nextChord を計算して再描画
8. useAudioPlayer がメトロノーム音＋コード音を time 引数で正確に再生
```

## エラーハンドリング戦略

### カスタムエラークラス
なし（クライアントサイドのみのツールのため）

### エラーハンドリングパターン
- Tone.js の dynamic import 失敗時は `console.error` のみ（音が鳴らないだけで UI は動く）
- 不正な BPM（範囲外）は `Math.min/max` でクランプ

## テスト戦略

### ユニットテスト
- `fretboardUtils.resolveOverlap`: 重複なし・重複あり・ミュート弦の3ケース
- `usePracticeSession`: start/stop/index 進行のロジック（Tone をモック）

### 統合テスト
- ChordBuilder でコードを追加→削除できること
- sequence が空のとき再生ボタンが disabled になること

## 依存ライブラリ

新規追加:

```json
{
  "dependencies": {
    "tone": "^15.1.22"
  }
}
```

## ディレクトリ構造

```
src/features/gallery/tool/chord-runner/
├── types/
│   └── index.ts
├── utils/
│   ├── chordData.ts
│   └── fretboardUtils.ts
├── hooks/
│   ├── usePracticeSession.ts
│   └── useAudioPlayer.ts
└── components/
    ├── ChordBuilder.tsx
    ├── Fretboard.tsx
    ├── FretDot.tsx
    ├── BpmControl.tsx
    ├── PlaybackControls.tsx
    └── __tests__/
        ├── fretboardUtils.test.ts
        └── ChordBuilder.test.tsx

src/pages/gallery/tool/chord-runner/
└── index.tsx
```

## 実装の順序

1. `yarn add tone` で依存追加
2. `types/index.ts` — 型定義
3. `utils/chordData.ts` — コード静的データ
4. `utils/fretboardUtils.ts` — ゴースト重複解決ロジック
5. `hooks/useAudioPlayer.ts` — Tone.js ラッパー
6. `hooks/usePracticeSession.ts` — セッション状態管理
7. `components/FretDot.tsx` — 最小単位
8. `components/Fretboard.tsx` — 指板 SVG
9. `components/ChordBuilder.tsx` — コードボタン＋タイムライン
10. `components/BpmControl.tsx` — BPM スライダー
11. `components/PlaybackControls.tsx` — 再生・停止
12. `pages/gallery/tool/chord-runner/index.tsx` — ページ統合
13. `pages/gallery/tool/index.tsx` — toolリストに追加
14. テスト・lint・build 確認

## セキュリティ考慮事項

- ユーザー入力は BPM 数値のみ。`Math.min(200, Math.max(40, value))` でクランプ済み

## パフォーマンス考慮事項

- Tone.js は dynamic import で遅延ロード（初期バンドルサイズ抑制）
- Fretboard の SVG は `useMemo` で currentChord / nextChord が変化したときのみ再計算

## 将来の拡張性

- コードデータを配列に拡張すれば追加コードは容易
- `useAudioPlayer` のインターフェイスを保てばサンプラー音源への差し替えも可能
