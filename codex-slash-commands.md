# Codex のスラッシュコマンドまとめ

確認日: 2026-06-06  
主な参照元: OpenAI Codex Manual

## スラッシュコマンドとは

Codex の入力欄で `/` を入力すると出てくる、セッション操作用のショートカットです。モデル変更、権限変更、レビュー開始、状態確認、会話の圧縮などを、通常の文章指示より素早く実行できます。

使い方は基本的に次の流れです。

1. Codex の入力欄で `/` を入力する。
2. 候補一覧から選ぶか、`/status` のようにコマンド名を続けて入力する。
3. Enter で実行する。

CLI では、Codex が作業中でもスラッシュコマンドを入力して Tab を押すと、次のターンに実行するコマンドとしてキューできます。

## まず覚えると便利なコマンド

| コマンド | 何をするか | 使いどころ |
| --- | --- | --- |
| `/status` | セッション状態、モデル、権限、トークン使用量などを表示 | いま Codex がどう動いているか確認したい |
| `/diff` | Git diff と未追跡ファイルの変更を表示 | Codex が編集した内容を確認したい |
| `/review` | 作業ツリーのレビューを依頼 | 変更後にバグやリスクを見てほしい |
| `/model` | 使用モデルを変更 | 軽い作業と深い推論を切り替えたい |
| `/permissions` | Codex が許可なしにできることを変更 | 自動実行を強める、または読み取り中心に戻したい |
| `/plan` | Plan mode に切り替える | 実装前に手順や設計を整理したい |
| `/goal` | 長めの作業目標を設定、表示、停止、再開、削除 | 複数ターンで大きな目標を追わせたい |
| `/compact` | 長い会話を要約してコンテキストを節約 | 長時間作業で文脈が膨らんだ |
| `/clear` | 画面をクリアし、新しい会話を開始 | 同じ CLI セッション内で仕切り直したい |
| `/new` | 新しい会話を開始 | 今の文脈を切って別件を始めたい |
| `/resume` | 保存済み会話を再開 | 過去の作業に戻りたい |
| `/quit` または `/exit` | CLI を終了 | セッションを終える |

## CLI で使える主なコマンド

Codex CLI では、次のようなコマンドが使えます。利用できるものはバージョン、設定、権限、環境によって変わることがあります。

| 分類 | コマンド |
| --- | --- |
| 状態確認 | `/status`, `/debug-config`, `/mcp`, `/ps` |
| 変更確認・レビュー | `/diff`, `/review`, `/copy` |
| モデル・速度・話し方 | `/model`, `/fast`, `/personality` |
| 権限・安全 | `/permissions`, `/approve`, `/sandbox-add-read-dir` |
| 会話管理 | `/compact`, `/clear`, `/new`, `/resume`, `/fork`, `/side`, `/btw` |
| 目標・計画 | `/plan`, `/goal` |
| 拡張・設定 | `/skills`, `/plugins`, `/apps`, `/hooks`, `/experimental`, `/memories` |
| UI・入力 | `/keymap`, `/vim`, `/raw`, `/statusline`, `/title`, `/theme` |
| その他 | `/ide`, `/mention`, `/init`, `/feedback`, `/logout`, `/stop`, `/quit`, `/exit` |

## Codex アプリで使える主なコマンド

Codex アプリでは、スレッドの入力欄で `/` を入力して使います。代表的なものは次の通りです。

| コマンド | 何をするか |
| --- | --- |
| `/feedback` | フィードバックを送信 |
| `/goal` | 継続的な作業目標を設定 |
| `/mcp` | 接続中の MCP サーバー状態を表示 |
| `/plan` | Plan mode を切り替え |
| `/review` | 未コミット変更やベースブランチとの差分をレビュー |
| `/status` | スレッド ID、コンテキスト使用量、レート制限などを表示 |

アプリでは、明示的にスキルを呼ぶ場合に `$` を入力します。有効なスキルはスラッシュコマンド一覧にも表示されることがあります。

## IDE 拡張で使える主なコマンド

Codex IDE extension でも、チャット入力欄で `/` を入力して使います。

| コマンド | 何をするか |
| --- | --- |
| `/auto-context` | 最近のファイルや IDE コンテキストを自動で含める設定を切り替え |
| `/cloud` | cloud mode に切り替え |
| `/cloud-environment` | cloud mode で使う環境を選択 |
| `/feedback` | フィードバック送信 |
| `/goal` | 継続的な作業目標を設定 |
| `/local` | local mode に切り替え |
| `/review` | 未コミット変更やベースブランチとの差分をレビュー |
| `/status` | スレッド ID、コンテキスト使用量、レート制限などを表示 |

`/goal` が出ない場合は、`config.toml` で `features.goals` を有効にします。

```toml
[features]
goals = true
```

CLI から有効化する場合は、次のコマンドも使えます。

```bash
codex features enable goals
```

## カスタムのスラッシュコマンドについて

Codex には、Markdown ファイルを置いて `/prompts:名前` のように呼び出す custom prompts があります。ただし、公式マニュアルでは custom prompts は deprecated とされており、再利用可能な指示には skills の利用が推奨されています。

それでも custom prompts を使う場合の基本は次の通りです。

1. `~/.codex/prompts` を作る。
2. その中に `draftpr.md` のような Markdown ファイルを置く。
3. Codex を再起動する。
4. `/prompts:draftpr` のように呼び出す。

例:

```markdown
---
description: Draft PR を作るための手順
argument-hint: [FILES=] [PR_TITLE=""]
---

指定されたファイルを確認し、変更内容を要約して、Draft PR 用の説明文を作ってください。
対象ファイル: $FILES
PR タイトル: $PR_TITLE
```

引数には `$1` から `$9`、`$ARGUMENTS`、または `$FILE` や `$TICKET_ID` のような名前付きプレースホルダーを使えます。スペースを含む値は `FOCUS="loading state"` のように引用符で囲みます。

## 使い分けのコツ

- いまの状態を知りたい: `/status`
- 変更を見たい: `/diff`
- 実装前に考えてほしい: `/plan`
- 長い作業を継続させたい: `/goal`
- 作業後に見直してほしい: `/review`
- 権限が強すぎる、または弱すぎる: `/permissions`
- 文脈が長くなりすぎた: `/compact`
- 再利用できる作業手順を作りたい: custom prompts ではなく、まず skills を検討する

## 割り込み相談と ChatGPT っぽい相談

作業中に「ちょっとだけ聞きたい」場合は、CLI の `/side` または `/btw` が向いています。メインの作業文脈を大きく動かさず、横道の質問をするための一時的な会話として使えます。

```text
/side このエラーって何が原因っぽい？
/btw この関数名、もっと良い案ある？
```

ChatGPT のように方針を相談したい、実装前に考えを整理したい、選択肢を比較したい場合は `/plan` が向いています。すぐに編集やコマンド実行へ進ませず、まず計画や判断材料を出してもらう用途です。

```text
/plan この機能を作るなら、どんな設計がよさそう？
/plan リファクタする前に方針を相談したい
```

別案を試したい場合は `/fork`、完全に別件として始めたい場合は `/new`、長く追いかける目標にしたい場合は `/goal` を使います。

## 注意点

- 利用できるコマンドは CLI、Codex アプリ、IDE extension で異なります。
- コマンド一覧は環境、アクセス権、設定、機能フラグによって変わります。
- `/quit` と `/exit` は CLI を終了します。必要な変更の保存やコミットを確認してから使うと安心です。
- `/clear` は Ctrl+L と違い、新しい会話を開始します。単に表示だけを消したい場合は Ctrl+L の方が向いています。
- custom prompts は deprecated です。チーム共有や自動呼び出しも考えるなら skills の方が適しています。

## 参照元

- OpenAI Codex Manual: Slash commands in Codex CLI (`/codex/cli/slash-commands.md`)
- OpenAI Codex Manual: Codex app commands (`/codex/app/commands.md`)
- OpenAI Codex Manual: Codex IDE extension slash commands (`/codex/ide/slash-commands.md`)
- OpenAI Codex Manual: Custom Prompts (`/codex/custom-prompts.md`)
