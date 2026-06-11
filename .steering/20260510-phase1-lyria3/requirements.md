# 要求内容 - My-Lumada Phase 1: Lyria 3 音楽生成パイプライン

## 概要

n8n（セルフホスト）からGoogle Gemini API（Lyria 3）を呼び出し、音楽WAVファイルをローカルに自動保存する最小パイプラインを構築する。

## 背景

My-Lumadaの最終目標（音楽動画の完全自動生成・YouTube投稿）に向けた第一歩として、
「AIが音楽を生成する」という魔法の体験を最短で実現し、以降のPhaseへのモチベーションと
技術的な基盤を確立する。

## 実装対象の機能

### 1. Docker環境でのn8n起動
- docker-compose.ymlでn8nコンテナを起動できる
- localhost:5678 でn8n UIにアクセスできる
- GEMINI_API_KEYがコンテナ内から参照できる

### 2. Lyria 3 APIへのHTTPリクエスト
- n8nのHTTP Requestノードからプロンプトを送信できる
- レスポンスのBase64音声データを取得できる

### 3. WAVファイルのローカル保存
- Base64データをバイナリに変換してWAVファイルとして保存
- `./data/audio_YYYYMMDD_HHmmss.wav` 形式でホスト上に生成される
- 生成されたWAVファイルが再生可能（音が出る）

## 受け入れ条件

### 環境構築
- [ ] `docker compose up -d` でn8nが起動する
- [ ] localhost:5678 にブラウザからアクセスできる
- [ ] n8n UIの Credentials または $env で GEMINI_API_KEY が参照できる

### ワークフロー動作
- [ ] `workflows/phase1-lyria3.json` をn8nにインポートできる
- [ ] Manual Triggerで実行すると全ノードが成功する
- [ ] `./data/` ディレクトリにWAVファイルが生成される
- [ ] WAVファイルのサイズが 1MB 以上ある（空でない）
- [ ] WAVファイルをメディアプレイヤーで再生して音楽が聞こえる

## 成功指標

- 実行から5分以内にWAVファイルが生成される
- ファイルサイズが想定範囲内（1MB〜200MB）

## スコープ外

以下はPhase 1では実装しない:

- Supabase連携（DB/Storage）
- Next.js UIへの表示
- FFmpeg動画化
- YouTube投稿
- スケジュール自動実行（Manual Triggerで動作確認のみ）
- エラー通知（Slack等）

## 参照ドキュメント

- `docs/ideas/my-lumada-requirements.md`（要件定義書）
- `haruhate-automation/docker-compose.yml`
- `haruhate-automation/workflows/phase1-lyria3.json`
