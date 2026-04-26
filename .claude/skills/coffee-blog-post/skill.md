---
name: coffee-blog-post
description: コーヒーブログの記事作成をサポートします。ケーススタディファイルから情報を抽出・補強し、ユーザーが自分の言葉で記事を書けるよう補助します。または、ユーザーの要望に基づいて記事を作成します。
triggers:
  - ブログ記事を書いて
  - 記事を書いて
  - ブログを作成して
  - 記事を作成して
  - case study をブログに
  - ケーススタディをブログに
  - これをブログ記事に
  - これをもとにブログを
  - コーヒーブログスキル
parameters:
  source:
    type: string
    description: ソースファイルのパス（オプション）。指定がない場合はIDEで開いているファイルを使用
  title:
    type: string
    description: 記事タイトル（オプション）
  auto_create:
    type: boolean
    description: trueの場合、情報収集後に自動的に記事を作成します（デフォルト: false）
---

コーヒーブログの記事作成を**支援**するスキルです。記事の本文はユーザーがご自身で書きますが、要望があれば記事を作成することもできます。
