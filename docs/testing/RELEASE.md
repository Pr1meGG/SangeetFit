# SangeetFit release procedure

**Latest checkpoint:** [cloud/device record](CLOUD_CHECKPOINT.md) supersedes initial pending CI/deployment statements below. Real-Redis CI passed and an approved protected mock Preview is deployed. Production is unchanged. Free-store setup remains blocked by marketplace acceptance and denied browser-origin permission; no store/budget exists.

This is a preparation checklist, not deployment or live-task authorization. The two privately reviewed men's references are evidence from one source photo only. Own-clothes quality, independent usability and public judge access remain unverified. Android has partial USB-local mock evidence below; iPhone remains untested.

## Local release gate

1. Use Node 22.13+ (below 23), run `npm ci`, and install Playwright Chromium with `npx --no-install playwright install chromium`. On a machine with Chrome, `PLAYWRIGHT_CHANNEL=chrome` can select it instead.
2. Run `npm run verify` and `git diff --check` on the exact proposed commit. `verify` runs offline tests, TypeScript, ESLint, the Webpack production build and mock-only browser suites with `MOCK_MODE=true` and credentials cleared. Browser checks start their own loopback server on port 3503 by default; choose an unused `TEST_PORT` if needed. The CI workflow repeats this mock-only sequence. Record actual exit codes; neither local nor CI checks prove live VTO quality.
3. Review the branch diff and exclude `.env.local`, local settings, traces, personal photos/results and signed provider URLs. Record the tested commit SHA. Push a verified scoped checkpoint and confirm the remote SHA matches before deployment preparation.

The locally verified gated code checkpoint is `f05ca94`; it has not been deployed. A 22 October read-only check confirmed the existing public production app still serves `b3cadb6` on `work/sangeetfit-mvp`, 20 commits behind checkpoint `283d27a`. Home returns 200; `/api/mode` and `/library` return 404. See the [Android record](ANDROID_CHECK.md). Existing deployment is not evidence that the current branch is deployed.

## Partial Android evidence — 22 October 2026

On Android 14/Chrome 155, code `81dd342` was tested over USB-local mock. Android's native picker delivered a synthetic 400×600 image; upload alone started no task. Exactly one explicit mock VTO route request ran, and Android saved the 381217-byte JPEG with a SHA-256 matching the packaged Emerald reference. Native Replace accepted a stored 600×400 EXIF-6 fixture, prepared it as 400×600 and cleared the prior modal result. Distinct-source switching/recovery was not established. Choose/original made no extra requests; clearing the private session removed comparison/reset consent, and reload retained no source/results. No page errors occurred. Earlier real camera Allow/Cancel passed without capturing or sending a photo.

Hardware slider touch moved 50% → 92% with a 44px-high range control and accessibility text at 92%, using an intercepted live-shaped response under **SYNTHETIC UI TEST — NO YOUCAM RESULT**. The server stayed mock and provider tasks stayed zero. This is control evidence, not a live YouCam result. Camera reopen/deny, iPhone, cloud Preview-on-phone, distinct-source switching/recovery and live signed-result download remain pending; landscape was skipped by user choice. See the [Android record](ANDROID_CHECK.md) for the detailed evidence and remaining checks. Application tests were not rerun for this documentation-only update.

## Controlled judge preview preflight

- Obtain separate deployment authorization. Configure `YOUCAM_API_KEY`, `YOUCAM_BASE_URL`, `MOCK_MODE=false` and a fresh random `LIVE_ACCESS_CODE` of 24–256 characters as server-side secrets for the intended deployment environment. Never place the key or code in source, a `NEXT_PUBLIC_` variable, a link or public judging materials. Confirm the environment scope and resulting `/api/mode` without revealing secret values.
- The page accepts the shared code in a password field and keeps it only in that page session. In live mode, `/api/vto` and `/api/skin` reject missing/invalid codes before reading photo bodies or calling YouCam. This is one shared invitation, not user accounts. Both endpoints separately reserve units from the shared budget described below before uploading any photo. Decide a bounded judging window, limit who receives the code and monitor the account balance. The 21 October post-pilot snapshot was 910 units with a 228-unit reserve; **refresh balance and price** before any further task. The remaining 14-look sweep is not authorized by this procedure.
- Confirm Vercel **Fluid Compute** for the project and deployed function configuration. Both photo routes allow up to 300 seconds while their own request deadline is 180 seconds; a legacy 60-second function limit would terminate them early. Confirm the production URL, route mode, error handling and expiration of result links. Check on actual Android Chrome and iPhone Safari before claiming those devices work. Do not use private pilot photos in a public smoke test or demo.
- Verify judge access in a clean browser without the developer's authenticated session. Test that browsing needs no code, missing/incorrect codes fail before provider work, and an authorized, separately approved bounded test uses the intended live project. Do not infer live success from mock CI or a `mode:live` badge alone.

## Shared credit allowance

The application uses one persistent Upstash Redis hash through its HTTPS REST API. Both photo endpoints and every app instance use the fixed key `sangeetfit:live-budget:v1`. Redis executes the conditional reservation atomically using [EVAL](https://upstash.com/docs/redis/commands/scripting/eval). No Redis package is needed; the store contains only four aggregate integers, never photos, participants, invite codes or provider URLs.

Enable this only after authorizing persistent storage setup and the intended deployment. Do not use an expiring trial database for judging. Configure server-only `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the same environments as the provider key. The URL must be an HTTPS `*.upstash.io` root with no credentials, port override, path or query. Do not put secrets in command arguments or print environment files.

Refresh the actual YouCam balance and applicable VTO/skin costs. Choose an allowance that leaves at least 25% reserved and subtracts other committed work. Example only: **if** the freshly verified values are 910 remaining, 2 units per VTO and 20 per skin task, a deliberately small 40-unit application allowance leaves 870 outside the allowance. These are earlier snapshots, not newly verified prices or spending approval. With credentials supplied securely through the environment, initialization is explicit and create-only:

```sh
# Substitute freshly verified allowance and prices. This writes aggregate state only.
node --import tsx scripts/live-budget.mjs init 40 2 20
node --import tsx scripts/live-budget.mjs status
```

The first command refuses to overwrite an existing key. `status` prints allowance, reserved/remaining units and configured prices only. The hash stores integer hundredths in `limit`, `used`, `vto` and `skin`; it must have no TTL. Production requests never create missing state, reset it, refresh its expiry or refund reservations. Missing/corrupt/expiring state, insufficient allowance and storage failures return 503 before photo upload; storage calls have a short timeout. Other requests may already be running. A failed upload or uncertain submission retains its reservation, so this conservatively bounds attempted spend rather than exactly reproducing billing. Reconcile manually before increasing any allowance; never delete/reset the hash as routine troubleshooting.

This cap covers **only code using this ledger**. Other apps, scripts and older deployments using the same YouCam key bypass it. Route all approved live access through the guarded release, use the same store across deployments sharing that key, and disable old live access or use an appropriately isolated key. Changes to those deployments/keys require separate approval. A Redis outage intentionally pauses generation while browsing remains available. `/api/mode` checks configuration only; it does not query the ledger, expose balances or guarantee an available allowance.

No cloud store was provisioned or seeded during implementation. No new code was deployed and no YouCam task was submitted. The operator must verify prices/configuration and a controlled deployment before calling the cap active.

## Rollback and exposure control

Record the deployed commit SHA, environment scope and the most recent **verified gated** release SHA before opening access. If a release fails, stop new paid requests first: redeploy with `MOCK_MODE=true` or remove the live key, verify `/api/mode` is `mock` or `unconfigured`, then redeploy the previous verified gated SHA if one exists. Provider tasks already accepted cannot be cancelled by switching modes. The last known committed checkpoint before this hardening work is `bc11c32`; it predates the access gate, so use it **only in mock/unconfigured mode**, never as a public live rollback. Verify the rollback URL and mode, record failures and remaining units, then investigate before restoring live access.

## Submission gate

Use permitted demo imagery and publish only claims supported by recorded results. The 16-look scorecard has two outcomes; the other 14 require separate approval. Final screenshots/video, accurate README/Devpost text, repository permissions, working judge URL, code licence and judging-period availability need their own checks. No deployment, live API task, video publication or submission is authorized by this document.

## Dependency advisory evidence — 22 October 2026

The installed runtime-only npm audit reported zero advisories. Development tooling still inherits the braces 3.0.3 stack-exhaustion advisory through glob/Tailwind tooling; no patched braces 3.x version was available from the registry during this check. These parsers are not public application endpoints. A pinned selector-parser 7.1.7 override addresses its separate parsing advisory; the production build and CSS/browser checks must pass after the override. Do not downgrade Next.js based on npm's suggested aggregate fix. Recheck advisories before deployment.
