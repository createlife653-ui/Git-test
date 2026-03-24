"""ロギングユーティリティ

簡易的なロギング機能を提供します。
"""

import sys
from typing import Optional
from datetime import datetime


class LogLevel:
    """ログレベル"""
    DEBUG = 0
    INFO = 1
    WARNING = 2
    ERROR = 3


class Logger:
    """ロガークラス"""

    def __init__(
        self,
        name: str,
        level: int = LogLevel.INFO,
        output_to_file: bool = False,
        log_file: Optional[str] = None
    ):
        """初期化

        Args:
            name: ロガー名
            level: ログレベル
            output_to_file: ファイル出力するか
            log_file: ログファイルパス
        """
        self.name = name
        self.level = level
        self.output_to_file = output_to_file
        self.log_file = log_file

    def _format_message(
        self,
        level: str,
        message: str
    ) -> str:
        """メッセージをフォーマット

        Args:
            level: ログレベル文字列
            message: メッセージ

        Returns:
            フォーマットされたメッセージ
        """
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return f"[{timestamp}] [{level}] [{self.name}] {message}"

    def _write(self, level_name: str, level: int, message: str) -> None:
        """ログを出力

        Args:
            level_name: ログレベル名
            level: ログレベル値
            message: メッセージ
        """
        if level < self.level:
            return

        formatted = self._format_message(level_name, message)

        # 標準出力
        print(formatted)

        # ファイル出力
        if self.output_to_file and self.log_file:
            try:
                with open(self.log_file, "a", encoding="utf-8") as f:
                    f.write(formatted + "\n")
            except IOError:
                pass

    def debug(self, message: str) -> None:
        """デバッグログ

        Args:
            message: メッセージ
        """
        self._write("DEBUG", LogLevel.DEBUG, message)

    def info(self, message: str) -> None:
        """情報ログ

        Args:
            message: メッセージ
        """
        self._write("INFO", LogLevel.INFO, message)

    def warning(self, message: str) -> None:
        """警告ログ

        Args:
            message: メッセージ
        """
        self._write("WARNING", LogLevel.WARNING, message)

    def error(self, message: str) -> None:
        """エラーログ

        Args:
            message: メッセージ
        """
        self._write("ERROR", LogLevel.ERROR, message)


# デフォルトロガー
_default_logger: Optional[Logger] = None


def get_logger(name: str = "multi_agent_brainstorming") -> Logger:
    """ロガーを取得

    Args:
        name: ロガー名

    Returns:
        Loggerインスタンス
    """
    global _default_logger
    if _default_logger is None:
        _default_logger = Logger(name)
    return _default_logger


def setup_logger(
    name: str,
    level: int = LogLevel.INFO,
    output_to_file: bool = False,
    log_file: Optional[str] = None
) -> Logger:
    """ロガーをセットアップ

    Args:
        name: ロガー名
        level: ログレベル
        output_to_file: ファイル出力するか
        log_file: ログファイルパス

    Returns:
        Loggerインスタンス
    """
    global _default_logger
    _default_logger = Logger(name, level, output_to_file, log_file)
    return _default_logger
