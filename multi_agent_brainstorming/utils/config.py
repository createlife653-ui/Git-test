"""設定管理

グローバル設定を管理します。
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class Config:
    """グローバル設定

    Attributes:
        ollama_host: Ollamaホスト
        ollama_port: Ollamaポート
        default_model: デフォルトモデル名
        default_max_turns: デフォルト最大ターン数
        output_dir: 出力ディレクトリ
    """
    ollama_host: str = "localhost"
    ollama_port: int = 11434
    default_model: str = "llama3.2"
    default_max_turns: int = 12
    output_dir: str = "output/conversations"

    @classmethod
    def from_dict(cls, data: dict) -> "Config":
        """辞書から設定を作成

        Args:
            data: 設定辞書

        Returns:
            Configインスタンス
        """
        return cls(
            ollama_host=data.get("ollama_host", "localhost"),
            ollama_port=data.get("ollama_port", 11434),
            default_model=data.get("default_model", "llama3.2"),
            default_max_turns=data.get("default_max_turns", 12),
            output_dir=data.get("output_dir", "output/conversations")
        )


# グローバル設定インスタンス
_global_config: Optional[Config] = None


def get_config() -> Config:
    """グローバル設定を取得

    Returns:
        Configインスタンス
    """
    global _global_config
    if _global_config is None:
        _global_config = Config()
    return _global_config


def set_config(config: Config) -> None:
    """グローバル設定を設定

    Args:
        config: Configインスタンス
    """
    global _global_config
    _global_config = config
