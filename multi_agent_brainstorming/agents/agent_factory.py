"""エージェントファクトリーモジュール

様々なエージェントを生成・管理するファクトリークラス
"""

from typing import Optional, Type
from llm.ollama_client import OllamaClient
from llm.model_config import ModelConfig
from .base_agent import BaseAgent, Persona
from .personas import get_persona, PRESET_PERSONAS


class BrainstormAgent(BaseAgent):
    """ブレインストーミング用エージェント

    汎用的なブレインストーミングを行うエージェント実装
    """

    def get_initial_prompt(self, topic: str) -> str:
        """最初の発言のためのプロンプトを生成

        Args:
            topic: ブレインストーミングのテーマ

        Returns:
            初期プロンプト
        """
        return (
            f"{self.persona.system_prompt}\n"
            f"\nテーマ「{topic}」についてのブレインストーミングを開始します。\n"
            f"{self.name}（{self.role}）として、最初のアイデアや意見を述べてください。\n"
            f"{self.persona.perspective}"
        )


class AgentFactory:
    """エージェント生成ファクトリー

    様々な設定でエージェントを生成するクラス
    """

    def __init__(
        self,
        llm_client: Optional[OllamaClient] = None,
        default_temperature: float = 0.8,
    ):
        """ファクトリーを初期化

        Args:
            llm_client: 共通で使用するLLMクライアント（省略時は各エージェントで作成）
            default_temperature: デフォルトの温度パラメータ
        """
        self.llm_client = llm_client
        self.default_temperature = default_temperature

    def create_agent(
        self,
        persona: Persona,
        agent_class: Type[BaseAgent] = BrainstormAgent,
        temperature: Optional[float] = None,
    ) -> BaseAgent:
        """エージェントを生成

        Args:
            persona: エージェントのペルソナ
            agent_class: エージェントクラス（デフォルトはBrainstormAgent）
            temperature: 温度パラメータ（省略時はファクトリーのデフォルト値を使用）

        Returns:
            生成されたエージェントインスタンス
        """
        temp = temperature if temperature is not None else self.default_temperature
        return agent_class(
            persona=persona,
            llm_client=self.llm_client,
            temperature=temp,
        )

    def create_from_preset(
        self,
        persona_name: str,
        agent_class: Type[BaseAgent] = BrainstormAgent,
        temperature: Optional[float] = None,
    ) -> BaseAgent:
        """プリセットペルソナからエージェントを生成

        Args:
            persona_name: プリセットペルソナ名
            agent_class: エージェントクラス
            temperature: 温度パラメータ

        Returns:
            生成されたエージェントインスタンス
        """
        persona = get_persona(persona_name)
        return self.create_agent(persona, agent_class, temperature)

    def create_team(
        self,
        persona_names: list[str],
        agent_class: Type[BaseAgent] = BrainstormAgent,
        temperatures: Optional[dict[str, float]] = None,
    ) -> list[BaseAgent]:
        """エージェントチームを生成

        Args:
            persona_names: プリセットペルソナ名のリスト
            agent_class: エージェントクラス
            temperatures: 各ペルソナの温度パラメータ（{persona_name: temperature}）

        Returns:
            生成されたエージェントリスト
        """
        agents = []
        temps = temperatures or {}

        for name in persona_names:
            temp = temps.get(name)
            agent = self.create_from_preset(name, agent_class, temp)
            agents.append(agent)

        return agents

    def create_diverse_team(
        self,
        team_type: str = "balanced",
        agent_class: Type[BaseAgent] = BrainstormAgent,
    ) -> list[BaseAgent]:
        """推奨ペルソナ組み合わせからチームを生成

        Args:
            team_type: チームタイプ
                - "balanced": バランス型（司会、創造、批評、現実）
                - "innovation": イノベーション型（創造、楽観、専門、異論）
                - "practical: 実務型（現実、専門、ユーザー、批評）
                - "full_diversity": 全ペルソナ
            agent_class: エージェントクラス

        Returns:
            生成されたエージェントチーム
        """
        # 推奨組み合わせの定義
        combinations = {
            "balanced": ["facilitator", "creative", "critic", "realist"],
            "innovation": ["creative", "optimist", "specialist", "devil_advocate"],
            "practical": ["realist", "specialist", "user_advocate", "critic"],
            "full_diversity": list(PRESET_PERSONAS.keys()),
        }

        if team_type not in combinations:
            available = ", ".join(combinations.keys())
            raise ValueError(
                f"チームタイプ '{team_type}' は存在しません。\n"
                f"利用可能なタイプ: {available}"
            )

        persona_names = combinations[team_type]
        return self.create_team(persona_names, agent_class)

    @staticmethod
    def create_custom_llm_client(config: Optional[ModelConfig] = None) -> OllamaClient:
        """カスタム設定のLLMクライアントを作成

        Args:
            config: モデル設定（省略時はデフォルト設定）

        Returns:
            Ollamaクライアントインスタンス
        """
        return OllamaClient(config)
