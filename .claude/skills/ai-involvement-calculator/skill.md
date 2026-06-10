---
name: ai-involvement-calculator
description: コーヒーブログ記事のAI活用度を、AI文章残存率・AI工程関与率・人間独自価値率の3指標で計算します。
triggers:
  - AI活用度を計算
  - 記事のAI活用度
  - この記事のAI比率
  - ai-involvement-calculator
parameters:
  source:
    type: string
    description: 完成記事のファイルパス（オプション）。指定がない場合はIDEで開いているファイルを使用します
  baseline:
    type: string
    description: AI下書きのファイルパス（オプション）。指定がない場合は記事のslugからcoffee-blog/.ai-baselines/内を探索します
---

コーヒーブログ記事のAI活用度を3つの観点で計算するスキルです。

**目的**: AIが残した文章、制作工程への関与、人間が提供した独自価値を分けて可視化します。

**3つの指標**:
1. **AI文章残存率**: AI下書きの文章が完成稿に残っている割合
2. **AI工程関与率**: 企画・構成・調査・本文作成・推敲にAIが関与した割合
3. **人間独自価値率**: 実体験・実測・比較・失敗・独自判断が記事に占める割合

**フロー**:
1. 完成記事と対応するAI baselineを読み込む
2. 人間由来のsourceFilesを除外してAI文章残存率を計算
3. baselineの工程メタデータからAI工程関与率を計算
4. 完成稿を段落単位で評価して人間独自価値率を計算
5. 3指標の値、根拠、測定方法、限界を表形式で表示

baselineがない場合、AI文章残存率は推測せずユーザーの手動申告値を使用し、測定元を`manual`と明記します。

**使用例**: 「この記事のAI活用度を計算して」「AI活用度を計算」
