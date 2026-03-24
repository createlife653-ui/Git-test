#!/usr/bin/env python3
"""接続テストスクリプト

Ollamaとの接続をテストし、基本的な動作を確認します。
"""

import sys

from llm import OllamaClient, create_client
from utils import get_logger, LogLevel


def test_connection():
    """Ollama接続をテスト"""
    logger = get_logger()
    logger.level = LogLevel.INFO

    print("=" * 60)
    print("マルチエージェント・ブレインストーミングシステム - 接続テスト")
    print("=" * 60)
    print()

    # クライアント作成
    logger.info("Ollamaクライアントを作成中...")
    client = create_client()

    # 接続チェック
    logger.info("接続チェック中...")
    if not client.check_connection():
        logger.error(
            "\n[ERROR] Ollamaサーバーに接続できません\n"
            "以下を確認してください:\n"
            "  1. Ollamaがインストールされているか\n"
            "  2. 'ollama serve' でサーバーが起動しているか\n"
            "     - Windows: コマンドプロンプトで 'ollama serve'\n"
            "     - Mac/Linux: ターミナルで 'ollama serve' &"
        )
        return False

    logger.info("[OK] 接続成功")

    # 利用可能なモデルを表示
    print()
    logger.info("利用可能なモデルを確認中...")
    try:
        models = client.list_models()
        if models:
            print(f"[OK] 利用可能なモデル ({len(models)}個):")
            for model in models:
                print(f"   - {model}")
        else:
            logger.warning("[WARNING] 利用可能なモデルが見つかりません")
            print("\nモデルをダウンロードしてください:")
            print("  ollama pull llama3.2")
            return False
    except Exception as e:
        logger.error(f"[ERROR] モデルリストの取得に失敗: {e}")
        return False

    print()
    print("=" * 60)
    print("[OK] すべてのチェックが完了しました")
    print("=" * 60)
    print()
    print("ブレインストーミングを実行するには:")
    print('  python main.py "トピック"')
    print()

    return True


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
