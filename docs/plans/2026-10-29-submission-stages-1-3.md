# Submission stages 1–3 — parallel execution

## Goal and boundaries

Repair automatic private result saving, reconcile regressions, and prepare a reproducible release candidate. Preserve current product features and all pre-existing work. User explicitly assigned retention-notice wording to Claude: do not edit that notice or other privacy copy in this pass. No live provider tasks, allowance changes, deployment, publication or history rewrite. Prepare exact checkpoint text/destination for approval after verification.

Architecture: Next.js 16 App Router, React 19, TypeScript; existing HMAC creator session and Redis command transport. Reuse installed dependencies and current authentication. Read bundled Next route/cookie documentation before route edits. Run mock checks in a credential-free isolated snapshot to protect running development servers.

## Parallel file ownership

1. Autosave builder: `src/lib/shared-results.ts`, `src/app/api/auto-saved/route.ts`, `src/app/api/vto/route.ts`, `src/app/admin/page.tsx`; new `tests/auto-saved.test.ts` and `tests/auto-saved.browser.test.mjs` only. Authentication for list/get/delete, correct multi-result index/expiry/cap, explicit failures, automatic saves retained, synthetic tests. No retention wording changes or edits to main `page.tsx`.
2. Regression builder: `tests/shared-results.browser.test.mjs`, `tests/garment-library.browser.test.mjs`, `tests/before-after.browser.test.mjs`, `src/components/BeforeAfterSlider.tsx`. Reconcile current automatic save UI and AI-only catalogue without weakening meaningful assertions; fix accessible slider percentage. Test positive behavior, not merely remove failing assertions.
3. Release preparation: README and a new local `docs/submission/RELEASE_CANDIDATE_2026_10_29.md`. Reconcile current catalogue/branch/run instructions; record source manifest, CI/deploy boundaries and rollback procedure. Do not draft public submission copy or invent a licence/attribution. Do not edit privacy/retention notice text.

Primary owns shared integration, any required main-page save failure/retry wiring, plan/state/task records, final verification and checkpoint proposal. Main-page edits must avoid Claude's notice and preserve concurrent edits. Final verification/CI/deployment cannot run ahead of their integrated dependencies.

## Acceptance and verification

- Unauthorized autosave list/get/delete cannot return or remove photos. Existing creator authentication works across the necessary API paths. Multiple records survive later saves; expiry and cap work. Admin can delete an actual saved record.
- Storage failure is distinguishable from an empty gallery. Automatic persistence never requires another paid generation. Mock catalogue validation exercises real image data rather than invalid asset strings when storage is tested.
- Sharing/library/slider checks reflect current behavior and retain meaningful generation/privacy/navigation coverage.
- Run each relevant regression while implementing, then `npm run verify` in a mock isolated snapshot. Provision disposable local Redis for `live-budget-redis.test.ts` if installed tooling permits; never use hosted credentials. Run `git diff --check` and independent security/code/React review.
- Record actual exits and remaining limitations. Require final source hash agreement before claiming verification covers the checkout.
- Review complete release file list: include needed untracked application code; exclude local env, private media, traces and scratch screenshots. Read-only GitHub/hosting checks may prepare release; final push requires approval of exact text. Effective auto-deployment on `codex/redesign-v2` must be known or safely disabled locally before push.

## Risks

Two existing saving systems and cookie scope can cause partial authentication fixes. Claude may edit the same checkout. Large base64 images stress Redis and response limits; keep bounds and avoid uploading repository data anywhere. Source CI is impossible to certify before approved publication; deployment remains separately gated.
