# 開発ガイドライン (Development Guidelines)

## コーディング規約

### 命名規則

#### 変数・関数

```typescript
// ✅ 良い例
const panelList = loadFromStorage();
function countChars(text: string, settings: CountSettings): CharCount { }
const isPreviewVisible = true;

// ❌ 悪い例
const data = load();
function calc(t: any): any { }
```

**原則**:
- 変数: camelCase、名詞または名詞句
- 関数: camelCase、動詞で始める（fetch, create, update, delete, handle, resolve 等）
- 定数: UPPER_SNAKE_CASE（モジュールスコープの固定値）
- Boolean: `is`, `has`, `should`, `can` で始める
- React フック: `use` プレフィックス必須（`usePracticeSession` 等）

#### Reactコンポーネント・型

```typescript
// コンポーネント: PascalCase
export const EsCounterPanel: FC<Props> = ({ ... }) => { ... };

// インターフェース: PascalCase、I接頭辞なし
interface Panel { ... }
interface ChordDefinition { ... }

// 型エイリアス: PascalCase
type PanelId = string;
type BpmValue = number;
```

#### ファイル名

| 種別 | 規則 | 例 |
|------|------|-----|
| Reactコンポーネント | PascalCase.tsx | `EsCounterPanel.tsx`, `Fretboard.tsx` |
| カスタムフック | camelCase.ts（use-prefix） | `useEsCounterStore.ts`, `usePracticeSession.ts` |
| ユーティリティ関数 | camelCase.ts | `countChars.ts`, `fretboardUtils.ts` |
| 型定義 | `index.ts`（feature内）| `types/index.ts` |
| Storybook | PascalCase.stories.tsx | `EsCounterPanel.stories.tsx` |
| テスト | PascalCase.test.tsx / camelCase.test.ts | `EsCounterPanel.test.tsx` |

---

### TypeScript 型規約

**`any` 禁止**: `unknown` または適切な型を使用する。

```typescript
// ✅ 良い例
function parseStorage(raw: string): Panel[] | null {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return null;
  return parsed as Panel[];
}

// ❌ 悪い例
function parseStorage(raw: string): any {
  return JSON.parse(raw); // any型 = 型安全性の破壊
}
```

**フック戻り値には明示的な型を付ける**:

```typescript
// ✅ 良い例: 戻り値の型を明記
export function useEsCounterStore(): EsCounterStore {
  ...
  return { panels, addPanel, removePanel, ... };
}

// ESLintのno-unsafe-callによる false positive 回避に必要
```

**インターフェース vs 型エイリアス**:

```typescript
// interface: 拡張可能なオブジェクト型（コンポーネントProps, データモデル）
interface Panel {
  id: string;
  text: string;
  maxLength: number;
}

// type: ユニオン型、プリミティブの別名
type PanelId = string;
type BpmRange = 40 | 41 | ... | 200; // 実際はnumber + clamp
```

---

### コメント規約

**「なぜ（Why）」を説明するコメントのみ書く**。コードを読めば分かる「何を（What）」は書かない。

```typescript
// ✅ 良い例: 非自明な制約・回避策
// Tone.js は SSR で window を参照するため、dynamic import で CSR 専用ロードする
const ChordRunner = dynamic(() => import('../features/...'), { ssr: false });

// ✅ 良い例: ESLint の false positive に対する抑制
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
onClick={() => toggleAllPreviews(!allPreviewVisible)}

// ❌ 悪い例: コードの繰り返し
// ストレージキーを定数として定義する
const STORAGE_KEY = 'es-counter-panels';
```

複雑なアルゴリズム（ゴーストフレット重複判定・BPMタイマー等）は「なぜその設計か」を1〜2行で補足する。多行コメントブロックは書かない。

---

### エラーハンドリング

**外部境界（ストレージ・API・Tone.js 音声ロード）のみで try/catch を使う**。内部ロジックに防衛的な try/catch を追加しない。

```typescript
// ✅ 良い例: ストレージ読み込み失敗は空の初期値にフォールバック
function loadFromStorage(): Panel[] {
  if (typeof window === 'undefined') return [createPanel()];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [createPanel()];
    return JSON.parse(raw) as Panel[];
  } catch {
    return [createPanel()];
  }
}

// ✅ 良い例: Tone.js 音声失敗は無音で継続（ユーザーに通知）
try {
  await sampler.load();
} catch {
  setAudioError('音声の読み込みに失敗しました。映像のみで練習できます');
}

// ❌ 悪い例: 到達し得ないエラーを防衛的に catch
function addPanel(panels: Panel[]): Panel[] {
  try {
    return [...panels, createPanel()]; // 例外が起きる余地がない
  } catch (e) {
    return panels;
  }
}
```

ユーザーへのエラーメッセージは日本語で、具体的な対処方法を含める。

---

### React / Next.js 固有規約

**pages/ は薄く保つ**:

```typescript
// ✅ 良い例: pages/ はデータ取得と feature の呼び出しのみ
export default function EsCounterPage() {
  return <EsCounterContainer />;
}

// ❌ 悪い例: pages/ に useState やロジックを書く
export default function EsCounterPage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  // ...
}
```

**Tone.js の dynamic import**:

```typescript
// Tone.js は SSR 非対応のため dynamic import 必須
const ChordRunnerContainer = dynamic(
  () => import('@/features/gallery/tool/chord-runner/components/ChordRunnerContainer'),
  { ssr: false }
);
```

**セッションストレージ活用**（es-counter の先例に倣う）:
- 新規タブ訪問 = 空の状態からスタート
- タブ内でのリロード・ブラウザバック = 状態保持
- `typeof window === 'undefined'` チェックでSSR安全に

---

## Git運用ルール

### ブランチ戦略

```
main        ← Vercel 本番デプロイ
  └─ develop  ← 開発の集約ブランチ（PR のマージ先）
      ├─ feature/chord-runner        ← 新機能
      ├─ feature/flow-music
      ├─ fix/bpm-timer-drift         ← バグ修正
      ├─ refactor/fretboard-svg      ← リファクタリング
      └─ update/es-counter-collapse  ← 既存機能の改善
```

**main へのマージ**は `develop` からのみ（直接 push 禁止）。

### コミットメッセージ規約

**フォーマット**: `<type>: <日本語の要約>`（スコープは任意）

```
feat: ChordRunnerのコード進行ビルダーを追加
fix: BPMタイマーの拍ズレを修正
docs: functional-design.mdにflowmusicデータフローを追記
style: EsCounterPanelのインポート順を修正
refactor: fretboardUtilsの重複判定ロジックを抽出
test: countCharsのエッジケーステストを追加
chore: Tone.jsをインストール
```

**Type 一覧**:

| type | 用途 |
|------|------|
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードの意味に影響しない変更（空白・import順等） |
| `refactor` | バグ修正も機能追加もないコード変更 |
| `test` | テストの追加・修正 |
| `chore` | ビルド・設定・依存関係の変更 |
| `update` | 既存機能の改善・拡張 |

---

### ビルド前チェック

push・マージ前に必ず実行:

```bash
yarn lint     # ESLint Error がないことを確認（Warningは許容）
yarn build    # 型エラーゼロ・ビルド成功を確認
yarn test     # テスト全パスを確認
```

**ESLint Error はビルドを落とす**。Warning は許容するが、蓄積させない。

---

## テスト戦略

### テストの種類と対象

#### ユニットテスト（Vitest）

**対象**: `features/**/utils/`・`utils/` の純粋関数

```typescript
// ✅ 例: countChars のユニットテスト
describe('countChars', () => {
  it('改行を除いた文字数を返す', () => {
    expect(countChars('hello\nworld', { excludeNewlines: true })).toBe(10);
  });

  it('空文字は0を返す', () => {
    expect(countChars('', {})).toBe(0);
  });
});
```

**カバレッジ目標**: utils/hooks 層 80% 以上（`yarn test` で coverage レポート生成）

#### コンポーネントテスト（@testing-library/react）

**対象**: インタラクションが複雑なコンポーネント

```typescript
// ✅ 例: ユーザー操作を模倣する
it('コードをクリックするとタイムラインに追加される', async () => {
  render(<ChordBuilder onSequenceChange={mockFn} />);
  await userEvent.click(screen.getByRole('button', { name: 'C' }));
  expect(mockFn).toHaveBeenCalledWith(['C']);
});
```

**方針**:
- `screen.getByRole` / `getByLabelText` を優先（実装詳細に依存しない）
- `getByTestId` は最終手段
- モックは外部依存（Tone.js・localStorage）のみ

#### Storybook

**対象**: 状態バリエーションが多いコンポーネント（Fretboard, ChordBuilder, EsCounterPanel）

```typescript
// 各状態をストーリーとして定義
export const WithGhostOverlap: Story = {
  args: {
    currentChord: 'F',
    nextChord: 'Bm',
    // Fとbmは一部フレット重複 → ゴーストアウトライン表示の確認
  },
};
```

---

### テスト命名規則

`[条件]_[期待結果]` または `[条件]のとき[期待結果]` の形式:

```typescript
// ✅ 良い例（英語スタイル）
it('returns_zero_for_empty_string', () => { });

// ✅ 良い例（日本語スタイル）
it('空文字のとき0を返す', () => { });
it('重複ありのゴーストドットは枠線スタイルになる', () => { });

// ❌ 悪い例
it('test1', () => { });
it('works', () => { });
```

---

## 開発環境セットアップ

### 必要なツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Node.js | 20.x LTS | ランタイム |
| yarn | 1.22.x | パッケージ管理 |
| VSCode（推奨） | 最新 | エディタ |

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/TaiyoNawa/my-db-site.git
cd my-db-site

# 2. 依存関係のインストール
yarn install

# 3. 環境変数の設定
cp .env.example .env.local
# .env.local を編集（Notion API キー・Supabase キー等）

# 4. 開発サーバーの起動
yarn dev          # localhost:3000

# 5. Storybook の起動（コンポーネント確認）
yarn storybook    # localhost:6006

# 6. テスト実行
yarn test
```

### 推奨 VSCode 拡張

- **ESLint**: リアルタイムに Lint エラーを表示
- **Prettier**: コードフォーマット自動化
- **TypeScript**: 型エラーのインライン表示

---

## スペック駆動開発フロー

このプロジェクトは `/setup-project` → `/add-feature` のフローで開発を進める。

### 新機能追加の手順

```
1. docs/ideas/[機能名].md にアイデアメモを書く
   └─ ユーザーストーリー・コア機能・UX を記述

2. /add-feature [機能名] を実行
   └─ .steering/[日付]-[機能名]/ にタスクリストが生成される

3. .steering/ のタスクリストに従って実装
   └─ features/ → pages/ → tests の順で

4. yarn lint && yarn build && yarn test を確認してPR作成
```

### ドキュメント更新のルール

`docs/` の6つの永続ドキュメントは、実装完了後に最新状態を保つ:

- 新機能追加 → `functional-design.md`・`repository-structure.md` を更新
- 技術スタック変更 → `architecture.md` を更新
- 用語追加 → `glossary.md` を更新

---

## 実装チェックリスト

PR 作成前に確認:

### コード品質
- [ ] 命名がrepository-structure.mdの規則に従っている
- [ ] `any` 型を使用していない
- [ ] フックの戻り値に明示的な型注釈がある
- [ ] 「なぜ」を説明するコメントのみ記述している

### セキュリティ
- [ ] APIキーが `process.env` 経由で取得されている（ハードコードなし）
- [ ] 環境変数に `NEXT_PUBLIC_` プレフィックスを不必要に付けていない
- [ ] 問い合わせフォームのサーバーサイドバリデーションが実装されている

### ビルド
- [ ] `yarn lint` でエラーがない
- [ ] `yarn build` が成功する（型エラーゼロ）
- [ ] `yarn test` で全テストがパスする

### 機能要件
- [ ] PRDの受け入れ条件をすべて満たしている
- [ ] モバイル（375px〜）・デスクトップで表示崩れがない
- [ ] ChordRunner / Tone.js 使用箇所: `{ ssr: false }` の dynamic import になっている
