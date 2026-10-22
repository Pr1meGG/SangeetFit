# Shared credit budget and Android verification

## Outcome and scope

Verify the existing Vercel deployment without submitting a YouCam task. Add one durable, atomic budget shared by both live photo routes and every Vercel instance. Prepare and run available Android checks without calling emulation a physical-phone test.

Production currently serves `b3cadb6` (`work/sangeetfit-mvp`); the current branch is 20 commits ahead. The public home responds 200; `/api/mode` and `/library` respond 404. Deployment and GitHub status metadata agree. No deployment is authorized by this task.

## Decision

The existing invite code is access control only. A local counter resets on server restart and cannot coordinate Vercel workers. Use a single persistent Upstash Redis hash via native HTTPS fetch and one atomic Lua reservation. This stores aggregate budget numbers only, never photos, identities, access codes or task URLs. Shared storage is necessary for the newly requested global cap; no wardrobe database is introduced.

The operator seeds `limit`, `used`, `vto`, and `skin` as integer hundredths of a unit in `sangeetfit:live-budget:v1`. Both routes share this exact key. Missing/invalid state, an expiring key, missing credentials or a storage failure blocks generation. The application never initializes, resets, expires or refunds the budget. Reserve after input validation and before any photo upload. Failed/ambiguous attempts retain their reservation: this may underuse the allowance but cannot silently free a possibly spent unit. Budget denial uses HTTP 503 and a clear message; provider 429 remains unchanged.

This is an application allowance, not an authoritative YouCam billing balance. The cap must fit a fresh balance minus the 25% reserve; prices must be refreshed before initialization. Other applications/old deployments sharing the YouCam key bypass this ledger. Enabling requires a persistent store, server-only configuration and a separately approved deployment. No automatic paid provisioning, live task or migration is authorized.

## Files and order

1. Add failing offline budget-boundary tests and missing-budget route tests. Implement `src/lib/live-budget.ts`; integrate `src/app/api/{vto,skin,mode}/route.ts`. Update the two existing offline fetch fixtures to stub the budget transport independently from provider requests. Test missing/exhausted/error/aborted reservations, validation/auth ordering, and mock bypass.
2. Add a real-Redis integration test using an isolated local Redis service in GitHub Actions. Exercise the production Lua script, concurrent reservations from separate module instances, mixed task costs, missing/corrupt/expiring keys and retained reservations. No cloud credentials or YouCam calls. Document if local Redis is unavailable rather than claiming local concurrency proof.
3. Add an explicit operator initialization/status tool that refuses overwrite and accepts only positive, two-decimal unit values. Keep default budget zero/unconfigured; do not execute initialization against cloud storage. Add server-only configuration guidance to `.env.example` and release docs.
4. Add Android checks for the latest local build: mobile viewport browsing, upload preparation without generation, dialog/slider controls and errors. Use synthetic images. Provide the physical-device checklist and record actual participant observations separately. Current tooling has neither ADB nor Apple device tooling, so hardware results require user participation or connecting a device.
5. Run `npm run verify`, independent code/security review, and `git diff --check`. Commit only reviewed project files, push the working branch and verify remote SHA. Leave unrelated settings/branding untouched. No deployment or live API task.

## Acceptance and risks

- Both live endpoints reject over-budget requests before provider work; one mixed global budget survives worker/module reloads.
- Redis does the check and increment atomically; missing state never resets an allowance. Initialization is create-only.
- Mock mode requires no storage and remains honestly labelled. Budget details/secrets never appear in public mode JSON or errors.
- Existing offline/browser suites still pass. Real Redis CI verifies atomic behavior; real Android Chrome verification remains separately labelled until observed.
- Reserve and per-task costs are operator inputs, not guessed current billing facts. Storage outages intentionally stop live generation. New code is not active on the old deployment until deployment approval.

## Execution record

- Preflight: inspected routes, auth, tests, verification runner, deployment metadata and official Upstash EVAL/REST documentation.
- Ruling: use shared aggregate storage despite the earlier no-database preference because a strict cross-instance cap requires atomic durable state. Session-only wardrobe remains unchanged.
- Implementation and independent code/TypeScript review complete. Full local `npm run verify` exited 0: 13 offline suites passed, the real-Redis suite skipped explicitly, TypeScript/lint/build and all eight mock browser suites passed. Redis concurrency is mandatory in GitHub CI; cloud activation and deployment remain pending.
- The user subsequently authorized USB testing. Actual Android14/Chrome155 portrait/mock decision flow and real camera cleanup passed; native picker, image saving and full hardware checklist remain pending. No captured camera photo, private photo upload or YouCam task.
