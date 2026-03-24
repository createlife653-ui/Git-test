"""使用例

マルチエージェントブレインストーミングの使用例
"""

from llm.model_config import ModelConfig, ModelPreset
from agents import AgentFactory, get_recommended_combination, get_all_personas
from conversation import ConversationManager, BrainstormConfig
from output import FileOutput, OutputFormatter
from utils import setup_logger


def example_basic():
    """基本的な使用例"""
    print("=== 基本的な使用例 ===\n")

    # エージェントファクトリーの作成
    factory = AgentFactory()

    # バランス型チームを作成
    agents = factory.create_diverse_team(team_type="balanced")

    # 会話マネージャーの作成
    manager = ConversationManager()
    manager.add_agents(agents)

    # ブレインストーミングの実行
    result = manager.run_brainstorm("新しいカフェのコンセプト")

    # 結果の表示
    print(OutputFormatter.format_text(result))

    # ファイルに保存
    file_output = FileOutput()
    file_output.save_text(result)
    print("\n結果を保存しました")


def example_custom_team():
    """カスタムチームの使用例"""
    print("=== カスタムチームの使用例 ===\n")

    factory = AgentFactory()

    # 特定のペルソナを選択
    persona_names = ["creative", "optimist", "specialist"]
    agents = factory.create_team(persona_names)

    # 温度パラメータを調整
    agents = factory.create_team(
        persona_names,
        temperatures={"creative": 0.9, "optimist": 0.8, "specialist": 0.6}
    )

    manager = ConversationManager(
        config=BrainstormConfig(max_rounds=2)
    )
    manager.add_agents(agents)

    result = manager.run_brainstorm("リモートワークの生産性向上")
    print(OutputFormatter.format_markdown(result))


def example_custom_model():
    """カスタムモデル設定の使用例"""
    print("=== カスタムモデル設定の使用例 ===\n")

    # カスタムモデル設定
    config = ModelConfig(
        model=ModelPreset.MISTRAL.value,
        temperature=0.9,
        max_tokens=1024,
    )

    factory = AgentFactory(default_temperature=0.9)
    agents = factory.create_diverse_team(team_type="innovation")

    manager = ConversationManager()
    manager.add_agents(agents)

    result = manager.run_brainstorm("次世代のスマートホーム")
    print(OutputFormatter.format_json(result))


def example_multiple_outputs():
    """複数の出力形式の使用例"""
    print("=== 複数の出力形式の使用例 ===\n")

    factory = AgentFactory()
    agents = factory.create_diverse_team(team_type="practical")

    manager = ConversationManager()
    manager.add_agents(agents)

    result = manager.run_brainstorm("持続可能なパッケージング")

    # 全形式で保存
    file_output = FileOutput()
    saved_files = file_output.save_all_formats(result)

    print("保存したファイル:")
    for fmt, path in saved_files.items():
        print(f"  {fmt}: {path}")


def example_available_personas():
    """利用可能なペルソナの表示"""
    print("=== 利用可能なペルソナ ===\n")

    personas = get_all_personas()

    for name, persona in personas.items():
        print(f"【{name}】")
        print(f"  名前: {persona.name}")
        print(f"  役割: {persona.role}")
        print(f"  性格: {persona.personality}")
        print(f"  視点: {persona.perspective}")
        print()


def example_recommended_combinations():
    """推奨チーム組み合わせの表示"""
    print("=== 推奨チーム組み合わせ ===\n")

    combinations = {
        "balanced": "バランス型（司会、創造、批評、現実）",
        "innovation": "イノベーション型（創造、楽観、専門、異論）",
        "practical": "実務型（現実、専門、ユーザー、批評）",
        "full_diversity": "全ペルソナ（7人の多様な視点）",
    }

    for name, description in combinations.items():
        personas = get_recommended_combination(name)
        print(f"【{name}】")
        print(f"  説明: {description}")
        print(f"  メンバー:")
        for p in personas:
            print(f"    - {p.name}（{p.role}）")
        print()


if __name__ == "__main__":
    # ロガーのセットアップ
    setup_logger("examples")

    # 利用可能なペルソナと組み合わせを表示
    example_available_personas()
    example_recommended_combinations()

    # 各種使用例（コメントを外して実行）
    # example_basic()
    # example_custom_team()
    # example_custom_model()
    # example_multiple_outputs()
