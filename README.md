This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

lib/notion.ts に Notionアクセスロジックをまとめる。
pages/api/??.ts では lib/??.ts を呼び出してAPIレスポンスとして整形する。
lib内のファイル名は関数名に合わせてOK。(例：getNotionDB.ts：小文字+キャメルケース)
api内のファイル名はクライアントから呼ぶURLにしたい名前で決めるのが分かりやすいです。(例：notion.ts：小文字単語(ハイフンなし))

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

`develop`ブランチで作業し、最終的に`main`ブランチにマージする

1. `develop`ブランチで作業：

   - 通常の開発作業は`develop`ブランチで行います。
   - コードの変更をコミットし、リモートリポジトリにプッシュします。

   ```bash
   # 変更をステージング
   git add .

   # 変更をコミット
   git commit -m "Your commit message"

   # developブランチにプッシュ
   git push origin develop
   ```

2. `main`ブランチへのマージ：

   - 開発が完了したら、`main`ブランチに変更をマージします。

   ```bash
   # mainブランチに切り替え
   git checkout main

   # developブランチの変更をmainブランチにマージ
   git merge develop

   # mainブランチにプッシュ
   git push origin main
   ```

これにより、`main`ブランチと`develop`ブランチを分けて運用し、最終的に`main`ブランチにマージするフローが確立されます。

---

## Claude Code によるAI支援開発

このプロジェクトはClaude Codeを使ったスペック駆動開発に対応しています。

### ディレクトリ構成

```
.claude/
  settings.json              # スキルの自動使用を許可する設定
  commands/
    add-feature.md           # /add-feature スラッシュコマンド
  skills/
    steering/                # タスク計画・進捗管理スキル
      SKILL.md
      templates/             # requirements / design / tasklist テンプレート
  agents/
    implementation-validator.md  # 実装品質を検証するサブエージェント
CLAUDE.md                    # プロジェクト固有のAI指示（常時読み込み）
docs/
  ideas/                     # 機能アイデアのメモ置き場
.steering/                   # 作業単位の計画・タスクリスト（自動生成）
```

### 開発フロー

```
1. docs/ideas/ にアイデアメモを書く（自由書き）

2. /add-feature [機能名] を実行
   ↓ 自動で以下を実行：
   - .steering/[日付]-[機能名]/ にタスクリストを生成
   - tasklist.md に従って実装を進める
   - implementation-validator で品質検証
   - yarn test / yarn lint / yarn build でチェック
   - tasklist.md に振り返りを記録
```

### スラッシュコマンド

| コマンド | 説明 |
|----------|------|
| `/add-feature [機能名]` | 新機能を計画から実装まで全自動で追加する |

### 設計原則

- `steering` スキルが `tasklist.md` の進捗を管理する（未完了タスクのスキップ禁止）
- `implementation-validator` サブエージェントが独立したコンテキストで品質検証を行う
- `yarn build` で型チェックとビルドを兼ねる（`typecheck` スクリプトは存在しない）
