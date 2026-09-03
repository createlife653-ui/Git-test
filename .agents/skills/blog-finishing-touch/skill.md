---
name: blog-finishing-touch
description: コーヒーブログ記事の仕上げを行い、baselineを参照してAI文章残存率・AI工程関与率・人間独自価値率を追加します。
triggers:
  - 仕上げして
  - 記事を仕上げて
  - blog-finishing-touch
  - 仕上げスキル
  - 記事の仕上げ
  - まとめて仕上げ
parameters:
  source:
    type: string
    description: 記事のファイルパス（オプション）。指定がない場合はIDEで開いているファイルを使用します
  category:
    type: string
    description: カテゴリ（オプション）。指定がない場合は記事内容から自動推論します
  image_keywords:
    type: string
    description: 画像選択用キーワード（オプション）。指定がない場合は記事内容から抽出します
---

コーヒーブログ記事の仕上げを行うスキルです。

**目的**: 記事に必要なフロントマター、ヘッダー画像、AI活用度を一括で追加します。

**フロー**:
1. 記事を読み込み、内容を分析
2. フロントマターを生成・追加
   - タイトル抽出（H1見出しから）
   - slug生成
   - category推論
   - date（今日）
   - readTime計算
   - image選択（Unsplash）
   - tags抽出
   - excerpt生成
3. 対応するAI baselineとsourceFilesを確認
4. 3指標のAI活用度を計算し、フロントマターと記事末尾へ追加

**使用例**: 「この記事を仕上げて」「仕上げして」
