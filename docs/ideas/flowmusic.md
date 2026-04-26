### 第1章：Supabaseの運用戦略（セルフホスト vs クラウド）

結論から言うと、**Supabaseは「クラウド版（無料枠）」を利用し、n8nは現在の「セルフホスト（ローカル）」のまま連携させるハイブリッド構成**が最も戦略的です。

**理由：**
1. **フロントエンド（Next.js）からのアクセス性:**
   Haruhateサイト（Next.js）をVercel等にデプロイする場合、データベースはインターネット上からアクセスできる必要があります。Supabaseをローカルでセルフホストしてしまうと、Next.js側からDBにアクセスできなくなってしまいます。
2. **Supabaseセルフホストの重さ:**
   SupabaseはPostgreSQLだけでなく、認証（GoTrue）、リアルタイム通信、ストレージなど10個以上のDockerコンテナが動く巨大なシステムです。マシンのリソース（メモリ等）を大量に消費するため、管理コストが見合いません。
3. **ローカルn8n → クラウドSupabaseの相性の良さ:**
   n8nが手元のPC（セルフホスト）で動いていても、外部のSupabase APIへデータを「送信（Push）」したり「取得（Pull）」したりする外向きの通信は全く問題なく行えます。重い自動化処理は手元のn8nに任せ、データだけをクラウドのSupabaseに置くのは非常にスマートな設計です。

### 第2章：1つのSupabaseプロジェクトで複数の用途を管理する方法

> 「Supabaseも1アカウントでは2つのプロジェクトしか扱えない。これって同じプロジェクト内で、例えば記事用とゲーム用みたいなの分けれるのかな」

**はい、完全に分けられます。**
Supabaseの「1プロジェクト」＝「1つの独立したPostgreSQLデータベース」です。1つのデータベースの中には、何十、何百という「テーブル（表）」を作成できます。

プロジェクトを消費せずとも、以下のようにテーブルを分けるだけで、1つのプロジェクトでHaruhateの全機能を賄えます。

* **テーブル案:**
    * `music_prompts`（今回の音楽生成用テーブル）
    * `articles`（Notionから移行する記事用テーブル）
    * `game_scores`（ゲームのスコア保存用テーブル）
    * `manga_reviews`（漫画レビュー用テーブル）

このようにテーブルで分割すれば、無料枠の2プロジェクトのうち、1つを「Haruhate（本番環境）」、もう1つを「テスト・開発環境」として贅沢に使うことができます。

---

### 第3章：自動化パイプライン構築の具体的な手順書

今回の「音楽生成プロンプト → n8n → YouTube投稿 → Next.jsへ連携」を実現するためのステップです。

#### Step 1: Supabase側の準備（データベースの作成）
1. Supabaseクラウドで新規プロジェクト（例: `haruhate-db`）を作成します。
2. Table Editorから、今回の連携用テーブル `music_prompts` を作成します。
    * **カラム構成例:**
        * `id` (uuid, Primary Key)
        * `prompt_text` (text) : 音楽作成のプロンプト
        * `status` (text) : `pending` (生成待ち), `completed` (完了)
        * `youtube_main_url` (text, nullable) : MVのURL
        * `youtube_short_url` (text, nullable) : ショートのURL
        * `created_at` (timestamp)

#### Step 2: n8nのワークフロー構築（ローカル環境）
手元のn8nで、以下のノードをつなぎ合わせて自動化フローを作ります。

1. **[Schedule Trigger]** または **[Webhook]**: 毎日特定の時間に起動。
2. **[Supabase Node]**: `music_prompts` テーブルから `status` が `pending`（未処理）のレコードを1件取得（Read）。
3. **[HTTP Request Node (Flow Music API)]**: 取得した `prompt_text` をFlow Musicに投げ、音楽とMV（必要なら切り抜き処理もここで実装）を生成。
4. **[YouTube Node]**: 生成された動画ファイルをYouTubeへアップロード。返ってくる「動画のURL（ID）」を取得。
5. **[Supabase Node]**: 最初に取得したSupabaseのレコードに対して、`youtube_main_url` 等を書き込み、`status` を `completed` に更新（Update）。

*※これで、「未処理のプロンプトがDBにあれば、勝手に曲を作ってYouTubeに上げ、DBにURLを書き戻す」というシステムが完成します。*

#### Step 3: Haruhate (Next.js) 側の実装
完成したデータを、自分のサイトに表示します。

1. **Supabaseクライアントの導入**:
   プロジェクトに `@supabase/supabase-js` をインストールし、APIキーを `.env` に設定します。
2. **データの取得とISR（定期自動更新）の設定**:
   ページコンポーネント（例: `src/pages/music/index.tsx`）で、`getStaticProps` を用いてSupabaseからデータを取得します。

```tsx
// src/pages/music/index.tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export const getStaticProps = async () => {
  // statusがcompletedの曲だけを取得
  const { data: musics } = await supabase
    .from('music_prompts')
    .select('*')
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  return {
    props: { musics },
    revalidate: 3600, // 1時間ごとに裏側でHTMLを再生成（ISR）し、API制限を回避
  };
};

export default function MusicPage({ musics }) {
  return (
    <div>
      {/* 既存のSectionWrapperやBaseBoxを使ってカード状に表示 */}
      {musics.map((music) => (
        <div key={music.id}>
           <p>プロンプト: {music.prompt_text}</p>
           {/* YouTubeの埋め込みプレイヤー等を表示 */}
        </div>
      ))}
    </div>
  )
}
```

この戦略であれば、セルフホストしているn8nの強み（自由な外部連携と無料の処理能力）と、Supabaseの強み（外部公開用DBとしての安定性）、Next.jsの強み（ISRによる爆速・高負荷耐性）のいいとこ取りができます。将来的なアドセンス等での収益化を考える上でも、サイトの表示速度を落とさずにデータを拡張できるため、非常に強固な基盤になります。