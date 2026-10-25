# SangeetFit documentation

Entry points, then how the folders are organised.

## Start here

| Document | What it answers |
|---|---|
| [`PRODUCT_SPEC.md`](PRODUCT_SPEC.md) | What the product is, the intended journey, input architecture, acceptance criteria |
| [`agent-workflow/PROJECT_STATE.md`](agent-workflow/PROJECT_STATE.md) | Verified facts by checkpoint, what is live versus mock, what remains unproven |
| [`agent-workflow/TASK_BOARD.md`](agent-workflow/TASK_BOARD.md) | Current milestone queue and open gates |
| [`submission/PITCH_CHECKLIST.md`](submission/PITCH_CHECKLIST.md) | Every remaining submission requirement, checked off only with evidence |
| [`testing/RELEASE.md`](testing/RELEASE.md) | Build, environment and release procedure |

## Folders

| Folder | Contents |
|---|---|
| `agent-workflow/` | Durable project state, backlog, the subagent playbook and handoffs |
| `plans/` | Dated design and implementation plans, including what was verified and what was not |
| `testing/` | Date-stamped verification records, device checks, access preflight, benchmarks, release notes |
| `research/` | Product discovery: landscape, competitors, concepts, recommendation, red-team review |
| `submission/` | Devpost draft, demo script, pitch checklist, submission screenshots |
| `garment-library/` | Provenance and licensing for the sourced outfit photos |
| `archive/` | Retired documents kept for history; superseded by the current records above |

## Conventions

- **Plans:** `plans/YYYY-MM-DD-slug.md`. State the goal, the scope, the verification actually performed, and the limits of that verification.
- **Evidence:** `testing/` files carry a date prefix when they record a specific run. Never upgrade a prepared protocol into a result: "not run" stays "not run".
- **Claims:** label the mode (mock or live), the sample size and the source of each result. Do not restate a prior report as a current verification.
- **Provenance:** every sourced image needs an author, licence and source URL, recorded in its data file and listed in `garment-library/`.
- **Retirement:** move superseded documents and assets instead of deleting them. Documents go to `archive/` here; working scratch and earlier brand generations go to the top-level `archive/` (see [`archive/README.md`](../archive/README.md)).

## Root files

`AGENTS.md` (working rules), `CLAUDE.md` (client-specific notes), `README.md` (product overview and setup). Everything else belongs in one of the folders above.
