# SAeCo — YouCam API Skin AI & eCommerce VTO Hackathon Project

## Project Context

YouCam Clothes VTO (Virtual Try-On) application built with Next.js 14, TypeScript, and Tailwind CSS. Uses the YouCam API for clothing virtual try-on functionality.

## Development Skill Workflow

### Skill Activation Policy

**Brainstorming**
- Use when exploring a new product idea, major feature, or architectural approach.
- Evaluate alternatives and trade-offs before implementation.
- Respect a sufficiently detailed task specification: make reasonable assumptions and proceed without unnecessary clarification loops.
- Do not ask questions whose answers are already available in the conversation or repository.

**Writing Plans**
- Use before substantial implementation, architectural changes, or multi-step work.
- Inspect the actual codebase first.
- Produce a plan containing the relevant files, dependencies, acceptance criteria, tests, risks and verification commands.
- Adapt task granularity to the complexity of the change. Do not turn every trivial edit into an unnecessarily long sequence.

**Systematic Debugging**
- Use when a bug, failed test, API error or unexpected behaviour occurs.
- Read the complete error, reproduce the issue where possible, investigate logs and inspect relevant code before proposing a fix.
- State and test a specific root-cause hypothesis.
- Apply the smallest justified fix, then run relevant regression tests.
- Never repeatedly change unrelated code without evidence.

**Verification Before Completion**
- Use before claiming an implementation is complete, a bug is fixed, tests pass or a build succeeds.
- Run the relevant verification commands against the current code.
- Inspect exit codes and test output.
- Distinguish verified facts from assumptions and incomplete work.
- Never trust an agent's success message without independent verification.

### General Operating Rules

- Read the relevant `SKILL.md` completely when its workflow applies.
- Invoke a skill explicitly through its supported Codex interface when useful, rather than relying solely on the fact that it exists on disk.
- Skills guide behaviour; they do not replace engineering judgement.
- Prefer minimal, reversible changes and preserve working code.
- Inspect existing implementations before creating duplicates.
- Do not claim that a feature is production-ready without appropriate testing, error handling, security review and deployment verification.
- Keep API keys server-side. Never expose credentials in frontend code or logs.
- For YouCam integrations, verify actual endpoints, authentication headers, request formats, response semantics and asynchronous task handling against official documentation and working project code.
- Never present mock API results as genuine live API responses.
- Use tests proportionately. Prioritise API contracts, core business logic, failure cases and regression risks.
- Avoid unnecessary agents, abstractions, dependencies and infrastructure.
- Given my beginner-level implementation experience, explain significant architectural decisions and non-obvious trade-offs clearly, without overexplaining trivial syntax.

## Multi-Agent Workflow

For multi-step development, complex debugging, parallel work, or release preparation, use the `sangeetfit-workflow` skill (`.agents/skills/sangeetfit-workflow/SKILL.md`). It orchestrates the project's native subagents:

| Agent | Role | Tools |
|-------|------|-------|
| `sf-scout` | Read-only investigation (code, APIs, evidence) | read-only |
| `sf-builder` | Bounded implementation, smallest complete change | edit + run |
| `sf-qa` | Local tests, tsc, build, report exact results | run-only |
| `sf-reviewer` | Independent post-implementation review | read-only |
| `sf-submission` | Hackathon docs, README, demo, pitch | docs-only |

Durable rules: file ownership is disjoint per agent — never let multiple agents edit the same files concurrently; the primary session owns shared files, integration, verification, and final decisions. Max three concurrent spawned subagents (workflow rule; Codex has no supported config key for this). Playbook copyable prompts live in `docs/agent-workflow/PLAYBOOK.md`; durable facts in `PROJECT_STATE.md`, backlog in `TASK_BOARD.md`.

## Safety and Approval Rules

- Keep mock mode enabled for ordinary local development unless explicitly requested otherwise. No live YouCam API tasks, paid operations, deployments, or external side effects without explicit approval for that specific action.
- The user authorized scoped commits and pushes at meaningful verified checkpoints on 21 October 2026. Stage only reviewed project changes, exclude secrets/local settings/traces/private photos, push the working branch and verify its remote SHA. This does not authorize merging or deployment.
- No destructive Git operations or bulk restoration/deletion without explicit user approval.
- Never print secrets, image contents, or sensitive personal data. Do not read `.env.local` values.
- Do not repeat failed operations in loops; after a 429, stop and seek a lower-cost path.
- Do not open individual images or build contact sheets repeatedly unless visual inspection is necessary.
- Run appropriate tests and report actual results; never claim a command passed if it was not executed successfully.
- Preserve user work. Stop when evidence is insufficient rather than guessing. Don't ask approval for every harmless local action — operate independently inside stated task boundaries.

## Skill Routing

Route requests to the appropriate skill based on task type:

| Task Type | Skill |
|-----------|-------|
| New product ideation or hackathon concept selection | `youcam-hackathon-ideation` |
| Opportunity mapping and product-discovery analysis | `product-discovery` |
| Large multi-source investigations and adversarial research | `deep-research` |
| Implementation planning | `writing-plans` |
| Bugs and failed tests | `systematic-debugging` |
| Final verification before claims | `verification-before-completion` |

Invoke the relevant skill explicitly when the task matches. Do not invoke every skill for every request.

## Hackathon Execution Policy

For this project, the priorities are:

1. Correctness and a genuinely working core experience.
2. A meaningful YouCam API integration.
3. Competitive differentiation and a clear value proposition.
4. A distinctive, well-designed user experience.
5. Reliable testing, deployment and demo execution.

Do not build a multi-agent workflow simply to make the application sound more advanced. Do not prioritise visual polish over an unverified core API integration.
