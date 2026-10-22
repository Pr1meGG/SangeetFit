# Vercel-managed Redis configuration compatibility

## Goal and observed cause

On 22 October, read-only Vercel inspection found `sangeetfit-live-budget` available on the Free plan, connected to `sangeet-fit` in Preview and Production. Its sensitive variables are named `KV_REST_API_URL` and `KV_REST_API_TOKEN`. The server currently recognizes only `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, so the installed integration cannot configure the existing guard without a compatibility fix.

Reuse the current REST transport, validation, atomic ledger and operator script. No dependency, new endpoint, database creation, credential copy or remote environment mutation is needed. `/api/mode`, both photo routes and `scripts/live-budget.mjs` already share this configuration through `live-budget.ts`.

## Implementation and ownership

1. Builder owns `src/lib/live-budget.ts` and `tests/live-budget.test.ts`. First add an offline regression proving a complete Vercel KV pair configures the guard, and run it against the original source to observe failure. Then choose one complete variable family: if either explicit Upstash field is nonempty, use only that family and reject incomplete/invalid values; otherwise use the KV pair. Never combine families or substitute the read-only token.
2. Preserve all URL/token validation and reservation-before-upload behavior. Cover KV-only operation, both-family precedence, incomplete/malformed pairs, invalid KV URLs, and the missing-budget fail-closed case. Tests use synthetic credentials and stubbed transport only; clear inherited KV values before missing-configuration assertions.
3. Primary owns `.env.example`, release/checkpoint/state/backlog documentation. Document the supported environment names and the verified Free resource/connection scope. Replace the old no-store blocker with the narrower pending ledger/deployment checks. Preserve historical observations as historical. Do not claim a Redis data-plane connection, initialized allowance or active production cap from resource metadata.

## Acceptance and verification

- KV-only configuration supports the existing guarded transport; explicit Upstash configuration retains precedence and rejects partial overrides without mixing credentials.
- No provider call, cloud ledger write, deployment, secret output or `.env.local` read occurs.
- Run `node --import tsx tests/live-budget.test.ts`, then `npm run verify` and `git diff --check`. Local real-Redis tests may explicitly skip if no disposable Redis exists; CI requires real Redis.
- Obtain independent code and TypeScript review, then make one scoped commit, push the working branch and verify its remote SHA under the standing Git authorization.

## Remaining release gates

The user connected the resource to Preview and Production; this work changes neither connection. Existing deployments do not gain this source fix automatically. Budget contents and actual credentials are not inspected here. Refresh YouCam balance/prices and agree the initial allowance before ledger initialization. Any new deployment, live activation or YouCam task retains its specific approval boundary. The earlier browser-origin denial is not retried; verification uses read-only metadata for the resource the user created manually.

## Execution evidence

The KV-only regression failed against the original source, then passed after the three-line configuration change. The targeted suite also passed with synthetic inherited KV variables. Full `npm run verify` exited 0: 13 offline suites passed and local real Redis explicitly skipped; all eight mock-browser suites, route types/TypeScript, lint (zero errors/19 warnings) and build passed. Independent code and TypeScript reviews found no blockers. User-run CLI returned PONG and EXISTS 0 for the ledger key; no agent ledger write, new deployment or YouCam task occurred.
