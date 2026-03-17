# MyRecipeVolt - Claude Code 設定

## プロジェクト概要
レシピ管理アプリ。レシピの保存、検索、お気に入り機能、URLからのスクレイピング対応。

## 技術スタック
- **フレームワーク**: Next.js 14.2.0 (App Router)
- **言語**: TypeScript 5
- **データベース**: Supabase (PostgreSQL)
- **スタイリング**: Tailwind CSS 4
- **ウェブスクレイピング**: Cheerio
- **テスト**: Playwright

## コーディング規約

### TypeScript
- 型定義を必ず使用
- `any` 型の使用を避ける
- インターフェースは `I` プレフィックスなし（例: `Recipe` ではなく `IRecipe`）

### React/Next.js
- Server Components を優先（クライアントコンポーネントは `"use client"` を明記）
- 状態管理: useState/useEffect を使用（小規模アプリ）
- フォーム: Server Actions を優先

### データベース (Supabase)
- クエリは `lib/supabase.ts` から初期化されたクライアントを使用
- 型安全のため Supabase の型定義を活用
- マイグレーション: `supabase/schema.sql` を参照

### コードスタイル
- ESLint を実行: `npm run lint`
- 日本語のコメント・コミットメッセージ
- 関数名: キャメルケース
- ファイル名: ケバブケース（例: `recipe-card.tsx`）

## よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# Lint
npm run lint

# 環境変数チェック
npm run check-env
```

## プロジェクト構造

```
app/
├── recipes/[id]/page.tsx    # レシピ詳細ページ
├── favorites/page.tsx        # お気に入り一覧
├── import/page.tsx           # URLからのレシピインポート
├── api/scrape/route.ts       # スクレイピングAPI
└── ...
lib/
└── supabase.ts               # Supabaseクライアント
supabase/
└── schema.sql                # データベース定義
```

## 特別な注意事項

### スクレイピング機能
- [app/api/scrape/route.ts][def] で実装
- 対応サイト: 白ごはん.com
- 材料・手順の抽出時に適切なフィルタリングが必要

### レシピインポート
- URLからレシピをスクレイピング
- 材料・手順の整形処理が重要
- エラーハンドリングを適切に実装

## 推奨ワークフロー

### 新機能追加
1. データベーススキーマを確認/変更
2. APIエンドポイントを作成（必要な場合）
3. UIコンポーネントを作成
4. テストを実行

### バグ修正
1. エラーの原因を特定
2. 最小限の変更で修正
3. 動作確認

## 開発サーバー
- デフォルトポート: 3000
- ホスト: 0.0.0.0（LANアクセス可能）

## 環境変数
`.env.local` に以下を設定:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`


[def]: app/api/scrape/route.ts