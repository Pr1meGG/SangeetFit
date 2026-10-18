# PLAYBOOK.md

Copyable prompts. Normal-language requests work too — these are shortcuts, not syntax.

## Status
> Read the project state and Git status. Tell me the three highest-priority tasks, blockers, and recommended next action. Do not modify files.

## Plan
> Plan the smallest complete implementation of [outcome]. Use parallel read-only investigation where helpful, identify dependencies and file ownership, present the plan for my confirmation before executing.

## Build
> Implement [outcome] using the SangeetFit workflow. Delegate genuinely independent tasks to native subagents, keep file ownership disjoint, verify the result, and update the task board.

## Parallel
> Split [outcome] into independent workstreams. Use native subagents with distinct ownership, wait for their results, integrate changes, run tests, and request an independent review. Do not parallelize shared-file edits.

## Investigate
> Investigate [failure] from existing logs, code, tests, and documentation. Separate confirmed facts from hypotheses. Do not make live API calls or modify files.

## Review
> Review the current changes for correctness, security, regressions, and missing tests using an independent read-only reviewer. Do not edit files.

## Ship check
> Audit release readiness against the task board. Verify build, tests, demo, documentation, and accuracy of claims. Do not commit, push, deploy, or make live API calls.
