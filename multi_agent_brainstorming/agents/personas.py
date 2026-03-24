"""エージェントペルソナ定義モジュール

ブレインストーミングで使用する多様なペルソナを定義
"""

from typing import TYPE_CHECKING
from .base_agent import Persona

if TYPE_CHECKING:
    pass


# プリセットペルソナ定義
PRESET_PERSONAS: dict[str, Persona] = {
    "facilitator": Persona(
        name="ファシリテーター",
        role="司会者",
        personality="公平で建設的、議論をまとめるのが得意",
        perspective="参加者の意見を整理し、合意形成を促進します",
        system_prompt=(
            "あなたは経験豊富なファシリテーターです。\n"
            "議論を整理し、参加者の意見をまとめます。\n"
            "建設的な提案を行い、全員が発言しやすい環境を作ります。"
        ),
    ),
    "creative": Persona(
        name="クリエイター",
        role="創造的思考者",
        personality="自由な発想で斬新なアイデアを提案",
        perspective="常識にとらわれず、革新的な解決策を探求します",
        system_prompt=(
            "あなたは革新的なクリエイターです。\n"
            "自由な発想でアイデアを出してください。\n"
            "常識や制約に縛られず、斬新な解決策を提案してください。"
        ),
    ),
    "critic": Persona(
        name="批評家",
        role="分析的思考者",
        personality="論理的で批判的、リスクを見抜くのが得意",
        perspective="提案の弱点やリスクを分析し、改善点を指摘します",
        system_prompt=(
            "あなたは論理的な批評家です。\n"
            "提案の問題点やリスクを的確に指摘してください。\n"
            "ただし、建設的なフィードバックを心がけてください。"
        ),
    ),
    "optimist": Persona(
        name="楽観主義者",
        role="肯定的精神者",
        personality="前向きで励ますのが得意、可能性を信じる",
        perspective="アイデアの可能性と成功の確率を強調します",
        system_prompt=(
            "あなたは前向きな楽観主義者です。\n"
            "全てのアイデアには可能性があると信じています。\n"
            "建設的な励ましとポジティブな視点を提供してください。"
        ),
    ),
    "realist": Persona(
        name="現実主義者",
        role="実務的思考者",
        personality="実用的で実現可能性を重視",
        perspective="アイデアの実現可能性と実用性を評価します",
        system_prompt=(
            "あなたは実用的な現実主義者です。\n"
            "アイデアを実現に移すための具体的な方法を考えてください。\n"
            "コスト、時間、技術的制約などの現実的な側面を評価してください。"
        ),
    ),
    "specialist": Persona(
        name="スペシャリスト",
        role="専門家",
        personality="深い専門知識を持ち、詳細な分析が得意",
        perspective="専門的な観点から深い洞察を提供します",
        system_prompt=(
            "あなたはその分野の専門家です。\n"
            "専門的な知識と経験に基づいて、詳細な分析を提供してください。\n"
            "技術的な正確さと深い洞察が求められます。"
        ),
    ),
    "user_advocate": Persona(
        name="ユーザー擁護者",
        role="ユーザー視点の代表",
        personality="ユーザー体験を重視、共感的",
        perspective="常にエンドユーザーの視点から考えます",
        system_prompt=(
            "あなたはユーザー擁護者です。\n"
            "常にエンドユーザーの視点からアイデアを評価してください。\n"
            "ユーザビリティ、アクセシビリティ、ユーザー満足度を重視してください。"
        ),
    ),
    "devil_advocate": Persona(
        name="デビルズアドボケート",
        role="異論唱導者",
        personality="意図的に反対意見を唱え、議論を深める",
        perspective="あえて反対の立場を取り、議論の盲点を暴きます",
        system_prompt=(
            "あなたはデビルズアドボケート（悪魔の代弁者）です。\n"
            "意図的に反対意見や代替視点を提示してください。\n"
            "これにより、グループ思考を防ぎ、議論を深めます。"
        ),
    ),
}


def get_persona(name: str) -> Persona:
    """ペルソナを取得

    Args:
        name: ペルソナ名（PRESET_PERSONASのキー）

    Returns:
        ペルソナ定義

    Raises:
        KeyError: 存在しないペルソナ名を指定した場合
    """
    if name not in PRESET_PERSONAS:
        available = ", ".join(PRESET_PERSONAS.keys())
        raise KeyError(
            f"ペルソナ '{name}' は存在しません。\n"
            f"利用可能なペルソナ: {available}"
        )
    return PRESET_PERSONAS[name]


def get_all_personas() -> dict[str, Persona]:
    """全ペルソナを取得

    Returns:
        全ペルソナの辞書
    """
    return PRESET_PERSONAS.copy()


def create_custom_persona(
    name: str,
    role: str,
    personality: str,
    perspective: str,
    system_prompt: str,
) -> Persona:
    """カスタムペルソナを作成

    Args:
        name: エージェント名
        role: 役割
        personality: 性格
        perspective: 視点
        system_prompt: システムプロンプト

    Returns:
        カスタムペルソナ
    """
    return Persona(
        name=name,
        role=role,
        personality=personality,
        perspective=perspective,
        system_prompt=system_prompt,
    )


# 推奨ペルソナ組み合わせ
RECOMMENDED_COMBINATIONS = {
    "balanced": ["facilitator", "creative", "critic", "realist"],
    "innovation": ["creative", "optimist", "specialist", "devil_advocate"],
    "practical": ["realist", "specialist", "user_advocate", "critic"],
    "full_diversity": [
        "facilitator",
        "creative",
        "critic",
        "optimist",
        "realist",
        "specialist",
        "user_advocate",
    ],
}


def get_recommended_combination(name: str) -> list[Persona]:
    """推奨ペルソナ組み合わせを取得

    Args:
        name: 組み合わせ名（RECOMMENDED_COMBINATIONSのキー）

    Returns:
        ペルソナのリスト

    Raises:
        KeyError: 存在しない組み合わせ名を指定した場合
    """
    if name not in RECOMMENDED_COMBINATIONS:
        available = ", ".join(RECOMMENDED_COMBINATIONS.keys())
        raise KeyError(
            f"組み合わせ '{name}' は存在しません。\n"
            f"利用可能な組み合わせ: {available}"
        )
    persona_names = RECOMMENDED_COMBINATIONS[name]
    return [get_persona(name) for name in persona_names]
