# 設計書（talk-maker v2）

## データモデル変更

```ts
// 追加
interface TalkMember { id: string; name: string; icon: string; iconImage?: string }
type FontId = 'gothic' | 'rounded' | 'serif' | 'mono';

// TalkMessage に追加
memberId?: string;   // sender==='other' の送信メンバー（未指定は先頭メンバー）
imageUrl?: string;   // 画像メッセージ（dataURL）。指定時はバブルの代わりに画像表示

// TalkSettings に追加
partnerIconImage?: string;  // トークアイコン画像（絵文字より優先）
backgroundImage?: string;   // 背景画像（テーマ色の上に cover 表示）
fontId: FontId;
members: TalkMember[];      // 2人以上でグループ表示
```

- **マイグレーション**: loadFromStorage で members が無い旧データは
  partnerName / partnerIcon から先頭メンバーを自動生成する

## 主要な技術判断

1. **書き出しズレ修正**: `toPng` に `style: { margin: '0' }` と width/height を明示。
   中央寄せの computed margin がクローンへ引き継がれるのが原因
2. **画像は dataURL + クライアント縮小**: sessionStorage 約5MBの制約と
   PNG出力時のCORS回避のため。アイコン256px(PNG)・背景960px(JPEG)・送信画像640px(JPEG)
3. **フォントはシステムフォントのみ**: 外部フォントは html-to-image の
   フォント埋め込みが不安定なため見送り
4. **JSONバリデーションは zod**（既存依存）。sender は "me"/"自分"/"other"/"相手" の
   エイリアスに加え、任意の文字列をメンバー名として解釈（未知の名前は自動でメンバー追加）
5. **部分スクショ**: 選択メッセージのみの TalkPreview を画面外（left:-9999px, w:380px）に
   一時レンダリングしてキャプチャ

## 追加・変更ファイル

```
features/gallery/tool/talk-maker/
  types/index.ts              変更（Member/FontId/画像フィールド）
  utils/presets.ts            変更（FONTS・createMember・DEFAULT拡張）
  utils/exportImage.ts        変更（ズレ修正）
  utils/image.ts              新規（readFileAsDataUrl / downscaleImage）
  utils/talkJson.ts           新規（zodスキーマ・parse/serialize）
  hooks/useTalkMakerStore.ts  変更（一括操作・インポート・メンバーCRUD・マイグレーション）
  components/
    MessageBubble.tsx         変更（メンバー名/アイコン・画像メッセージ・選択モード）
    TalkPreview.tsx           変更（フォント・背景画像・グループ・選択パススルー）
    MessageComposer.tsx       変更（メンバー選択・画像添付）
    TalkSettingsForm.tsx      変更（アコーディオン化・アップロード・フォント・メンバー管理）
    IconCropModal.tsx         新規（ドラッグ+ズームの簡易クロップ）
    JsonImportModal.tsx       新規
    SelectionToolbar.tsx      新規
pages/gallery/tool/talk-maker/index.tsx  変更（選択状態・部分エクスポート・モーダル）
```

## テスト戦略

- `talkJson.ts`: パース成功/エイリアス/メンバー自動生成/不正時刻/不正JSON/シリアライズ
- store: 一括更新・一括削除・インポート（置換/追記）・メンバーCRUD・旧データマイグレーション
- 画像系（canvas依存）は jsdom で検証不可のため Storybook / 手動確認とする
