"""ベースエージェントクラスモジュール"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional
from llm.ollama_client import OllamaClient
from llm.model_config import ModelConfig


@dataclass
class AgentMessage:
    """エージェントの発言"""

    agent_name: str
    content: str
    round: int


@dataclass
class Persona:
    """エージェントのペルソナ定義"""

    name: str
    role: str
    personality: str
    perspective: str
    system_prompt: str


class BaseAgent(ABC):
    """エージェントの基底クラス

    複数のエージェントがブレインストーミングを行うための基底クラス
    """

    def __init__(
        self,
        persona: Persona,
        llm_client: Optional[OllamaClient] = None,
        temperature: float = 0.8,
    ):
        """エージェントを初期化

        Args:
            persona: エージェントのペルソナ
            llm_client: LLMクライアント（指定しない場合はデフォルト設定で作成）
            temperature: 生成時の温度パラメータ
        """
        self.persona = persona
        self.llm_client = llm_client or OllamaClient()
        self.temperature = temperature
        self.message_history: list[AgentMessage] = []

    @property
    def name(self) -> str:
        """エージェント名"""
        return self.persona.name

    @property
    def role(self) -> str:
        """エージェントの役割"""
        return self.persona.role

    def build_context(self, topic: str, conversation_history: list[AgentMessage]) -> str:
        """会話コンテキストを構築

        Args:
            topic: ブレインストーミングのテーマ
            conversation_history: これまでの会話履歴

        Returns:
            プロンプト文字列
        """
        prompt_parts = [
            self.persona.system_prompt,
            f"\n現在のテーマ: {topic}",
        ]

        if conversation_history:
            prompt_parts.append("\nこれまでの議論:")
            for msg in conversation_history:
                prompt_parts.append(f"  {msg.agent_name}: {msg.content}")

        prompt_parts.append(f"\n{self.persona.perspective}")
        prompt_parts.append(f"\n{self.name}としての意見を簡潔に述べてください:")

        return "\n".join(prompt_parts)

    def generate_response(
        self, topic: str, conversation_history: list[AgentMessage]
    ) -> str:
        """応答を生成

        Args:
            topic: ブレインストーミングのテーマ
            conversation_history: これまでの会話履歴

        Returns:
            生成された応答
        """
        prompt = self.build_context(topic, conversation_history)
        response = self.llm_client.generate(prompt, temperature=self.temperature)
        return response.strip()

    def speak(
        self, topic: str, conversation_history: list[AgentMessage], round: int
    ) -> AgentMessage:
        """発言を行う

        Args:
            topic: ブレインストーミングのテーマ
            conversation_history: これまでの会話履歴
            round: 現在のラウンド数

        Returns:
            エージェントの発言
        """
        content = self.generate_response(topic, conversation_history)
        message = AgentMessage(agent_name=self.name, content=content, round=round)

        self.message_history.append(message)
        return message

    def reset_history(self) -> None:
        """発言履歴をリセット"""
        self.message_history.clear()

    @abstractmethod
    def get_initial_prompt(self, topic: str) -> str:
        """最初の発言のためのプロンプトを生成

        Args:
            topic: ブレインストーミングのテーマ

        Returns:
            初期プロンプト
        """
        pass
