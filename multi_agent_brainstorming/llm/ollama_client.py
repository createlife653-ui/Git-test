"""Ollama APIクライアントモジュール"""

import time
import requests
from typing import Optional
from .model_config import ModelConfig


class OllamaClientError(Exception):
    """Ollamaクライアントエラー"""

    pass


class OllamaConnectionError(OllamaClientError):
    """接続エラー"""

    pass


class OllamaGenerationError(OllamaClientError):
    """生成エラー"""

    pass


class OllamaClient:
    """Ollama APIクライアント

    タイムアウト・リトライ機能付きのOllama APIクライアント
    """

    def __init__(self, config: Optional[ModelConfig] = None):
        self.config = config or ModelConfig()
        self._base_url = f"{self.config.host}/api"
        self._check_connection()

    def _check_connection(self) -> None:
        """Ollamaサーバーとの接続を確認"""
        try:
            response = requests.get(f"{self.config.host}/api/tags", timeout=5)
            response.raise_for_status()
        except requests.exceptions.ConnectionError:
            raise OllamaConnectionError(
                f"Ollamaサーバーに接続できません: {self.config.host}\n"
                "'ollama serve' でOllamaを起動してください"
            )
        except requests.exceptions.Timeout:
            raise OllamaConnectionError(
                f"Ollamaサーバーの応答がありません: {self.config.host}"
            )

    def _make_request(self, payload: dict) -> str:
        """APIリクエストを実行（リトライ機能付き）"""
        for attempt in range(self.config.max_retries):
            try:
                response = requests.post(
                    f"{self._base_url}/generate",
                    json=payload,
                    timeout=self.config.timeout,
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", "").strip()

            except requests.exceptions.Timeout:
                if attempt < self.config.max_retries - 1:
                    time.sleep(self.config.retry_delay * (attempt + 1))
                    continue
                raise OllamaGenerationError(
                    f"生成がタイムアウトしました（{self.config.timeout}秒）"
                )

            except requests.exceptions.ConnectionError as e:
                raise OllamaConnectionError(f"接続エラー: {e}")

            except requests.exceptions.HTTPError as e:
                status_code = e.response.status_code
                if status_code == 404:
                    raise OllamaGenerationError(
                        f"モデル '{self.config.model}' が見つかりません\n"
                        f"'ollama pull {self.config.model}' でダウンロードしてください"
                    )
                raise OllamaGenerationError(f"HTTPエラー: {status_code}")

        raise OllamaGenerationError("最大リトライ回数に達しました")

    def generate(self, prompt: str, temperature: Optional[float] = None) -> str:
        """テキストを生成

        Args:
            prompt: 入力プロンプト
            temperature: 温度パラメータ（指定しない場合はconfigの値を使用）

        Returns:
            生成されたテキスト
        """
        # 温度パラメータを一時的に変更
        original_temp = self.config.temperature
        if temperature is not None:
            self.config.temperature = temperature

        payload = self.config.to_api_payload(prompt)

        try:
            response = self._make_request(payload)
            return response
        finally:
            # 元の温度に戻す
            self.config.temperature = original_temp

    def get_available_models(self) -> list[str]:
        """利用可能なモデル一覧を取得"""
        try:
            response = requests.get(f"{self._base_url}/tags", timeout=5)
            response.raise_for_status()
            data = response.json()
            return [model["name"] for model in data.get("models", [])]
        except (requests.exceptions.RequestException, KeyError) as e:
            raise OllamaClientError(f"モデル一覧の取得に失敗: {e}")
