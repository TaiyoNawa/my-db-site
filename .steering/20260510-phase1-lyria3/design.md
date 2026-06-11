# 設計書 - My-Lumada Phase 1

## アーキテクチャ概要

n8nのManual Triggerから始まる4ノード構成の線形ワークフロー。
APIキーは環境変数経由で渡し、ワークフローにはハードコードしない。

```
[Manual Trigger]
      ↓
[Set Prompt]        プロンプト文字列・ファイル名を定義
      ↓
[HTTP Request]      Gemini API (lyria-3-pro-preview) へPOST
      ↓             レスポンス: Base64エンコードされたWAV
[Code Node]         Base64 → Binaryに変換
      ↓
[Write Binary File] /data/audio_YYYYMMDD_HHmmss.wav に書き出し
```

## コンポーネント設計

### 1. docker-compose.yml

**責務**:
- n8nコンテナの起動・環境変数注入
- `./data/` をコンテナの `/data/` にマウント（WAV保存先の共有）

**実装の要点**:
- `NODE_OPTIONS=--max-old-space-size=4096`: 大きなBase64レスポンスのメモリ対策
- `EXECUTIONS_TIMEOUT=7200`: 音楽生成の待ち時間（最大2時間）
- `GEMINI_API_KEY` はコンテナに渡し、ワークフロー内で `$env.GEMINI_API_KEY` で参照

### 2. HTTP Requestノード（Lyria 3 API）

**責務**:
- Gemini APIにプロンプトをPOSTし、音声データを取得する

**実装の要点**:
- URL: `https://generativelanguage.googleapis.com/v1beta/models/lyria-3-pro-preview:generateContent?key={{ $env.GEMINI_API_KEY }}`
- Body: `responseModalities: ["AUDIO"]` を指定
- タイムアウト: 300,000ms（5分）
- レスポンス形式: `candidates[0].content.parts[0].inlineData.data`（Base64）

> **注意**: Lyria 3 APIはpreview段階のため、リクエスト仕様が変更される可能性がある。
> 実際のAPIドキュメントと照合して調整すること。

### 3. Code ノード（Base64 → Binary変換）

**責務**:
- APIレスポンスのBase64文字列をn8nのbinaryオブジェクトに変換する
- エラー時に分かりやすいメッセージを投げる

**実装の要点**:
- `parts.find(p => p.inlineData?.mimeType?.startsWith('audio/'))` でaudioパートを抽出
- バイナリキー名は `audioData` (Write Binary Fileノードと一致させる)
- ファイル名はSet Promptノードで定義したものを引き継ぐ

### 4. Write Binary File ノード

**責務**:
- バイナリデータをコンテナの `/data/` に書き出す

**実装の要点**:
- `fileName`: `=/data/{{ $json.fileName }}`
- `dataPropertyName`: `audioData`（Codeノードのバイナリキーと一致）
- `/data/` はdocker-compose.ymlで `./data/` にマウント済み

## データフロー

### 正常系
```
1. Manual Trigger 起動
2. Set Prompt: prompt="Calm ambient piano..." / fileName="audio_20260510_120000.wav"
3. HTTP Request: POST → Gemini API → 200 OK (JSON with base64 audio)
4. Code: candidates[0].content.parts[0].inlineData.data → binary.audioData
5. Write Binary File: /data/audio_20260510_120000.wav に書き出し完了
```

### 異常系（Codeノードでのガード）
- `candidates` が空 → Error: "APIレスポンスにcandidatesが存在しません"
- `parts` に audio がない → Error: "レスポンスに音声データが含まれていません"
- API認証エラー → HTTP Requestノードが400/401で失敗（n8nがキャッチ）

## ディレクトリ構造

```
haruhate-automation/
  docker-compose.yml       # n8n起動設定
  .env                     # APIキー等（gitignore）
  .env.example             # テンプレート（gitignore対象外）
  .gitignore
  data/                    # WAV/MP4一時保存先（gitignore）
    .gitkeep
  workflows/
    phase1-lyria3.json     # n8nワークフローエクスポート（インポート用）
  README.md
```

## セキュリティ考慮事項

- `.env` は `.gitignore` で必ず除外する
- GEMINI_API_KEY は n8n の画面上にハードコードしない（`$env` 経由）
- n8n の Basic Auth を有効化する（`N8N_BASIC_AUTH_ACTIVE=true`）

## 将来の拡張性

- Phase 2: Supabaseノードを末尾に追加してDBにステータスを記録
- Phase 3: Write Binary File の後に Execute Command ノードを追加してFFmpeg実行
- Phase 4: YouTube ノードを追加して自動投稿
