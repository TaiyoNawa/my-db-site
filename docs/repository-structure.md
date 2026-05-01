# リポジトリ構造定義書 (Repository Structure Document)

## プロジェクト全体構造

```
my-db-site/                       # プロジェクトルート
├── src/                          # アプリケーションソースコード
│   ├── pages/                    # Next.js Pages Router（ルーティング・データフェッチ）
│   ├── features/                 # 機能単位モジュール（メイン実装の場所）
│   ├── components/               # 複数機能をまたぐ共通UIコンポーネント
│   ├── hooks/                    # 共通カスタムフック
│   ├── lib/                      # 外部サービス連携（Notion・メール）
│   ├── utils/                    # 汎用ユーティリティ関数
│   ├── assets/                   # 静的データ・型定義（テキストアセット）
│   ├── styles/                   # グローバルCSS・Chakraテーマ設定
│   ├── stories/                  # Storybookデフォルトサンプル（参照用）
│   └── test/                     # テストユーティリティ（renderWrapper等）
├── public/                       # 静的ファイル（画像・favicon等）
├── docs/                         # プロジェクトドキュメント（6つの永続ドキュメント）
│   └── ideas/                    # 機能アイデアメモ（実装前の下書き）
├── .steering/                    # スペック駆動開発用の作業単位タスクリスト
├── .claude/                      # Claude Code設定・スキル定義
│   ├── commands/                 # スラッシュコマンド
│   ├── skills/                   # タスクモード別スキル
│   └── agents/                   # サブエージェント定義
├── CLAUDE.md                     # Claude Code向けプロジェクト仕様
├── next.config.mjs               # Next.js設定
├── tsconfig.json                 # TypeScript設定
├── vitest.config.ts              # Vitest設定
├── setupTests.ts                 # テストセットアップ
├── package.json                  # 依存関係・スクリプト定義
└── yarn.lock                     # ロックファイル
```

---

## src/ 詳細

### pages/ — ルーティング・データフェッチ層

**役割**: URLマッピング・`getStaticProps`/`getServerSideProps` によるデータ取得・API Routes

**配置ルール**:
- ビジネスロジック・UI状態管理を書かない（features/ へ委譲）
- features/ のコンポーネントを呼び出すだけ
- API Routes は `pages/api/` 配下に集約

```
src/pages/
├── _app.tsx                       # Chakra UIプロバイダー・レイアウト共通設定
├── _document.tsx                  # HTMLドキュメント設定
├── index.tsx                      # トップページ
├── 404.tsx / 500.tsx              # エラーページ
├── article/
│   ├── index.tsx                  # 記事一覧（SSG + ISR）
│   └── [id].tsx                   # 記事詳細（SSG）
├── gallery/
│   ├── index.tsx                  # ギャラリートップ
│   ├── tool/
│   │   ├── index.tsx              # ツール一覧（ここに items 配列がある）
│   │   ├── es-counter/index.tsx   # ES文字数カウンターページ
│   │   ├── poll/                  # アンケートツール（複数ページ）
│   │   └── chord-runner/index.tsx # ChordRunner（追加予定）
│   ├── prompt/
│   │   └── flow-music/index.tsx   # flowmusic（ISR、追加予定）
│   ├── game/                      # ゲーム系ページ
│   ├── manga/index.tsx            # 漫画スタック
│   └── link/index.tsx             # リンク集
├── contact/                       # 問い合わせフォーム
├── search/                        # 検索ページ群
└── api/                           # API Routes
    ├── contact.ts                 # 問い合わせメール送信
    ├── notion/                    # Notion API中継
    ├── poll/                      # アンケートCRUD
    ├── spotify/                   # Spotify API中継
    └── image/                     # 画像検索
```

---

### features/ — ドメインロジック層（メイン実装）

**役割**: 機能単位でコンポーネント・hooks・utils・型を同梱。ここに本体実装を書く。

**命名規則**: `features/[ドメイン]/[サブドメイン]/[機能名]/`

```
src/features/
├── article/                       # 記事機能
│   ├── components/
│   │   ├── list/                  # 記事一覧コンポーネント
│   │   └── id/                   # 記事詳細コンポーネント
│   ├── hooks/                     # 記事関連フック
│   └── contexts/                  # Reactコンテキスト
│
├── gallery/                       # ギャラリー機能
│   ├── components/                # ギャラリー共通コンポーネント
│   ├── tool/                      # ツール系機能
│   │   ├── es-counter/            # ES文字数カウンター（実装済み）
│   │   │   ├── components/        # UIコンポーネント + __tests__/ + *.stories.tsx
│   │   │   ├── hooks/             # useEsCounterStore.ts
│   │   │   ├── utils/             # countChars.ts + presets.ts + __tests__/
│   │   │   └── types/             # index.ts (Panel, CountSettings等)
│   │   ├── poll/                  # アンケートツール（実装済み）
│   │   └── chord-runner/          # ChordRunner（追加予定）
│   │       ├── components/        # ChordBuilder, Fretboard, FretDot, BpmControl, PlaybackControls
│   │       ├── hooks/             # usePracticeSession.ts, useAudioPlayer.ts
│   │       ├── utils/             # chordData.ts, fretboardUtils.ts
│   │       └── types/             # index.ts (ChordDefinition, PracticeSession等)
│   ├── prompt/                    # AIプロンプト集機能
│   │   └── flow-music/            # flowmusic（追加予定）
│   │       ├── components/        # MusicCard.tsx, MusicList.tsx
│   │       └── types/             # index.ts (MusicPrompt等)
│   ├── game/                      # ゲーム系機能
│   │   ├── neko-punch/
│   │   └── right-left-game/
│   └── manga/                     # 漫画スタック
│
└── search/                        # 検索機能
    └── music/                     # 音楽検索（Spotify）
```

**配置ルール**:
- テストファイルは `components/__tests__/` または `utils/__tests__/` に置く
- Storybookファイル（`*.stories.tsx`）は対象コンポーネントと同階層に置く
- feature をまたぐ依存は禁止（必要なら `components/` または `utils/` へ昇格）

---

### components/ — 共通UIコンポーネント層

**役割**: 特定機能に依存しない汎用UIコンポーネント。複数の features から参照される。

```
src/components/
├── Layout.tsx                     # ページレイアウト（Header + Footer + main）
├── button/                        # 汎用ボタン群
├── card/                          # 汎用カード群（HomeCard, LinkCard等）
├── header/                        # Header, SecondHeader
├── footer/                        # Footer
├── meta/                          # SEOメタタグ（ArticleMeta, GalleryMeta等）
├── contact/                       # 問い合わせフォームコンポーネント
└── __tests__/                     # 共通コンポーネントテスト
```

**命名規則**: PascalCase（例: `BackButton.tsx`, `HomeCard.tsx`）

---

### lib/ — 外部API連携層

**役割**: サーバーサイド専用の外部サービス通信。クライアントバンドルに含まれない。

```
src/lib/
├── notion/
│   ├── fetchNotionDBItems.ts      # データベース一覧取得
│   └── fetchNotionPageContent.ts  # ページコンテンツ取得
├── contact/
│   ├── email.ts                   # nodemailer によるメール送信
│   ├── notion.ts                  # お問い合わせ内容のNotion記録
│   └── validation.ts              # サーバーサイドバリデーション
└── supabase/
    └── client.ts                  # Supabase クライアント初期化（追加予定）
```

**配置ルール**: `NEXT_PUBLIC_` 不使用 = クライアントに露出しない。`getStaticProps` または API Routes からのみ呼ぶ。

---

### hooks/ — 共通カスタムフック

**役割**: 複数の features で使われる汎用フック。

```
src/hooks/
├── useStickyHeader.ts             # ヘッダーのスクロール追従
└── limitedLengthText.ts           # テキスト長制限ユーティリティ
```

---

### utils/ — 汎用ユーティリティ

**役割**: 純粋関数。UIに依存しない汎用ロジック。

```
src/utils/
├── generateURL.ts                 # URL生成ヘルパー
├── extractImageKey.ts             # 画像キー抽出
├── getExpirationFromUrl.ts        # URL有効期限取得
├── getSpotifyToken.ts             # Spotifyトークン取得
└── __tests__/
    └── generateURL.test.ts
```

---

### assets/ — 静的データ・型定義

**役割**: 変更頻度が低い静的データ（ナビゲーション項目・漫画リスト等）と型定義。

```
src/assets/
├── data/
│   ├── HeaderAssets.ts            # ナビゲーション項目
│   ├── MangaItems.ts              # 漫画一覧データ
│   ├── SectionWrapperAssets.ts    # セクション設定
│   └── index.ts
└── type/
    └── SpotifyTypes.ts            # Spotify API レスポンス型
```

---

### styles/ — スタイル定義

```
src/styles/
├── globals.css                    # グローバルスタイル
├── theme.ts                       # Chakra UI カスタムテーマ
└── masonry/, reactbits/           # CSS Modules（特定コンポーネント用）
```

---

## ファイル配置規則

### ソースファイル

| ファイル種別 | 配置先 | 命名規則 | 例 |
|------------|--------|---------|-----|
| Reactコンポーネント | `features/**/components/` or `components/` | PascalCase.tsx | `EsCounterPanel.tsx` |
| カスタムフック | `features/**/hooks/` or `hooks/` | camelCase（use-prefix） | `useEsCounterStore.ts` |
| ユーティリティ関数 | `features/**/utils/` or `utils/` | camelCase | `countChars.ts` |
| 型定義 | `features/**/types/index.ts` or `assets/type/` | index.ts (feature内) / PascalCase (共通) | `index.ts`, `SpotifyTypes.ts` |
| ページ | `pages/` | index.tsx または [slug].tsx | `pages/gallery/tool/es-counter/index.tsx` |
| API Route | `pages/api/` | camelCase or [slug].ts | `contact.ts`, `[pollUid].ts` |

### テストファイル

| テスト種別 | 配置先 | 命名規則 | 例 |
|-----------|--------|---------|-----|
| コンポーネントテスト | `[コンポーネントと同階層の]__tests__/` | PascalCase.test.tsx | `EsCounterPanel.test.tsx` |
| utilsテスト | `utils/__tests__/` | camelCase.test.ts | `countChars.test.ts` |
| 共通コンポーネントテスト | `components/__tests__/` or `components/[サブ]/__tests__/` | PascalCase.test.tsx | `BaseBox.test.tsx` |

### Storybookファイル

Storybookファイルはテスト対象コンポーネントと**同階層**に置く（一部 `stories/` サブディレクトリに置くパターンも混在）。

| 種別 | 命名規則 | 例 |
|------|---------|-----|
| コンポーネントストーリー | PascalCase.stories.tsx | `EsCounterPanel.stories.tsx` |

---

## 命名規則まとめ

| 対象 | 規則 | 例 |
|------|------|-----|
| Reactコンポーネントファイル | PascalCase | `ChordBuilder.tsx` |
| フックファイル | camelCase（usePrefix必須） | `usePracticeSession.ts` |
| ユーティリティファイル | camelCase | `fretboardUtils.ts` |
| 型定義ファイル | `index.ts`（feature内）| `types/index.ts` |
| ページファイル | `index.tsx` or `[slug].tsx` | `[id].tsx` |
| ディレクトリ名 | kebab-case | `es-counter/`, `chord-runner/` |
| CSSモジュール | PascalCase.module.css | `Stack.module.css` |

---

## 依存関係ルール

```
pages/
  ↓ OK（features/コンポーネントを呼ぶ）
features/[任意のfeature]/
  ↓ OK（共通層を使う）
components/ / hooks/ / utils/ / lib/
  ↓ OK（外部API呼び出し）
外部サービス（Notion API / Supabase）
```

**禁止される依存**:
- `features/A/` → `features/B/` への直接 import（共通層へ昇格させる）
- `lib/` のサーバーサイドモジュールをクライアントコンポーネントから直接 import
- `pages/` にUIロジック・useState を書く

---

## 新規ツール追加手順

ツール `foo-tool` を追加する場合の標準手順:

```
1. src/features/gallery/tool/foo-tool/ を作成
   ├── components/   ← Reactコンポーネント + __tests__/ + *.stories.tsx
   ├── hooks/        ← カスタムフック
   ├── utils/        ← 純粋関数 + __tests__/
   └── types/        ← 型定義 (index.ts)

2. src/pages/gallery/tool/foo-tool/index.tsx を作成
   ← features/foo-tool のコンポーネントを呼ぶだけ

3. src/pages/gallery/tool/index.tsx の items 配列にエントリを追加
```

---

## docs/ — プロジェクトドキュメント

```
docs/
├── product-requirements.md        # PRD（プロダクト要求定義書）
├── functional-design.md           # 機能設計書
├── architecture.md                # アーキテクチャ設計書
├── repository-structure.md        # リポジトリ構造定義書（本ドキュメント）
├── development-guidelines.md      # 開発ガイドライン
├── glossary.md                    # 用語集
└── ideas/                         # 機能アイデアメモ（PRD作成前の下書き）
    ├── ChordRunner.md
    └── flowmusic.md
```

---

## .steering/ — スペック駆動開発の作業ログ

```
.steering/
└── [YYYYMMDD]-[機能名]/
    ├── requirements.md            # 今回の作業要求
    ├── design.md                  # 変更内容の設計
    └── tasklist.md                # タスクリスト
```

**命名例**: `.steering/20260501-chord-runner/`

---

## 除外設定（.gitignore）

以下はGit管理外:
- `node_modules/`
- `.next/` （ビルド成果物）
- `.env.local`（APIキー類）
- `coverage/`（テストカバレッジレポート）
- `.DS_Store`
