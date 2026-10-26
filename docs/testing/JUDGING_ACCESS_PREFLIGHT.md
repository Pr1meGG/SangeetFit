# Judge access and release preflight

Reconciled 26 October 2026 for the [accepted final-week plan](../plans/2026-10-24-final-week-release.md). **Live release preflight not executed.** Local evidence and the read-only Git integration inspection are tracked separately in [current readiness](READINESS_AUDIT_2026_10_26.md). This template does not authorize deployment, live activation or a provider-task batch. Existing [cloud](CLOUD_CHECKPOINT.md), [mock Preview](MOCK_PREVIEW_CHECK.json), [budget](BUDGET_INITIALIZATION_CHECK.json) and [Android](ANDROID_CHECK.md) records remain historical evidence, not passes for the next build.

The [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules), rechecked 24 October, give a **2 November 2026, 22:15 IST / 11:45 EST** deadline and **3–20 November** judging. Target submission **30 October**, with **31 October–1 November** as recovery buffer; keep the application, permitted assets, access instructions and approved allowance usable through **20 November**. Recheck the final submission form before publication, including repository sharing and video requirements.

## Current hold and source decision

The user clears their AI-created demo-person image for use; retain that clearance and identify the exact source/version. Garment selection and the two-case live pilot are on hold at their request. Continue local preparation; this preflight does not resume garments or authorize deployment/spending.

## Declare the release and separate approvals

| Required declaration | Value / sanitized evidence reference |
|---|---|
| Full source SHA and exact build/deployment URL | Pending |
| Date, environment, actual `/api/mode` | Pending |
| Deployment approval, including environment changes | Pending |
| Live-activation approval | Pending |
| Exactly two fresh preview attempts: user-owned upper-body garment and complete outfit, same user-cleared AI demo-person source, processing/publication receipts | Pending — reuse these outputs for validation and public recording; no additional recording tasks |
| Live task approval: count, maximum units and stop conditions | Pending |
| Judging allowance approval: cap, reserve, intended use/window | Pending — propose 20 VTO attempts, calculate unit cap from newly verified prices; separate from the two pilot attempts and historical starter allowance |
| Host access/exposure | Pending — app has no invite-code gate; anyone reaching live routes can use the finite shared allowance |
| Host/resource owner, availability through 20 November, rollback target | Pending |

Verify secret configuration by presence/scope only; never read `.env.local`, print tokens/codes or include them in screenshots. The user removed the app access-code gate on 26 October. The [release procedure](RELEASE.md) specifies server-only provider/shared-budget configuration. Host access and spend allowance remain separate release controls.

## Gate 1 — exact build and runtime

- [ ] Final source passes `npm run verify` and `git diff --check`; record commands, exit codes, source SHA, skipped checks and relevant review findings. Recheck after changes. These checks are mock/local unless explicitly recorded otherwise.
- [ ] Before pushing, confirm the active release branch has an effective `git.deploymentEnabled: false` rule. Preview branch tracking is enabled for all unassigned branches in the 24 October read-only inspection; source control sync must not cause an unapproved deployment. Keep this separate from manual deployment approval.
- [ ] Require successful real-Redis CI on the release SHA. A local skip and an older commit's CI pass do not meet this gate.
- [ ] Deployment is authorized and its source matches the reviewed SHA. Confirm actual mode on that URL. An old production page or protected mock Preview does not validate this release.
- [ ] Confirm deployed Vercel **Fluid Compute** and actual function duration settings. Current photo routes declare `maxDuration = 300` with an internal 180-second request deadline; verify the deployed configuration supports it rather than assuming source declarations override platform limits.
- [ ] Record recovery behavior for timeout, expired image link and exhausted allowance. A timeout may leave an accepted task running: no automatic resubmission, refund or hidden mock replacement.

## Gate 2 — clean browser and budget enforcement

- [ ] Open the judging URL in a fresh browser profile without developer/Vercel login. Confirm home, collection and assets load. If host protection prevents access, resolve through separately approved configuration before claiming judge access.
- [ ] Verify a valid prepared photo enables Generate without an invite code; photo selection alone submits no task. Approve the hosted exposure and finite judging allowance explicitly, since anyone reaching live routes can use that allowance.
- [ ] With specific inspection authorization, read current provider balance/prices and shared ledger status without exposing credentials. Record timestamp, allowance/reserved/remaining units and reserve. Do not assume the 22 October balance or remaining units are unchanged.
- [ ] Obtain a **separately approved judging allowance**. The historical 10-unit/five-preview starter cap is not a judging plan; the two fresh release previews also consume their declared budget. Record expected judging demand, the approved bounded contingency and an operator response if depleted. Keep optional skin analysis outside the budget unless specifically included.
- [ ] Verify missing, corrupt, expiring, unavailable and insufficient budget state fails closed before external photo work using isolated tests/instrumented provider stubs. Check concurrent reservations cannot exceed the cap. Do not exhaust or reset the real ledger as a test.
- [ ] On the approved deployment, confirm runtime reservations against the connected ledger from the two permitted fresh attempts below. A build-time read or `mode:live` badge does not establish runtime enforcement. Uncertain/failed attempts retain reservations; reconcile before any separately approved increase.
- [ ] Check resource expiry/eviction, auto-upgrade settings, environment scope and other deployments sharing the provider key. Record any path that can bypass the guard. No paid upgrade or ledger reset is authorized by this checklist.

## Gate 3 — exactly two fresh approved previews

Declare the two user-owned garments, exact user-cleared AI demo-person source version and permitted use before Generate. These are the same `upper_body`/`full_body` cases in [OWN_GARMENT_PILOT](OWN_GARMENT_PILOT.md), not an additional smoke batch. Verify rights to process the person/garment images and publish derived outputs/footage. User evaluator scores source likeness and garment fidelity ≥4/5 for both visibly rendered results; these are not participant ratings. Use the same source for comparison. No optional skin task or automatic retry.

| Attempt | Build / mode | Input/source receipt | Generate-to-visible-render seconds / displayed time | Outcome | Ledger reservation change | Phone save/open |
|---|---|---|---|---|---|---|
| 1 | Not run | Pending | — | Not run | — | Not run |
| 2 | Not run | Pending | — | Not run | — | Not run |

- [ ] Each explicit Generate makes one app request; record known task count or `unknown` after an uncertain submission. Log failures and image-load failures as outcomes. **Stop on 429; never retry automatically.** Additional tasks require separate approval.
- [ ] Capture raw footage of upload, explicit generation, comparison, assignment and actual PDF saving during this same session. Save permitted outputs immediately; a lost page session or expired link does not authorize regenerating for recording.
- [ ] Compare, inspect and select **Plan for {occasion}**. Confirm the board and **Planned for {occasion}** agree; planning, comparison and opening existing results create no extra generation requests.
- [ ] On the actual target phone/browser, save or open a genuine permitted live result and verify that the file/image is usable. Record exact device/browser and outcome; mock JPEG downloads do not prove live signed-result saving. Check denied/expired links without starting another task.
- [ ] Export a populated and a partially empty five-event plan. Inspect an actual PDF: event/garment names, owned/reference labels and empty slots only; no photos, results, invite code or provider links. Check mobile controls and keyboard access. Record untested devices explicitly.
- [ ] Restrict device claims to the user's actual tested phone/browser. Desktop emulation is separate evidence; unavailable iPhone/other hardware is not silently marked passed.

## Gate 4 — access through judging and accurate package

- [ ] Record host/resource availability through **20 November**. The user is operator; manually check home/collection/access daily and, after specific inspection authorization, allowance status before judging and after usage. Record timestamp, outcome and unresolved failures without credentials. Escalate depleted allowance, broken access or expiring resources; do not auto-refill/reset, change settings, send external notifications or create automation.
- [ ] Judge instructions identify the URL, private credential route, photo requirements, mode, shared limits and recovery contact route. Do not send credentials or contact judges from this checklist without specific authorization.
- [ ] Keep the repository private and verify the organizer's specified private-sharing route before separately authorized sharing. Review code/asset rights without inventing an MIT licence. Check the final 1–3 minute English video, five screenshots and text match the exact tested release; retain mock labels and private-image restrictions. No guest-study outcome is required or claimed this week. Publication and submission remain separately authorized actions.

Final outcome: **pending** · verified SHA: **pending** · passes/failures/skips: **pending** · remaining allowance as of timestamp: **not checked** · release owner decision: **pending**. Never mark the released flow verified solely from historical CI, a developer-authenticated browser or a task returning a URL.
