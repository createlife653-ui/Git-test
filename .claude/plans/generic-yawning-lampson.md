# Coffee Blog 実装計画

## コンテキスト
`coffee-asset` リポジトリで蓄積したコーヒーの知識資産（Markdownファイル）を、一般層向けのブログとして発信するサイトを構築する。

**目的**:
- コーヒーの知識を体系立てて情報発信・記録
- ポートフォリオとして技術的な実装をアピール
- 将来的な収益化（電子書籍、有料コンテンツ等）につなげる

**ターゲット**: コーヒーが好きな一般層（専門用語は分かりやすく解説）

---

## 推奨アプローチ: Next.js + MDX + shadcn/ui

### 技術スタック
- **Next.js 15** (App Router) - モダンで高速、SEOに強い
- **MDX** - MarkdownとReactコンポーネントを融合
- **shadcn/ui** - 美しいUIコンポーネント
- **TypeScript** - 型安全
- **Tailwind CSS** - スタイリング
- **Vercel** - デプロイ

### プロジェクト構成
```
coffee-knowledge/
├── app/
│   ├── page.tsx           # ホーム（記事一覧）
│   ├── about/page.tsx     # アバウト
│   ├── blog/
│   │   ├── [slug]/page.tsx  # 個別記事ページ
│   │   └── page.tsx         # ブログ一覧
│   └── layout.tsx
├── content/               # Markdown記事を配置
│   └── posts/
├── components/
│   └── ui/               # shadcn/uiコンポーネント
└── lib/
    └── mdx.ts            # MDX設定
```

---

## 実装ステップ

### 1. プロジェクト初期化
```bash
npx create-next-app@latest coffee-blog --typescript --tailwind --app
cd coffee-blog
npx shadcn@latest init
```

### 2. MDX設定
- `@next/mdx` と `@mdx-js/loader` をインストール
- MDXファイルを`content/posts/`から読み込む設定
- フロントマター対応（タイトル、日付、タグ、概要）

### 3. 記事ページ作成
- 動的ルート `/blog/[slug]` で個別記事表示
- 目次（Table of Contents）生成
- シンタックスハイライト
- シェアボタン（X, Facebook）

### 4. ホームページ
- ヒーローセクション（サイトの説明）
- 最新記事5件をカード表示
- タグクラウド

### 5. タグ検索
- 各記事のフロントマターからタグ抽出
- タグでフィルタリング機能
- `/blog/tag/[tag]` ページ

### 6. デザイン
- **テーマ**: レザーアカデミック（革製品のような知的な高級感）
- **コンセプト**: 知識を探求するシリアスな姿勢、調査・研究のツールとしての印象
- **配色**:
  - メイン背景: ディープブラック (#0A0A0A)
  - セクション背景: ダークブラウン (#1A1410)
  - カード・ボーダー: レザーブラウン (#3D2B1F)
  - アクセント: コーヒーチェリー (#8B3A3A) - 赤みを帯びた茶色
  - 本文テキスト: クリームホワイト (#F5F0E8)
  - 強調・カード背景: 純白 (#FFFFFF)
  - サブテキスト: グレー (#9CA3AF)
- **タイポグラフィ**: Noto Sans JP / Inter、太字使い分け、明朝体との併用で知的印象
- **スタイル要素**:
  - 革テクスチャ風の微細なパターン
  - シャープなエッジと角丸
  - 余白を活かしたレイアウト
  - 紙のような質感のカード
- レスポンシブ対応
- ダークモード標準（ライトモードはオプション）

### 7. SEO・アクセシビリティ
- メタデータ設定
- sitemap.xml生成
- robots.txt
- 構造化データ（JSON-LD）

### 8. オプション機能（将来的に）
- RSSフィード
- ニュースレター登録
- 検索機能

---

## 既存コンテンツの移行方針
- まずは新規記事から作成開始
- `coffee-asset/02_case_studies/` から良さそうな記事を選んで編集
- 専門用語には注釈を入れるなど、一般層向けにリライト

---

## クリティカルファイル
- **作成**: `app/page.tsx`, `app/blog/[slug]/page.tsx`, `lib/mdx.ts`, `next.config.mjs`
- **既存参照**: `coffee-asset/02_case_studies/` の記事構造

---

## 検証方法
1. `npm run dev` でローカル起動
2. 記事が正しく表示されるか確認
3. タグフィルタリングが動作するか確認
4. レスポンシブデザインを確認
5. LighthouseでSEO・パフォーマンス確認
6. Vercelにデプロイして公開

---

## Stitch by Google - デザインプロンプト

Stitchでデザインを作成するためのプロンプト集です。まずデザインプロトタイプを作成し、それを参考に実装します。

### 1. ホームページ
```
A coffee blog homepage with warm, inviting design. Hero section with the title "Coffee Knowledge" and subtitle "日常のコーヒーを知識資産に". Below the hero, a grid of 6 latest article cards with coffee-themed images, titles, excerpts, and dates. A tag cloud section on the right sidebar. Footer with newsletter signup form. Color palette: warm brown (#4A3728), cream (#F5F0E8), dark coffee (#2C1810). Clean, modern typography with Japanese text support.
```

### 2. ブログ記事ページ
```
A blog article page for a coffee knowledge website. Large hero image at top. Article title "エチオピア咖啡豆の特徴" in bold. Author profile photo and name on the left side. Publication date and reading time. Table of contents on the right sidebar (sticky). Main content area with well-formatted text, code blocks, and coffee tasting notes in a styled card. Related articles section at bottom. Social share buttons (X, Facebook) floating on the left. Same warm color scheme as homepage.
```

### 3. ブログ一覧ページ
```
A blog listing page for coffee knowledge website. Page title "記事一覧" with subtitle "すべてのコーヒー知識". Two-column grid layout of article cards. Each card shows: coffee bean image, category tag (Principles/Frameworks/Case Studies), title, excerpt, date, and read time. Filter buttons on top: All, Principles, Frameworks, Case Studies. Search bar in header. Load more button at bottom. Pagination.
```

### 4. アバウトページ
```
An about page for coffee knowledge blog. Large hero section with "About Coffee Knowledge" title. Three-column feature cards explaining: 1) Coffee tasting logs 2) Knowledge frameworks 3) Learning resources. "About the author" section with photo, bio, and social links. Mission statement section. Contact form at bottom. Minimal, clean design with focus on typography and whitespace.
```

### Stitchの使い方フロー
1. **Stitchにアクセス**: https://stitch.withgoogle.com/
2. **Googleアカウントでログイン**
3. **プロンプトを入力**: 上記のプロンプトを貼り付け
4. **生成結果を確認**: 複数のバリエーションから選択
5. **調整**: 必要に応じてプロンプトを修正して再生成
6. **エクスポート**: Figmaまたは画像としてエクスポート
7. **実装**: エクスポートしたデザインを参考にNext.jsで実装
