# マルチエージェント・ブレインストーミングシステム

複数のAIエージェントが自律的に対話し、アイデアを出し合うシステムです。Ollamaを使用してローカルで動作します。

## 特徴

- **4つの役割（ペルソナ）**: イノベーター、批評家、統合者、ファシリテーター
- **自律的な対話**: エージェントが交互に発言し、ブレインストーミングを進行
- **自動収束検出**: 会話がまとまった時点で自動終了
- **複数のターン制御モード**: Facilitator-led、Round-robin、Random
- **結果の保存**: JSONとMarkdown形式で会話記録を保存

## 前提条件

- Python 3.8+
- Ollama（インストールとモデルのダウンロードが必要）

### Ollamaのセットアップ

1. Ollamaをインストール: https://ollama.com/download

2. モデルをダウンロード:
```bash
ollama pull llama3.2
# または
ollama pull mistral
# または
ollama pull gemma2
```

3. Ollamaサーバーを起動:
```bash
ollama serve
```

## インストール

1. リポジトリをクローン:
```bash
cd multi_agent_brainstorming
```

2. 依存ライブラリをインストール:
```bash
pip install -r requirements.txt
```

## 使用方法

### 基本的な実行

```bash
python main.py "新しい朝食メニューのアイデア"
```

### オプション

```bash
# モデル指定
python main.py "トピック" --model mistral

# ターン数指定
python main.py "トピック" --turns 15

# 出力先指定
python main.py "トピック" --output ./results

# コンソール出力なし（保存のみ）
python main.py "トピック" --quiet

# ターン選択モード
python main.py "トピック" --mode round_robin

# デバッグモード
python main.py "トピック" --debug
```

## 4つのペルソナ

### 1. イノベーター（Innovator）
- **役割**: 斬新で革新的なアイデアを提案、既存の枠組みを打破
- **スタイル**: 大胆な表現、「もしこうだったら？」仮説、実験的な考え
- **温度**: 0.9（創造性重視）

### 2. 批評家（Critic）
- **役割**: 提案を批判的・論理的に評価、リスクや改善点を指摘
- **スタイル**: 建設的な批判、論理的根拠、改善案の提示
- **温度**: 0.6（論理性重視）

### 3. 統合者（Synthesizer）
- **役割**: 複数の意見を統合、新たな視点を提供
- **スタイル**: バランスの取れた表現、妥協点の発見、全体像の俯瞰
- **温度**: 0.7（バランス重視）

### 4. ファシリテーター（Facilitator）
- **役割**: 議論を整理・促進、方向性を示唆
- **スタイル**: 明確で簡潔、要約、次の議論点の提示
- **温度**: 0.5（中立性重視）

## ターン選択モード

### Facilitator-led（デフォルト）
- 3ターンごとにFacilitatorが議論を要約・方向性を提示
- それ以外は直近の発言者以外からランダムに選択
- 全エージェントが均等に発言するように配慮

### Round-robin
- 順番に発言

### Random
- 完全ランダム

## 出力

会話結果は `output/conversations/` ディレクトリに保存されます。

- **JSON**: 完全なデータ（会話ログ、メタデータ）
- **Markdown**: 読みやすい要約形式

## プロジェクト構造

```
multi_agent_brainstorming/
├── agents/              # エージェント関連
│   ├── base_agent.py   # 基底クラス
│   ├── agent_factory.py # エージェント生成
│   └── personas.py      # ペルソナ定義
├── conversation/        # 会話管理
│   └── manager.py       # 会話マネージャー
├── llm/                # LLM関連
│   ├── ollama_client.py # Ollamaクライアント
│   └── model_config.py  # モデル設定
├── utils/              # ユーティリティ
│   ├── config.py        # 設定管理
│   └── logger.py        # ロギング
├── output/             # 出力
│   ├── formatter.py     # フォーマッター
│   └── conversations/   # 会話記録
├── main.py             # メインスクリプト
├── requirements.txt    # 依存ライブラリ
└── README.md           # 本ファイル
```

## ライセンス

MIT License

## 製作者

Claude Code & ユーザー協同
