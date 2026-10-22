# Cloud and device checkpoint — 22 October 2026

This record supersedes earlier pending CI/deployment statements in release-hardening notes. The Free Redis resource is connected, the authorized 10-unit ledger is initialized, and the latest approved mock Preview verified read-only build-to-Redis REST access. Runtime reservations, an active live cap and judge access remain unverified. See the latest [mock Preview evidence](MOCK_PREVIEW_CHECK.json).

**Later Brave finding:** authenticated catalogue filters passed, but a class-dependent rule in the user's Brave profile hides the current Preview's photo-permission panel and blocks normal upload. A small hook rename passed the rebuilt local Brave flow and full mock verification; it is not deployed. See [BRAVE_CHECK.md](BRAVE_CHECK.md). Earlier HTTP/asset checks below do not establish a usable fitting room in this profile.

## Verified source and CI

Historical source `81dd342f954f87e705397dae3b660accdb0648ba` was pushed to `codex/ui-revamp`; local and remote SHA matched. [GitHub run39706955618](https://github.com/Pr1meGG/SangeetFit/actions/runs/39706955618) passed: clean install, all 14 offline suites, eight mock browser suites, TypeScript, production build and lint with zero errors/19 warnings.

Actual Redis 7.4 tested the production Lua: 20 concurrent requests admitted exactly five within ten units. Mixed prices/reloaded workers shared one counter; missing/corrupt/wrong-type/expiring state failed closed; uncertain reservations were retained without retry. Local Redis was absent, so concurrency evidence comes from CI. Independent code/security and TypeScript reviews found no blockers.

The latest deployment archive is `7858b2fd6d33491788ad76de69ffbb1d2b1a7b18`, with application source `682f98589ad6d656d5b48e5ca129bdf375d6ec25`. [GitHub run39738104073](https://github.com/Pr1meGG/SangeetFit/actions/runs/39738104073) completed successfully for `7858b2f`. This status check does not add new retrieved Redis test-log evidence; the detailed concurrency proof above remains historical `81dd342` evidence.

## Earlier approved mock Preview

The user approved one persistent Free store and a **mock Preview**, excluding paid plans, live activation and YouCam tasks. A clean Git archive of `81dd342` was deployed to [sangeet-f9wblyyha-ryuk-codes.vercel.app](https://sangeet-f9wblyyha-ryuk-codes.vercel.app), deployment `dpl_Hk9WVQFhRBPbTHsKMzMJh2KYJQnL`. Build/runtime mock mode is on; provider key, invite code and budget credentials were overridden empty. Authenticated `/api/mode` returned `{"mode":"mock"}`; `/library` returned 200 with current concepts. Anonymous access redirects to Vercel SSO. This requires Vercel login and is not a public judge release.

Production alias and old b3cadb6 deployment were unchanged. No security setting was weakened. No private image/result or unrelated settings/branding were included in the clean source archive.

## Earlier store setup block

Vercel-managed Upstash was selected to avoid a separate account. Requested settings: Free, Mumbai region, auto-upgrade false, eviction false, prod pack false, no project connection and no environment pull. Vercel returned `integration_terms_acceptance_required` after the user reported acceptance; integration inventory remained empty. Browser security then denied opening vercel.com because origin permission was declined. Stop creation attempts until resolved; do not work around that denial through another surface or API.

At that earlier checkpoint no store existed or budget was seeded. This historical creation block was superseded by the user's manual setup. The user later explicitly allowed the open Vercel tab for the 10-unit initialization below; no browser denial was bypassed.

## Free store connected — later 22 October check

After the user reported creating and connecting the resource, authenticated read-only CLI inspection found `sangeetfit-live-budget` available, on billing plan `free` / **Free**, and connected to `sangeet-fit` in **Preview and Production**. These scopes were selected by the user; this check changed neither. Sanitized evidence: [REDIS_CONNECTION_CHECK.json](REDIS_CONNECTION_CHECK.json).

Environment metadata shows sensitive `KV_REST_API_URL` and `KV_REST_API_TOKEN` variables in both scopes. No explicit `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` pair was listed. The guard previously understood only those explicit names, so the source compatibility fix accepts the Vercel pair when neither explicit Upstash field is nonempty. Explicit configuration keeps precedence and partial/invalid overrides fail closed; credentials are never combined across families. The operator tool uses the same guard configuration.

During that connection-only check, no credential values or `.env.local` contents were read, and no resource/connection/environment mutation, ledger write, deployment or YouCam task occurred. The user subsequently reported `PING` → `PONG` and, after running it separately, `EXISTS sangeetfit:live-budget:v1` → `0`. These were user-run observations confirming reachability and an absent ledger key; no agent authenticated Redis request had occurred at that stage. Balance/prices, initialization and the latest mock deployment were verified later as recorded below. Automatic-upgrade/eviction settings remain unverified. Live activation and tasks retain their separate gates; the protected mock Preview does not establish judge access.

## Actual Android evidence

Model I2126, Android 14, Chrome 155.0.8059.84, portrait 392×761. Authorized USB forwarding served local mock. No overflow/page errors; synthetic-file preparation made zero requests; one explicit mock preview, choose and original worked without extra requests. Mock JPEG fetched successfully. A real 1280×1280 camera stream opened; Cancel ended every track. No camera image captured/sent and zero YouCam units used.

The later connected-phone run passed actual native picker delivery, EXIF-6 preparation, an actual mock JPEG download with a matching hash, a 50→92 touch slider using a visibly labelled synthetic response, choice/original without extra requests, session clearing and reload. Zero YouCam tasks ran. Distinct-source switching was not established. Landscape was explicitly skipped; camera reopen/deny, zoom, live signed-result saving, Preview-on-phone and iPhone remain unverified. See [device record](ANDROID_CHECK.md) and its sanitized metadata. Hardware observations used USB-local mock, not cloud Preview.

The KV-name compatibility update passed `npm run verify` with exit 0: 13 offline suites passed, the real-Redis suite explicitly skipped locally (14 enumerated), eight mock-browser suites passed, route types/TypeScript and mock production build passed, and lint reported zero errors/19 pre-existing warnings. Code and TypeScript review found no blockers. These are local software checks; the user-run Redis observations above and earlier real-Redis CI are separate evidence.

## Authorized starter allowance initialized — 22 October

The reloaded signed-in YouCam dashboard showed 910 credits (Bonus910, PAYG0, auto-refill Off). The official [unit calculator](https://yce.perfectcorp.com/ai-api/unit-calculator) showed Clothes V4 at 2 units/call and Facial Color Tones Analyzer at 20, with no cost-changing parameters. The user authorized a 10-unit starter cap and explicitly restored access to the open Vercel Redis CLI tab.

The existing production `INITIALIZE_BUDGET_SCRIPT` was executed once through EVAL and returned 1. It is atomic and create-only: an existing key cannot be overwritten. HMGET readback for `limit used vto skin` was `1000 0 200 2000` in integer hundredths. TTL returned -1. Thus the ledger contains 10 units allowed, 0 reserved and 10 remaining; at most five VTO reservations fit. Optional 20-unit skin requests cannot fit this starter allowance. There are 900 credits outside it, exceeding the 228-credit minimum reserve. The provider dashboard was reloaded afterward and still showed 910.

Read-only mode in the Redis CLI was restored and checked. No secrets, image bytes or `.env.local` values were read; no photo processing, provider task, purchase, new deployment or live activation occurred. Only the four aggregate ledger fields were created. [Sanitized readback evidence](BUDGET_INITIALIZATION_CHECK.json) records the values and remaining limits.

Application source `682f985` now has a completed successful [CI run39736055092](https://github.com/Pr1meGG/SangeetFit/actions/runs/39736055092). That follow-up read did not separately retrieve its Redis test log lines; the earlier `81dd342` concurrency evidence remains separate. Source code was unchanged during initialization, so the full suite was not rerun for the documentation update.

Initialization alone does not activate protection on old deployments. The later approved mock Preview below verified read-only build-to-Redis REST access, while runtime reservation/enforcement remains unexercised. Resource eviction/automatic-upgrade settings and judge access remain unverified. No budget reservation was submitted as a connectivity test.

## Latest approved mock Preview — after initialization

A clean archive of `7858b2fd6d33491788ad76de69ffbb1d2b1a7b18` was deployed to [sangeet-4dzgkdoe9-ryuk-codes.vercel.app](https://sangeet-4dzgkdoe9-ryuk-codes.vercel.app), deployment `dpl_7cRPXW8yEVWo36XPkY2zHek8Bmpm`. The archive contains KV-compatible application source `682f98589ad6d656d5b48e5ca129bdf375d6ec25`; Vercel metadata matches both source identifiers exactly. The build exited 0 and the deployment reached READY.

The approved build command, `npm run build && node --import tsx scripts/live-budget.mjs status`, used the inherited KV pair and printed `allowanceUnits: 10`, `reservedUnits: 0`, `remainingUnits: 10`, `vtoUnits: 2`, `skinUnits: 20`. This proves read-only deployed-build-to-Redis REST access through the shared application transport (`HMGET` and `TTL`). It does not exercise runtime reservation/enforcement or establish live image quality. Build and runtime use `MOCK_MODE=true`; the provider key and live access code are blank. No ledger mutation/reservation, photo request or provider task occurred.

Authenticated checks returned `/api/mode` 200 with `{"mode":"mock"}`, `/` 200 and `/library` 200; both HTML pages used the title “SangeetFit — Indian Wedding Outfit Styling”. Anonymous `/library` returned 302 to `vercel.com/sso-api`. The Preview remains Vercel SSO-protected and does not provide public judge access. Post-deployment inspection still identifies `dpl_4inrWPNEV24ExC7CR8TPcMwQP6dc` as READY production; production was not redeployed. See [MOCK_PREVIEW_CHECK.json](MOCK_PREVIEW_CHECK.json) for sanitized deployment, endpoint and read-only transport evidence. Live activation, any provider task and further deployment retain their separate approval gates.

Representative authenticated asset checks also returned 200: CSS 43,139 bytes, JavaScript 203,721 bytes and `/garment_test/editorial/midnight-lehenga.jpg` 590,515 bytes. These are delivery checks, not a new browser/device acceptance pass.
