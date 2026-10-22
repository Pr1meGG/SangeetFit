# Cloud and device checkpoint — 22 October 2026

This record supersedes earlier pending CI/deployment statements in release-hardening notes.

## Verified source and CI

Source `81dd342f954f87e705397dae3b660accdb0648ba` was pushed to `codex/ui-revamp`; local and remote SHA matched. [GitHub run39706955618](https://github.com/Pr1meGG/SangeetFit/actions/runs/39706955618) passed: clean install, all 14 offline suites, eight mock browser suites, TypeScript, production build and lint with zero errors/19 warnings.

Actual Redis 7.4 tested the production Lua: 20 concurrent requests admitted exactly five within ten units. Mixed prices/reloaded workers shared one counter; missing/corrupt/wrong-type/expiring state failed closed; uncertain reservations were retained without retry. Local Redis was absent, so concurrency evidence comes from CI. Independent code/security and TypeScript reviews found no blockers.

## Approved mock Preview

The user approved one persistent Free store and a **mock Preview**, excluding paid plans, live activation and YouCam tasks. A clean Git archive of `81dd342` was deployed to [sangeet-f9wblyyha-ryuk-codes.vercel.app](https://sangeet-f9wblyyha-ryuk-codes.vercel.app), deployment `dpl_Hk9WVQFhRBPbTHsKMzMJh2KYJQnL`. Build/runtime mock mode is on; provider key, invite code and budget credentials were overridden empty. Authenticated `/api/mode` returned `{"mode":"mock"}`; `/library` returned 200 with current concepts. Anonymous access redirects to Vercel SSO. This requires Vercel login and is not a public judge release.

Production alias and old b3cadb6 deployment were unchanged. No security setting was weakened. No private image/result or unrelated settings/branding were included in the clean source archive.

## Store setup blocked

Vercel-managed Upstash was selected to avoid a separate account. Requested settings: Free, Mumbai region, auto-upgrade false, eviction false, prod pack false, no project connection and no environment pull. Vercel returned `integration_terms_acceptance_required` after the user reported acceptance; integration inventory remained empty. Browser security then denied opening vercel.com because origin permission was declined. Stop creation attempts until resolved; do not work around that denial through another surface or API.

**No store exists and no budget was seeded.** The cap is tested code, not active live protection. Resolve browser/marketplace access, create the approved Free store, and refresh actual YouCam balance/prices before initialization. Live activation and additional tasks remain separately gated.

## Actual Android evidence

Model I2126, Android 14, Chrome 155.0.8059.84, portrait 392×761. Authorized USB forwarding served local mock. No overflow/page errors; synthetic-file preparation made zero requests; one explicit mock preview, choose and original worked without extra requests. Mock JPEG fetched successfully. A real 1280×1280 camera stream opened; Cancel ended every track. No camera image captured/sent and zero YouCam units used.

The later connected-phone run passed actual native picker delivery, EXIF-6 preparation, an actual mock JPEG download with a matching hash, a 50→92 touch slider using a visibly labelled synthetic response, choice/original without extra requests, session clearing and reload. Zero YouCam tasks ran. Distinct-source switching was not established. Landscape was explicitly skipped; camera reopen/deny, zoom, live signed-result saving, Preview-on-phone and iPhone remain unverified. See [device record](ANDROID_CHECK.md) and its sanitized metadata. Hardware observations used USB-local mock, not cloud Preview.
