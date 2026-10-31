# Opt-in background results and private 24-hour links

## Goal and scope

The user approved automatic, toast-free saving **after clear opt-in**, no user History tab, 24-hour expiry and private result links. Preserve existing photo/provider consent, generation budget and explicit Generate. Never save source photos/garment uploads, archive unchecked or mock results, or publish private images through ID-only URLs. No new dependency or database service.

## Implementation and ownership

- Backend builder owns `src/lib/shared-results.ts`, `src/app/api/shared-results/**`, and `tests/shared-results.test.ts`. Replace first-save visitor cookie with per-result signed access token minted before persistence. Receipt authorizes opt-in storage; distinct access token authorizes that result's read/delete. Both use signed random session ID. Duplicate receipt remains idempotent after commit/reply loss. Keep private Redis bytes+metadata EX86400, exact provider host allowlist, bounded image fetch/validation, cap20, private owner gallery and no-store responses.
- Viewer builder owns `src/app/view/[id]/page.tsx`/layout and small skip-link fix in `src/app/results/page.tsx`. Fragment key is read only in browser, omitted from API URLs/logs/referrers; authenticated blob fetch. Missing/invalid/expired key reveals no image. Allow deletion and manual private-link copy. No public list or History navigation.
- Primary owns `src/lib/session.ts`, `src/app/page.tsx`, `src/components/SharedResultAction.tsx`, FAQ copy, browser tests and integration. Add unchecked optional checkbox beside Generate. Start one background persistence request after successful live generation only when consent captured at Generate. Keep job state in page state across dialog close/reopen; retries never generate another VTO. No success toast or save notification. Best-effort automatic clipboard write, manual copy fallback on browser denial. Clear session resets opt-in; saved copies expire separately.

## Acceptance and verification

1. Unchecked choice, receipt issuance, mock generation and browsing cause zero result writes. Explicit opt-in triggers one automatic save per generated look.
2. Generation/image survives storage failure. Retry is explicit and idempotent; close/reopen cannot lose save/delete state. Clearing session prevents stale UI/clipboard updates.
3. Private links require signed per-result fragment key; foreign/forged/expired key or ID-only request fails. Deletion and24h expiry remove access. No input photos/keys/providerURLs logged or stored in metadata.
4. Actual Redis Lua expiry/cap/idempotency checks use a unique synthetic probe namespace, never the budget ledger; cleanup in finally. Cloud check is pending until deployment.
5. Run offline contracts, `npm run typecheck`, canonical lint, mock production build, all browser suites on isolated source copy (no `.env.local`), `git diff --check`; independent code/TS/React/security review. New browser assertions include automatic opt-in, no save toast/history, background close/reopen, denial-copy fallback, private image bytes, invalid link and delete.
6. Prepare a clean deployment artifact; inherited cloud credentials remain server-only. Exact new public copy and WhatsApp drafts/destinations need review under standing communication preference. General feature approval does not approve unseen public prose. No commit/push/deploy/send before that final text approval. Do not generate a paid smoke task or increase allowance.

## Known limits

A browser may refuse clipboard access after an async generation; provide Copy private link. Closing/reloading the whole page can interrupt a browser-initiated background save; source result remains provider-owned, and a failed save must never be reported as successful. Bounded Redis bytes are for the friends test; use private object storage before a larger rollout. Public release must verify live mode, existing allowance, runtime and anonymous access independently.
