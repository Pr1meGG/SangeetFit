# SangeetFit release hardening

## Outcome and boundaries

Complete the existing occasion, owned-clothes, recommendation, try-on and comparison journey with controlled live access, explicit photo processing, privacy recovery and reproducible release checks. Keep the wardrobe session-only and preserve the warm festive UI. The two successful catalogue pilot cases support only those references on one source photo. No new paid tasks, deployments, account system, checkout, database or publication of private pilot images is authorized by this work.

## Evidence and architecture

The audit found public billable endpoints without server authorization; skin analysis without VTO-equivalent validation/deadlines; body limits enforced after buffering; automatic overlapping skin requests; no clear-session control; two successful references excluded from default recommendations; no complete test runner or CI; and an unsupported Next.js 14 runtime. Use the existing image parser, provider upload helper and native browser controls. Add a server-only live gate before reading photos or contacting YouCam. A strong preview access code protects controlled judging; a reserve check and process-local concurrency guard must not be described as a globally atomic serverless spending quota.

## Implementation checkpoints

1. **API safety and reliability.** Own `src/app/api/*`, new bounded JSON/live-access helpers, `.env.example`, and focused offline API tests. Enforce streamed body limits, validate skin image/response shapes, propagate one request deadline, preserve 429, sanitize provider errors, and return `Cache-Control: no-store`. Live processing fails closed without configured preview access; unauthorized or invalid requests make zero provider calls. Verify the documented read-only credit contract before adding a reserve check. Do not call the live service during development.
2. **Complete private user flow.** Primary owns `src/app/page.tsx`, `Navbar.tsx`, CSS and UI browser regressions. Prepare a selfie without submitting it; one explicit Analyze action submits one request. Guard stale preparation/results, reset copy status, clearly label URL-provided colours, provide clear-session and navigation-loss recovery, and supply session-only preview-code input to paid endpoints. Clearing invalidates pending work and releases all app-held photo/result references; it does not claim to delete provider copies.
3. **Reviewed catalogue entry points.** Own `src/data/editorial.ts`, `src/app/library/page.tsx` and editorial tests. Verify provenance/hashes and promote only Emerald Silk Kurta and Sapphire Embroidered Sherwani using the completed pilot. Label the limited one-source review accurately; other concepts remain candidates. Default eligible occasions gain genuine try-on choices, and unsupported coverage still offers own-clothes upload.
4. **Supported runtime and repeatable release.** Own package/lockfile, Next config, test runners, CI and application recovery pages. Select and pin a current supported patched Next release using official docs/registry evidence; update compatible React/tooling only as needed. Add offline/browser commands, mock-only CI, typecheck/lint/build checks and useful error/not-found recovery. Do not add tracking or upload repository data to an audit service.
5. **Integrate, review and preserve.** Run the complete offline suite, TypeScript, ESLint, mock production build and browser suite. Inspect desktop/phone-width journey and keyboard controls. Independent review covers API trust boundaries and React state. Fix concrete findings, update project state/task board/release instructions, then make scoped commits and push `codex/ui-revamp`; verify remote SHA. Preserve unrelated `.claude/settings.local.json` and `branding/`.

## Verification

Use `npm test`, `npm run typecheck`, `npm run lint`, `MOCK_MODE=true npm run build`, the mock-only browser runner and `git diff --check` once the scripts exist. API tests stub every provider request. Browser tests use synthetic photos. Assert unauthorized/chunked oversized requests reject before fetch, malformed provider responses are sanitized, 429/deadline never resubmit, uploads do not auto-generate, session clear removes private state, sliders/comparison create no tasks, and only the two reviewed references enter primary ranking.

## Remaining release gates

Deployment configuration, serverless-wide quota enforcement, actual Android/iPhone testing, own-garment live quality, independent usefulness evidence and public demo assets require their own verification. A local green suite is not production deployment proof. Publish no claim of broad face retention or guaranteed physical fit.
