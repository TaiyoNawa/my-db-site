# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

### タスクスキップが許可される唯一のケース
技術的理由（実装方針変更・アーキテクチャ変更・依存関係変更）のみ。
スキップ時は必ず理由を明記:
```markdown
- [x] ~~タスク名~~（実装方針変更により不要: 具体的な技術的理由）
```

---

## フェーズ1: 基盤（型・プリセット・ユーティリティ）

- [x] `html-to-image` を依存に追加（yarn add）
- [x] `types/index.ts` を作成（`Sender` / `TalkMessage` / `TalkSettings` / `BackgroundTheme`）
- [x] `utils/presets.ts` を作成（背景テーマ4種以上・絵文字アイコン候補・`DEFAULT_SETTINGS`）
- [x] `utils/time.ts` を作成（現在時刻の "HH:MM" 生成・入力値の正規化）
- [x] `utils/__tests__/time.test.ts` を作成

## フェーズ2: 状態管理

- [x] `hooks/useTalkMakerStore.ts` を作成
  - [x] messages / settings の状態と sessionStorage 永続化（es-counter パターン）
  - [x] addMessage / updateMessage / removeMessage / clearAll / updateSettings
- [x] `hooks/__tests__/useTalkMakerStore.test.ts` を作成（renderHook で主要操作を検証）

## フェーズ3: UIコンポーネント

- [x] `components/MessageBubble.tsx` を作成
  - [x] 自分=右・緑 / 相手=左・白のテール付き吹き出し
  - [x] 時刻・既読の表示切替
  - [x] タップで編集 Popover（本文・時刻・送信者切替・削除）
- [x] `components/TalkPreview.tsx` を作成
  - [x] スマホ実機風フレーム + チャットヘッダー（相手アイコン+名前）
  - [x] 連続する同一送信者のアイコン省略
  - [x] 空状態のガイド表示（メッセージ0件時）
- [x] `components/MessageComposer.tsx` を作成
  - [x] 送信者トグル + テキスト入力 + 送信ボタン
  - [x] Enter送信（IME変換中は送信しない・Shift+Enterで改行）
- [x] `components/TalkSettingsForm.tsx` を作成
  - [x] 相手の名前・絵文字アイコン選択
  - [x] 背景テーマスウォッチ・時刻/既読スイッチ
- [x] `components/__tests__/MessageBubble.test.tsx` を作成
- [x] `components/MessageBubble.stories.tsx` を作成

## フェーズ4: ページ統合

- [x] `utils/exportImage.ts` を作成（dynamic import + toPng + ダウンロード）
- [x] `pages/gallery/tool/talk-maker/index.tsx` を作成
  - [x] GalleryMeta / SecondHeader / SectionWrapper の既存パターンを踏襲
  - [x] プレビュー + 入力バー + 設定 + 「画像を保存」「全て消去」ボタンを配置
  - [x] エクスポート失敗時のトースト表示
- [x] `pages/gallery/tool/index.tsx` の items 配列に「トーク画面メーカー」を追加

## フェーズ5: 品質チェックと修正

- [x] すべてのテストが通ることを確認
  - [x] `yarn test`（228件パス）
- [x] リントエラーがないことを確認
  - [x] `yarn lint`（エラー・警告なし）
- [x] ビルド成功（型エラーの確認を兼ねる）
  - [x] `yarn build`（/gallery/tool/talk-maker 7.98kB）

## フェーズ5.5: implementation-validator 指摘対応

- [x] `TalkPreview.stories.tsx` を追加（複数メッセージ・テーマ違い・空状態）
- [x] `MessageBubble.test.tsx` に不正時刻入力のロールバックテストを追加
- [x] 編集ポップオーバーの既読スイッチを自分のメッセージのみ表示に修正
- [x] `MessageComposer` の複数行入力時に高さが追従するよう修正（行数連動・最大4行）
- [x] `exportImage` の失敗系テストを追加（toPng を mock で reject）
- [x] 修正後に `yarn test` / `yarn lint` を再実行（233テスト・lint・build 全て成功）

## フェーズ6: ドキュメント更新

- [x] 実装後の振り返り（このファイルの下部に記録）

---

## 実装後の振り返り

### 実装完了日
2026-07-09

### 計画と実績の差分

**計画と異なった点**:
- ほぼ計画通り。design.md の設計（features/ 構造・es-counter パターン踏襲・dynamic import）をそのまま実装できた
- MessageComposer の Textarea を固定1行で計画していたが、Shift+Enter の改行が見切れるため行数連動（最大4行）に変更した

**新たに必要になったタスク**（implementation-validator の指摘によるフェーズ5.5）:
- TalkPreview.stories.tsx の追加（design.md に記載していたが tasklist に落とし忘れていた）
- 時刻バリデーションのロールバック・既読スイッチの表示条件・exportImage 失敗系のテスト強化

### 学んだこと

**技術的な学び**:
- html-to-image は dynamic import にすることで初期バンドルへの影響を回避できる（ページサイズ 8.01kB に収まった）
- PNG エクスポート対象の DOM に内部スクロールを持たせない（全メッセージを描画する）ことで、キャプチャの見切れを構造的に防げる
- IME 変換確定の Enter は `e.nativeEvent.isComposing` で判定して誤送信を防ぐ
- Chakra の Popover は portal 描画のため、エクスポート対象 DOM に混入しない（WYSIWYG 編集とPNG出力を両立できる）

**プロセス上の改善点**:
- design.md に書いたテスト戦略の項目は tasklist に漏れなく転記すること（TalkPreview.stories.tsx の落とし忘れが発生）
- implementation-validator の指摘は具体的で有効だった。フェーズ5.5 として tasklist に追記してから対応するフローが機能した

### 次回への改善提案
- 文字化け修正ツール（Phase 1 の次のツール）でも同じ features/ + steering フローを使う。tasklist 生成時に design.md のテスト戦略・Storybook 項目をチェックリストとして機械的に転記する
- 収益化観点では、ツール本体の実装後に「使い方解説記事」（Notion）とOGP画像をセットで用意するタスクを別途忘れないこと（docs/ideas/monetization-strategy.md 参照）
