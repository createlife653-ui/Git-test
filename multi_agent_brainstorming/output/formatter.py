"""会話フォーマッター

会話結果をJSONやMarkdown形式で出力します。
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Optional

from agents.base_agent import Message
from conversation.manager import ConversationResult


class ConversationFormatter:
    """会話フォーマッター

    会話結果を様々な形式で出力します。
    """

    def __init__(self, output_dir: str = "output/conversations"):
        """初期化

        Args:
            output_dir: 出力ディレクトリ
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def _generate_filename(self, topic: str, extension: str) -> str:
        """ファイル名を生成

        Args:
            topic: 話題
            extension: 拡張子

        Returns:
            ファイル名
        """
        # ファイルシステムに安全な文字列に変換
        safe_topic = "".join(
            c for c in topic
            if c.isalnum() or c in (' ', '-', '_')
        ).strip()
        safe_topic = safe_topic[:30]  # 長さ制限

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"brainstorm_{safe_topic}_{timestamp}.{extension}"

    def to_json(
        self,
        result: ConversationResult,
        filename: Optional[str] = None
    ) -> str:
        """JSON形式で保存

        Args:
            result: 会話結果
            filename: ファイル名（オプション）

        Returns:
            保存先ファイルパス
        """
        if filename is None:
            filename = self._generate_filename(result.topic, "json")

        filepath = self.output_dir / filename

        data = {
            "topic": result.topic,
            "turn_count": result.turn_count,
            "start_time": result.start_time.isoformat(),
            "end_time": result.end_time.isoformat(),
            "termination_reason": result.termination_reason,
            "messages": [
                {
                    "turn": msg.turn_number,
                    "speaker": msg.agent_name,
                    "persona_type": msg.persona_type.value,
                    "content": msg.content
                }
                for msg in result.messages
            ]
        }

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return str(filepath)

    def to_markdown(
        self,
        result: ConversationResult,
        filename: Optional[str] = None
    ) -> str:
        """Markdown形式で保存

        Args:
            result: 会話結果
            filename: ファイル名（オプション）

        Returns:
            保存先ファイルパス
        """
        if filename is None:
            filename = self._generate_filename(result.topic, "md")

        filepath = self.output_dir / filename

        lines = [
            f"# ブレインストーミング結果: {result.topic}",
            "",
            f"**日時**: {result.start_time.strftime('%Y-%m-%d %H:%M:%S')} - {result.end_time.strftime('%H:%M:%S')}",
            f"**ターン数**: {result.turn_count}",
            f"**終了理由**: {result.termination_reason}",
            "",
            "---",
            "",
            "## 会話ログ",
            ""
        ]

        for msg in result.messages:
            lines.append(f"### ターン {msg.turn_number}: {msg.agent_name}")
            lines.append("")
            lines.append(msg.content)
            lines.append("")

        with open(filepath, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

        return str(filepath)

    def print_to_console(self, result: ConversationResult) -> None:
        """コンソールに出力

        Args:
            result: 会話結果
        """
        print("\n" + "=" * 60)
        print(f"ブレインストーミング: {result.topic}")
        print("=" * 60)

        for msg in result.messages:
            print(f"\n[ターン {msg.turn_number}] {msg.agent_name}")
            print("-" * 40)
            print(msg.content)

        print("\n" + "=" * 60)
        print(f"ターン数: {result.turn_count}")
        print(f"終了理由: {result.termination_reason}")
        print(f"所要時間: {(result.end_time - result.start_time).total_seconds():.1f}秒")
        print("=" * 60 + "\n")
