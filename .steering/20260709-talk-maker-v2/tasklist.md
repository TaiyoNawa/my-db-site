# タスクリスト（talk-maker v2）

## 🚨 タスク完全完了の原則

全タスクが `[x]` になるまで作業を継続する。スキップは技術的理由がある場合のみ（理由を明記）。

---

## フェーズ1: バグ修正・基盤

- [x] `exportImage.ts` の書き出しズレを修正（margin打ち消し + width/height明示）
- [x] `types/index.ts` を拡張（TalkMember / FontId / memberId / imageUrl / 設定フィールド）
- [x] `presets.ts` を拡張（FONTS 4種・getFont・createMember・DEFAULT_SETTINGS更新）
- [x] `utils/image.ts` を新規作成（readFileAsDataUrl / loadImage / downscaleImage）
- [x] `utils/talkJson.ts` を新規作成（zodスキーマ・parseTalkJson・serializeTalk）
- [x] `utils/__tests__/talkJson.test.ts` を作成（10テストパス）

## フェーズ2: 状態管理の拡張

- [x] `useTalkMakerStore.ts` を拡張
  - [x] 旧データのマイグレーション（members自動生成）
  - [x] addMessage の memberId 対応・addImageMessage 追加
  - [x] updateMessages / removeMessages（一括操作）
  - [x] importMessages（replace / append）
  - [x] addMember / updateMember / removeMember（最低1人は維持）
- [x] `useTalkMakerStore.test.ts` に新機能のテストを追加（マイグレーションのバグをテストが検出→修正）

## フェーズ3: UIコンポーネント

- [x] `IconCropModal.tsx` を新規作成（ドラッグ+ズーム→256px正方形出力）
- [x] `MessageBubble.tsx` を拡張（メンバーアイコン/名前・画像メッセージ・選択モード）
- [x] `TalkPreview.tsx` を拡張（フォント・背景画像・グループ名表示・選択パススルー）
- [x] `MessageComposer.tsx` を拡張（グループ時のメンバー選択・画像添付ボタン）
- [x] `TalkSettingsForm.tsx` をアコーディオン化（基本/背景/メンバー）
  - [x] トークアイコン画像アップロード + クロップ
  - [x] 背景画像アップロード/削除
  - [x] フォント選択
  - [x] メンバー管理（追加/編集/削除・画像アイコン対応）
  - [x] ~~データセクション（JSON）~~（実装方針変更により不要: JSON入出力は messages への参照が必要なため、設定フォームではなくページ側の操作ボタンに配置した）
- [x] `JsonImportModal.tsx` を新規作成（貼り付け/ファイル・置換/追記・エラー表示）
- [x] `SelectionToolbar.tsx` を新規作成（全選択・削除・時刻変更・送信者切替・部分保存）

## フェーズ4: ページ統合

- [x] `pages/gallery/tool/talk-maker/index.tsx` に選択状態・部分エクスポート・モーダルを統合
- [x] JSONエクスポートボタンを追加

## フェーズ5: 品質チェック

- [x] `yarn test`（248テストパス）
- [x] `yarn lint`（エラー・警告なし）
- [x] `yarn build`（/gallery/tool/talk-maker 13.9kB）

## フェーズ6: ドキュメント更新

- [x] 実装後の振り返り（このファイルの下部に記録）

## フェーズ7: 追加要望（2026-07-09 追記）

- [x] UI細部修正（Placeholderはみ出し・フォーカス枠・メンバー選択の配置）
- [x] 通話メッセージ（通話時間/不在着信/キャンセル、時間は編集可）
- [x] システムメッセージ（入室・退会など、文言は自由編集）
- [x] 日付ラベル（「今日」など、中央のピル表示）
- [x] 入力バーに「＋」挿入メニューを追加
- [x] 日付・システムを挟んだら連投グルーピングをリセット
- [x] JSONエクスポートは特殊メッセージをスキップ（形式で表現できないため）
- [x] テスト追加（store 2件・serialize更新）+ test/lint/build 全パス

---

## 実装後の振り返り

### 実装完了日
2026-07-09

### 計画と実績の差分

**計画と異なった点**:
- JSON入出力のUIを設定フォーム内ではなくページの操作ボタン列に配置した（messages への参照が設定フォームの責務を超えるため）
- store のマイグレーション実装で「DEFAULT_SETTINGS のスプレッドにより members が常に埋まり、旧データからの生成分岐が実行されない」バグをテストが検出。保存データ側（parsed.settings.members）を直接確認する方式に修正

**新たに必要になったタスク**:
- FileReader.result の型ガード（ESLint @typescript-eslint/no-base-to-string 対応）

### 学んだこと

**技術的な学び**:
- html-to-image の書き出しズレは「中央寄せ（margin: auto）の computed margin がクローンDOMに引き継がれる」のが原因。`style: { margin: '0' }` + width/height 明示で解決
- `{ ...DEFAULT, ...stored }` 方式のマイグレーションは、デフォルトに非空のコレクションがあると「欠落検知」ができない。欠落判定は必ず保存データ側を見る
- クロップUIは cover基準スケール + オフセットのclamp + canvas drawImage の座標変換で、外部ライブラリなしで実装できる
- 一括操作の状態（選択IDセット）はページ側に置き、store は純粋な一括更新APIだけ提供する分離が保守しやすい

**プロセス上の改善点**:
- v1振り返りの教訓（design.md のテスト戦略を tasklist に転記）を反映し、テスト作成をタスク化して漏れなく実施できた
- テストが実際にマイグレーションのバグを検出し、テストファーストの価値を実証した

### 次回への改善提案
- 実機（ブラウザ）でのPNG書き出し確認は自動化できないため、/verify 的な手動確認手順を tasklist に含めると良い
- sessionStorage の5MB制限は画像を多用すると超えうる。将来は IndexedDB への移行を検討

