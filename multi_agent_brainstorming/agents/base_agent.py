"""エージェント基底クラス

すべてのエージェントの基底となるクラスを定義します。
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from dataclasses import dataclass

from llm.ollama_client import OllamaClient, GenerationResponse
from llm.model_config import ModelConfig
from agents.personas import Persona, PersonaType


@dataclass
class Message:
    """会話メッセージ

    Attributes:
        agent_name: 発言者名
        persona_type: ペルソナタイプ
        content: 発言内容
        turn_number: ターン番号
    """
    agent_name: str
    persona_type: PersonaType
    content: str
    turn_number: int


class BaseAgent(ABC):
    """エージェント基底クラス

    すべてのエージェントはこのクラスを継承します。

    Attributes:
        persona: ペルソナ定義
        model_config: モデル設定
        client: Ollamaクライアント
    """

    def __init__(
        self,
        persona: Persona,
        model_config: ModelConfig,
        client: OllamaClient
    ):
        self.persona = persona
        self.model_config = model_config
        self.client = client
        self._conversation_history: List[Message] = []

    @property
    def name(self) -> str:
        """エージェント名"""
        return self.persona.name

    @property
    def persona_type(self) -> PersonaType:
        """ペルソナタイプ"""
        return self.persona.type

    def add_to_history(self, message: Message) -> None:
        """会話履歴にメッセージを追加

        Args:
            message: 追加するメッセージ
        """
        self._conversation_history.append(message)

    def clear_history(self) -> None:
        """会話履歴をクリア"""
        self._conversation_history.clear()

    def get_history(self) -> List[Message]:
        """会話履歴を取得

        Returns:
            メッセージのリスト
        """
        return self._conversation_history.copy()

    def format_context(self, current_topic: str) -> str:
        """現在のコンテキストをフォーマット

        Args:
            current_topic: 現在の話題

        Returns:
            フォーマットされたコンテキスト文字列
        """
        lines = [
            f"現在の話題: {current_topic}",
            "",
            "これまでの会話:",
        ]

        for msg in self._conversation_history:
            lines.append(f"{msg.agent_name}: {msg.content}")

        return "\n".join(lines)

    def generate_response(
        self,
        prompt: str,
        current_topic: str
    ) -> GenerationResponse:
        """応答を生成

        Args:
            prompt: 入力プロンプト
            current_topic: 現在の話題

        Returns:
            生成応答
        """
        context = self.format_context(current_topic)
        full_prompt = f"{context}\n\n{prompt}"

        response = self.client.generate(
            prompt=full_prompt,
            model=self.model_config.model_name,
            system=self.persona.system_prompt,
            temperature=self.persona.temperature
        )

        return response

    @abstractmethod
    def respond(
        self,
        current_topic: str,
        prompt: Optional[str] = None
    ) -> str:
        """対話に応答

        Args:
            current_topic: 現在の話題
            prompt: 追加のプロンプト（オプション）

        Returns:
            応答テキスト
        """
        pass


class BrainstormAgent(BaseAgent):
    """ブレインストーミング用エージェント

    標準的なブレインストーミングセッションで使用するエージェント実装です。
    """

    def respond(
        self,
        current_topic: str,
        prompt: Optional[str] = None
    ) -> str:
        """対話に応答

        Args:
            current_topic: 現在の話題
            prompt: 追加のプロンプト（オプション）

        Returns:
            応答テキスト
        """
        if prompt is None:
            prompt = "この話題について、あなたの視点から意見やアイデアを述べてください。"

        response = self.generate_response(prompt, current_topic)
        return response.response
