"""エージェントファクトリー

ペルソナ定義からエージェントを作成するファクトリークラスです。
"""

from typing import List, Optional
from copy import deepcopy

from llm.ollama_client import OllamaClient
from llm.model_config import ModelConfig
from agents.personas import Persona, PersonaType, get_persona, get_all_personas
from agents.base_agent import BaseAgent, BrainstormAgent


class AgentFactory:
    """エージェントファクトリー

    ペルソナ定義からエージェントを作成します。
    """

    def __init__(
        self,
        client: OllamaClient,
        model_config: Optional[ModelConfig] = None
    ):
        """初期化

        Args:
            client: Ollamaクライアント
            model_config: 基本モデル設定（オプション）
        """
        self.client = client
        self.model_config = model_config

    def create_agent(
        self,
        persona_type: PersonaType,
        agent_class: type = BrainstormAgent,
        custom_temperature: Optional[float] = None
    ) -> BaseAgent:
        """エージェントを作成

        Args:
            persona_type: ペルソナタイプ
            agent_class: エージェントクラス（デフォルト: BrainstormAgent）
            custom_temperature: カスタム温度（オプション）

        Returns:
            作成されたエージェントインスタンス
        """
        persona = get_persona(persona_type)

        # 温度をカスタマイズ
        if custom_temperature is not None:
            persona = deepcopy(persona)
            persona.temperature = custom_temperature

        # モデル設定
        if self.model_config:
            model_config = ModelConfig(
                model_name=self.model_config.model_name,
                temperature=persona.temperature
            )
        else:
            model_config = ModelConfig(
                model_name="llama3.2",
                temperature=persona.temperature
            )

        return agent_class(persona, model_config, self.client)

    def create_all_agents(
        self,
        agent_class: type = BrainstormAgent
    ) -> List[BaseAgent]:
        """すべてのペルソナのエージェントを作成

        Args:
            agent_class: エージェントクラス（デフォルト: BrainstormAgent）

        Returns:
            作成されたエージェントインスタンスのリスト
        """
        agents = []
        for persona_type in PersonaType:
            agent = self.create_agent(persona_type, agent_class)
            agents.append(agent)
        return agents

    def create_custom_agent(
        self,
        persona: Persona,
        agent_class: type = BrainstormAgent
    ) -> BaseAgent:
        """カスタムペルソナでエージェントを作成

        Args:
            persona: カスタムペルソナ定義
            agent_class: エージェントクラス（デフォルト: BrainstormAgent）

        Returns:
            作成されたエージェントインスタンス
        """
        if self.model_config:
            model_config = ModelConfig(
                model_name=self.model_config.model_name,
                temperature=persona.temperature
            )
        else:
            model_config = ModelConfig(
                model_name="llama3.2",
                temperature=persona.temperature
            )

        return agent_class(persona, model_config, self.client)
