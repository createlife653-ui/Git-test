"""マルチエージェントブレインストーミング

複数のAIエージェントが協力してブレインストーミングを行うツール
"""

import argparse
import sys
from pathlib import Path

from llm.model_config import ModelConfig, ModelPreset
from agents import AgentFactory, get_recommended_combination
from conversation import ConversationManager, BrainstormConfig
from output import FileOutput, OutputFormatter
from utils import setup_logger, validate_llm_connection, format_duration
import time


def parse_args():
    """コマンドライン引数をパース"""
    parser = argparse.ArgumentParser(
        description="マルチエージェントブレインストーミングツール",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
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

推奨チームタイプ:
  balanced     - バランス型（司会、創造、批評、現実）
  innovation   - イノベーション型（創造、楽観、専門、異論）
  practical    - 実務型（現実、専門、ユーザー、批評）
  full_diversity - 全ペルソナ（7人の多様な視点）
        """,
    )

    parser.add_argument(
        "topic",
        help="ブレインストーミングのテーマ",
    )

    parser.add_argument(
        "--team",
        "-t",
        choices=["balanced", "innovation", "practical", "full_diversity"],
        default="balanced",
        help="チームタイプ（デフォルト: balanced）",
    )

    parser.add_argument(
        "--rounds",
        "-r",
        type=int,
        default=3,
        help="ラウンド数（デフォルト: 3）",
    )

    parser.add_argument(
        "--model",
        "-m",
        choices=[e.value for e in ModelPreset],
        default=ModelPreset.LLAMA32.value,
        help="使用するモデル（デフォルト: llama3.2）",
    )

    parser.add_argument(
        "--temperature",
        "--temp",
        type=float,
        default=0.8,
        help="温度パラメータ 0.0-1.0（デフォルト: 0.8）",
    )

    parser.add_argument(
        "--output",
        "-o",
        choices=["text", "md", "markdown", "csv", "json", "all"],
        default="text",
        help="出力形式（デフォルト: text）",
    )

    parser.add_argument(
        "--output-dir",
        default="output",
        help="出力ディレクトリ（デフォルト: output）",
    )

    parser.add_argument(
        "--no-shuffle",
        action="store_true",
        help="発言順のシャッフルを無効化",
    )

    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="詳細ログを表示",
    )

    return parser.parse_args()


def main():
    """メイン関数"""
    args = parse_args()

    # ロガーのセットアップ
    log_level = "DEBUG" if args.verbose else "INFO"
    logger = setup_logger("main", level=getattr(__import__("logging"), log_level))

    logger.info("マルチエージェントブレインストーミングを開始します")
    logger.info(f"テーマ: {args.topic}")

    # Ollamaサーバーの接続確認
    logger.info("Ollamaサーバーの接続を確認中...")
    if not validate_llm_connection():
        logger.error(
            "Ollamaサーバーに接続できません。\n"
            "'ollama serve' でOllamaを起動してください。"
        )
        sys.exit(1)
    logger.info("Ollamaサーバーに接続しました")

    # モデル設定
    config = ModelConfig(
        model=args.model,
        temperature=args.temperature,
    )
    logger.info(f"モデル: {args.model}")
    logger.info(f"温度: {args.temperature}")

    # エージェントファクトリーの作成
    factory = AgentFactory(default_temperature=args.temperature)

    # チームの作成
    logger.info(f"チームタイプ: {args.team}")
    agents = factory.create_diverse_team(team_type=args.team)
    logger.info(f"エージェント数: {len(agents)}")
    for agent in agents:
        logger.info(f"  - {agent.name}（{agent.role}）")

    # 会話マネージャーの設定
    brainstorm_config = BrainstormConfig(
        max_rounds=args.rounds,
        shuffle_order=not args.no_shuffle,
    )
    manager = ConversationManager(config=brainstorm_config)
    manager.add_agents(agents)

    # ブレインストーミングの実行
    logger.info(f"ブレインストーミングを開始（{args.rounds}ラウンド）")
    logger.info("-" * 60)

    start_time = time.time()
    result = manager.run_brainstorm(args.topic)
    duration = time.time() - start_time

    logger.info("-" * 60)
    logger.info(f"完了（{format_duration(duration)}）")
    logger.info(f"総発言数: {len(result.messages)}")

    # 結果の表示
    print("\n" + "=" * 80)
    print(OutputFormatter.format_text(result))
    print("=" * 80)

    # ファイルへの保存
    file_output = FileOutput(output_dir=args.output_dir)

    if args.output == "all":
        saved_files = file_output.save_all_formats(result)
        logger.info("全形式で保存しました:")
        for fmt, path in saved_files.items():
            logger.info(f"  {fmt}: {path}")
    else:
        if args.output in ["md", "markdown"]:
            path = file_output.save_markdown(result)
        elif args.output == "csv":
            path = file_output.save_csv(result)
        elif args.output == "json":
            path = file_output.save_json(result)
        else:  # text
            path = file_output.save_text(result)

        logger.info(f"結果を保存しました: {path}")

    logger.info("ブレインストーミングが終了しました")


if __name__ == "__main__":
    main()
