"""会話マネージャー

ブレインストーミングセッションの進行を管理します。
ターン制御、収束判定、終了条件を管理します。
"""

import random
from typing import List, Optional, Callable
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

from agents.base_agent import BaseAgent, Message
from agents.personas import PersonaType


class TurnSelectionMode(Enum):
    """ターン選択モード"""
    FACILITATOR_LED = "facilitator_led"  # Facilitator-led方式
    ROUND_ROBIN = "round_robin"          # ラウンドロビン
    RANDOM = "random"                    # ランダム


@dataclass
class ConversationConfig:
    """会話設定

    Attributes:
        max_turns: 最大ターン数
        turn_selection_mode: ターン選択モード
        convergence_threshold: 収束判定の類似度閾値
        early_termination: 早期終了を有効にするか
    """
    max_turns: int = 12
    turn_selection_mode: TurnSelectionMode = TurnSelectionMode.FACILITATOR_LED
    convergence_threshold: float = 0.75
    early_termination: bool = True


@dataclass
class ConversationResult:
    """会話結果

    Attributes:
        topic: 話題
        messages: メッセージ履歴
        turn_count: ターン数
        start_time: 開始時刻
        end_time: 終了時刻
        termination_reason: 終了理由
    """
    topic: str
    messages: List[Message]
    turn_count: int
    start_time: datetime
    end_time: datetime
    termination_reason: str


class ConversationManager:
    """会話マネージャー

    ブレインストーミングセッションの進行を管理します。

    Attributes:
        agents: 参加エージェントのリスト
        config: 会話設定
        messages: メッセージ履歴
        current_turn: 現在のターン数
    """

    def __init__(
        self,
        agents: List[BaseAgent],
        config: Optional[ConversationConfig] = None
    ):
        """初期化

        Args:
            agents: 参加エージェントのリスト
            config: 会話設定（オプション）
        """
        if len(agents) == 0:
            raise ValueError("少なくとも1つのエージェントが必要です")

        self.agents = agents
        self.config = config or ConversationConfig()
        self.messages: List[Message] = []
        self.current_turn = 0
        self._speaker_counts: dict[str, int] = {agent.name: 0 for agent in agents}
        self._start_time: Optional[datetime] = None
        self._end_time: Optional[datetime] = None

    @property
    def is_first_turn(self) -> bool:
        """最初のターンかどうか"""
        return self.current_turn == 0

    def reset(self) -> None:
        """会話状態をリセット"""
        self.messages.clear()
        self.current_turn = 0
        self._speaker_counts = {agent.name: 0 for agent in self.agents}
        self._start_time = None
        self._end_time = None

        # 全エージェントの履歴もクリア
        for agent in self.agents:
            agent.clear_history()

    def _select_next_speaker(self) -> BaseAgent:
        """次の発言者を選択

        Returns:
            選択されたエージェント
        """
        mode = self.config.turn_selection_mode

        if mode == TurnSelectionMode.ROUND_ROBIN:
            # ラウンドロビン方式
            return self.agents[self.current_turn % len(self.agents)]

        elif mode == TurnSelectionMode.RANDOM:
            # ランダム選択
            return random.choice(self.agents)

        elif mode == TurnSelectionMode.FACILITATOR_LED:
            # Facilitator-led方式
            # 3ターンごとにFacilitatorが発言
            if self.current_turn % 3 == 0:
                facilitator = next(
                    (a for a in self.agents
                     if a.persona_type == PersonaType.FACILITATOR),
                    None
                )
                if facilitator:
                    return facilitator

            # それ以外は直近の発言者以外から、発言数が少ないエージェントを優先
            last_speaker = self.messages[-1].agent_name if self.messages else None

            candidates = [
                agent for agent in self.agents
                if agent.name != last_speaker
            ]

            if not candidates:
                candidates = self.agents

            # 発言数が少ない順にソートして、上位3つからランダム選択
            candidates.sort(key=lambda a: self._speaker_counts[a.name])
            top_candidates = candidates[:min(3, len(candidates))]

            return random.choice(top_candidates)

        # デフォルトはランダム
        return random.choice(self.agents)

    def _check_convergence(self) -> bool:
        """収束をチェック

        直近3ターンのメッセージから収束を判定します。
        簡易実装として、直近3ターンがすべてFacilitatorである場合を収束とみなします。

        Returns:
            収束している場合はTrue
        """
        if len(self.messages) < 3:
            return False

        recent = self.messages[-3:]
        facilitator_count = sum(
            1 for msg in recent
            if msg.persona_type == PersonaType.FACILITATOR
        )

        return facilitator_count >= 2

    def _check_early_termination(self) -> bool:
        """早期終了条件をチェック

        Returns:
            終了すべき場合はTrue
        """
        if not self.config.early_termination:
            return False

        # 収束チェック
        if self._check_convergence():
            return True

        return False

    def _update_message_history(self, message: Message) -> None:
        """メッセージ履歴を更新

        Args:
            message: 追加するメッセージ
        """
        self.messages.append(message)
        self._speaker_counts[message.agent_name] += 1

        # 全エージェントの履歴にも追加
        for agent in self.agents:
            agent.add_to_history(message)

    def run(
        self,
        topic: str,
        progress_callback: Optional[Callable[[int, Message], None]] = None
    ) -> ConversationResult:
        """ブレインストーミングセッションを実行

        Args:
            topic: 話題
            progress_callback: 進行状況コールバック（オプション）

        Returns:
            会話結果
        """
        self.reset()
        self._start_time = datetime.now()

        termination_reason = "最大ターン数に到達"

        try:
            while self.current_turn < self.config.max_turns:
                # 次の発言者を選択
                speaker = self._select_next_speaker()

                # 応答を生成
                if self.is_first_turn:
                    prompt = f"次の話題についてブレインストーミングを開始してください: {topic}"
                else:
                    prompt = None

                response = speaker.respond(topic, prompt)

                # メッセージを作成
                message = Message(
                    agent_name=speaker.name,
                    persona_type=speaker.persona_type,
                    content=response.strip(),
                    turn_number=self.current_turn + 1
                )

                # 履歴を更新
                self._update_message_history(message)

                # コールバックを呼び出し
                if progress_callback:
                    progress_callback(self.current_turn + 1, message)

                # 早期終了チェック
                if self._check_early_termination():
                    termination_reason = "会話が収束"
                    break

                self.current_turn += 1

        except KeyboardInterrupt:
            termination_reason = "ユーザーによる中断"

        finally:
            self._end_time = datetime.now()

        return ConversationResult(
            topic=topic,
            messages=self.messages.copy(),
            turn_count=len(self.messages),
            start_time=self._start_time,
            end_time=self._end_time,
            termination_reason=termination_reason
        )
