# MyRecipeVolt 🍳

制限なし・広告なし。あなただけのレシピ帳

[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## はじめに

MyRecipeVoltは、お気に入りのレシピを一箇所にまとめて管理できるレシピ管理ツールです。URLを貼り付けるだけで自動でレシピ情報を取得でき、人数調整も簡単！

### 主な機能

- 📚 レシピ保存・検索・閲覧
- 🔗 URLからのインポート（クックパッド、白ごはん.com、NHKきょうの料理、キッコーマン、Nadiaなど）
- ✏️ 手動でレシピを入力
- ❤️ お気に入り機能
- 👥 人数調整機能（材料の分量が自動計算）
- 📝 自分メモ機能
- 📱 スマートフォン対応

## デモ

### URLインポートでレシピを追加

1. 「URLからインポート」ボタンをクリック
2. 対応サイトのレシピURLを入力（例: 白ごはん.com、キッコーマン、Nadiaなど）
3. 「取得」ボタンをクリックすると、レシピ情報が自動で入力されます
4. 必要に応じて内容を編集して「保存」

### 手動でレシピを入力

1. 「手動で入力」ボタンをクリック
2. タイトル、材料、手順を入力
3. カテゴリを選択して「保存」

### レシピを閲覧・編集

- ホームでレシピカードをクリックすると詳細を表示
- 人数を変更すると、材料の分量が自動で再計算されます
- 自分メモを追加して、アレンジやメモを残せます

## 技術スタック

| 技術 | 役割 | なぜ選んだか |
|------|------|-------------|
| Next.js 14.2.0 | Webアプリケーションフレームワーク | 高速なページ遷移、SSR（サーバーサイドレンダリング）対応、App Routerのモダンなルーティング |
| React 18.3.1 | UIライブラリ | コンポーネントベースで再利用可能、豊富なエコシステム |
| TypeScript 5 | 型安全な言語 | 型ミス防止、開発体験向上、保守性の向上 |
| Tailwind CSS 4 | CSSフレームワーク | 迅速なスタイリング、ダークモード対応、バンドルサイズが小さい |
| Supabase | データベース・認証 | フリーで使えるPostgreSQL、簡単設定、リアルタイム機能 |
| Cheerio | スクレイピング | HTML解析が簡単、軽量 |

## プロジェクト構造

```
MyRecipeVolt/
├── app/                          # アプリケーションの主要コード（App Router）
│   ├── layout.tsx                 # レイアウト（ナビゲーションなど）
│   ├── page.tsx                   # ホームページ
│   ├── globals.css                # グローバルスタイル
│   ├── favorites/                 # お気に入りページ
│   │   └── page.tsx
│   ├── import/                    # URLインポートページ
│   │   └── page.tsx
│   ├── recipes/                   # レシピ関連ページ
│   │   ├── [id]/page.tsx        # レシピ詳細
│   │   └── new/page.tsx         # 新規レシピ作成
│   └── api/                      # APIルート
│       ├── scrape/route.ts       # スクレイピングAPI
│       └── parse-recipe/route.ts # 手動レシピ解析API
├── lib/
│   └── supabase.ts              # Supabaseクライアント設定
├── supabase/
│   └── schema.sql               # データベーススキーマ
├── public/                       # 静的ファイル
├── package.json                  # 依存関係・スクリプト
└── tsconfig.json                # TypeScript設定
```

## セットアップ方法

### 前提条件

- Node.js 20.x以降

```bash
node --version  # 20.x以降が必要
```

### 手順

#### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd MyRecipeVolt
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

プロジェクトのルートに `.env.local` ファイルを作成し、以下の環境変数を設定します：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Supabaseのプロジェクト作成とキーの取得方法：

1. [Supabase](https://supabase.com/) でアカウントを作成
2. 新しいプロジェクトを作成
3. Project Settings > API から `Project URL` と `anon public` キーをコピー

#### 4. データベースのセットアップ

SupabaseのSQL Editorで `supabase/schema.sql` の内容を実行して、データベーステーブルを作成します。

または：

```bash
# Supabase CLIを使用している場合
supabase db push
```

#### 5. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスするとアプリが表示されます。

## データベース構造

### テーブル一覧

| テーブル名 | 説明 | 主なカラム |
|----------|------|-----------|
| `recipes` | レシピ本体 | id, title, image_url, servings, servings_count, category, note, is_favorite, created_at |
| `ingredients` | 材料 | id, recipe_id, name, amount, order_index |
| `steps` | 手順 | id, recipe_id, step_number, instruction |
| `tags` | タグマスター | id, name |
| `recipe_tags` | レシピ↔タグの中間テーブル | recipe_id, tag_id |
| `user_settings` | ユーザー設定 | id, default_servings_count |

### リレーションシップ

```
recipes (1) ←→ (N) ingredients
recipes (1) ←→ (N) steps
recipes (1) ←→ (N) recipe_tags ←→ (N) tags
```

### スキーマ定義

詳細なスキーマは [supabase/schema.sql](supabase/schema.sql) を確認してください。

## 主な機能の詳細

### URLインポート機能

[app/api/scrape/route.ts](app/api/scrape/route.ts) で実装されています。以下の戦略でレシピ情報を抽出します：

1. **JSON-LD (Schema.org Recipe)** を優先解析
2. **OGP / メタタグ** からタイトル・画像をフォールバック取得
3. **専用パーサー** で各サイトに対応：
   - 白ごはん.com (sirogohan.com)
   - クックパッド (cookpad.com)
   - デリッシュキッチン (delishkitchen.tv)
   - NHK きょうの料理 (nhk.or.jp)
   - キッコーマン (kikkoman.co.jp)
   - Nadia (oceans-nadia.com)

**技術的ポイント**：
- Cheerioを使用したHTML解析
- User-Agentのローテーションでボット検知を回避
- 15秒のタイムアウト設定
- エラーハンドリングによるユーザーへの分かりやすいメッセージ表示

### 人数調整機能

- `servings_count` で基準人数を保存
- ユーザーが変更すると比率で材料の分量を計算
- 元のレシピの分量は保持されたまま、表示だけ調整されます

### 検索機能

- **デバウンス処理（400ms）** でリクエスト軽減
- タイトルでの部分一致検索
- カテゴリフィルタリング対応

## 開発方法

### コードの読み方

#### App Router

Next.js 14のApp Routerを採用しています。`app/` ディレクトリの構造がURLに対応します：

```
app/page.tsx          → /
app/favorites/page.tsx → /favorites
app/recipes/[id]/page.tsx → /recipes/:id
```

#### Server Components vs Client Components

- **Server Components（デフォルト）**：サーバー側でレンダリング、高速、SEOに最適
- **Client Components**：`"use client"` と記述、インタラクティブな機能（クリック、フォーム入力など）が必要な場合

例：

```tsx
// Server Component
export default function RecipeCard() {
  // ✅ データフェッチ、データベースクエリが可能
  const recipes = await supabase.from("recipes").select("*");
  return <div>{...}</div>
}

// Client Component
"use client";
export default function SearchBar() {
  // ✅ useState, useEffect, イベントハンドラが可能
  const [search, setSearch] = useState("");
  return <input onChange={(e) => setSearch(e.target.value)} />;
}
```

### 新しいページの追加

1. `app/` ディレクトリに新しいフォルダと `page.tsx` を作成

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return <div>About MyRecipeVolt</div>;
}
```

### 新しいAPIの作成

1. `app/api/` ディレクトリにフォルダと `route.ts` を作成

```ts
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

### スタイリング

Tailwind CSSクラスを使用します：

```tsx
<div className="p-4 bg-blue-500 text-white rounded-lg">
  こんにちは
</div>
```

### データベースへのアクセス

`lib/supabase.ts` から初期化されたクライアントを使用します：

```ts
import { supabase } from "@/lib/supabase";

// データの取得
const { data, error } = await supabase
  .from("recipes")
  .select("*")
  .eq("id", recipeId);

// データの挿入
await supabase.from("recipes").insert({
  title: "カレー",
  category: "肉料理",
});
```

## トラブルシューティング

### URLインポートが失敗する場合

**問題**: 「このサイトはボット検知のためURLからの自動取得をブロックしています」と表示される

**解決策**:
- クックパッドなどの一部サイトは、ボットアクセスをブロックしています
- 「手動で入力」機能を使用してレシピを追加してください

### 開発サーバーが起動しない

**問題**: `npm run dev` でエラーが発生する

**解決策**:
```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# Node.jsのバージョンを確認（20.x以降が必要）
node --version
```

### 環境変数が読み込まれない

**問題**: Supabase接続エラーが発生する

**解決策**:
1. `.env.local` ファイルがプロジェクトルートにあるか確認
2. ファイル名が正しいか確認（`.env` ではなく `.env.local`）
3. 開発サーバーを再起動する（環境変数の変更は再起動が必要）

### データベースのセットアップに失敗する

**問題**: Supabaseへの接続ができない

**解決策**:
1. Supabaseプロジェクトが正常に作成されているか確認
2. `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいか確認
3. Supabaseダッシュボードの Project Settings > API でキーを再取得

## 注意事項

- **バックアップ機能**: 現在、バックアップ機能がありません。重要なレシピは定期的に Supabase からエクスポートすることを推奨します
- **SNS対応**: Instagram、Facebook などのSNS投稿からのレシピ取得には対応していません
- **商用利用**: このアプリは個人利用を想定しています

## ライセンス

MIT License

## コントリビューション

バグ報告、機能の提案、プルリクエストを歓迎します！

---

**MyRecipeVolt** は、AIとのペアプログラミング（バイブコーディング）で作られたプロジェクトです。コードの読み方、構造、技術の選択理由を学ぶ教材としても活用できます。
