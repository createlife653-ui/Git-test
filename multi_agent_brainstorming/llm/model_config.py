"""モデル設定管理

Ollamaで使用するモデルのプリセットと設定を管理します。
"""

from dataclasses import dataclass
from typing import Optional
from enum import Enum


class ModelPreset(Enum):
    """モデルプリセット列挙型

    推奨モデルを定義します。
    """
    LLAMA32 = "llama3.2"      # バランス重視
    MISTRAL = "mistral"        # 論理推論
    GEMMA2 = "gemma2"          # 軽量・高速


@dataclass
class ModelConfig:
    """モデル設定データクラス

    Attributes:
        model_name: モデル名
        temperature: 温度パラメータ（0.0-1.0）
        top_p: Top-pサンプリング
        top_k: Top-kサンプリング
        num_ctx: コンテキスト長
    """
    model_name: str
    temperature: float = 0.7
    top_p: Optional[float] = None
    top_k: Optional[int] = None
    num_ctx: Optional[int] = None

    def to_dict(self) -> dict:
        """辞書形式に変換"""
        options = {"temperature": self.temperature}
        if self.top_p is not None:
            options["top_p"] = self.top_p
        if self.top_k is not None:
            options["top_k"] = self.top_k
        if self.num_ctx is not None:
            options["num_ctx"] = self.num_ctx
        return options


# プリセット設定
PRESETS = {
    ModelPreset.LLAMA32: ModelConfig(
        model_name="llama3.2",
        temperature=0.7
    ),
    ModelPreset.MISTRAL: ModelConfig(
        model_name="mistral",
        temperature=0.7
    ),
    ModelPreset.GEMMA2: ModelConfig(
        model_name="gemma2",
        temperature=0.7
    ),
}


def get_preset(preset: ModelPreset, temperature: Optional[float] = None) -> ModelConfig:
    """プリセット設定を取得

    Args:
        preset: モデルプリセット
        temperature: カスタム温度（オプション）

    Returns:
        ModelConfigインスタンス
    """
    config = PRESETS[preset]
    if temperature is not None:
        config = ModelConfig(
            model_name=config.model_name,
            temperature=temperature
        )
    return config


def create_custom_config(
    model_name: str,
    temperature: float = 0.7
) -> ModelConfig:
    """カスタムモデル設定を作成

    Args:
        model_name: モデル名
        temperature: 温度パラメータ

    Returns:
        ModelConfigインスタンス
    """
    return ModelConfig(model_name=model_name, temperature=temperature)
