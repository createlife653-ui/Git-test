# MyRecipeVolt README.md 作成計画

## Context（背景）

ユーザーがAIとのペアプログラミング（バイブコーディング）を初めて経験したプロジェクト「MyRecipeVolt」に対し、以下の目的でREADME.mdを作成する：

- **誰が読んでもわかる**：初心者にもアプリの価値を伝える
- **教材として活用できる**：コードの読み方、構造、技術の選択理由を学べる
- **使い始められる**：環境構築から実行までの手順を提供

## 推奨アプローチ

以下の構成でREADME.mdを作成する：

### 1. アプリの紹介（キャッチ〜機能一覧）

```markdown
# MyRecipeVolt 🍳

制限なし・広告なし。あなただけのレシピ帳

## はじめに

MyRecipeVoltは、お気に入りのレシピを一箇所にまとめて管理できるレシピ管理ツールです。URLを貼り付けるだけで自動でレシピ情報を取得でき、人数調整も簡単！

### 主な機能

- 📚 レシピ保存・検索・閲覧
- 🔗 URLからのインポート（クックパッド、クラシル、NHKきょうの料理など）
- ✏️ 手動でレシピを入力
- ❤️ お気に入り機能
- 👥 人数調整機能（材料の分量が自動計算）
- 📝 自分メモ機能
- 📱 スマートフォン対応
```

### 2. 使い方（デモンストレーション）

基本的な使用フローをステップバイステップで説明：
- URLインポートの手順
- 手動入力の手順
- レシピの閲覧・編集方法

### 3. 技術スタック

各技術の説明と選択理由：

| 技術 | 役割 | なぜ選んだか |
|------|------|-------------|
| Next.js 14.2.0 | Webアプリケーションフレームワーク | 高速なページ遷移、SSR対応 |
| React 18.3.1 | UIライブラリ | コンポーネントベースで再利用可能 |
| TypeScript 5 | 型安全な言語 | 型ミス防止、開発体験向上 |
| Tailwind CSS 4 | CSSフレームワーク | 迅速なスタイリング、ダークモード対応 |
| Supabase | データベース・認証 | フリーで使えるPostgreSQL、簡単設定 |
| Cheerio | スクレイピング | HTML解析が簡単、軽量 |

### 4. プロジェクト構造

ディレクトリ構造図と主要ファイルの説明：

```
MyRecipeVolt/
├── app/                          # アプリケーションの主要コード
│   ├── layout.tsx                 # レイアウト（ナビゲーションなど）
│   ├── page.tsx                   # ホームページ
│   ├── globals.css                # グローバルスタイル
│   ├── favorites/                 # お気に入りページ
│   ├── import/                    # URLインポートページ
│   ├── recipes/                   # レシピ関連ページ
│   │   ├── [id]/page.tsx        # レシピ詳細
│   │   └── new/page.tsx         # 新規レシピ作成
│   └── api/                      # APIルート
│       └── scrape/route.ts       # スクレイピングAPI
├── lib/
│   └── supabase.ts              # Supabaseクライアント設定
├── supabase/
│   └── schema.sql               # データベーススキーマ
└── public/                       # 静的ファイル
```

### 5. セットアップ方法

前提条件から実行までの手順：

```bash
# 1. Node.jsのバージョン確認
node --version  # 20.x以降が必要

# 2. 依存関係のインストール
npm install

# 3. 環境変数の設定（.env.localを作成）
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 4. データベースのセットアップ
# SupabaseのSQL Editorで supabase/schema.sql を実行

# 5. 開発サーバー起動
npm run dev
```

### 6. データベース構造

テーブルと関係を図で説明：

**テーブル一覧**:
- `recipes` - レシピ本体（id, title, image_url, servings, servings_count, category, note, is_favorite, created_at）
- `ingredients` - 材料（id, recipe_id, name, amount, order_index）
- `steps` - 手順（id, recipe_id, step_number, instruction）
- `tags` - タグマスター（id, name）
- `recipe_tags` - レシピ↔タグの中間テーブル
- `user_settings` - ユーザー設定（id, default_servings_count）

**リレーションシップ**:
```
recipes (1) ←→ (N) ingredients
recipes (1) ←→ (N) steps
recipes (1) ←→ (N) recipe_tags ←→ (N) tags
```

### 7. 主な機能の詳細

- **URLインポート機能**: `/api/scrape`でCheerioを使ってHTML解析、JSON-LDや専用パーサーで材料・手順を抽出
- **人数調整機能**: `servings_count`で基準人数を保存、ユーザーが変更すると比率で材料の分量を計算
- **検索機能**: デバウンス処理（400ms）でリクエスト軽減、カテゴリフィルタリング対応

### 8. 開発方法

コードの読み方と拡張方法：

- **App Router**: `app/`の構造がURLに対応
- **Server vs Client Components**: `"use client"`の有無で使い分け
- **新しいページの追加**: `app/xxx/page.tsx`を作成
- **新しいAPIの作成**: `app/api/yyy/route.ts`を作成
- **スタイリング**: Tailwind CSSクラスを使用

### 9. 注意事項・トラブルシューティング

- URLインポートの制限（ボット検知、SNS非対応）
- バックアップ機能がないため、重要なレシピは定期的にエクスポートを推奨
- よくあるエラーと解決策

## Critical Files（重要ファイル）

以下のファイルから情報を取得する：

- [package.json](MyRecipeVolt/package.json) - 依存関係、スクリプト、Node.js要件
- [supabase/schema.sql](MyRecipeVolt/supabase/schema.sql) - データベース構造
- [app/page.tsx](MyRecipeVolt/app/page.tsx) - メインページの構造例
- [app/api/scrape/route.ts](MyRecipeVolt/app/api/scrape/route.ts) - スクレイピング機能の実装
- [lib/supabase.ts](MyRecipeVolt/lib/supabase.ts) - データベース接続設定

## Verification（検証）

README作成後に以下を確認：

1. **読みやすさチェック**
   - 専門用語には簡単な説明が含まれているか
   - ステップが明確で追いやすいか
   - コード例がコピー＆ペーストで使えるか

2. **動作確認**
   - セットアップ手順に従って環境構築できるか
   - `npm run dev`でアプリが起動するか

3. **技術的正確性**
   - 使用されている技術とバージョンが正しいか
   - ファイルパスが正確か
   - コード例が実際の実装と一致しているか

## Implementation Notes（実装のポイント）

- 日本語で書く
- 専門用語には（ ）で簡単な説明を添える
- 表や図を効果的に使う
- 実際のコード例やコマンド例を含める
- 初心者でも理解できる優しい言葉で書く
- バイブコーディングの学習成果として活用できるようにする
