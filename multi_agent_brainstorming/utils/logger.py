"""ユーティリティモジュール

汎用的なユーティリティ関数・クラス
"""

import logging
import sys
from pathlib import Path
from typing import Optional
from datetime import datetime


class ColoredFormatter(logging.Formatter):
    """カラーフォーマッター

    ログレベルごとに色を付けるフォーマッター
    """

    # ANSIカラーコード
    COLORS = {
        'DEBUG': '\033[36m',      # シアン
        'INFO': '\033[37m',       # 白
        'WARNING': '\033[33m',    # 黄
        'ERROR': '\033[31m',      # 赤
        'CRITICAL': '\033[35m',   # マゼンタ
    }
    RESET = '\033[0m'

    def format(self, record):
        # カラーコードを追加
        levelname = record.levelname
        if levelname in self.COLORS:
            record.levelname = f"{self.COLORS[levelname]}{levelname}{self.RESET}"
        return super().format(record)


def setup_logger(
    name: str = "brainstorm",
    level: int = logging.INFO,
    log_file: Optional[str] = None,
    colored: bool = True,
) -> logging.Logger:
    """ロガーをセットアップ

    Args:
        name: ロガー名
        level: ログレベル
        log_file: ログファイルパス（省略時はファイル出力なし）
        colored: カラーログを使用するか

    Returns:
        設定されたロガー
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # 既存のハンドラーをクリア
    logger.handlers.clear()

    # フォーマット
    log_format = '[%(asctime)s] [%(levelname)s] %(message)s'
    date_format = '%Y-%m-%d %H:%M:%S'

    # コンソールハンドラー
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)

    if colored and sys.stdout.isatty():
        console_formatter = ColoredFormatter(log_format, date_format)
    else:
        console_formatter = logging.Formatter(log_format, date_format)

    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    # ファイルハンドラー
    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(level)
        file_formatter = logging.Formatter(log_format, date_format)
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)

    return logger


def truncate_text(text: str, max_length: int, suffix: str = "...") -> str:
    """テキストを指定長で切り詰め

    Args:
        text: 元のテキスト
        max_length: 最大長
        suffix: 切り詰め時の接尾辞

    Returns:
        切り詰められたテキスト
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix


def format_duration(seconds: float) -> str:
    """秒数を読みやすい時間形式に変換

    Args:
        seconds: 秒数

    Returns:
        フォーマットされた時間文字列
    """
    if seconds < 1:
        return f"{seconds * 1000:.1f}ms"
    elif seconds < 60:
        return f"{seconds:.1f}秒"
    elif seconds < 3600:
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{minutes}分{secs}秒"
    else:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        return f"{hours}時間{minutes}分"


def create_timestamp() -> str:
    """現在のタイムスタンプを取得

    Returns:
        タイムスタンプ文字列
    """
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def sanitize_filename(filename: str) -> str:
    """ファイル名として使用できない文字をサニタイズ

    Args:
        filename: 元のファイル名

    Returns:
        サニタイズされたファイル名
    """
    # ファイル名として使用できない文字を置換
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')

    # 連続するアンダースコアを統一
    while '__' in filename:
        filename = filename.replace('__', '_')

    return filename.strip('_')


class ProgressTracker:
    """進捗トラッカー

    処理の進捗を追跡・表示
    """

    def __init__(self, total: int, description: str = "処理中"):
        """初期化

        Args:
            total: 総ステップ数
            description: 進捗の説明
        """
        self.total = total
        self.current = 0
        self.description = description
        self.start_time = datetime.now()
        self.logger = setup_logger("progress")

    def update(self, increment: int = 1) -> None:
        """進捗を更新

        Args:
            increment: 増分
        """
        self.current += increment
        percentage = (self.current / self.total) * 100

        self.logger.info(
            f"{self.description}: {self.current}/{self.total} ({percentage:.1f}%)"
        )

    def complete(self) -> None:
        """完了時の処理"""
        duration = (datetime.now() - self.start_time).total_seconds()
        self.logger.info(f"{self.description}完了 ({format_duration(duration)})")


def validate_llm_connection(host: str = "http://localhost:11434") -> bool:
    """Ollamaサーバーへの接続を検証

    Args:
        host: Ollamaサーバーのホスト

    Returns:
        接続可能な場合はTrue
    """
    try:
        import requests
        response = requests.get(f"{host}/api/tags", timeout=5)
        return response.status_code == 200
    except Exception:
        return False


def get_available_models(host: str = "http://localhost:11434") -> list[str]:
    """利用可能なモデル一覧を取得

    Args:
        host: Ollamaサーバーのホスト

    Returns:
        モデル名のリスト
    """
    try:
        import requests
        response = requests.get(f"{host}/api/tags", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return [model["name"] for model in data.get("models", [])]
    except Exception:
        pass
    return []
