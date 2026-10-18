---
name: sangeetfit-workflow
description: Use for multi-step SangeetFit development, parallel implementation, complex debugging, QA passes, and hackathon release preparation. Orchestrates the project's native subagents (sf-scout, sf-builder, sf-qa, sf-reviewer, sf-submission) with disjoint file ownership, from outcome definition through verification and progress preservation.
---

# SangeetFit Workflow

Multi-stage orchestration for the SangeetFit project. The primary session is coordinator: it owns priorities, integration, verification, and final decisions. Native subagents do scoped work.

## Agent roster

| Agent | Role |
|-------|------|
| `sf-scout` | Read-only investigation: code, API flow, evidence, root-cause candidates |
| `sf-builder` | Bounded implementation within an assigned file-ownership scope |
| `sf-qa` | Local tests, tsc, build, git diff --check; exact honest results |
| `sf-reviewer` | Independent read-only review of integrated changes |
| `sf-submission` | Documentation and submission artifacts only |

Cap: **three** active spawned subagents at a time (workflow rule — no config key exists for this; enforce by not spawning more).

## Stage A — Define the outcome

1. Understand the requested outcome and acceptance criteria.
2. Read `docs/agent-workflow/PROJECT_STATE.md` and `TASK_BOARD.md`, and check `git status --short` for current state.
3. Identify relevant code, dependencies, and whether parallel work is genuinely justified.
4. Proceed on reasonable assumptions; don't stall on questions the repo can answer.

## Stage B — Delegate efficiently

- Up to three subagents concurrently. Do not spawn agents for trivial or single-file tasks — do it inline.
- For broad or uncertain work, begin with independent read-only `sf-scout` investigations (parallel, distinct focus areas).
- Assign distinct workstreams, explicit outputs, and **disjoint file-ownership boundaries** per builder.
- Keep each agent's request focused; never ask every agent to investigate the whole repo.
- Wait for all relevant results before integrating dependent changes.
- Prefer fewer useful agents over agent theatre.

## Stage C — Implement

- One primary writer per file or file group; parallelize only independent tasks.
- Shared files belong to the primary session.
- Integrate changes deliberately; avoid conflicting edits.
- Stop before any unapproved external or destructive action (live API, deploy, commit/push, git reset/clean).

## Stage D — Verify and review

- After integration, run relevant regression tests, `npx tsc --noEmit`, the production build, and `git diff --check` when appropriate (sf-qa or inline).
- Do not have QA inspect an unfinished intermediate state — verify after integration.
- Ask `sf-reviewer` to inspect the integrated changes.
- Verify every claim against actual command output. If tests fail, diagnose rather than falsely report completion.
- Distinguish a verified fix from an unresolved hypothesis in the final report.

## Stage E — Preserve progress

- Update `docs/agent-workflow/TASK_BOARD.md` after material task-status changes.
- Update `docs/agent-workflow/PROJECT_STATE.md` when durable facts, verified outcomes, major decisions, or blockers change.
- Do not fill project-state files with repetitive logs.
- Never persist secrets, credentials, personal image contents, or sensitive API identifiers.

## Stage F — Report

Return a concise report: what changed; which agents ran and what they contributed; tests and verification results (actual output); known limitations and blockers; remaining work and recommended next task; git state including pre-existing changes that remain untouched.

## Reference playbook prompts

Copyable shortcuts for triggering these stages live in `docs/agent-workflow/PLAYBOOK.md`.
