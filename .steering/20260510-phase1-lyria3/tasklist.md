# タスクリスト - My-Lumada Phase 1: Lyria 3 音楽生成パイプライン

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

---

## フェーズ1: haruhate-automationリポジトリ構築

- [x] gitリポジトリ初期化
  - [x] `git init`
  - [x] `.gitignore` 作成（.env, data/ を除外）
  - [x] 初回コミット

- [ ] 設定ファイル作成
  - [x] `docker-compose.yml` 作成
  - [x] `.env.example` 作成
  - [x] `data/.gitkeep` 作成
  - [x] `workflows/phase1-lyria3.json` 作成
  - [x] `README.md` 作成

- [ ] `.env` ファイルをセットアップ（ユーザー作業）
  - [ ] `.env.example` をコピーして `.env` を作成
  - [ ] `GEMINI_API_KEY` に実際のAPIキーを設定
  - [ ] `N8N_PASSWORD` を強いパスワードに変更

## フェーズ2: Docker環境起動確認

- [ ] n8n起動
  - [ ] `docker compose up -d` でエラーなく起動
  - [ ] `docker compose logs n8n` でエラーログがないことを確認
  - [ ] localhost:5678 にブラウザでアクセスできる
  - [ ] n8n Basic Auth でログインできる

- [ ] 環境変数の確認
  - [ ] n8nのCredentials画面を開く
  - [ ] Execute Commandノード等で `$env.GEMINI_API_KEY` が参照できることを確認
    （またはSettingsでの確認）

## フェーズ3: n8nワークフロー動作確認

- [ ] ワークフローのインポート
  - [ ] n8n UI → Workflows → Import from file
  - [ ] `workflows/phase1-lyria3.json` をインポート
  - [ ] 5つのノードが表示されることを確認

- [ ] ノード設定の確認
  - [ ] HTTP Requestノードを開いて URL の `$env.GEMINI_API_KEY` が機能するか確認
  - [ ] 必要に応じてAPIキー渡し方式を調整（Credentialsを使う場合はここで設定）

- [ ] 実行テスト
  - [ ] Manual Trigger「Test workflow」でワークフロー実行
  - [ ] 全ノードが緑（成功）になることを確認
  - [ ] `./data/` にWAVファイルが生成されていることを確認
  - [ ] WAVファイルサイズが 1MB 以上
  - [ ] WAVファイルをメディアプレイヤーで再生して音が出ることを確認

## フェーズ4: トラブルシュート（問題発生時）

- [ ] API認証エラーの場合
  - [ ] Gemini APIのダッシュボードでLyria 3へのアクセス権限を確認
  - [ ] APIキーが正しくコンテナに渡されているか確認

- [ ] レスポンス構造エラーの場合
  - [ ] HTTPノードのOutput（raw JSON）を確認してpartsの構造を確認
  - [ ] Codeノードの抽出ロジックをレスポンスに合わせて修正

- [ ] Write Binary Fileエラーの場合
  - [ ] `/data/` のパーミッション確認: `docker exec n8n ls -la /data`
  - [ ] 必要に応じてdocker-compose.ymlにパーミッション設定を追加

## フェーズ5: 振り返り記録

- [ ] 実装後の振り返り（このファイルの下部に記録）

---

## 実装後の振り返り

### 実装完了日
（未完了）

### 計画と実績の差分

**計画と異なった点**:
-

**新たに必要になったタスク**:
-

### 学んだこと

**技術的な学び**:
-

**Lyria 3 APIの実際の挙動**:
-

### 次フェーズ（Phase 2）への申し送り
-
