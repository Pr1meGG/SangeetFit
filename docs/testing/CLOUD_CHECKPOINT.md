# Cloud and device checkpoint — 22 October 2026

This record supersedes earlier pending CI/deployment statements in release-hardening notes. The user subsequently created and connected the Free Redis resource; resource metadata was independently checked below. This does not establish an initialized ledger or an active deployed cap.

## Verified source and CI

Source `81dd342f954f87e705397dae3b660accdb0648ba` was pushed to `codex/ui-revamp`; local and remote SHA matched. [GitHub run39706955618](https://github.com/Pr1meGG/SangeetFit/actions/runs/39706955618) passed: clean install, all 14 offline suites, eight mock browser suites, TypeScript, production build and lint with zero errors/19 warnings.

Actual Redis 7.4 tested the production Lua: 20 concurrent requests admitted exactly five within ten units. Mixed prices/reloaded workers shared one counter; missing/corrupt/wrong-type/expiring state failed closed; uncertain reservations were retained without retry. Local Redis was absent, so concurrency evidence comes from CI. Independent code/security and TypeScript reviews found no blockers.

## Approved mock Preview

The user approved one persistent Free store and a **mock Preview**, excluding paid plans, live activation and YouCam tasks. A clean Git archive of `81dd342` was deployed to [sangeet-f9wblyyha-ryuk-codes.vercel.app](https://sangeet-f9wblyyha-ryuk-codes.vercel.app), deployment `dpl_Hk9WVQFhRBPbTHsKMzMJh2KYJQnL`. Build/runtime mock mode is on; provider key, invite code and budget credentials were overridden empty. Authenticated `/api/mode` returned `{"mode":"mock"}`; `/library` returned 200 with current concepts. Anonymous access redirects to Vercel SSO. This requires Vercel login and is not a public judge release.

Production alias and old b3cadb6 deployment were unchanged. No security setting was weakened. No private image/result or unrelated settings/branding were included in the clean source archive.

## Earlier store setup block

Vercel-managed Upstash was selected to avoid a separate account. Requested settings: Free, Mumbai region, auto-upgrade false, eviction false, prod pack false, no project connection and no environment pull. Vercel returned `integration_terms_acceptance_required` after the user reported acceptance; integration inventory remained empty. Browser security then denied opening vercel.com because origin permission was declined. Stop creation attempts until resolved; do not work around that denial through another surface or API.

At that earlier checkpoint no store existed or budget was seeded. This historical creation block is superseded by the user's manual setup below. The denied browser origin has not been retried or bypassed.

## Free store connected — later 22 October check

After the user reported creating and connecting the resource, authenticated read-only CLI inspection found `sangeetfit-live-budget` available, on billing plan `free` / **Free**, and connected to `sangeet-fit` in **Preview and Production**. These scopes were selected by the user; this check changed neither. Sanitized evidence: [REDIS_CONNECTION_CHECK.json](REDIS_CONNECTION_CHECK.json).

Environment metadata shows sensitive `KV_REST_API_URL` and `KV_REST_API_TOKEN` variables in both scopes. No explicit `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` pair was listed. The guard previously understood only those explicit names, so the source compatibility fix accepts the Vercel pair when neither explicit Upstash field is nonempty. Explicit configuration keeps precedence and partial/invalid overrides fail closed; credentials are never combined across families. The operator tool uses the same guard configuration.

No credential values or `.env.local` contents were read, and no resource/connection/environment mutation, ledger write, deployment or YouCam task occurred in this follow-up. The user subsequently reported `PING` → `PONG` and, after running it separately, `EXISTS sangeetfit:live-budget:v1` → `0`. These are user-run observations confirming reachability and an absent ledger key; no agent authenticated Redis request occurred. Automatic-upgrade/eviction settings and current provider balance/prices remain unverified. Existing deployments have not received this source fix. Refresh balance/prices and agree the allowance before initialization; new deployment, live activation and tasks retain their separate gates. The protected mock Preview still does not establish judge access.

## Actual Android evidence

Model I2126, Android 14, Chrome 155.0.8059.84, portrait 392×761. Authorized USB forwarding served local mock. No overflow/page errors; synthetic-file preparation made zero requests; one explicit mock preview, choose and original worked without extra requests. Mock JPEG fetched successfully. A real 1280×1280 camera stream opened; Cancel ended every track. No camera image captured/sent and zero YouCam units used.

The later connected-phone run passed actual native picker delivery, EXIF-6 preparation, an actual mock JPEG download with a matching hash, a 50→92 touch slider using a visibly labelled synthetic response, choice/original without extra requests, session clearing and reload. Zero YouCam tasks ran. Distinct-source switching was not established. Landscape was explicitly skipped; camera reopen/deny, zoom, live signed-result saving, Preview-on-phone and iPhone remain unverified. See [device record](ANDROID_CHECK.md) and its sanitized metadata. Hardware observations used USB-local mock, not cloud Preview.

The KV-name compatibility update passed `npm run verify` with exit 0: 13 offline suites passed, the real-Redis suite explicitly skipped locally (14 enumerated), eight mock-browser suites passed, route types/TypeScript and mock production build passed, and lint reported zero errors/19 pre-existing warnings. Code and TypeScript review found no blockers. These are local software checks; the user-run Redis observations above and earlier real-Redis CI are separate evidence.
