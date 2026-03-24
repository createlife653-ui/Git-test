# マルチエージェントブレインストーミング

複数のAIエージェントが協力してブレインストーミングを行うPythonツール。

## 特徴

- **多様なペルソナ**: 7種類のプリセットペルソナ（ファシリテーター、クリエイター、批評家、楽観主義者、現実主義者、専門家、ユーザー擁護者、デビルズアドボケート）
- **柔軟なチーム構成**: 推奨チームタイプから選択、またはカスタム組成
- **複数の出力形式**: テキスト、マークダウン、CSV、JSON
- **Ollama対応**: ローカルLLM環境でプライベートに実行
- **設定可能**: 温度パラメータ、ラウンド数、モデルなどが調整可能

## インストール

### 前提条件

- Python 3.10+
- [Ollama](https://ollama.com/)（ローカルLLM実行環境）

### セットアップ

1. リポジトリをクローン

```bash
git clone <repository-url>
cd multi_agent_brainstorming
```

2. 依存関係をインストール

```bash
pip install -r requirements.txt
```

3. Ollamaでモデルをダウンロード

```bash
# llama3.2（推奨）
ollama pull llama3.2

# または他のモデル
ollama pull mistral
ollama pull gemma2
ollama pull qwen2.5
```

4. Ollamaサーバーを起動

```bash
ollama serve
```

## 使用方法

### コマンドラインから実行

```bash
# 基本的な使用
python main.py "新しい製品のアイデア"

# イノベーション重視のチームで実行
python main.py "気候変動対策" --team innovation

# ラウンド数を指定
python main.py "リモートワークの課題" --rounds 5

# 結果をマークダウン形式で保存
python main.py "チームビルディング" --output md

# カスタムモデルを使用
python main.py "次世代のスマートフォン" --model mistral --temperature 0.9
```

### コマンドラインオプション

```
位置引数:
  topic                ブレインストーミングのテーマ

オプション:
  -h, --help           ヘルプを表示
  --team, -t           チームタイプ
                       choices: balanced, innovation, practical, full_diversity
                       default: balanced
  --rounds, -r         ラウンド数 (default: 3)
  --model, -m          使用するモデル
                       choices: llama3.2, mistral, gemma2, qwen2.5
                       default: llama3.2
  --temperature        温度パラメータ 0.0-1.0 (default: 0.8)
  --output, -o         出力形式
                       choices: text, md, markdown, csv, json, all
                       default: text
  --output-dir         出力ディレクトリ (default: output)
  --no-shuffle         発言順のシャッフルを無効化
  --verbose, -v        詳細ログを表示
```

### Pythonスクリプトから使用

```python
from agents import AgentFactory
from conversation import ConversationManager
from output import FileOutput, OutputFormatter

# エージェントファクトリーの作成
factory = AgentFactory()

# チームの作成
agents = factory.create_diverse_team(team_type="balanced")

# 会話マネージャーの作成
manager = ConversationManager()
manager.add_agents(agents)

# ブレインストーミングの実行
result = manager.run_brainstorm("新しいカフェのコンセプト")

# 結果の表示
print(OutputFormatter.format_text(result))

# ファイルに保存
file_output = FileOutput()
file_output.save_markdown(result)
```

## ペルソナ一覧

| ペルソナ | 役割 | 特徴 |
|---------|------|------|
| facilitator | 司会者 | 公平で建設的、議論をまとめるのが得意 |
| creative | 創造的思考者 | 自由な発想で斬新なアイデアを提案 |
| critic | 分析的思考者 | 論理的で批判的、リスクを見抜くのが得意 |
| optimist | 肯定的精神者 | 前向きで励ますのが得意、可能性を信じる |
| realist | 実務的思考者 | 実用的で実現可能性を重視 |
| specialist | 専門家 | 深い専門知識を持ち、詳細な分析が得意 |
| user_advocate | ユーザー視点の代表 | ユーザー体験を重視、共感的 |
| devil_advocate | 異論唱導者 | 意図的に反対意見を唱え、議論を深める |

## 推奨チームタイプ

### balanced（バランス型）
4人のエージェント: ファシリテーター、クリエイター、批評家、現実主義者

### innovation（イノベーション型）
4人のエージェント: クリエイター、楽観主義者、専門家、デビルズアドボケート

### practical（実務型）
4人のエージェント: 現実主義者、専門家、ユーザー擁護者、批評家

### full_diversity（全ペルソナ）
7人のエージェント: 全てのペルソナを使用

## プロジェクト構成

```
multi_agent_brainstorming/
├── agents/               # エージェント関連モジュール
│   ├── base_agent.py    # ベースエージェントクラス
│   ├── agent_factory.py # エージェントファクトリー
│   └── personas.py      # ペルソナ定義
├── conversation/         # 会話管理モジュール
│   └── manager.py       # 会話マネージャー
├── output/              # 出力管理モジュール
│   └── formatter.py     # フォーマッター
├── llm/                 # LLM関連モジュール
│   ├── ollama_client.py # Ollamaクライアント
│   └── model_config.py  # モデル設定
├── utils/               # ユーティリティモジュール
│   └── logger.py        # ロガー
├── main.py              # メイン実行ファイル
├── examples.py          # 使用例
└── requirements.txt     # 依存関係
```

## 依存関係

- requests>=2.31.0
- janome>=0.4.2

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。
