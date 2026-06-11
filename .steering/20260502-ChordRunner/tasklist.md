# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

### タスクスキップが許可される唯一のケース
以下の技術的理由に該当する場合のみスキップ可能:
- 実装方針の変更により、機能自体が不要になった
- アーキテクチャ変更により、別の実装方法に置き換わった
- 依存関係の変更により、タスクが実行不可能になった

---

## フェーズ1: 基盤セットアップ

- [x] Tone.jsをインストールする
  - [x] `yarn add tone` を実行
  - [x] package.jsonに tone が追加されたことを確認

- [x] 型定義を作成する（`src/features/gallery/tool/chord-runner/types/index.ts`）
  - [x] `FretPosition` 型（string: 1〜6, fret: number, finger?: 1〜4）
  - [x] `ChordDefinition` 型（name, positions, audioNote）
  - [x] `ResolvedDot` 型（FretPosition + style: 'current' | 'ghost-filled' | 'ghost-outline'）
  - [x] `PracticeSession` 型（sequence, bpm, beatsPerChord, isPlaying, currentIndex）

## フェーズ2: データ・ユーティリティ

- [x] コード静的データを作成する（`src/features/gallery/tool/chord-runner/utils/chordData.ts`）
  - [x] C コード定義
  - [x] G コード定義
  - [x] D コード定義
  - [x] A コード定義
  - [x] E コード定義
  - [x] Am コード定義
  - [x] Dm コード定義
  - [x] Em コード定義
  - [x] F コード定義（バレーコード）
  - [x] Bm コード定義（バレーコード）

- [x] fretboardUtilsを作成する（`src/features/gallery/tool/chord-runner/utils/fretboardUtils.ts`）
  - [x] `resolveOverlap(current, next)` 関数
    - [x] 重複なしの場合 'ghost-filled' を返す
    - [x] 同弦・同フレット重複の場合 'ghost-outline' を返す
    - [x] fret === -1（ミュート）の場合は除外する

## フェーズ3: フックの実装

- [x] useAudioPlayerを作成する（`src/features/gallery/tool/chord-runner/hooks/useAudioPlayer.ts`）
  - [x] Tone.jsをdynamic importで遅延ロード（SSRガード）
  - [x] メトロノーム音用 Tone.Synth の初期化
  - [x] コード音用 Tone.Synth の初期化
  - [x] `startTransport(bpm, beatsPerChord, onBeat)` 関数
  - [x] `stopTransport()` 関数
  - [x] アンマウント時のクリーンアップ（Transport.stop + cancel + dispose）

- [x] usePracticeSessionを作成する（`src/features/gallery/tool/chord-runner/hooks/usePracticeSession.ts`）
  - [x] `sequence`, `bpm`, `beatsPerChord`, `isPlaying`, `currentIndex` の状態
  - [x] `setSequence`, `setBpm`, `setBeatsPerChord` の更新関数
  - [x] `start()` 関数（Transport 開始 + isPlaying=true）
  - [x] `stop()` 関数（Transport 停止 + isPlaying=false + currentIndex=0）
  - [x] Tone コールバック内での currentIndex 更新（useRef で安全参照）

## フェーズ4: コンポーネントの実装

- [x] FretDotを作成する（`src/features/gallery/tool/chord-runner/components/FretDot.tsx`）
  - [x] variant: 'current' | 'ghost-filled' | 'ghost-outline' の3パターン
  - [x] SVG circle 要素で描画

- [x] Fretboardを作成する（`src/features/gallery/tool/chord-runner/components/Fretboard.tsx`）
  - [x] SVG viewBox="0 0 200 160" の指板グリッド（6弦×5フレット）
  - [x] 弦番号・フレット番号ラベル
  - [x] currentChord の黒ドット表示
  - [x] nextChord のゴーストドット表示（resolveOverlap を使用）

- [x] ChordBuilderを作成する（`src/features/gallery/tool/chord-runner/components/ChordBuilder.tsx`）
  - [x] 10種類のコードボタン（C, G, D, A, E, Am, Dm, Em, F, Bm）
  - [x] sequence >= 16 でボタンを disabled
  - [x] タイムライン表示（追加済みコード一覧）
  - [x] タイムライン各コードの削除ボタン（×）

- [x] BpmControlを作成する（`src/features/gallery/tool/chord-runner/components/BpmControl.tsx`）
  - [x] Chakra UI Slider（range: 40〜200）
  - [x] Chakra UI NumberInput（同じ値を数値入力）
  - [x] BPM表示ラベル

- [x] PlaybackControlsを作成する（`src/features/gallery/tool/chord-runner/components/PlaybackControls.tsx`）
  - [x] 再生ボタン（isPlaying=false のとき表示）
  - [x] 停止ボタン（isPlaying=true のとき表示）
  - [x] beatsPerChord の 2拍/4拍 切り替えボタン
  - [x] sequence.length === 0 のとき再生ボタン disabled

## フェーズ5: ページ統合

- [x] チャンクページを作成する（`src/pages/gallery/tool/chord-runner/index.tsx`）
  - [x] GalleryMeta, SecondHeader, SectionWrapper の組み込み
  - [x] usePracticeSession フックの利用
  - [x] ChordBuilder, Fretboard, BpmControl, PlaybackControls の配置

- [x] toolリストにChordRunnerを追加する（`src/pages/gallery/tool/index.tsx`）
  - [x] items 配列に ChordRunner エントリを追加（title, description, url, eyeCatch）

## フェーズ6: テスト実装

- [x] fretboardUtils のユニットテストを作成する（`components/__tests__/fretboardUtils.test.ts`）
  - [x] 重複なしのケース
  - [x] 同弦・同フレット重複のケース
  - [x] ミュート弦（fret: -1）が除外されるケース

- [x] ChordBuilder のコンポーネントテストを作成する（`components/__tests__/ChordBuilder.test.tsx`）
  - [x] コードボタンをクリックすると onAdd が呼ばれる
  - [x] sequence.length >= 16 でボタンが disabled になる
  - [x] タイムライン上の × ボタンで onRemove が呼ばれる

## フェーズ7: 品質チェックと修正

- [x] すべてのテストが通ることを確認
  - [x] `yarn test` → 54 files, 212 tests passed
- [x] リントエラーがないことを確認
  - [x] `yarn lint` → No ESLint warnings or errors
- [x] ビルド成功（型エラーの確認を兼ねる）
  - [x] `yarn build` → /gallery/tool/chord-runner が正常生成

## フェーズ8: ドキュメント更新

- [x] 実装後の振り返り（このファイルの下部に記録）

---

## 実装後の振り返り

### 実装完了日
2026-05-02

### 計画と実績の差分

**計画と異なった点**:
- import/order のESLint規則が厳密で、`type import` は通常 import グループの後に分離が必要だった。複数ファイルで修正が発生
- `fretboardUtils.test.ts` の配置を当初 `components/__tests__/` に置いたが、検証で `utils/__tests__/` が正しいと判明し移動した

**新たに必要になったタスク**:
- `useAudioPlayer.initialize` への try/catch 追加（Tone.js ロード失敗時の UI 状態保護）
- `BpmControl.handleChange` への `isNaN` ガード追加（NumberInput 全消去時の NaN 防止）
- `usePracticeSession.start` を楽観的UI更新パターンに修正（setIsPlaying(true) を await 前に移動）

**技術的理由でスキップしたタスク**:
なし（全タスク完了）

### 学んだこと

**技術的な学び**:
- Tone.js 15 は `Transport.cancel()` が存在する（@14 から API 変更なし）。`typeof window` ガードと dynamic import で SSR は問題なく通過する
- Tone のコールバック内では React の state が古い値になるため `useRef` で最新値を参照するパターンが必須
- `userEvent.setup()` は `@testing-library/user-event` を直接インポートして使う（`render` の返り値には `user` がない）

**プロセス上の改善点**:
- import/order は事前に既存ファイルのパターンを確認してから書くと修正ラウンドが減る
- テストファイルの配置は実装対象のディレクトリ構造（`utils/` テストは `utils/__tests__/`）に厳密に従う

### 次回への改善提案
- Tone.js を使う場合は最初から dynamic import + try/catch + isNaN ガードをセットで書く
- 楽観的UI更新（`setIsPlaying(true)` を await 前に置く）は非同期アクションを持つ全ての再生コントロールで標準パターンにする
