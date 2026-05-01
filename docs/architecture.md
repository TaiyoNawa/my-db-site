# 技術仕様書 (Architecture Design Document)

## テクノロジースタック

### 言語・ランタイム

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Node.js | v20.x (LTS) | Vercel実行環境 |
| TypeScript | ^5.x | 型安全な開発・コンパイル時バグ検出 |
| React | ^18.x | UIレンダリング |

### フレームワーク・ライブラリ（本番依存）

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| Next.js | 14.2.4 | Webフレームワーク | Pages Router・SSG/ISR・API Routes を既存構成として採用 |
| Chakra UI | ^2.8.2 | UIコンポーネント | アクセシビリティ標準準拠・Emotion統合・既存構成 |
| Framer Motion | ^12.7.3 | アニメーション | Chakra UI との統合・宣言的アニメーションAPI |
| @notionhq/client | ^2.3.0 | Notion APIクライアント | 公式SDKによる型安全なAPI呼び出し |
| notion-to-md | ^3.1.8 | Notion→Markdown変換 | 記事コンテンツのMarkdownレンダリング用 |
| swr | ^2.3.4 | クライアントサイドフェッチ | キャッシュ・再検証戦略の簡易実装 |
| react-hook-form | ^7.72.1 | フォーム管理 | 問い合わせフォームのバリデーション |
| zod | ^4.3.6 | スキーマバリデーション | APIルートの入力検証 |
| nanoid | ^5.1.5 | ID生成 | パネルIDなどの一意識別子 |
| @dnd-kit/* | core^6, sortable^10 | ドラッグ&ドロップ | コード進行ビルダーの並べ替えUI |
| next-seo | ^6.7.1 | SEOメタタグ管理 | OGP・title・description の一元管理 |

### 開発ツール

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| Vitest | ^2.1.4 | ユニット・コンポーネントテスト | Viteベースで高速・@testing-library/react統合 |
| @testing-library/react | latest | コンポーネントテスト | ユーザー視点のテスト記述 |
| Storybook | ^8.6.12 | コンポーネントカタログ | UIの仕様文書化・visual regression |
| ESLint | ^8.x | 静的解析 | @typescript-eslint + next lint構成 |
| yarn | ^1.22.22 | パッケージ管理 | 既存構成 |

### 外部サービス

| サービス | 用途 | 認証方式 |
|---------|------|---------|
| Vercel | ホスティング・CDN・自動デプロイ | GitHub連携 |
| Notion API | 記事データソース | Integration Token（サーバーサイドのみ） |
| Supabase Cloud | flowmusic データホスティング | anon key（サーバーサイドのみ、ISR） |
| gleitz/midi-js-soundfonts | ギターサンプル音源CDN | 認証不要（パブリックCDN） |

---

## アーキテクチャパターン

### Next.js Pages Router レイヤー構造

```
┌───────────────────────────────────────────────┐
│  pages/  ルーティング・データフェッチ層          │
│  - getStaticProps / getServerSideProps         │
│  - APIルート (/api/*)                          │
├───────────────────────────────────────────────┤
│  features/  ドメインロジック層                  │
│  - components/  UI コンポーネント               │
│  - hooks/       状態管理・副作用                │
│  - utils/       純粋関数・計算ロジック           │
│  - types/       型定義                         │
├───────────────────────────────────────────────┤
│  components/  共通UIコンポーネント層             │
│  hooks/       共通フック層                      │
│  lib/         外部API連携層（Notion・メール）    │
│  utils/       汎用ユーティリティ層               │
└───────────────────────────────────────────────┘
```

#### pages/ 層の責務
- **担当**: URL→コンポーネントのマッピング、`getStaticProps` / ISR によるデータ取得
- **許可**: features/ コンポーネントを呼び出す、lib/ を呼び出す
- **禁止**: UIロジック・状態管理をここに書く（features/ へ委譲）

#### features/ 層の責務
- **担当**: 機能単位のコンポーネント・hooks・utils を同梱
- **許可**: 同一 feature 内の参照、共通 components/hooks/utils の呼び出し
- **禁止**: 別 feature への直接依存（必要なら共通層へ昇格）

#### lib/ 層の責務
- **担当**: 外部API（Notion、メール送信）との通信
- **許可**: サーバーサイド専用処理（クライアントバンドル非対象）
- **禁止**: クライアントコンポーネントからの直接呼び出し（API Routesを経由）

### データフロー

```
[SSG/ISR ページ]
  getStaticProps ──→ lib/notion ──→ Notion API
  getStaticProps ──→ lib/supabase ──→ Supabase Cloud
         ↓
  props として React コンポーネントへ渡す

[クライアント操作]
  features/hooks ──→ /api/* ──→ 外部サービス
  features/hooks ──→ sessionStorage（es-counter 状態保持）

[ChordRunner（クライアント専用）]
  features/hooks/usePracticeSession ──→ Tone.js Transport
  features/hooks/useAudioPlayer ──→ gleitz CDN（音源）
```

---

## データ永続化戦略

### ストレージ方式

| データ種別 | ストレージ | フォーマット | 備考 |
|-----------|----------|-------------|------|
| 記事データ | Notion API | Notion Block | ISR (revalidate: 60) でキャッシュ |
| flowmusic データ | Supabase Cloud | PostgreSQL | ISR (revalidate: 3600) でキャッシュ |
| ES文字数カウンター状態 | sessionStorage | JSON | タブ内で保持・タブ閉じでリセット |
| アンケート回答 | Supabase Cloud | PostgreSQL | SWRでクライアントフェッチ |
| 問い合わせデータ | nodemailer (メール) | - | 保存なし・転送のみ |

### バックアップ戦略

- Notion・Supabase ともにクラウドサービス側でバックアップを担保
- ローカルバックアップは不要（Vercel の SSG キャッシュがフォールバックとして機能）
- `.env.local` は手動でパスワードマネージャーに保管

---

## デプロイメントアーキテクチャ

```
GitHub main ブランチへのマージ
        ↓
Vercel 自動ビルド (yarn build)
  - ESLint Error ゼロ が必須条件
  - 型エラーゼロ が必須条件
        ↓
Vercel CDN にデプロイ
  - SSG ページ: Edge にキャッシュ
  - ISR ページ: revalidate 秒数でバックグラウンド再生成
  - API Routes: Serverless Function として実行
```

### 環境変数管理

| 変数名 | 用途 | 露出範囲 |
|--------|------|---------|
| `NOTION_API_KEY` | Notion API 認証 | サーバーサイドのみ |
| `NOTION_DATABASE_ID` | 記事DB ID | サーバーサイドのみ |
| `SUPABASE_URL` | Supabase エンドポイント | サーバーサイドのみ |
| `SUPABASE_ANON_KEY` | Supabase 公開キー | サーバーサイドのみ（ISR） |
| `CONTACT_EMAIL` | メール送信先 | サーバーサイドのみ |

`NEXT_PUBLIC_` プレフィックスを使用しない = クライアントバンドルに含まれない。

---

## パフォーマンス要件

### レスポンスタイム

| 操作 | 目標時間 | 実現方法 |
|------|---------|---------|
| 記事一覧ページ初期表示（LCP） | 2.5秒以内 | SSG + Vercel CDN |
| ギャラリートップ初期表示（LCP） | 2.5秒以内 | SSG + 画像最適化 |
| ChordRunner 操作レスポンス | 100ms以内 | クライアント状態のみ・API呼び出しなし |
| flowmusic ページ初期表示 | 2.5秒以内 | ISR キャッシュ |

### リソース使用量

| リソース | 上限 | 理由 |
|---------|------|------|
| Notion API 呼び出し | ISR 間隔 60秒以上 | レート制限（3 req/sec）回避 |
| Supabase API 呼び出し | ISR 間隔 3600秒 | 無料枠の月次制限内に収める |

---

## セキュリティアーキテクチャ

### APIキー保護

```
.env.local（Gitignore 済み）
  ↓
Next.js サーバーサイド（getStaticProps / API Routes）のみで参照
  ↓
クライアントバンドルには含まれない（NEXT_PUBLIC_ 使用禁止）
```

### 入力検証

- **問い合わせフォーム**: クライアント側 react-hook-form + サーバー側 zod によるダブルバリデーション
- **BPM入力**: フロントエンドで 40〜200 にクランプ（外部送信なし）
- **Supabase 書き込み**: n8n（ローカル）からのみ。公開側はリードオンリー

### XSS 対策

- Notion 記事コンテンツ: `react-markdown` + `rehype-highlight` でレンダリング（dangerouslySetInnerHTML 不使用）
- ユーザー入力の直接的な innerHTML 挿入なし

---

## スケーラビリティ設計

### コンテンツ増加への対応

- **記事**: Notion の記事数増加は ISR + ページネーションで対応（既実装）
- **flowmusic**: 楽曲増加は ISR で対応。レコード数 100件程度まで1ページ表示、超過時はページネーション追加
- **ツール追加**: `src/features/gallery/tool/` へ独立モジュールを追加するだけ（既存機能への影響ゼロ）

### 機能拡張性

- 新しいギャラリーツールは `features/gallery/tool/[name]/` に追加
- `pages/gallery/tool/index.tsx` の `items` 配列にエントリを1行追加するだけで導線が生成される
- Supabase テーブル追加は `src/lib/supabase/` にクライアント関数を追加するだけ

---

## テスト戦略

### ユニットテスト（Vitest）

- **対象**: `features/**/utils/`・`utils/`・`features/**/hooks/`
- **カバレッジ目標**: utils/hooks 層 80% 以上
- **実行**: `yarn test`（coverage付き）

### コンポーネントテスト（@testing-library/react）

- **対象**: インタラクションが複雑なコンポーネント（ChordBuilder, Fretboard, BpmControl, EsCounterPanel）
- **方針**: ユーザー操作を模倣する（click, type）。実装詳細のテスト禁止

### Storybook

- **対象**: 再利用性の高いコンポーネント・状態バリエーションが多いコンポーネント
- **用途**: デザイン確認・ビジュアル仕様の文書化

### CI（Vercel ビルド）

- `yarn build` = ESLint Error ゼロ + 型エラーゼロ の確認を兼ねる
- main ブランチへの PR マージ前に `yarn build` と `yarn lint` を手動確認

---

## 技術的制約

### 環境要件

- **ランタイム**: Vercel (Node.js 20.x LTS)
- **ブラウザサポート**: モダンブラウザ（Safari/Chrome/Firefox 最新2世代）
- **モバイル**: 375px〜 のレスポンシブ対応

### 既知の制約

| 制約 | 内容 | 対策 |
|------|------|------|
| Notion API レート制限 | 3 req/sec・月間制限あり | ISR で呼び出し頻度を最小化 |
| Supabase 無料枠 | 500MB DB・月2GB帯域 | ISRキャッシュで呼び出しを抑制 |
| Tone.js SSR 非対応 | `window` 依存のため SSR 不可 | `dynamic(() => import(...), { ssr: false })` でクライアント専用ロード |
| Vercel Hobby プラン | サーバーレス関数実行時間 10秒上限 | API Routes の重い処理は ISR に移行 |

---

## 依存関係管理方針

| ライブラリ種別 | バージョン管理 | 理由 |
|--------------|--------------|------|
| Next.js | ピン留め（14.2.4） | メジャーバージョン間で破壊的変更が多い |
| Chakra UI | キャレット（^2.8.2） | マイナーアップは後方互換 |
| Storybook | キャレット（^8.6.12） | devDependency・ビルドのみ影響 |
| @vitest/coverage-v8 | ピン留め（2.1.4） | vitestとのバージョン整合が必要 |

**アップグレード方針**: Vercel ビルドと `yarn test` が通ることを確認してからマージ。
