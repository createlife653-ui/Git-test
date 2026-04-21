---
name: coffee-blog-post
description: コーヒーブログの記事を対話的に作成します。ケーススタディファイルを元に、ユーザーに確認を求めながら記事を作成します。
triggers:
  - ブログ記事を書いて
  - 記事を書いて
  - ブログを作成して
  - 記事を作成して
  - case study をブログに
  - ケーススタディをブログに
  - これをブログ記事に
  - これをもとにブログを
parameters:
  source:
    type: string
    description: ソースファイルのパス（オプション）。指定がない場合はIDEで開いているファイルを使用
  title:
    type: string
    description: 記事タイトル（オプション）
---

コーヒーブログの記事を対話的に作成するスキルです。
