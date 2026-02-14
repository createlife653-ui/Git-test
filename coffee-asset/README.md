# Coffee Knowledge Asset System

## Purpose
This repository is not just a tasting log. It is a structured system to convert subjective coffee experiences into objective, reusable knowledge assets.
単なる味覚ログではなく、再編集・再構築・再販売可能な「知識資産」を作るためのシステム。

## Principles (基本方針)
1. **Subjective vs Objective**: Always separate *what happened* (facts) from *what you felt* (perception).
2. **Atomic Knowledge**: 1 File = 1 Theme.
3. **Quotable**: Include one sentence that can be used on Twitter/Instagram/Slides.
4. **AI Ready**: structured for easy ingestion by LLMs for summarization.
## ⚠ 注意：`example` 名義のコミットについて

このリポジトリには、初期設定の影響で `example` 名義のコミットが一部含まれます。  
これは **アカウントが別にある**という意味ではなく、当時の Git 設定（user.name / user.email）によるものです。

- **過去コミットを書き換えないこと（履歴改変・force push禁止）**
- 今後のコミットは `Kenta Fujikura` 名義で行う

もし `example` が再発した場合は、まず以下で原因（local/global）を確認します：

```bash
git config --show-origin --get user.email


## Structure
- **00_principles/**: Universal truths and scientific mechanisms. (Extraction, Chemistry)
- **01_frameworks/**: Tools for analysis. (Tasting forms, Calibration)
- **02_case_studies/**: Daily logs and specific bean analysis. (The raw data)
- **03_patterns/**: Insights derived from connecting case studies. (The wisdom)
- **04_meta/**: Plans for outputting this knowledge (Books, Web, Seminars).

## Usage
1. Brew coffee.
2. Duplicate `02_case_studies/template_case.md`.
3. Fill in the data.
4. If you start seeing a pattern (e.g., "All washed Ethiopians taste like lemon tea"), document it in `03_patterns`.
