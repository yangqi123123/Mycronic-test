---
name: write-a-prd
description: Create a product requirements document (PRD) via user interview, light codebase exploration, and implementation design, then publish it as a GitHub issue. Use when the user asks to write a PRD, create requirements, plan a feature, scope work, define user stories, or open a GitHub issue for a new feature.
---

# write-a-prd

## Outcome

Produce a PRD markdown document and create a GitHub Issue containing it.

## Default workflow

1. **Elicit the problem**
   - Ask for a detailed description of the problem, who experiences it, and why it matters.
   - Ask for any constraints (timeline, platforms, compliance, integrations), and what “done” means.

2. **Interview to remove ambiguity**
   - Ask questions until requirements, edge cases, and non-goals are clear.
   - Force decisions where needed (permissions, roles, data retention, error handling, analytics, i18n, performance).
   - If requirements are unstable, propose two or three options with trade-offs and get a choice.
   - Use the question bank in [INTERVIEW_QUESTIONS.md](INTERVIEW_QUESTIONS.md) as needed.

3. **Explore the codebase just enough**
   - Identify the relevant domain modules and existing similar features.
   - Capture current constraints (existing APIs, data model, auth/roles, UI patterns) as *implementation decisions*.
   - Do not copy file paths or code into the PRD.

4. **Design the solution at module/API level**
   - Propose “deep modules” where possible: stable, testable interfaces that encapsulate complexity.
   - Define external contracts (API endpoints, events, DB schema changes) at a conceptual level.
   - Identify risks and open questions and either resolve them or call them out explicitly.

5. **Write the PRD**
   - Use the structure in [PRD_TEMPLATE.md](PRD_TEMPLATE.md).
   - Write from the user’s perspective for *problem/solution* sections.
   - User stories should be extensive and cover happy path + edge cases + admin/ops needs.
   - Avoid file paths and code snippets (they rot quickly).

6. **Publish as a GitHub Issue**
   - Use GitHub CLI (`gh`) to create an issue in the current repo.
   - If issue labels/milestone/assignees are used in this repo, apply them.
   - Use a title that describes outcome + audience (e.g., “PRD: Add lead deduplication in import flow”).
   - If `gh auth status` indicates not logged in, prompt the user to authenticate.

## Output requirements

- PRD must include: **Problem statement, Solution, User stories, Implementation decisions, Testing decisions, Out of scope, Further notes**.
- Include **open questions** when unknowns remain.
- Include a **test plan** that emphasizes external behavior, not implementation details.

## Additional resources

- PRD template: [PRD_TEMPLATE.md](PRD_TEMPLATE.md)
- Interview question bank: [INTERVIEW_QUESTIONS.md](INTERVIEW_QUESTIONS.md)
