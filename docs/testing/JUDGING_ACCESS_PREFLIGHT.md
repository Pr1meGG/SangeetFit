# Judge access and release preflight

Prepared 23 October 2026. **Not executed.** This is a record template for a separately approved release, live activation and bounded provider-task batch. It authorizes none of those actions. Existing [cloud](CLOUD_CHECKPOINT.md), [mock Preview](MOCK_PREVIEW_CHECK.json), [budget](BUDGET_INITIALIZATION_CHECK.json) and [Android](ANDROID_CHECK.md) records remain historical evidence, not passes for the next build.

The recorded [competition facts](../research/competition-facts.md) list a **2 November 2026, 11:45 AM Eastern** deadline and **3–20 November** judging. Target submission **1 November**; keep the application, permitted assets, access instructions and approved allowance usable through **20 November**. Recheck [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and the final submission form before publication, including repository sharing and video requirements.

## Declare the release and separate approvals

| Required declaration | Value / sanitized evidence reference |
|---|---|
| Full source SHA and exact build/deployment URL | Pending |
| Date, environment, actual `/api/mode` | Pending |
| Deployment approval, including environment changes | Pending |
| Live-activation approval | Pending |
| Exactly two fresh preview attempts: declared inputs/source, publication scope | Pending |
| Live task approval: count, maximum units and stop conditions | Pending |
| Judging allowance approval: cap, reserve, intended use/window | Pending — separate from starter allowance and release smoke batch |
| Private judge credential delivery method | Pending — no code/secret in this document or URL |
| Host/resource owner, availability through 20 November, rollback target | Pending |

Verify secret configuration by presence/scope only; never read `.env.local`, print tokens/codes or include them in screenshots. Keep the full access code private. The [release procedure](RELEASE.md) specifies server-only live access and shared-budget configuration; invitation access and spend allowance are separate controls.

## Gate 1 — exact build and runtime

- [ ] Final source passes `npm run verify` and `git diff --check`; record commands, exit codes, source SHA, skipped checks and relevant review findings. Recheck after changes. These checks are mock/local unless explicitly recorded otherwise.
- [ ] Deployment is authorized and its source matches the reviewed SHA. Confirm actual mode on that URL. An old production page or protected mock Preview does not validate this release.
- [ ] Confirm deployed Vercel **Fluid Compute** and actual function duration settings. Current photo routes declare `maxDuration = 300` with an internal 180-second request deadline; verify the deployed configuration supports it rather than assuming source declarations override platform limits.
- [ ] Record recovery behavior for timeout, expired image link and exhausted allowance. A timeout may leave an accepted task running: no automatic resubmission, refund or hidden mock replacement.

## Gate 2 — clean browser and budget enforcement

- [ ] Open the judging URL in a fresh browser profile without developer/Vercel login. Confirm home, collection and assets load. If host protection prevents access, resolve through separately approved configuration before claiming judge access.
- [ ] Verify missing and incorrect invite codes fail before photo transmission/provider work; with the privately supplied valid code, the intended flow becomes available. Record outcomes only, never the code. Do not expose the code in a URL, public README or video.
- [ ] With specific inspection authorization, read current provider balance/prices and shared ledger status without exposing credentials. Record timestamp, allowance/reserved/remaining units and reserve. Do not assume the 22 October balance or remaining units are unchanged.
- [ ] Obtain a **separately approved judging allowance**. The historical 10-unit/five-preview starter cap is not a judging plan; the two fresh release previews also consume their declared budget. Record expected judging demand, the approved bounded contingency and an operator response if depleted. Keep optional skin analysis outside the budget unless specifically included.
- [ ] Verify missing, corrupt, expiring, unavailable and insufficient budget state fails closed before external photo work using isolated tests/instrumented provider stubs. Check concurrent reservations cannot exceed the cap. Do not exhaust or reset the real ledger as a test.
- [ ] On the approved deployment, confirm runtime reservations against the connected ledger from the two permitted fresh attempts below. A build-time read or `mode:live` badge does not establish runtime enforcement. Uncertain/failed attempts retain reservations; reconcile before any separately approved increase.
- [ ] Check resource expiry/eviction, auto-upgrade settings, environment scope and other deployments sharing the provider key. Record any path that can bypass the guard. No paid upgrade or ledger reset is authorized by this checklist.

## Gate 3 — exactly two fresh approved previews

Declare the two garments, exact source version and permitted use before Generate. If this is also the owned-garment pilot, use the exact `upper_body`/`full_body` cases in [OWN_GARMENT_PILOT](OWN_GARMENT_PILOT.md); do not silently add tasks or reuse expired consent. Use the same source for a fair two-look comparison. No optional skin task.

| Attempt | Build / mode | Input/source receipt | Generate-to-visible-render seconds / displayed time | Outcome | Ledger reservation change | Phone save/open |
|---|---|---|---|---|---|---|
| 1 | Not run | Pending | — | Not run | — | Not run |
| 2 | Not run | Pending | — | Not run | — | Not run |

- [ ] Each explicit Generate makes one app request; record known task count or `unknown` after an uncertain submission. Log failures and image-load failures as outcomes. **Stop on 429; never retry automatically.** Additional tasks require separate approval.
- [ ] Compare, inspect and select **Plan for {occasion}**. Confirm the board and **Planned for {occasion}** agree; planning, comparison and opening existing results create no extra generation requests.
- [ ] On the actual target phone/browser, save or open a genuine permitted live result and verify that the file/image is usable. Record exact device/browser and outcome; mock JPEG downloads do not prove live signed-result saving. Check denied/expired links without starting another task.
- [ ] Export a populated and a partially empty five-event plan. Inspect an actual PDF: event/garment names, owned/reference labels and empty slots only; no photos, results, invite code or provider links. Check mobile controls and keyboard access. Record untested devices explicitly.

## Gate 4 — access through judging and accurate package

- [ ] Record host/resource availability through **20 November**, responsible operator and agreed balance/access review cadence. Any account inspection, allowance change or external notification follows its existing authorization boundary; this sheet creates no automation.
- [ ] Judge instructions identify the URL, private credential route, photo requirements, mode, shared limits and recovery contact route. Do not send credentials or contact judges from this checklist without specific authorization.
- [ ] Verify repository/source licensing and access as the rules require. Check the final 1–3 minute video, screenshots and text match the exact tested release; retain mock labels and any private-image restrictions. Publication and submission remain separately authorized actions.

Final outcome: **pending** · verified SHA: **pending** · passes/failures/skips: **pending** · remaining allowance as of timestamp: **not checked** · release owner decision: **pending**. Never mark the released flow verified solely from historical CI, a developer-authenticated browser or a task returning a URL.
