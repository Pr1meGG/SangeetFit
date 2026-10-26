# Local release package — 26 October 2026

**State:** prepared for review; no commit, push, deployment, budget increase, publication or submission performed. Owned-garment work remains on hold. The two authorized catalogue generations are complete; no additional task is included.

## Available artifacts

The current chat's local `release-package/` visualization folder contains:

- `revision-2/sangeetfit-demo-v2.mp4`: current 88-second, 1920×1080, 30fps review edit with moving UI, visible cursor/clicks, animated source/result wipes, local synthetic draft narration and an original locally synthesized music bed. English captions are embedded and supplied as a sidecar SRT. Actual live wait excerpts are shortened and labelled; saved outputs are identified as existing results, with no new task.
- `sangeetfit-demo-v2-review.zip`: four allowlisted entries: the v2 video, SRT, README and verification receipt. `revision-2/` also retains the edit plan and zero-generation rehearsal/capture receipts. The older silent two-minute `sangeetfit-demo-review-draft.mp4` and ten-entry package are preserved but superseded for media review after the user found that edit too static.
- `five-event-plan.pdf` and `partial-event-plan.pdf`: actual one-page exports with five event headings, reference labels, zero images/annotations and no private URL/access-code markers. The partial plan retains its undecided slot.
- Five review screenshots indexed by `screenshots-manifest.json`: home, completed reference plan, text-only print view, male live source/reference/output panel and female live source/reference/output panel. These are unpublished preparation assets; the panels are edited evidence, not an app comparison screen.
- `demo-manifest.json`: edit decisions, source files, duration and hash. `planner-recording.json`: actual local steps and zero generation requests. Raw pilot footage and private provider recovery links remain outside the repository and source checkpoint.
- `checkpoint-manifest.json`: explicitly selected source/docs/test/config files and hashes. Excludes environment files, private source/results/raw footage, branding explorations, temporary scripts and pre-existing `AGENTS.md` edits.

The current draft uses macOS Samantha synthetic narration and original locally synthesized music; no voice clone, stock track or paid generation service was used. Listening/creative approval, publication and a complete judging rehearsal remain pending. Catalogue quality ratings are still pending. The planner uses reference concepts and reports **zero owned outfits and zero planned rewears**; this does not demonstrate the held owned-garment pilot.

## Verified live evidence

See [the exact pilot record](../testing/CATALOGUE_AI_PILOT_2026_10_26.md): male Emerald 15.712s, female Midnight 15.959s, two distinct AI sources, two app requests, four units deducted, both original outputs saved and visibly rendered. Provider balance 906 and shared allowance 6 remaining were measured after that batch. These are dated observations; no further account inspection or spending occurred in this preparation pass.

## Source checkpoint proposal

Destination: private `Pr1meGG/SangeetFit`, branch `experiments`, using a normal push after the exact commit text is approved. No merge or history rewrite. The branch does not yet exist remotely; existing release branch remains `e2eb6cd` with successful [CI 40089231989](https://github.com/Pr1meGG/SangeetFit/actions/runs/40089231989). Its result does not certify this working candidate.

Exact proposed commit subject and body:

```text
chore: prepare SangeetFit release candidate

Polish responsive layouts and keyboard access, stabilize library geometry checks, and retain synthetic CI artifacts. Record the catalogue pilot, dated Android evidence and remaining release gates.

Validation: 15 offline suites and 10 mock browser suites passed; real Redis skipped locally. TypeScript and production build passed; lint reported 0 errors and 22 warnings.
```

An existing unsynced ancestor, `d0ab65f`, would also become reachable from this branch on a normal push. Its exact existing message is below. The Codebuff attribution is preserved history and has not been independently verified in this preparation pass; do not silently remove it, rewrite it, or publish it without showing the wording to the user.

```text
chore: organize repository layout and retire scratch material

Collect superseded brand generations, working screenshots and one-off scripts
into a gitignored local archive, and give docs, brand sources and skill packs a
single canonical home, so the repository reads as a finished project instead of
an accumulation of checkpoints. Also drops the mode route no-op and the
misleading polling comments without changing behaviour.

🤖 Generated with Codebuff
Co-Authored-By: Codebuff <noreply@codebuff.com>
```

Before committing, recompute the explicit file manifest, check the diff and inspect only selected files for secrets/private assets. Stage exact paths rather than `git add .`. After the approved push, verify the remote SHA and require that SHA's real-Redis CI. Existing local `.env.local` is ignored and stays excluded. The normal mock default remains enabled.

## Hosting findings and deployment proposal

Read-only project metadata retrieved 26 October for `ryuk-codes/sangeet-fit`:

- Next.js project; configured Node version **24.x**. Source `package.json` declares Node **>=22.13.0 <23**, and local verification used 22.23.3. Reconcile the intended release runtime to the tested Node 22 setting before deployment; do not assume the project setting alone determines the final build's runtime.
- Fluid Compute is **enabled**, default region `iad1`. Source routes declare 300s with a shared 180s internal deadline. Final deployment metadata/function duration still needs verification.
- Vercel SSO protects `all_except_custom_domains`; anonymous known Preview access redirects to Vercel. The app access-code gate was removed locally at the user’s request on 26 October; this does not remove the host-login requirement.
- Connected repository is `Pr1meGG/SangeetFit`; production branch remains `work/sangeetfit-mvp`. Local `vercel.json` explicitly disables Git deployments for `experiments`, `codex/final-week-release` and `codex/ui-revamp`. No remote setting was changed.

After source approval/CI, prepare a deployment request naming the exact SHA, target environment/domain, Node 22 alignment, server-only credentials, rollback source and judge access route. Judge access must work without the owner's Vercel session. Do not disable SSO or expose a Preview as an implicit troubleshooting step; present the exact domain/access change for approval first. Verify actual mode, assets, code-free explicit generation, runtime reservations and phone saving separately.

No provider task accompanies a deployment automatically. Existing live outputs may be reused for media review; generating again for a screenshot or recording is outside the completed two-attempt authorization.

## Judging capacity proposal — not executed

Six remaining units permit only three configured VTO reservations. The earlier plan proposes capacity for twenty judging attempts. At the last verified two-unit tariff, **forty units remaining** would require an aggregate ledger limit of **forty-four units**, retaining the four already reserved. This is a proposal for a separately approved increase, not a reset/refund or permission to run twenty tasks. Fresh authorized balance/tariff/ledger inspection and reserve/depletion planning must precede any change. No auto-refill, top-up, expiry or replacement database is proposed.

## Remaining gates

1. Review the 88-second v2 edit, narration/mix and five screenshots; obtain the user's separate likeness/garment ratings. Do not invent quality scores or promote catalogue status automatically.
2. Approve exact checkpoint prose/destination, publish the selected source and verify current-source real-Redis CI.
3. Approve the concrete deployment/runtime/access package and any judging allowance change; verify the resulting exact build in a clean browser and on the user's phone.
4. Review the final public [Devpost draft](DEVPOST_DRAFT.md), video destination and private source-sharing route, then publish/submit only after exact text/media approval. Target 30 October; official deadline 2 November 2026, 22:15 IST. Maintain approved access through 20 November.

## Verification and review limits

The preceding full mock verification passed on the application/config/test source; this media revision did not modify application code. The new planner rehearsal and recording each recorded zero generation requests. V2 decoded all 2640 frames at 30fps, exactly 88 seconds, 1920×1080, square pixels/yuv420p, with AAC stereo 48kHz audio and 11 English subtitle cues. Each scene's frame count matches the edit plan. Measured final audio peak is -3.8dBFS (mean -20.1dB); representative final frames were visually inspected. Listening/creative review remains pending. The new four-entry ZIP passed CRC and content-hash checks. Prior PDF read-back and application verification retain their original scope; no new independent review is claimed.

Fresh parallel code/remote/submission review attempts encountered usage/access failures and are not counted as successful reviews. The primary session completed bounded preparation directly and retained the prior successful review/verification evidence with its original scope. No new claim of independent review is made for this edit.
