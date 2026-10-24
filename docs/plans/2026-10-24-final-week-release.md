# SangeetFit: seven days to a credible submission

Accepted implementation plan, 24 October 2026. Sprint: **24–30 October**; target submission **30 October**; recovery buffer **31 October–1 November**. Official deadline: **2 November 2026, 22:15 IST / 11:45 EST**. Judging ends **20 November**. Sources: [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules), [submission requirements](https://youcam-api-skin-ai-ecommerce.devpost.com/).

## Outcome and constraints

Demonstrate **add owned outfits → two genuine previews → compare → choose → plan five events → save an actual PDF**. The user has 4–6 hours daily and their own phone; no independent guest study is scheduled.

- **Altitude:** help a wedding guest make and keep a wardrobe decision.
- **Depth:** prove the complete path with rendered provider results, a physical phone and an inspected saved PDF. This is the most consequential lens.
- **Range:** include design, reliability, image rights, budget, judge access and submission assets.
- **Speed:** reuse existing implementation/protocols and the same two outputs for validation and recording.

Start an isolated `codex/final-week-release` branch at `853f955492df727df6abe5475798cef086b0d128`. Preserve the dirty `CC-P` checkout and exclude its unverified API polling changes. Inspect actual Vercel Git settings before pushing; prevent an unapproved automatic deployment.

Keep UI-v2, occasion browsing, own-clothes upload, comparison, assignments, rewear counts and private text-only export. Fix observed blockers only. Preserve request/response contracts and page-session storage. No new endpoints, database, dependencies, accounts, permanent wardrobes, checkout, family collaboration, top/bottom generation, chatbot or redesign. Optional skin analysis stays outside the pilot/headline demo.

## Daily work and proof

| Day | Work | Exit gate |
|---|---|---|
| 1 — 24 Oct | Clean release baseline; inspect deployment triggers; full mock verification. User identifies two owned garments and licensed demo-person source. | Reviewed baseline and blocker record; proposed exact inputs; processing/publication rights identified. |
| 2 — 25 Oct | Physical-phone mock walkthrough; fix observed navigation/permission/upload/comparison/export blockers. Finalize concrete release and task approval package. | Actual saved PDF opens correctly; independent review/full verification; feature freeze. |
| 3 — 26 Oct | After specific approvals, deploy reviewed SHA and verify clean-browser judge access. Exactly two Cloth V4 attempts using the same licensed source. Capture the whole journey immediately. | Rendered outputs, elapsed times, request/reservation counts, evaluator scores, result saving, comparison, assignment and PDF tied to deployed SHA. |
| 4 — 27 Oct | Assess outcomes; finish physical-phone release checks; diagnose failures without retries; reverify any fixes. | Written go/no-go, supported-input limits and usable recovery/privacy controls. |
| 5 — 28 Oct | Edit existing footage into 2:30 English demo; refresh five screenshots and Devpost narrative. | Reviewable permitted footage matching demonstrated behavior. |
| 6 — 29 Oct | Fresh-browser judging rehearsal; repository/setup, assets, private credentials route and final SHA. | Verified destinations and no developer-login dependency or unsupported claim. |
| 7 — 30 Oct | Resolve blockers; review exact public package; publish/submit only after specific authorization. | Verified submission confirmation; tested judge instructions and operating ownership. |

Agents handle engineering/docs/artifact preparation; user handles inputs, phone checks, visual assessment and recording. One writer per file, bounded project agents, primary integration and independent verification. Future dates are a schedule, not an instruction to create automations or wait instead of completing available work.

## Acceptance gates

Run `TEST_PORT=<verified-free-port> npm run verify` and `git diff --check` on the release source. Record exit codes, skips and source SHA. Require real-Redis CI evidence for that SHA before release signoff.

- Browsing, uploads, comparison, assignment and export generate zero tasks; one explicit Generate submits once, including repeated-tap protection.
- Exercise malformed uploads, permission denial, stale/expired results, timeout, source replacement, session clearing and exhausted allowance with mocks/stubs. Never use the real ledger destructively to test exhaustion.
- Inspect 320/390/1440px, visible actions, keyboard/focus, full-length images and overflow; emulation is not physical-phone evidence.
- Inspect an actual populated and partial PDF: five events, correct counts/labels/empty slots; no photos, access code, private URL or annotation leaks.
- Exactly two new live attempts: one user-owned `upper_body` garment and one complete `full_body` outfit, one licensed demo-person source/version. No skin tasks, implicit retries or extra recording generations.
- Confirm source and garment processing rights AND derived-output/footage publication rights before approval. User evaluator scores source likeness and garment fidelity independently ≥4/5 for each visibly rendered output. This is demo-source technical validation, not participant satisfaction or independent usability.
- Record every failed/uncertain attempt and actual Generate-to-visible-render time. Stop on 429. One failing case narrows claims; neither passing blocks owned-garment live signoff. Any retest needs new bounded approval.
- Capture raw upload/generation/comparison/planning/PDF footage and save permitted outputs during the same session; refresh and expiring links can otherwise lose the evidence.

## Release, budget and submission boundaries

Keep the repository private; verify the organizer's required private-sharing route before authorized sharing. Verify clean-browser access, actual live/mock mode, deployed function duration, asset tracing, runtime reservations and phone saving on the reviewed SHA. Keep a rollback target.

Propose **20 judging VTO attempts**, separate from the two pilot attempts. Current tariffs, provider balance, exact unit ceiling and 25% reserve need specifically authorized fresh inspection/approval. Historical allowance is not current capacity. No automatic refill, paid top-up or ledger reset.

Deployment/environment changes, live activation, account inspection, task spending, credential sharing, publication and submission retain separate specific approval gates. Planning capacity is not spending authorization. The user owns availability through 20 November: manually check access and authorized allowance status; record problems and obtain approval before changes. No monitoring automation is created.

No claims of independent validation, broad likeness reliability, sizing accuracy, proven savings or avoided purchases. Existing private catalogue photos/results remain excluded from public footage. Hardware not tested is listed as unverified; iPhone is not a prerequisite if only the user's other phone is available.

## Execution records

- [Current readiness/evidence](../testing/FINAL_WEEK_READINESS_2026-10-24.md)
- [Owned-garment pilot and input/approval receipts](../testing/OWN_GARMENT_PILOT.md)
- [Release/judge access preflight](../testing/JUDGING_ACCESS_PREFLIGHT.md)
- [Demo storyboard](../submission/DEMO_SCRIPT.md) and [submission checklist](../submission/PITCH_CHECKLIST.md)

Every unchecked gate remains pending. A mock pass does not establish live quality, phone behavior, public access or submission.
