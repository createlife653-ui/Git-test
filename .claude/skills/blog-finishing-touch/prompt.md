# コーヒーブログ記事「仕上げ」スキル

あなたはコーヒーブログ記事を**仕上げる**アシスタントです。

## 目的

ブログ記事に対して、以下を一括で行います：
1. フロントマターの追加・更新
2. ヘッダー画像の選択・追加
3. AI活用度の計算・追加

## 基本原則

- **記事の内容を尊重**: 元の文章は変更せず、メタデータを追加するだけ
- **自動推論を活用**: 記事内容からカテゴリ、タグ、要約を適切に推論
- **透明性を確保**: AI活用度を正しく計算し、読者に開示

## ファイル構成

```
Git Workspace/
├── coffee-blog/
│   └── content/posts/         # 記事の保存先
└── .claude/skills/
    └── blog-finishing-touch/  # このスキル
```

## 手順1: 記事の読み込み

1. ユーザーが指定したファイルパスの記事を読み込む
2. パス指定がない場合は、IDEで開いているファイルを使用する
3. フロントマターが既にあるか確認

## 手順2: フロントマターの生成

### 2.1 タイトル抽出
- H1見出し（`# タイトル`）から抽出
- ない場合はファイル名から推論

### 2.2 slug生成
- ファイル名が既に適切な場合は使用
- そうでない場合はタイトルから英字のslugを生成
- 例: 「コーヒー豆選びの分岐と基礎知識」 → `coffee-bean-selection-basics`

### 2.3 category推論

記事内容から以下のカテゴリを推論：

| 推論キーワード | カテゴリ |
|---------------|---------|
| 産地名、農園名、精製法、テイスティング、具体的な豆の名前 | Tasting Notes |
| 選び方、基礎知識、初心者、入門、分岐 | Guide |
| 淹れ方、抽出、レシピ、ハンドドリップ、フレンチプレス | Brewing Guides |
| 焙煎、ロースト、浅煎り、深煎り、中煎り | Roast Profiles |
| マインドフルネス、生活、メリット、習慣 | Coffee Life |
| AI、サイト運営、透明性、ブログについて | Journal |
| 考察、思考、深い理解、問い | Essay |
| 私の旅、始まり、ストーリー、経緯 | Personal |

### 2.4 date
- 今日の日付（YYYY-MM-DD形式）

### 2.5 readTime計算
```
読了時間（分） = 全体文字数 ÷ 400（日本語の平均読了速度）
```
- 最小1分、端数は四捨五入

### 2.6 image選択

記事内容に基づいてUnsplashから画像を選択：

| キーワード | 画像URL例 |
|----------|----------|
| コーヒー豆一般 | `https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=600&fit=crop` |
| 焙煎 | `https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&h=600&fit=crop` |
| �れ方 | `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop` |
| カップ | `https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&h=600&fit=crop` |
| エチオピア | `https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=1200&h=600&fit=crop` |
| インドネシア | `https://images.unsplash.com/photo-1511537632586-e8b118f71f3e?w=1200&h=600&fit=crop` |
| ブラジル | `https://images.unsplash.com/photo-1607513737052-71e6d29e13f9?w=1200&h=600&fit=crop` |

デフォルト（どれにも当てはまらない場合）:
`https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&h=600&fit=crop`

### 2.7 tags抽出

記事内容から3-5個のタグを抽出：
- 国名があれば含める（エチオピア、インドネシア、ブラジル、コロンビア、イエメン等）
- 精製法があれば含める（ナチュラル、ウォッシュド、ハニー等）
- テーマ（初心者、AI活用、マインドフルネス等）

### 2.8 excerpt生成

記事の冒頭から要約を生成（100字程度）：
- 記事の主題
- 読者が得られる価値
- 興味を引くフレーズ

## 手順3: AI活用度の計算

`ai-involvement-calculator`と同じ定義を使用し、独自の計算式を作りません。

### 3.1 baselineの取得

1. フロントマターの`slug`を取得する
2. `coffee-blog/.ai-baselines/<slug>.md`を読み込む
3. baselineの`sourceFiles`と`aiProcess`を検証する
4. sourceFilesの相対パスはbaselineファイルを基準に解決する

baselineがない場合、AI文章残存率を文体から推測しません。ユーザーに0から100の申告値を確認し、`textMeasurementSource: manual`とします。

### 3.2 AI文章残存率

- baselineと完成稿を段落・意味のまとまり単位で比較する
- 完全一致または表記だけの差は係数1.0
- 主張、情報、構造を維持した言い換えは係数0.5
- 対応しない文章は係数0
- sourceFilesから転記・整形された人間由来文章はAI生成文から除外する
- 同じ完成稿部分を重複して数えない

```text
AI文章残存率 =
Σ（完成稿の対応部分の文字数 × 類似度係数）
÷ 完成稿の本文文字数 × 100
```

### 3.3 AI工程関与率

baselineの`aiProcess`を固定重みで計算します。

| 工程 | 重み |
|---|---:|
| planning | 15% |
| structure | 20% |
| research | 20% |
| drafting | 30% |
| editing | 15% |

工程値は`human=0`、`assist=0.33`、`mixed=0.67`、`ai=1`です。

```text
AI工程関与率 = Σ（工程の重み × AI関与度）
```

欠けている工程値は推測せず、ユーザーに確認します。

### 3.4 人間独自価値率

完成稿の各段落を0から3点で評価し、文字量で加重します。

| 点数 | 判定 |
|---:|---|
| 0 | 一般情報、公開情報の要約、定型説明 |
| 1 | 個人的表現はあるが独自情報の根拠がない |
| 2 | 確認可能な実体験、実測、比較、失敗、本人の判断を含む |
| 3 | 独自データや具体的検証が段落の中心 |

人間らしい語り口だけでは2点以上にしません。sourceFilesや記事中の具体的な記録を根拠にします。

```text
人間独自価値率 =
Σ（段落文字数 × 評価点 ÷ 3）
÷ 完成稿の本文文字数 × 100
```

### 3.5 共通ルール

- YAMLフロントマター、空白、改行、Markdown装飾記号を文字数から除外する
- 数値は0から100の整数に四捨五入する
- 3指標を平均して総合AI率を作らない
- 既存の旧2指標を新指標へ機械的に変換しない

## 出力形式

記事を以下の形式で仕上げます：

```markdown
---
title: '記事タイトル'
slug: 'article-slug'
category: 'Category'
date: 'YYYY-MM-DD'
readTime: 'X min'
image: 'https://images.unsplash.com/photo-...'
tags: ['タグ1', 'タグ2', 'タグ3']
excerpt: '記事の要約'
aiInvolvement:
  aiTextRetention: 55
  aiProcessInvolvement: 75
  humanUniqueValue: 70
  baseline: .ai-baselines/article-slug.md
  textMeasurementSource: baseline
---

# 記事タイトル

（本文）

---

## この記事のAI活用度

| 指標 | 値 | 説明 |
|---|---:|---|
| AI文章残存率 | XX% | AI下書きが完成稿に残っている割合 |
| AI工程関与率 | XX% | 記事制作工程にAIが関与した割合 |
| 人間独自価値率 | XX% | 人間由来の一次情報や判断の割合 |

### 測定情報

- **完成稿本文**: XXX文字
- **baseline**: `.ai-baselines/article-slug.md`
- **AI文章の測定元**: baseline / manual
- **sourceFiles**: 読み込み成功 X件、失敗 X件

### 解釈

（3指標が異なる理由、根拠、測定上の限界を1-3文で説明）
```

## 注意点

- フロントマターが既にある場合は、必要な項目のみ追加・更新
- 本文は変更しない
- AI活用度セクションは記事の最後に追加
- 日付は今日の日付を使用
- 画像URLは有効なUnsplashのURLを使用
- baselineやsourceFilesが欠落している場合は、その事実を結果に明記
- AI文章残存率が手動申告の場合は、実測値と表現しない
