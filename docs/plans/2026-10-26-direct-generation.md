# Direct generation after photo selection

User request: remove the preview access-code gate. A prepared valid photo enables Generate; selecting it never submits a task.

Outcome (Altitude): remove the manual code handoff from the fitting room. Proof (Depth): browser checks cover disabled-before-photo, enabled-after-photo, explicit-only submission, and no access header; offline API contracts retain input validation and budget failures. Impact (Range): shared page, VTO/skin/mode routes, access helper, configuration example, API/browser fixtures and current setup/release documentation. Speed: delete the obsolete access mechanism and reuse current photo processing, consent and shared budget; no replacement auth framework. Depth changes confidence most because a cosmetic-only fix would still fail at the server.

1. Update API tests and remove the access gate from VTO, skin and mode; delete the unused helper/config example. Keep provider keys server-side and preserve all budget reservations and photo validation. In shared `src/lib/request.ts`, require JSON and reject explicit foreign browser origins before reading photos; compare against the actual Host authority because Next normalizes internal local URLs.
2. Remove page code fields/state/header/button dependencies and unused styles. Retain photo disclosure, preparation/error states and explicit Generate click. Update existing browser coverage, including Android and private-session/PDF checks.
3. Review integrated changes independently. Run offline contracts, typecheck, build, browser suites, lint and whitespace checks. Correct any evidenced regressions.
4. Update durable state and setup docs; restart the already requested loopback live server on port 3566 with the rebuilt app. Check mode/home without generating or changing allowance. No commit, push, deployment or paid smoke test.

Risk: anyone able to reach a live instance can spend its finite shared allowance. This local server remains bound to 127.0.0.1; no hosted access setting or budget cap changes. Older recordings/receipts describe the former code-gated flow and remain historical evidence.
