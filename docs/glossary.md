# プロジェクト用語集 (Glossary)

## 概要

このドキュメントは、Haruhate プロジェクト内で使用される用語を統一的に定義します。

**更新日**: 2026-04-26

---

## ドメイン用語

### ChordRunner（コードランナー）

**定義**: ギターコードチェンジ練習ツール。`/gallery/tool/chord-runner` で公開。

**説明**: ユーザーが組み立てたコード進行をBPMに合わせて自動再生し、指板上に現在コードと次コードを同時表示することで、視覚的・聴覚的にコードチェンジ練習をサポートするWebアプリ。

**関連用語**: ゴーストフレット表示、BPM、コード進行、指板（フレットボード）

---

### ゴーストフレット表示（Ghost Fret / Onion Skin）

**定義**: 現在弾くコードの運指と次に弾くコードの運指を、同じ指板上に重ねて表示するUI機能。

**説明**:
- **現在コード**: 黒ドット（`opacity: 1, fill: gray.800`）
- **次コード（ゴースト）**: 透過ドット（`opacity: 0.3, fill: gray.400`）
- **重複位置**: 枠線のみのドット（`stroke: gray.400, fill: none`）

**関連用語**: ChordRunner、FretDot、resolveOverlap

---

### コード進行（Chord Sequence）

**定義**: 練習対象のコードを順番に並べたリスト。

**制約**: 1〜16コード。無限ループで繰り返し練習できる。

**例**: `["C", "G", "Am", "F"]`

**関連用語**: PracticeSession、ChordBuilder

---

### flowmusic（フローミュージック）

**定義**: n8n + Flow Music API で自動生成した楽曲をショーケースするAIプロンプト集ページ。`/gallery/prompt/flow-music` で公開予定。

**説明**: Supabase の `music_prompts` テーブルから `status=completed` のレコードを ISR で取得し、YouTube埋め込みとプロンプトテキストを一覧表示する。

**関連用語**: MusicPrompt、ISR、n8n、Supabase

---

### ES文字数カウンター（es-counter）

**定義**: エントリーシート（ES）作成を支援する文字数カウントツール。`/gallery/tool/es-counter` で公開済み。

**説明**: 複数パネルで文章の文字数を計測し、制限文字数に対する充足率を可視化する。設定はセッションストレージに保持（タブ閉じでリセット）。

**関連用語**: Panel、CountSettings、sessionStorage

---

### ギャラリー（Gallery）

**定義**: ゲーム・ツール・漫画・プロンプト集など多様なコンテンツを集めた `/gallery` 以下のセクション。

**サブカテゴリ**:
- `/gallery/tool/` — 実用ツール（es-counter, poll, chord-runner 等）
- `/gallery/prompt/` — AIプロンプト集（flow-music 等）
- `/gallery/game/` — ゲーム
- `/gallery/manga/` — 漫画スタック

---

## 技術用語

### Next.js Pages Router

**定義**: `src/pages/` ディレクトリのファイル構造がそのままURLルーティングになる Next.js のルーティング方式。

**本プロジェクトでの用途**: 全ページのルーティング・`getStaticProps` による SSG/ISR・API Routes

**バージョン**: Next.js 14.2.4

---

### SSG（Static Site Generation）

**定義**: ビルド時にHTMLを生成する Next.js の静的生成方式。

**本プロジェクトでの用途**: 記事ページ（`/article/[id]`）・ギャラリートップ等の高速配信

---

### ISR（Incremental Static Regeneration）

**定義**: SSG ページをバックグラウンドで定期再生成する Next.js の機能。`revalidate` 秒数を設定する。

**本プロジェクトでの用途**:
- 記事一覧: `revalidate: 60`
- flowmusic: `revalidate: 3600`（1時間ごとに最新データを反映）

---

### Tone.js

**定義**: Web Audio API をラップした JavaScriptオーディオライブラリ。BPMスケジュール再生・サンプラー機能を提供。

**本プロジェクトでの用途**: ChordRunner のメトロノーム音・コード和音の正確なスケジュール再生

**注意**: SSR非対応のため `dynamic(() => import(...), { ssr: false })` でCSR専用ロードが必要。

---

### gleitz/midi-js-soundfonts

**定義**: MIDI音源をMP3に変換したサンプル音源をCDN配信する GitHub ベースのオープンライブラリ。

**本プロジェクトでの用途**: ChordRunner のギターコード和音サンプル音源（acoustic_guitar_steel）

**URL**: `https://gleitz.github.io/midi-js-soundfonts/`

---

### Supabase

**定義**: PostgreSQL ベースのオープンソース Backend-as-a-Service。

**本プロジェクトでの用途**:
- flowmusic: `music_prompts` テーブルから楽曲データを ISR で取得
- アンケートツール（poll）: 回答データの保存・集計

**認証方式**: anon key をサーバーサイド（getStaticProps）のみで使用。クライアントに露出しない。

---

### Chakra UI

**定義**: アクセシビリティ標準準拠の React コンポーネントライブラリ。

**本プロジェクトでの用途**: 全UIコンポーネントのベース。テーマカスタマイズは `src/styles/theme.ts`

**バージョン**: ^2.8.2

---

### Framer Motion

**定義**: React 向けアニメーションライブラリ。`AnimatePresence` / `motion.div` で宣言的にアニメーションを記述。

**本プロジェクトでの用途**: `SmoothCollapse` コンポーネントによるパネルの開閉アニメーション（Chakra UI の `Collapse` 代替）

**バージョン**: ^12.7.3

---

### n8n

**定義**: ローカル自己ホスト型のワークフロー自動化ツール。

**本プロジェクトでの用途**: Flow Music API による楽曲生成 → YouTube アップロード → Supabase への書き込みを自動化するパイプライン。サイト本体ではなく作者のローカル環境で動作。

---

### Vitest

**定義**: Vite ベースの高速テストフレームワーク。Jest 互換の API を持つ。

**本プロジェクトでの用途**: utils・hooks のユニットテスト、コンポーネントテスト（@testing-library/react と組み合わせ）

**実行コマンド**: `yarn test`（coverage付き）

---

### Storybook

**定義**: UIコンポーネントを独立して開発・文書化するためのツール。

**本プロジェクトでの用途**: コンポーネントの状態バリエーションをカタログとして管理。`yarn storybook` で起動（localhost:6006）

---

## 略語・頭字語

### BPM

**正式名称**: Beats Per Minute（ビート毎分）

**意味**: 音楽のテンポを表す単位。1分間に何拍あるかを示す。

**本プロジェクトでの使用**: ChordRunner のテンポ設定。範囲: 40〜200。

---

### PRD

**正式名称**: Product Requirements Document（プロダクト要求定義書）

**意味**: 機能要件・非機能要件・KPI等を定義したドキュメント。

**本プロジェクトでの使用**: `docs/product-requirements.md`

---

### ISR

**正式名称**: Incremental Static Regeneration

→ [技術用語: ISR](#isrincremental-static-regeneration) を参照

---

### SSG

**正式名称**: Static Site Generation

→ [技術用語: SSG](#ssgestatic-site-generation) を参照

---

### ES

**正式名称**: エントリーシート

**意味**: 就職活動で企業に提出する自己紹介・志望動機等の書類。

**本プロジェクトでの使用**: es-counter ツールの対象ドキュメント種別。

---

## アーキテクチャ用語

### features/ アーキテクチャ

**定義**: 機能単位（feature）ごとにコンポーネント・hooks・utils・型を同梱するディレクトリ設計パターン。

**本プロジェクトでの適用**: `src/features/gallery/tool/es-counter/` のように機能ごとにサブディレクトリを作成し、機能間の依存を最小化する。

**関連コンポーネント**: `src/features/`, `src/components/`（共通UIのみ）

---

### SmoothCollapse

**定義**: `AnimatePresence` + `motion.div` で実装したカスタム折りたたみコンポーネント。

**本プロジェクトでの適用**: Chakra UI の `Collapse` を置き換え。DOM ノードを完全に削除することで、`display: none` の遅延による表示アニメーションの歪みを回避。

**実装箇所**: `src/features/gallery/tool/es-counter/components/SmoothCollapse.tsx`

---

## ステータス・状態

### MusicPrompt ステータス

| ステータス | 意味 | 設定タイミング | 次の状態 |
|----------|------|-------------|---------|
| `pending` | 楽曲生成待ち | n8n がレコード作成時 | `completed` |
| `completed` | 公開可能・YouTube URL あり | n8n が YouTube アップロード完了後に更新 | — |

flowmusic ページは `status = 'completed'` のレコードのみ取得・表示する。

---

### ChordRunner 練習セッション状態

| 状態 | 説明 | 遷移条件 |
|------|------|---------|
| 初期状態 | コード未設定・停止中 | ページ表示時 |
| 進行構築中 | コード進行を編集中 | コードをクリック |
| 再生中 | BPMタイマー動作・コード自動遷移 | 再生ボタン（1コード以上設定時） |
| 停止中 | タイマー停止・編集可能 | 停止ボタン |

---

## データモデル用語

### Panel

**定義**: ES文字数カウンターの1つの入力エリア（テキスト + 文字数設定のセット）。

**主要フィールド**:
- `id`: `string` — nanoid で生成する一意識別子
- `text`: `string` — 入力テキスト
- `maxLength`: `number` — 文字数上限
- `isPreviewVisible`: `boolean` — プレビュー表示フラグ
- `settings`: `CountSettings` — 文字カウント設定

**永続化**: `sessionStorage`（タブ内保持・タブ閉じでリセット）

---

### ChordDefinition

**定義**: ギターコード1種類の完全な定義データ。

**主要フィールド**:
- `name`: `string` — コード名（"C", "Am", "F" 等）
- `positions`: `FretPosition[]` — 弦ごとの押さえ位置
- `audioNote`: `string` — Tone.js Sampler に渡すルートノート（"C3" 等）

**実装箇所**: `src/features/gallery/tool/chord-runner/utils/chordData.ts`

---

### FretPosition

**定義**: ギター指板上の1箇所の押さえ位置を表すデータ。

**主要フィールド**:
- `string`: `1 | 2 | 3 | 4 | 5 | 6` — 弦番号（1=高音弦、6=低音弦）
- `fret`: `number` — フレット番号（0=開放弦、-1=ミュート）
- `finger?`: `1 | 2 | 3 | 4` — 使用指（省略可）

---

### MusicPrompt

**定義**: flowmusic の1曲分のデータ。Supabase `music_prompts` テーブルの行に対応。

**主要フィールド**:
- `id`: `string` — UUID (Primary Key)
- `prompt_text`: `string` — 楽曲生成に使ったプロンプト
- `status`: `'pending' | 'completed'` — 公開可否
- `youtube_main_url`: `string | null` — MV の YouTube URL
- `youtube_short_url`: `string | null` — ショート動画の YouTube URL
- `created_at`: `string` — ISO 8601 形式の生成日時

---

## アルゴリズム用語

### resolveOverlap（重複判定アルゴリズム）

**定義**: 現在コードと次コードの押さえ位置を比較し、各ゴーストドットのスタイル（透過 or 枠線のみ）を決定する関数。

**計算ロジック**:
- 同弦・同フレットが一致 → `'ghost-outline'`（枠線のみ）
- 一致なし → `'ghost-filled'`（透過ドット）

**実装箇所**: `src/features/gallery/tool/chord-runner/utils/fretboardUtils.ts`

---

### BPMタイマー（Tone.js Transport）

**定義**: Tone.js の `Transport.scheduleRepeat` を使い、BPM・拍数に従って正確にコードインデックスを進めるタイミング制御機構。

**動作**: `"4n"`（4分音符）ごとにコールバックを実行。`beatsPerChord` 拍ごとに `currentIndex` をインクリメント。

**実装箇所**: `src/features/gallery/tool/chord-runner/hooks/useAudioPlayer.ts`
