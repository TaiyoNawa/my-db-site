# 設計書

## アーキテクチャ概要

es-counter と同じ「features/ に実装・pages/ は薄く」のパターンを踏襲する。
状態管理はカスタムフック + sessionStorage 永続化（外部状態管理ライブラリは使わない）。

```
pages/gallery/tool/talk-maker/index.tsx   ← ページ（メタ情報 + レイアウトのみ）
        │
        ▼
features/gallery/tool/talk-maker/
  hooks/useTalkMakerStore.ts   ← 状態管理 + sessionStorage 永続化
  components/
    TalkPreview.tsx            ← スマホ風フレーム + ヘッダー + バブルリスト（＝編集画面）
    MessageBubble.tsx          ← 吹き出し1つ（タップで編集ポップオーバー）
    MessageComposer.tsx        ← 下部のチャット風入力バー
    TalkSettingsForm.tsx       ← 相手の名前/アイコン/テーマ/表示設定
  utils/
    presets.ts                 ← 背景テーマ定義・絵文字アイコン候補・デフォルト値
    exportImage.ts             ← html-to-image による PNG 出力
    time.ts                    ← 時刻文字列のユーティリティ
  types/index.ts               ← TalkMessage / TalkSettings 型
```

## コンポーネント設計

### 1. useTalkMakerStore（hooks）

**責務**:
- `messages: TalkMessage[]` と `settings: TalkSettings` の管理
- 追加/更新/削除/全消去の操作を提供
- sessionStorage への自動保存・復元（SSR回避のため useEffect で初期化）

**実装の要点**:
- es-counter の `useEsCounterStore` と同じ構造（`initialized` フラグ、`loadFromStorage`/`saveToStorage`）
- ID生成は `nanoid`（既存依存）

### 2. TalkPreview（WYSIWYG プレビュー）

**責務**:
- スマホ実機風フレーム（最大幅 ~380px、角丸、影）の描画
- チャットヘッダー（戻る矢印・相手アイコン+名前・通話/メニューアイコン）
- メッセージリストの描画（連続する同一送信者はアイコン省略）
- PNG出力対象の DOM ルート（ref を受け取る）

**実装の要点**:
- アイコン類は react-icons で描画（画像を使わない → PNG出力時のCORS問題を回避）
- 背景色はテーマ preset から適用
- Framer Motion のアニメーションは出力対象の外側（新規バブルのマウント時のみ）に留め、静止状態で完全な見た目になるようにする

### 3. MessageBubble

**責務**:
- 吹き出し1つの描画（自分=右・緑 / 相手=左・白、テール付き）
- 時刻・既読ラベルの表示（設定でON/OFF）
- タップで Chakra の Popover を開き、本文編集・時刻編集・送信者切替・削除を提供

**実装の要点**:
- テール（吹き出しのしっぽ）は CSS の擬似要素相当を Box の `_before` で実装
- 長文の折り返し（`whiteSpace: pre-wrap`, `wordBreak: break-word`）
- 編集ポップオーバー内の操作は props のコールバック経由（状態を持たない）

### 4. MessageComposer

**責務**:
- チャットアプリ風の入力バー（送信者トグル + テキスト入力 + 送信ボタン）
- Enter で送信（Shift+Enter で改行）、送信後も送信者選択を維持

**実装の要点**:
- IME変換中の Enter（`isComposing`）では送信しない（日本語入力での誤送信防止）
- 送信者トグルは「自分/相手」の見た目が直感的に分かるセグメント風UI

### 5. TalkSettingsForm

**責務**:
- 相手の名前（テキスト）・アイコン（絵文字候補から選択 or 自由入力）
- 背景テーマの切替（カラースウォッチ）
- 時刻表示・既読表示のスイッチ

### 6. exportImage（utils）

**責務**:
- `html-to-image` の `toPng` でプレビュー DOM を PNG 化し、ダウンロードさせる

**実装の要点**:
- `pixelRatio: 2` で高解像度出力
- ファイル名は `talk-maker-[タイムスタンプ].png`
- 失敗時は呼び出し側でトースト表示できるよう例外を投げる

## データフロー

### メッセージ追加
```
1. MessageComposer で送信者を選び本文を入力し送信
2. useTalkMakerStore.addMessage(sender, text) が TalkMessage を生成（時刻は現在時刻）
3. messages 更新 → sessionStorage 保存 → TalkPreview が再描画
```

### メッセージ編集
```
1. TalkPreview 内の MessageBubble をタップ → Popover 表示
2. 本文/時刻/送信者を変更 or 削除 → store のコールバック実行
3. messages 更新 → プレビューに即時反映
```

### PNG出力
```
1. 「画像を保存」ボタン押下
2. exportImage(previewRef.current) → toPng → aタグでダウンロード
3. 失敗時: Chakra の useToast で日本語エラーメッセージ表示
```

## エラーハンドリング戦略

### カスタムエラークラス

不要（外部API・非同期I/Oが PNG 出力のみのため）。

### エラーハンドリングパターン

- sessionStorage の読み書きは try-catch で握りつぶし、デフォルト値にフォールバック（es-counter と同様）
- PNG 出力失敗時は「画像の保存に失敗しました。時間をおいて再度お試しください。」をトースト表示

## テスト戦略

### ユニットテスト
- `utils/time.ts`: 時刻文字列の生成・正規化
- `hooks/useTalkMakerStore.ts`: 追加/更新/削除/全消去/永続化（renderHook）
- `components/MessageBubble.tsx`: 送信者による配置・既読/時刻の表示切替（render）

### 統合テスト
- ページレベルの結合は Storybook（TalkPreview / MessageBubble）で目視確認に留める

## 依存ライブラリ

```json
{
  "dependencies": {
    "html-to-image": "^1.11.11"
  }
}
```

- 依存ゼロ・軽量で、DOM → PNG のデファクト。canvas 手描きは実装コストが高く見た目の同期も崩れやすいため不採用

## ディレクトリ構造

```
src/
  features/gallery/tool/talk-maker/
    components/
      TalkPreview.tsx
      MessageBubble.tsx
      MessageBubble.stories.tsx
      MessageComposer.tsx
      TalkSettingsForm.tsx
      __tests__/MessageBubble.test.tsx
    hooks/
      useTalkMakerStore.ts
      __tests__/useTalkMakerStore.test.ts
    utils/
      presets.ts
      exportImage.ts
      time.ts
      __tests__/time.test.ts
    types/
      index.ts
  pages/gallery/tool/talk-maker/index.tsx
  pages/gallery/tool/index.tsx   ← items 配列にエントリ追加
```

## 実装の順序

1. 依存追加（html-to-image）+ 型定義 + presets
2. time ユーティリティ + テスト
3. useTalkMakerStore + テスト
4. MessageBubble → TalkPreview → MessageComposer → TalkSettingsForm
5. exportImage + ページ統合 + ツール一覧への追加
6. Storybook・テスト整備 → 品質チェック（test/lint/build）

## セキュリティ考慮事項

- ユーザー入力は React が自動エスケープするため XSS リスクは低い（dangerouslySetInnerHTML を使わない）
- 外部画像を扱わない（絵文字のみ）ため、PNG出力時の CORS/tainted canvas 問題を回避

## パフォーマンス考慮事項

- メッセージ数は実用上数十件程度。メモ化は MessageBubble の React.memo のみで十分
- html-to-image はエクスポート時のみ dynamic import し、初期バンドルに含めない

## 将来の拡張性

- `TalkSettings` にフィールド追加で拡張できる設計（アイコン画像アップロード、グループトーク、スタンプ）
- テーマは presets.ts の配列追加だけで増やせる
