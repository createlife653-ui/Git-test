# Multi-Agent Brainstorming Skill

## Description
Launch a multi-agent brainstorming session using Ollama. Multiple AI personas (Innovator, Critic, Synthesizer, Facilitator) discuss a topic autonomously to generate diverse ideas and insights.

## Trigger
Trigger when user says:
- "brainstorm"
- "ブレインストーミング"
- "multi-agent"
- "マルチエージェント"
- "エージェント会議"
- "discuss with agents"
- "エージェントと話し合って"

## Examples
- "brainstorm new breakfast menu ideas"
- "ブレインストーミング：新しいコーヒーの飲み方"
- "multi-agent discussion about AI safety"
- "マルチエージェントで環境問題を議論"

## Usage
Execute the brainstorming session:
1. User provides a topic
2. System launches multiple AI agents (30 turns by default)
3. Results are saved to output/conversations/
4. Returns the summary and file paths

## Requirements
- Python 3.8+
- Ollama running with at least one model (llama3.2 recommended)
- Run from multi_agent_brainstorming directory
