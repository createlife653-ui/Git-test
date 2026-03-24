"""Ollama APIクライアント

Ollamaローカルサーバーとの通信を担当します。
タイムアウト、リトライ、エラーハンドリング機能を備えています。
"""

import requests
import time
from typing import Optional, Dict, Any, Generator
from dataclasses import dataclass


@dataclass
class GenerationResponse:
    """生成応答を表すデータクラス"""
    response: str
    model: str
    prompt_eval_count: Optional[int] = None
    eval_count: Optional[int] = None


class OllamaClientError(Exception):
    """Ollamaクライアントエラー基底クラス"""
    pass


class ConnectionError(OllamaClientError):
    """接続エラー"""
    pass


class GenerationError(OllamaClientError):
    """生成エラー"""
    pass


class OllamaClient:
    """Ollama APIクライアント

    Attributes:
        host: Ollamaサーバーのホスト名（デフォルト: localhost）
        port: Ollamaサーバーのポート（デフォルト: 11434）
        timeout: リクエストタイムアウト（秒、デフォルト: 120）
        max_retries: 最大リトライ回数（デフォルト: 3）
        retry_delay: リトライ間隔（秒、デフォルト: 1.0）
    """

    DEFAULT_HOST = "localhost"
    DEFAULT_PORT = 11434
    DEFAULT_TIMEOUT = 120
    DEFAULT_MAX_RETRIES = 3
    DEFAULT_RETRY_DELAY = 1.0

    def __init__(
        self,
        host: str = DEFAULT_HOST,
        port: int = DEFAULT_PORT,
        timeout: int = DEFAULT_TIMEOUT,
        max_retries: int = DEFAULT_MAX_RETRIES,
        retry_delay: float = DEFAULT_RETRY_DELAY
    ):
        self.host = host
        self.port = port
        self.timeout = timeout
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self._base_url = f"http://{host}:{port}"

    @property
    def base_url(self) -> str:
        """ベースURLを取得"""
        return self._base_url

    def check_connection(self) -> bool:
        """Ollamaサーバーへの接続を確認

        Returns:
            接続できている場合はTrue、そうでない場合はFalse
        """
        try:
            response = requests.get(f"{self._base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except requests.RequestException:
            return False

    def list_models(self) -> list[str]:
        """利用可能なモデルのリストを取得

        Returns:
            モデル名のリスト

        Raises:
            ConnectionError: 接続に失敗した場合
        """
        try:
            response = requests.get(f"{self._base_url}/api/tags", timeout=10)
            response.raise_for_status()
            data = response.json()
            return [model['name'] for model in data.get('models', [])]
        except requests.RequestException as e:
            raise ConnectionError(f"モデルリストの取得に失敗しました: {e}")

    def generate(
        self,
        prompt: str,
        model: str,
        system: Optional[str] = None,
        temperature: Optional[float] = None,
        stream: bool = False
    ) -> GenerationResponse:
        """テキストを生成

        Args:
            prompt: 入力プロンプト
            model: 使用するモデル名
            system: システムプロンプト（オプション）
            temperature: 温度パラメータ（オプション）
            stream: ストリーミングモード（オプション、未実装）

        Returns:
            GenerationResponse: 生成結果

        Raises:
            ConnectionError: 接続に失敗した場合
            GenerationError: 生成に失敗した場合
        """
        url = f"{self._base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": stream
        }

        if system:
            payload["system"] = system
        if temperature is not None:
            payload["options"] = {"temperature": temperature}

        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    url,
                    json=payload,
                    timeout=self.timeout
                )
                response.raise_for_status()

                # ストリーミングでない場合
                data = response.json()
                return GenerationResponse(
                    response=data.get('response', ''),
                    model=data.get('model', model),
                    prompt_eval_count=data.get('prompt_eval_count'),
                    eval_count=data.get('eval_count')
                )

            except requests.Timeout as e:
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                raise GenerationError(f"リクエストがタイムアウトしました: {e}")

            except requests.RequestException as e:
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                raise ConnectionError(f"リクエストに失敗しました: {e}")

        raise GenerationError("最大リトライ回数を超えました")

    def generate_stream(
        self,
        prompt: str,
        model: str,
        system: Optional[str] = None,
        temperature: Optional[float] = None
    ) -> Generator[str, None, None]:
        """ストリーミングでテキストを生成

        Args:
            prompt: 入力プロンプト
            model: 使用するモデル名
            system: システムプロンプト（オプション）
            temperature: 温度パラメータ（オプション）

        Yields:
            生成されたテキストのチャンク

        Raises:
            ConnectionError: 接続に失敗した場合
            GenerationError: 生成に失敗した場合
        """
        url = f"{self._base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": True
        }

        if system:
            payload["system"] = system
        if temperature is not None:
            payload["options"] = {"temperature": temperature}

        try:
            response = requests.post(
                url,
                json=payload,
                timeout=self.timeout,
                stream=True
            )
            response.raise_for_status()

            for line in response.iter_lines():
                if line:
                    data = line.decode('utf-8')
                    # OllamaのストリーミングレスポンスはJSON形式
                    import json
                    try:
                        json_data = json.loads(data)
                        chunk = json_data.get('response', '')
                        if chunk:
                            yield chunk
                    except json.JSONDecodeError:
                        continue

        except requests.RequestException as e:
            raise ConnectionError(f"ストリーミングリクエストに失敗しました: {e}")


def create_client(**kwargs) -> OllamaClient:
    """Ollamaクライアントを作成するファクトリー関数

    Args:
        **kwargs: OllamaClientの初期化パラメータ

    Returns:
        OllamaClientインスタンス
    """
    return OllamaClient(**kwargs)
