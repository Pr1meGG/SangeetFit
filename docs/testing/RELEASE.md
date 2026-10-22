# SangeetFit release procedure

This is a preparation checklist, not deployment or live-task authorization. The two privately reviewed men's references are evidence from one source photo only. Own-clothes quality, independent usability, physical phones and public judge access remain unverified.

## Local release gate

1. Use Node 22.13+ (below 23), run `npm ci`, and install Playwright Chromium with `npx --no-install playwright install chromium`. On a machine with Chrome, `PLAYWRIGHT_CHANNEL=chrome` can select it instead.
2. Run `npm run verify` and `git diff --check` on the exact proposed commit. `verify` runs offline tests, TypeScript, ESLint, the Webpack production build and mock-only browser suites with `MOCK_MODE=true` and credentials cleared. Browser checks start their own loopback server on port 3503 by default; choose an unused `TEST_PORT` if needed. The CI workflow repeats this mock-only sequence. Record actual exit codes; neither local nor CI checks prove live VTO quality.
3. Review the branch diff and exclude `.env.local`, local settings, traces, personal photos/results and signed provider URLs. Record the tested commit SHA. Push a verified scoped checkpoint and confirm the remote SHA matches before deployment preparation.

The locally verified gated code checkpoint is `f05ca94`; it has not been deployed.

## Controlled judge preview preflight

- Obtain separate deployment authorization. Configure `YOUCAM_API_KEY`, `YOUCAM_BASE_URL`, `MOCK_MODE=false` and a fresh random `LIVE_ACCESS_CODE` of 24–256 characters as server-side secrets for the intended deployment environment. Never place the key or code in source, a `NEXT_PUBLIC_` variable, a link or public judging materials. Confirm the environment scope and resulting `/api/mode` without revealing secret values.
- The page accepts the shared code in a password field and keeps it only in that page session. In live mode, `/api/vto` and `/api/skin` reject missing/invalid codes before reading photo bodies or calling YouCam. This is one shared invitation, not user accounts or a server-wide credit cap. Decide a bounded judging window, limit who receives the code, monitor the account balance and stop exposure if the reserve is threatened. The 21 October post-pilot snapshot was 910 units with a 228-unit reserve; **refresh balance and price** before any further task. The remaining 14-look sweep is not authorized by this procedure.
- Confirm Vercel **Fluid Compute** for the project and deployed function configuration. Both photo routes allow up to 300 seconds while their own request deadline is 180 seconds; a legacy 60-second function limit would terminate them early. Confirm the production URL, route mode, error handling and expiration of result links. Check on actual Android Chrome and iPhone Safari before claiming those devices work. Do not use private pilot photos in a public smoke test or demo.
- Verify judge access in a clean browser without the developer's authenticated session. Test that browsing needs no code, missing/incorrect codes fail before provider work, and an authorized, separately approved bounded test uses the intended live project. Do not infer live success from mock CI or a `mode:live` badge alone.

## Rollback and exposure control

Record the deployed commit SHA, environment scope and the most recent **verified gated** release SHA before opening access. If a release fails, stop new paid requests first: redeploy with `MOCK_MODE=true` or remove the live key, verify `/api/mode` is `mock` or `unconfigured`, then redeploy the previous verified gated SHA if one exists. Provider tasks already accepted cannot be cancelled by switching modes. The last known committed checkpoint before this hardening work is `bc11c32`; it predates the access gate, so use it **only in mock/unconfigured mode**, never as a public live rollback. Verify the rollback URL and mode, record failures and remaining units, then investigate before restoring live access.

## Submission gate

Use permitted demo imagery and publish only claims supported by recorded results. The 16-look scorecard has two outcomes; the other 14 require separate approval. Final screenshots/video, accurate README/Devpost text, repository permissions, working judge URL, code licence and judging-period availability need their own checks. No deployment, live API task, video publication or submission is authorized by this document.

## Dependency advisory evidence — 22 October 2026

The installed runtime-only npm audit reported zero advisories. Development tooling still inherits the braces 3.0.3 stack-exhaustion advisory through glob/Tailwind tooling; no patched braces 3.x version was available from the registry during this check. These parsers are not public application endpoints. A pinned selector-parser 7.1.7 override addresses its separate parsing advisory; the production build and CSS/browser checks must pass after the override. Do not downgrade Next.js based on npm's suggested aggregate fix. Recheck advisories before deployment.
