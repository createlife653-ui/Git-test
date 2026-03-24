"""会話管理モジュール

ブレインストーミングセッションの進行を管理
"""

from dataclasses import dataclass, field
from typing import Optional
from agents.base_agent import BaseAgent, AgentMessage


@dataclass
class BrainstormConfig:
    """ブレインストーミング設定"""

    max_rounds: int = 3
    min_response_length: int = 20
    allow_self_response: bool = False  # 同じエージェントが連続で発言可能か
    shuffle_order: bool = True  # 各ラウンドで発言順をシャッフル


@dataclass
class BrainstormResult:
    """ブレインストーミング結果"""

    topic: str
    total_rounds: int
    messages: list[AgentMessage] = field(default_factory=list)
    summary: str = ""

    def get_messages_by_agent(self, agent_name: str) -> list[AgentMessage]:
        """特定エージェントの発言を取得

        Args:
            agent_name: エージェント名

        Returns:
            そのエージェントの発言リスト
        """
        return [m for m in self.messages if m.agent_name == agent_name]

    def get_messages_by_round(self, round: int) -> list[AgentMessage]:
        """特定ラウンドの発言を取得

        Args:
            round: ラウンド数

        Returns:
            そのラウンドの発言リスト
        """
        return [m for m in self.messages if m.round == round]

    def get_all_agents(self) -> list[str]:
        """参加したエージェント名一覧を取得

        Returns:
            エージェント名のリスト
        """
        return list(set(m.agent_name for m in self.messages))


class ConversationManager:
    """会話マネージャー

    ブレインストーミングセッションの進行を管理
    """

    def __init__(self, config: Optional[BrainstormConfig] = None):
        """マネージャーを初期化

        Args:
            config: ブレインストーミング設定（省略時はデフォルト設定）
        """
        self.config = config or BrainstormConfig()
        self.agents: list[BaseAgent] = []
        self.conversation_history: list[AgentMessage] = []

    def add_agent(self, agent: BaseAgent) -> None:
        """エージェントを追加

        Args:
            agent: 追加するエージェント
        """
        if agent not in self.agents:
            self.agents.append(agent)

    def add_agents(self, agents: list[BaseAgent]) -> None:
        """複数のエージェントを追加

        Args:
            agents: 追加するエージェントリスト
        """
        for agent in agents:
            self.add_agent(agent)

    def clear_agents(self) -> None:
        """全エージェントをクリア"""
        self.agents.clear()

    def reset_history(self) -> None:
        """会話履歴をリセット"""
        self.conversation_history.clear()

    def _validate_agent(self, agent: BaseAgent) -> bool:
        """エージェントが有効かチェック

        Args:
            agent: チェックするエージェント

        Returns:
            有効な場合はTrue
        """
        return agent in self.agents

    def conduct_round(
        self,
        topic: str,
        round_num: int,
        speaker_order: Optional[list[BaseAgent]] = None,
    ) -> list[AgentMessage]:
        """1ラウンドの議論を実行

        Args:
            topic: 議論のテーマ
            round_num: 現在のラウンド数
            speaker_order: 発言順（省略時は全エージェント）

        Returns:
            そのラウンドの発言リスト
        """
        speakers = speaker_order or self.agents
        round_messages = []

        for agent in speakers:
            if not self._validate_agent(agent):
                continue

            message = agent.speak(topic, self.conversation_history, round_num)
            round_messages.append(message)
            self.conversation_history.append(message)

        return round_messages

    def run_brainstorm(self, topic: str) -> BrainstormResult:
        """ブレインストーミングを実行

        Args:
            topic: ブレインストーミングのテーマ

        Returns:
            ブレインストーミング結果
        """
        if not self.agents:
            raise ValueError("エージェントが追加されていません。add_agent()でエージェントを追加してください。")

        import random

        result = BrainstormResult(topic=topic, total_rounds=self.config.max_rounds)

        for round_num in range(1, self.config.max_rounds + 1):
            # 発言順を決定
            speakers = self.agents.copy()
            if self.config.shuffle_order:
                random.shuffle(speakers)

            # ラウンド実行
            round_messages = self.conduct_round(topic, round_num, speakers)
            result.messages.extend(round_messages)

        return result

    def get_conversation_summary(self) -> str:
        """会話の要約を取得

        Returns:
            会話の要約文字列
        """
        if not self.conversation_history:
            return "まだ議論が行われていません。"

        lines = []
        lines.append(f"総発言数: {len(self.conversation_history)}")
        lines.append("")

        for msg in self.conversation_history:
            lines.append(f"[Round {msg.round}] {msg.agent_name}")
            lines.append(f"  {msg.content}")
            lines.append("")

        return "\n".join(lines)
