# Male/female AI-source catalogue pilot — 26 October 2026

**Outcome:** both declared catalogue cases rendered live through the local app and their original JPEG outputs were saved. Exactly two app generation requests; four provider units deducted. Quality scores remain pending; no owned-garment, deployed-release or physical-phone signoff.

## Authorized scope

The user selected the male and female full-body AI images from Downloads, explicitly requested their use for two live attempts, and chose existing catalogue outfits. This replaces the one-source comparison design for this batch. Exactly **two Cloth V4 attempts total**, one per source; no skin tasks, automatic retries, substitute attempts, additional recording generations or deployment. Stop on any 429. Announced ceiling: **4 provider units total**, subject to the current two-unit tariff and verified available allowance/reserve before execution.

The original owned-garment pilot remains **on hold**. These catalogue outcomes cannot sign it off. The two sources differ, so this is not a same-person two-outfit comparison or a test of independent usability. User-created AI-source clearance is already recorded; no new real-participant consent or generator attribution is invented. Public posting remains separate.

| Case | Source | Catalogue outfit / exact server reference | Category | State |
|---|---|---|---|---|
| CAT-AI-M-01 | demo-male-v1 | Emerald Silk Kurta / `concept-emerald-kurta`, `editorial/emerald-kurta.jpg` | existing `auto` mapping | Live rendered and saved |
| CAT-AI-F-01 | demo-female-v1 | Midnight & Gold Lehenga / `concept-midnight-lehenga`, `editorial/midnight-lehenga.jpg` | existing `auto` mapping | Live rendered and saved |

Emerald has a historical one-person catalogue review. Midnight is an explicitly unreviewed candidate; no promotion occurs merely by selecting it. Both references are existing original AI concepts and their file hashes match the catalogue provenance. Both source images and exact references were visually inspected once for this task; both sources show head to feet.

## Source and local preparation receipts

Original image files stay in Downloads; no source or result is placed under public assets or Git. Prepared images/metadata are retained privately in the current task visualization folder under `catalogue-live-pilot/`.

| Alias | Original dimensions / bytes / SHA-256 | Prepared JPEG dimensions / bytes / SHA-256 | Encoded catalogue request bytes |
|---|---|---|---|
| demo-male-v1 | 1024×2398 / 1,875,089 / `b2c448fd17fbc413cf05407d8a6f322c926c94da12d92e4044e5186ac27b324a` | 875×2048 / 113,829 / `9fe8d1810fb325587602bba6553671cdd9b19dd806c5600a914577a31c8093d8` | Under 4 MB; actual app payload validated |
| demo-female-v1 | 635×1024 / 660,576 / `4901da449c2cddac14a7a2188280d9ddc250337b51f1416eabeb23b68f93a13b` | 635×1024 / 46,145 / `c5e547a31dd6ed9eb2aead777120779115dc9b5daf490b201ac983855e3a14c0` | Under 4 MB; actual app payload validated |

Initial offline preparation used the existing image helper with a 1600px limit. The app's actual person-upload limit is 2048px; the first local send guard detected the male fingerprint mismatch and blocked dispatch before any app/provider request or reservation. That zero-send receipt/lock was preserved. The fingerprint was corrected to 2048px, and an offline interception verified both exact UI-posted source/outfit/access payloads while forwarding zero requests and deducting zero units. The subsequent live run used the corrected guard. This was a local preflight correction, not a repeated provider attempt.

Both original inputs remain unchanged. The female source is below 2048px and was not upscaled. Exact reference SHA-256: Emerald `a3464154fbe72bb25caf351d22c402ba252e5058cc9576e7733dc603a0641d64`; Midnight `4715d4eab961d87eb0bcac8e139d9b331d1ede42f517303b9aaf316f54d26dc0`.


## Earlier runtime/budget blocker — resolved

- Local `http://127.0.0.1:3500/api/mode` returned `unconfigured`; the guarded live app cannot generate in this state. Port3540 had no running service.
- The execution shell reports the provider key, live access code and both Redis credential families absent; values were not read or printed. This does not identify which field is missing inside a separately launched app process.
- Brave CDP connection was refused. The existing signed-in YouCam tab was identified, but CUA tab/native access timed out; no balance, credential or ledger state was obtained through it.
- Current official V4 endpoint and source/reference file-ID/category contract were rechecked against [Cloth V4 reference](https://docs.perfectcorp.com/reference/ai_clothes/v4.0/paths/~1s2s~1v2.0~1task~1cloth-v4/post). [Official current pricing](https://www.perfectcorp.com/business/blog/ai-clothes/ai-clothes-try-on-api-v4-outerwear) states two units/image. Current account balance, refill status and shared ledger remain unverified; historical snapshots are not substituted.
- Read-only Vercel metadata confirms the existing Preview provider key/base are scoped to `feat/menswear-catalog-vto-mapping`, with KV credentials in Preview/Production. The direct CLI environment-run test, performed from a temporary folder to avoid opening local environment files, reports **three Secret values cannot be pulled**. Presence-only child output confirms provider key, KV URL and KV token unavailable. No secret values were printed.
- Initial nested `npx` environment-run calls were misrouted to CLI argument parsing and exited before the intended child scripts ran. A direct absolute CLI/Node invocation removed that wrapper problem; it then exposed the actual non-exportable-secret blocker. Those failed preflight commands did not submit provider requests or deploy.
- **Preflight blocked; task count remains zero.** Supply the existing provider key and existing KV URL/token to the intended local runtime through a secure local environment/secret manager, together with a local live access code. Do not paste secrets into chat or bypass the shared ledger. No remote environment mutation, deployment, budget initialization/reset/increase, photo upload or provider task has occurred.

## Successful live preflight and execution

The user configured credentials locally. Presence/format checks confirmed the provider key and valid Redis configuration without printing values. The app accepts the configured explicit Upstash pair as well as KV aliases. Default `MOCK_MODE=true` stayed unchanged; the driver supplied `MOCK_MODE=false` and a random, process-only access code to an isolated loopback server on port3566. `/api/mode` returned live/access-required. No deployment or persistent credential change occurred.

Fresh read-only provider balance: **910 units**. Shared ledger: **10 allowed / 0 reserved / 10 remaining**, non-expiring, VTO2 and skin20. Two attempts fit the four-unit ceiling while retaining a calculated **228-unit minimum reserve**. The account's refill setting was not inspected or changed.

The same normal UI path was exercised for each case: catalogue deep link → private access code → explicit consent → actual source-file preparation → exactly one Generate click → actual live image decoded in the browser → original result downloaded and hashed. The driver enforced one matching request per case and two total; code review approved its corrected one-shot guards. No skin request, automatic generation retry or extra recording generation occurred.

## Attempts and results

| Case | App generation requests / live results | Generate-to-visible-render | Output | Ledger reserved after case | User likeness / garment fidelity |
|---|---|---|---|---|---|
| CAT-AI-M-01 | 1 / 1; HTTP200 | 15.712 seconds | Live rendered/saved, 875×2048 JPEG, 254,407 bytes | 2 units | Pending / pending |
| CAT-AI-F-01 | 1 / 1; HTTP200 | 15.959 seconds | Live rendered/saved, 635×1024 JPEG, 320,569 bytes | 4 units total | Pending / pending |

Final provider balance: **906 units**, an exact **four-unit deduction**. Final ledger: **10 allowed / 4 reserved / 6 remaining**. Reservation deltas were checked after each result. Both saved output hashes/byte counts were independently rechecked against the sanitized receipt:

- Male: `CAT-AI-M-01-result.jpg`, SHA-256 `2882a4c6c3031f06845cf5e107ebe16dad979bc0028a817764e85c784edcc128`.
- Female: `CAT-AI-F-01-result.jpg`, SHA-256 `3cfe05b619df00e59fe6b6fc51f3d89fbed7e153c542405a5d1eeab97f30dc39`.

Private run folder: `catalogue-live-pilot/live-2026-10-26T03-03-48-412Z/` in this chat's local visualization artifacts. It holds the sanitized receipt, two original outputs, two UI captures and two raw desktop browser videos. Private recovery URL files are access-bearing, mode0600, and must never be printed, committed, included in evidence uploads or published. Image files and hashes were verified; both outputs were visually inspected once. Raw videos exist but have not been reviewed or edited into final submission footage.

The one-shot driver exited0. The temporary live server was confirmed stopped, normal mock mode remained true, and its temporary access code was not persisted. No app source, stored environment values, ledger limit or deployment changed. No public media, source push or submission occurred.

## Limits and next gate

This is technical evidence for two existing catalogue concepts on two user-created AI sources, from local desktop Chromium. It is not owned-garment proof, a same-person comparison, independent usability, physical-phone saving, deployed budget enforcement or judge access. User likeness/garment scores remain pending; no catalogue review status is automatically promoted. The owned-garment pilot remains on hold. No further provider tasks are authorized by this completed batch.
