# Submission re-audit — 1 November 2026

Supersedes [SUBMISSION_AUDIT_2026_10_29.md](SUBMISSION_AUDIT_2026_10_29.md). Deadline: **2 November 2026, 22:15 IST**. Judging access through **20 November**. Lenses used: `demo-showcase-planning` (judge experience, failure recovery), `ste` (clarity of public text), `grilling` (open decisions, listed at the end). Read-only: no live YouCam task, no POST to production, no `.env.local` values read. An independent reviewer subagent could not run (its model had no usage credits), so this audit was done in the main session.

## Candidate identity (verified today)

- HEAD `8bfd5e6` = production app code `a697fdf` + docs only (`git diff --name-only a697fdf HEAD`).
- `TEST_PORT=3581 npm run verify` exit 0: 18 offline suites (both real-Redis suites skipped locally), typecheck, build, lint 0 errors / 22 known warnings, 13 mock browser suites. `git diff --check` clean.
- Production GETs: `/` 200, `/library` 200, `/api/mode` → `{"mode":"live"}`.
- Stack claim checked: Next.js 16.4.1, React 19.3.1 (matches the Devpost draft).

## Findings

| Sev | Where | Problem | Smallest fix |
|---|---|---|---|
| **HIGH** | `src/lib/live-budget.ts:64`, `src/app/api/vto/route.ts:170`, `src/lib/request.ts:15` | The only guard on live try-ons is one shared allowance (~19 left). There is no per-visitor limit, and a request with no `Origin` header is accepted. One visitor, or a short script, can use every try-on before judges open the app. The Devpost page is public, so the URL will be too. | Add a per-visitor daily cap (for example 3 try-ons per IP per day, a Redis counter checked before `reserveLiveBudget`). This needs a code change, tests and a production deploy, each with user approval. Alternative with no deploy: watch the ledger and top it up manually. |
| LOW (was MEDIUM) | Allowance ledger (TASK_BOARD, 31 Oct) | YouCam credits fell by 84 between 26 and 31 Oct, more than the ledger explains. **1 Nov read-back (user-run, read-only): 820 credits** (780 expiring 13 Jan 2027 + 40 expiring 16 Oct 2027). That is 2 below the 822 read before the single 31 Oct video take, so nothing else has used the key since. The earlier 26–31 Oct gap stays unexplained. | None before the deadline. The binding limit for judges is the app's ~19-try-on allowance, not the credits. |
| MEDIUM | `docs/submission/DEVPOST_DRAFT.md:77,78,82` | Three open `[CONFIRM]` items: video link, organiser invite (not sent), AI-disclosure wording. Pasting the draft as it stands would publish a false sharing claim. | Settle the three items before pasting. |
| MEDIUM | Video | Both cuts use a synthetic voice. Your own voiceover is planned but not recorded; no timed rehearsal of the final cut exists. | Record, rebuild, then watch it once end to end before uploading. |
| LOW | `package.json` `engines.node` `>=22.13.0 <23` | A judge on Node 24 gets an engine warning from `npm ci` (warning only). The README run line does not mention the Node version. | Add "Node 22" to the README run line. |
| LOW | No `LICENSE` file (README:97 says so) | Fine for a private repo shared with organisers; matters only for public release. | No action for judging. |

## HIGH fix — implemented locally, not deployed (1 Nov)

`src/lib/live-budget.ts`: the existing atomic reservation script now also takes a per-visitor key (`sangeetfit:visitor:v1:` + first 32 hex of SHA-256 of the Vercel-supplied client address). It allows **3 live tasks per visitor per rolling 24 h**, returns 429 with a plain message when over, and counts a visitor only when the shared allowance is actually spent. Both live routes pass the key. Known ceiling: someone rotating addresses can still drain the pool.

Evidence: `tests/live-budget.test.ts` (new cap, hashing and 429 checks; it also now fails if a stub stalls, which previously could exit 0 with checks skipped). `TEST_PORT=3582 npm run verify` exit 0: 18 offline suites, typecheck, build, lint 0 errors, 13 mock browser suites. `git diff --check` clean. **Real Redis:** pushed with approval as `3f2de5b` + `6abd10a`; CI run 41323057572 failed on a test-only seed error (pool of 200 = one try-on, so "exhausted" was wrong) after the cap checks had passed. Fixed in `54e7b58`; **CI run 41323576432 green** on Redis 7.4, including "per-visitor daily cap admits three, spends nothing when capped, expires in a day and ignores exhausted attempts". **Deployed (1 Nov, with user approval):** a clean detached worktree of `54e7b5855f34` was deployed with Vercel CLI 65.9.0 → production `dpl_5xJTzzCnqeMco3iVVRDpS167z6ma` READY (`sangeet-pxvvxldc0-ryuk-codes.vercel.app`), aliased to https://sangeet-fit.vercel.app. Read-only checks: `/`, `/library`, `/results`, `/api/mode` HTTP 200; mode `live`; `GET /api/vto` 405. No try-on was run, so the cap has not been exercised on production. Rollback target: the previous production deployment `sangeet-5qgw0piwy-ryuk-codes.vercel.app` (`a697fdf`).

## Checked and fine

- **Honest failure messages** (`vto/route.ts`): exhausted allowance → "Live generation allowance is exhausted. Browsing and saved results remain available." 429 → no retry. Timeout → says a submitted task may still finish and nothing restarts. Missing API key → 503, never a mock image.
- **Order of operations**: allowance is reserved before any photo upload. Request size is capped before parsing. The YouCam result URL must be `https` with no credentials. The API key never leaves the server.
- **Mock never shown as live**: mock responses carry `mode: "mock"`, and live mode never falls back to mock.
- **iPhone photos**: every file input uses `accept="image/jpeg,image/png"`, so iOS Safari converts HEIC to JPEG before upload.
- **Video v3 frames**: the live render is labelled "Real wait 26.0 s · shown 4× faster" and "Live YouCam Cloth V4 render · recorded 31 Oct". The end card carries the 24-hour and fit-guarantee lines.
- **Screenshots**: 14 current-UI captures, 0 generation requests ([README](../submission/screenshots/2026-11-01-current-ui/README.md)).

## Judge-demo failure plan (demo-showcase lens)

| If this happens during judging | What the judge sees | Backup |
|---|---|---|
| Allowance runs out | Clear exhausted message; planning, browsing and PDF still work | The video's real 26 s production render |
| YouCam slow or down | Timeout or error message; no automatic retry | Same video segment |
| Vercel down | Nothing | Video and screenshots; rollback target `dpl_S3XTf3qgBTHXJRieDwxYbEBf9HNu` is recorded |

Day-of check (T−30 min, before submitting): open production, confirm `/api/mode` is live, read the allowance balance, watch the uploaded video once.

## Open decisions (for the user)

1. Add a per-visitor try-on cap and redeploy before the deadline, or accept the risk and monitor manually?
2. Which video cut is final?
3. When to send the organiser invite?
4. Exact AI-disclosure wording.
