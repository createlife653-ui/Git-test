@AGENTS.md

# Coffee Blog

コーヒーについて書くブログです。

## 記事のルール

- トピック：コーヒーに関する全て（淹れ方、豆、道具、お店など）
- 目的：自分の記録と共有

## AIへの指示

### 文章の添削
- 文法や表現に誤りやわかりにくいところがあったら直す
- 事実は変更しない
- 文章の雰囲気は維持する

---

## Webサイト作成のルール

### 技術スタック
- **フレームワーク**: Next.js (App Router)
- **スタイリング**: Tailwind CSS
- **デザインシステム**: Editorial Muse
- **フォント**: Noto Sans JP（日本語対応）

### デザインシステム（Editorial Muse）
- ミニマルでエレガントな雑誌風デザイン
- カラーパレット:
  - 背景: `#ffffff`, `#f9f9f9`
  - テキスト: `#1a1a1a`
  - アクセント: `#c4a77d`（コーヒーを意識したゴールドブラウン）
- タイポグラフィ: 読みやすさを重視した適切な行間・字間

### ファイル構成
```
coffee-blog/
├── app/
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # トップページ
│   ├── blog/
│   │   ├── page.tsx      # 記事一覧ページ
│   │   └── [id]/
│   │       └── page.tsx  # 個別記事ページ（動的ルート）
│   ├── about/
│   │   └── page.tsx      # Aboutページ
│   └── components/       # UIコンポーネント
├── content/
│   └── posts/            # 記事のMarkdownファイル
├── lib/                  # ユーティリティ関数
│   └── posts.ts          # 記事読み込みユーティリティ
└── public/               # 静的アセット
```

### 新しいページを追加する方法
1. `app/` ディレクトリ内に新しいフォルダを作成
2. その中に `page.tsx` を作成
3. 必要に応じて `layout.tsx` も作成

例: `/about` ページを追加する場合
```
app/
└── about/
    └── page.tsx
```

### 記事を追加する方法
1. `content/posts/` ディレクトリに `.md` ファイルを作成
2. フロントマター（YAML）でメタデータを記述
3. Markdownで本文を書く

例: `content/posts/new-article.md`
```markdown
---
title: '記事タイトル'
slug: 'new-article'
category: 'Tasting Notes'
date: '2024-04-20'
readTime: '5 min'
image: 'https://images.unsplash.com/...'
tags: ['タグ1', 'タグ2']
excerpt: '記事の要約'
---

# 記事本文

ここにMarkdownで本文を書きます。
```

### コンポーネント作成のルール
- コンポーネントは `components/` ディレクトリに配置
- Tailwind CSSのクラスを使用
- 再利用性を意識して小さく分割
- 日本語コンテンツに対応

### スタイリングのルール
- Tailwind CSSのユーティリティクラスを使用
- カスタムカラーが必要な場合は `tailwind.config.ts` に追加
- レスポンシブデザインを意識（モバイルファースト）
- コーヒーをテーマにした温かみのあるデザインを維持

### AIへの具体的な指示
- 新しい機能やページを追加する際は、まず既存のファイル構成を確認
- Editorial Museのデザインシステムに従ってスタイリング
- 日本語のコンテンツに適切なフォントとスタイルを適用
- コードを書く前に、ユーザーに実装方法を説明
- Next.jsの最新のベストプラクティスに従う