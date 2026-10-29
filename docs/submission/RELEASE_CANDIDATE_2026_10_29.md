# Release candidate — 29 October 2026

Local preparation record. This document does not authorize a push, deployment, provider task, allowance change or submission. It is not Devpost copy. Privacy/retention wording is outside this pass and is being handled separately.

## Candidate and evidence boundary

The candidate is the current `codex/redesign-v2` checkout based on `4c4ed65`, including reviewed staged changes and required modified/untracked application files. Committed HEAD alone is not the candidate. Preserve pre-existing work rather than resetting to the base.

The [29 October audit](../testing/SUBMISSION_AUDIT_2026_10_29.md) records the starting point: 14 offline suites passed, actual Redis skipped, build/typecheck passed, lint zero errors/25 warnings, nine browser suites passed and three failed. These are pre-repair results. They are not signoff for the parallel autosave/regression changes in the [stages 1–3 plan](../plans/2026-10-29-submission-stages-1-3.md).

Production `https://sangeet-fit.vercel.app` was anonymously reachable on 29 October and `/api/mode` returned live. That check did not prove provider generation, saved-photo authorization, remaining allowance or which source snapshot is deployed. The latest listed passing remote CI is [run 40089231989](https://github.com/Pr1meGG/SangeetFit/actions/runs/40089231989), October24 source `e2eb6cdf690f6870385b774fced3d47a37a1a11c`; it does not cover this candidate.

## Freeze and manifest procedure

Do these after integration has stopped changing the candidate:

1. Review tracked, staged and untracked changes separately. Read `git diff HEAD --` as well as `git ls-files --others --exclude-standard`; ordinary `git diff --stat` does not include untracked files or all staged deletions. Review explicit paths before staging; do not use a blanket `git add -A` in this dirty checkout.
2. Create an allowlist of exact existing paths and a separate list of intended removals. Include required application routes/components/helpers, current public reference assets, package/lock/config files, tests, scripts and CI. Include the new autosave/admin/results/view code only after review and verification. Preserve intended catalogue removals; do not silently restore deleted sourced photos or legacy data to satisfy stale tests.
3. For every allowlisted existing file, record its repository-relative path, byte count and SHA-256 from the final bytes. Record the base revision, candidate branch and intended removal paths with the manifest. Keep this manifest locally until its paths/content are reviewed for publication. A manifest that omits required untracked application code cannot identify this candidate.
4. Copy only allowlisted files into an isolated directory with the same relative paths. Supply installed dependencies or run the reviewed lockfile install there. Exclude environment files entirely; set mock mode and clear provider/storage credentials for checks. Include JSON test evidence needed by benchmark/editorial suites. Keep output outside the source checkout so build caches and browser recordings do not modify the candidate.
5. Run final canonical verification in that isolated directory. Compare SHA-256 again against every final allowlisted checkout file. If any relevant source changes during verification, rebuild/retest the affected integration and refresh the manifest. Record the exact manifest identity with verification logs.
6. After approved checkpoint creation, record the resulting full commit SHA and verify it contains the exact allowlisted bytes/removals. After an approved push, verify the remote branch SHA equals that commit; then inspect CI for that same SHA. Neither a local manifest nor older green CI substitutes for this remote check.

### Candidate content review

| Include after review | Exclude |
|---|---|
| `src/`, current required `public/` assets, package/lock/config files | `.env*` secret files, `.vercel/`, credentials and machine-local settings |
| Tests, scripts, `.github/workflows/verify.yml` | `.next*`, `node_modules/`, caches and build output |
| Selected setup/release documents and synthetic evidence | Private person/result images, access-bearing URLs, browser profiles and traces |
| Intentional sourced-photo/legacy catalogue removals | Root scratch captures such as `hero-after.png`, `hero-final.png`, `home-desktop.png`, `shot-bottom.png`; private recordings and unselected branding |

`.env.example` is already a tracked documentation file and must be reviewed separately; its name is not permission to publish access-bearing values. An ignored file remaining on disk is not proof that every earlier tracked copy or screenshot is safe.

## Final verification record

Fresh integrated output is recorded in [the verification receipt](../testing/STAGES_1_3_VERIFICATION_2026_10_29.md):

| Gate | Status / evidence to record |
|---|---|
| Autosave security/index/deletion/failure tests | Pass, including immutable-receipt retry race and metadata-only listing |
| Canonical `npm run test` | All 17 suites pass; none skipped |
| Disposable actual-Redis concurrency/failure suite | Pass for autosave and shared budget; no hosted ledger used |
| `npm run typecheck` | Exit 0 |
| `npm run lint` | Exit 0; 0 errors / 22 warnings |
| Mock production build | Exit 0 |
| All browser suites, including formerly failing ones | All 13 pass; none excluded |
| `git diff --check` | Exit 0 after integration |
| Independent code/security/React review | Approved after corrections; TypeScript review has no outstanding blocker |
| Source manifest matches checked checkout | All 135 checked files match; digest in verification receipt |
| Current-source remote CI and remote SHA | Pending approved publication |
| Deployed revision matches tested remote SHA | Pending approved deployment |

The canonical `npm run verify` sequence runs offline tests, typecheck, lint, build and browser checks in mock mode. Use an unused `TEST_PORT`. CI provisions Redis7.4 and sets `REQUIRE_REDIS_TEST=true`; a local skipped Redis suite must not be reported as equivalent to that gate. Node must be `>=22.13.0 <23`; the repository pins Next16.4.1 and React19.3.1.

## Push and deployment boundaries

Before any push, show the complete exact new commit text, destination repository/branch and audience for approval. No history rewrite is proposed. Check whether an associated PR exists and whether pushing may dismiss review approval or restart checks; report that consequence before publication.

`vercel.json` now explicitly disables deployment for `codex/redesign-v2` as well as `codex/ui-revamp`, `codex/final-week-release` and `experiments`. Include this reviewed guard in the checkpoint. No remote hosting setting changed; verify effective deployment behavior on publication. Do not assume a private repository or a branch prefix prevents deployment.

After remote CI succeeds for the candidate SHA, request any still-required specific deployment approval using the concrete tested package. Record source SHA, deployment ID, URL, runtime and function-duration/Fluid Compute settings. Verify clean-browser access and route mode without disclosing secrets. Never query saved-photo contents merely to establish route availability.

No live task or allowance mutation is included in this preparation. Hosted generation/save/reopen and phone acceptance belong to stage4 with a separately approved bounded test. `/api/mode` is not a balance check.

## Rollback procedure

Before deploying, record the exact prior deployment/source, its verified mode, the new deployment ID and how to restore the prior package. Preserve that package; do not rely on a dirty checkout as the only recovery source.

If paid endpoints or private-photo access misbehave, stop opening the affected release to new users. With the required authorization, switch to mock/unconfigured operation or promote a verified safe package; confirm route mode and access controls afterward. Switching modes cannot undo provider tasks already accepted. Preserve the existing aggregate allowance and saved data during diagnosis; never reset the ledger or delete photos in bulk as a rollback shortcut.

An earlier snapshot containing the audit's unauthenticated autosave route is not a safe live rollback. Do not infer security from READY status or successful page loads. Record what was restored, its source/deployment identity and which behavior was actually rechecked before reopening access.

## Stage3 completion conditions

- Full candidate reviewed and reproducible from an exact checkpoint.
- Current-source remote CI, including real disposable Redis, is green.
- Explicitly approved deployment uses that tested revision and has a recorded rollback package.
- Source/deployment mapping and remaining stage4–6 gates are recorded without treating a live-mode badge as functional evidence.

Until those conditions are met, stage3 is **prepared, not complete**. README/setup reconciliation and this checklist can proceed in parallel with implementation; final freeze, CI and deployment must wait for integration.
