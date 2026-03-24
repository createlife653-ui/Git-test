#!/usr/bin/env python3
"""マルチエージェント・ブレインストーミングシステム

複数のAIエージェントが自律的に対話し、アイデアを出し合うシステムです。
"""

import argparse
import sys
from pathlib import Path

# カレントディレクトリをパスに追加
sys.path.insert(0, str(Path(__file__).parent))

from llm import OllamaClient, ModelConfig, ModelPreset
from agents import AgentFactory
from conversation import ConversationManager, ConversationConfig, TurnSelectionMode
from output import ConversationFormatter
from utils import get_logger, get_config, LogLevel


def check_ollama_connection(client: OllamaClient) -> bool:
    """Ollama接続をチェック

    Args:
        client: Ollamaクライアント

    Returns:
        接続できている場合はTrue
    """
    logger = get_logger()

    logger.info("Ollamaサーバーへの接続を確認中...")

    if not client.check_connection():
        logger.error(
            "Ollamaサーバーに接続できません。\n"
            "以下を確認してください:\n"
            "1. Ollamaがインストールされているか\n"
            "2. 'ollama serve' でサーバーが起動しているか\n"
            "3. ホストとポートの設定が正しいか"
        )
        return False

    logger.info("Ollamaサーバーに接続しました")

    # 利用可能なモデルを表示
    try:
        models = client.list_models()
        if models:
            logger.info(f"利用可能なモデル: {', '.join(models)}")
        else:
            logger.warning("利用可能なモデルが見つかりません")
    except Exception as e:
        logger.warning(f"モデルリストの取得に失敗しました: {e}")

    return True


def parse_arguments() -> argparse.Namespace:
    """コマンドライン引数を解析

    Returns:
        解析された引数
    """
    parser = argparse.ArgumentParser(
        description="マルチエージェント・ブレインストーミングシステム",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
例:
  %(prog)s "新しい朝食メニューのアイデア"
  %(prog)s "コーヒーの新しい抽出方法" --model mistral --turns 15
  %(prog)s "サステナビリティ向上策" --quiet --output ./results
        """
    )

    parser.add_argument(
        "topic",
        nargs="?",
        help="ブレインストーミングの話題"
    )

    parser.add_argument(
        "--model", "-m",
        default="llama3.2",
        help="使用するモデル（デフォルト: llama3.2）"
    )

    parser.add_argument(
        "--turns", "-t",
        type=int,
        default=12,
        help="最大ターン数（デフォルト: 12）"
    )

    parser.add_argument(
        "--output", "-o",
        help="出力ディレクトリ"
    )

    parser.add_argument(
        "--quiet", "-q",
        action="store_true",
        help="コンソール出力を抑制"
    )

    parser.add_argument(
        "--format", "-f",
        choices=["json", "markdown", "both"],
        default="both",
        help="出力フォーマット（デフォルト: both）"
    )

    parser.add_argument(
        "--mode",
        choices=["facilitator_led", "round_robin", "random"],
        default="facilitator_led",
        help="ターン選択モード（デフォルト: facilitator_led）"
    )

    parser.add_argument(
        "--host",
        default="localhost",
        help="Ollamaサーバーのホスト（デフォルト: localhost）"
    )

    parser.add_argument(
        "--port",
        type=int,
        default=11434,
        help="Ollamaサーバーのポート（デフォルト: 11434）"
    )

    parser.add_argument(
        "--debug",
        action="store_true",
        help="デバッグモード"
    )

    return parser.parse_args()


def main() -> int:
    """メイン関数

    Returns:
        終了コード
    """
    args = parse_arguments()

    # ロガー設定
    log_level = LogLevel.DEBUG if args.debug else LogLevel.INFO
    logger = get_logger()
    logger.level = log_level

    # トピックチェック
    if not args.topic:
        logger.error("トピックが指定されていません")
        print("使用方法: python main.py \"トピック\"")
        return 1

    # Ollamaクライアント作成
    client = OllamaClient(host=args.host, port=args.port)

    # 接続チェック
    if not check_ollama_connection(client):
        return 1

    # モデル設定
    model_config = ModelConfig(
        model_name=args.model,
        temperature=0.7
    )

    # エージェントファクトリー作成
    factory = AgentFactory(client, model_config)

    # 全エージェント作成
    agents = factory.create_all_agents()
    agent_names = ", ".join(agent.name for agent in agents)
    logger.info(f"参加エージェント: {agent_names}")

    # 会話設定
    turn_mode_map = {
        "facilitator_led": TurnSelectionMode.FACILITATOR_LED,
        "round_robin": TurnSelectionMode.ROUND_ROBIN,
        "random": TurnSelectionMode.RANDOM,
    }

    conv_config = ConversationConfig(
        max_turns=args.turns,
        turn_selection_mode=turn_mode_map[args.mode],
        early_termination=True
    )

    # 会話マネージャー作成
    manager = ConversationManager(agents, conv_config)

    # フォーマッター作成
    output_dir = args.output or get_config().output_dir
    formatter = ConversationFormatter(output_dir)

    # プログレスコールバック
    def progress_callback(turn: int, message):
        if not args.quiet:
            print(f"\n[ターン {turn}] {message.agent_name}")
            print("-" * 50)
            print(message.content[:200] + "..." if len(message.content) > 200 else message.content)

    # ブレインストーミング実行
    logger.info(f"ブレインストーミングを開始: {args.topic}")
    logger.info(f"最大ターン数: {args.turns}, モード: {args.mode}")

    result = manager.run(args.topic, progress_callback)

    # 結果出力
    if not args.quiet:
        formatter.print_to_console(result)

    # ファイル保存
    saved_files = []
    if args.format in ("json", "both"):
        json_path = formatter.to_json(result)
        saved_files.append(json_path)
        logger.info(f"JSONを保存: {json_path}")

    if args.format in ("markdown", "both"):
        md_path = formatter.to_markdown(result)
        saved_files.append(md_path)
        logger.info(f"Markdownを保存: {md_path}")

    logger.info("ブレインストーミングが完了しました")

    return 0


if __name__ == "__main__":
    sys.exit(main())
