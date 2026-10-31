# Live friends test and optional 24-hour feedback gallery

## Authorized outcome and boundaries

Deploy the current redesign with live VTO, connect a one-day result store, and prepare the link for WhatsApp contacts Malhar and T10 Player. The owner wants to view friends' outputs. Collection must be optional and accurately disclosed; no covert collection or invented AI-training purpose. No source photo or garment upload is archived. Existing aggregate provider allowance remains unchanged. No live generation smoke test or allowance increase is included.

Proposed in-app wording: **“Share this look with the creator · kept for 24 hours”** A separate explicit share action follows a successful live result; generating itself does not save anything to our database. Exact new public copy and the WhatsApp messages will be shown before publication/sending under the standing communication policy.

## Smallest complete design

Reuse the existing server-only Upstash/KV connection, with a separate key namespace from the non-expiring budget ledger. This bounded friends test stores at most20 active outputs, each at most2,400,000 decoded bytes, with Redis TTL86400 on image and metadata keys. A sorted expiry index contains only random IDs and expiry times. Output bytes are private; no public bucket or new service dependency is needed. For broader usage, move bytes to private object storage; this cap is deliberately small.

A successful live VTO may issue a short-lived HMAC-signed sharing receipt containing a random result ID, trusted provider output URL, outfit label and issuance time. Issuance writes no record. The share endpoint verifies the receipt and explicit consent, downloads only an exact allowlisted YouCam S3 host with redirects blocked and a bounded stream, validates the image through the existing parser, then atomically stores bytes/metadata with expiry and a signed anonymous visitor cookie. Repeated sharing is idempotent and never extends expiry. Failure never resubmits generation and preserves the normal result.

An owner-only gallery uses a separate high-entropy server secret, password login and HttpOnly cookie. API list/image/delete calls authorize either the owner or the originating signed visitor session as appropriate. Visitors can remove their shared look; expired metadata/bytes are inaccessible. All private responses use no-store. No signed provider URL, auth secret or image bytes appear in logs or public listings.

## Ownership and files

- Backend builder: `src/lib/shared-results.ts`; `src/app/api/shared-results/route.ts`; `src/app/api/shared-results/[id]/route.ts`; `src/app/api/shared-results/admin/route.ts`; `tests/shared-results.test.ts`.
- Frontend builder: new `src/components/SharedResultAction.tsx`, `src/app/results/page.tsx` and its optional CSS module. Explicit opt-in and deletion in the result action; password-protected gallery page.
- Primary: integrate optional sharing receipt into `src/app/api/vto/route.ts`, `src/lib/session.ts`, `src/app/page.tsx`; update accurate privacy language in HomeGuide/page; `.env.example`; meaningful browser regression; deployment packaging, environment configuration and remote verification. Preserve all current redesign/release changes.

## Acceptance and checks

1. No sharing action means zero result-store writes. Mock results cannot be archived as live outputs. Consent must be literal true.
2. Forged/expired receipts, foreign origins, arbitrary URL/redirect/MIME/size payloads and unknown images fail safely. No private record enumeration without authentication.
3. Anonymous visitors are isolated, owner can review only opted-in outputs, deletion works, both record and image expire after24h, and storage cap/duplicate operations are atomic.
4. Storage/provider-download errors produce sharing errors only, never a new generation. Current generation flow, budget and privacy/reset behavior remain verified.
5. Contract tests, canonical TypeScript/lint, mock production build, existing/new browser tests, independent code/React/TS/security review, and `git diff --check`.
6. Read-only Vercel/Redis preflight, synthetic short-lived write/read/delete proof in the result namespace only, deploy exact reviewed artifact with live mode and existing budget, verify public URL/assets/mode/private auth without generating a task. No `.env.local` values are read or uploaded.
7. Show exact new UI privacy text, destination/domain, owner-gallery access setup and exact WhatsApp message for each identified contact. Approval is required before publishing new outward-facing prose or sending. Confirm deployed status and message delivery separately.

## Open deployment facts

Existing Vercel project: `ryuk-codes/sangeet-fit`; production alias `https://sangeet-fit.vercel.app`; project setting Node24.x while package declares Node22. Existing Redis/KV secrets are configured in Preview/Production; provider key is Production-only. Effective runtime, Fluid Compute, public protection, current allowance and owner-secret configuration require verification. Deployment tooling must exclude all secrets, private photos/results, screenshots, traces and unrelated untracked material.
