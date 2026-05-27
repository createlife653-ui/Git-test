# ブログ記事「仕上げ」スキル作成計画

## Context

ブログ記事を作成する際、毎回以下の作業を繰り返しています：
1. フロントマターの追加
2. ヘッダー画像の設定
3. AI活用度の計算と追加

これらを「仕上げ」という一つのスキルで自動化することで、作業効率を向上させます。

既存スキル：
- `coffee-blog-post`: ケーススタディ→ブログ記事の変換
- `ai-involvement-calculator`: AI活用度の計算

## 推奨アプローチ

「仕上げ」スキルは既存の `ai-involvement-calculator` を拡張し、フロントマターと画像の処理も含める形で作成します。

### スキル名
`blog-finishing-touch`（ユーザー選択）

### 機能

1. **フロントマターの追加・更新**
   - タイトル抽出（H1見出しから）
   - slug生成（ファイル名またはタイトルから）
   - category推論（記事内容から）
   - date（今日の日付）
   - readTime（文字数から計算）
   - image（Unsplashから適切な画像を選択）
   - tags（内容から推論）
   - excerpt（要約生成）

2. **ヘッダー画像の選択**
   - 記事内容に基づいたキーワード抽出
   - Unsplashから適切な画像URLを選択
   - キーワード例: coffee, beans, roasting, brewing, ethiopia, indonesia 等

3. **AI活用度の計算と追加**
   - `ai-involvement-calculator` のロジックを統合
   - 記事の最後に「この記事のAI活用度」セクションを追加

### ファイル構成

```
.claude/skills/blog-finishing-touch/
├── skill.md          # スキル定義
├── prompt.md         # プロンプト
└── description.md    # 説明文
```

### カテゴリ自動推論ルール

記事内容から以下のカテゴリを自動推論：

| 推論キーワード | カテゴリ |
|---------------|---------|
| 産地名、農園名、精製法、テイスティング | Tasting Notes |
| 選び方、基礎知識、初心者 | Guide |
| 淹れ方、抽出、レシピ、ハンドドリップ | Brewing Guides |
| 焙煎、ロースト、浅煎り、深煎り | Roast Profiles |
| マインドフルネス、生活、メリット | Coffee Life |
| AI、サイト運営、透明性 | Journal |
| 考察、思考、深い理解 | Essay |
| 私の旅、始まり、ストーリー | Personal |

### トリガー例
- 「仕上げして」「記事を仕上げて」「shiwake」「仕上げスキル」

## 実装手順

1. スキル定義ファイル (`skill.md`) の作成
   - name: `coffee-blog-shiwake`
   - description: コーヒーブログ記事の仕上げ（フロントマター、画像、AI活用度）
   - triggers: 仕上げして、記事を仕上げて、shiwake

2. プロンプトファイル (`prompt.md`) の作成
   - ai-involvement-calculator のロジックを統合
   - フロントマター生成ロジック
   - 画像選択ロジック

3. 動作確認
   - 実際の記事でテスト
   - 既存記事との整合性確認

## 既存スキルとの関係

- `coffee-blog-post`: 記事作成後に呼び出すことができる
- `ai-involvement-calculator`: 内部的に利用または統合

## 修正ファイル

- 新規: `.claude/skills/blog-finishing-touch/skill.md`
- 新規: `.claude/skills/blog-finishing-touch/prompt.md`
- 新規: `.claude/skills/blog-finishing-touch/description.md`

## 検証方法

1. テスト記事（フロントマターなし）を用意
2. スキルを実行
3. 以下を確認：
   - フロントマターが正しく追加されている
   - カテゴリが適切に推論されている
   - readTimeが正しく計算されている
   - 画像URLが有効
   - AI活用度が正しく計算・追加されている
