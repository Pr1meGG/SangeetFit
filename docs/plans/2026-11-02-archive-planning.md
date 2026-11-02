# Archive wedding planning and PDF export

User request: remove the plan board, creating plans and exporting them from the
active app immediately, preserving the feature for later.

## Scope and approach

- `src/app/page.tsx`: detach board/print imports and mounts, remove session-only
  plan state and assignment callbacks, route browsing to `try-on`.
- `src/components/Navbar.tsx`, `HomeGuide.tsx`, `LookComparison.tsx`: remove
  planning actions/claims and comparison assignment buttons. Reuse the existing
  gallery flow, with the main action labelled **Try on a look**.
- Preserve `WeddingWeekBoard.tsx`, `WardrobePlanPrint.tsx`, summary helper/unit
  tests and dedicated styles as unmounted archive code. No data migration: plan
  assignments existed only in memory. Preserve personal garment/result handling.
- Legacy `?view=plan` and board hashes should reach the working gallery, without
  trying to focus an absent board. Keep direct outfit links working.
- Update affected browser suites, preserving generation/privacy/session/mobile
  coverage. Replace the active board/PDF suite with archive absence and legacy
  link regressions; keep its historical suite outside the active test runner.
- Update README, active submission/architecture/demo drafts and state records.
  Preserve older demo scripts and clearly mark old videos as superseded.

## Ownership

App builder: the four application files above. Test builder: affected browser
suites and the historical suite copy only. Primary: docs, integration, review
and verification. No overlapping writes.

## Acceptance and verification

No board, plan assignment buttons, planning CTAs, print component or PDF export
in the active UI, including old links and support views. Browsing, own clothes,
shortlist, explicit mock try-on, comparison and result saving remain usable.
Run `npm run verify` and `git diff --check` after integration, inspect all exit
codes and obtain independent React/TypeScript review. Use mock mode, no live
provider calls. No new dependencies, API edits, deployment, commit or push.

## Risks

Existing screenshots/videos/scripts demonstrating the board/PDF must not be
submitted for this candidate. Production remains a separate deployment until
explicitly authorized. Preserve unrelated local documentation changes.
