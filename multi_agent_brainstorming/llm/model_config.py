"""モデル設定管理モジュール"""

from dataclasses import dataclass
from enum import Enum


class ModelPreset(Enum):
    """推奨モデルプリセット"""

    LLAMA32 = "llama3.2"
    MISTRAL = "mistral"
    GEMMA2 = "gemma2"
    QWEN = "qwen2.5"


@dataclass
class ModelConfig:
    """LLMモデル設定"""

    model: str = ModelPreset.LLAMA32.value
    temperature: float = 0.7
    max_tokens: int = 512
    num_ctx: int = 4096  # コンテキスト長（デフォルト2044を拡張）
    top_p: float = 0.9
    top_k: int = 40
    repeat_penalty: float = 1.1

    # Ollama API設定
    host: str = "http://localhost:11434"
    timeout: int = 120  # タイムアウト（秒）
    max_retries: int = 3  # リトライ回数
    retry_delay: float = 1.0  # リトライ間隔（秒）

    def to_api_payload(self, prompt: str) -> dict:
        """Ollama API用ペイロードを生成"""
        return {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens,
                "num_ctx": self.num_ctx,
                "top_p": self.top_p,
                "top_k": self.top_k,
                "repeat_penalty": self.repeat_penalty,
            },
        }
