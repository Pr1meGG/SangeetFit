# YouCam Skin-Tone Analysis Polling 403 Diagnostics

## Summary
Investigation of HTTP 403 errors reported during YouCam skin-tone analysis task polling. No actual error responses or request IDs were captured in repository logs.

## Endpoint Paths (from `src/app/api/skin/route.ts`)

| Step | Method | Path | Full URL |
|------|--------|------|----------|
| Upload file metadata | POST | `/file` | `https://yce-api-01.makeupar.com/s2s/v2.0/file` |
| Submit task | POST | `/task/skin-tone-analysis` | `https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-tone-analysis` |
| Poll task result | GET | `/task/skin-tone-analysis/{taskId}` | `https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-tone-analysis/{taskId}` |

Base URL from `.env.local`: `https://yce-api-01.makeupar.com/s2s/v2.0`
Auth: `Authorization: Bearer <YOUCAM_API_KEY>` on all calls.

## Discrepancy: Planned vs. Implemented Upload Path
The planning doc (`docs/plans/2026-10-15-sangeetfit.md`) specifies the upload endpoint as:
```
POST /file/skin-tone-analysis
```
The implemented code uses:
```
POST /file
```
No endpoint suffix. Compare with `src/app/api/vto/route.ts` which uses `/file/cloth-v3`. This mismatch may be contributing to the 403.

## Sanitized Error Response
The error raised by `pollTask` on 403 is:
```
Poll failed: 403
```
No response body is logged. The catch block (`src/app/api/skin/route.ts:126-128`) returns HTTP status 500 with the JSON body:
```json
{ "success": false, "error": "Poll failed: 403" }
```
(`500` is the HTTP status code; the body contains only `success` and `error` fields.)

## Manually Observed Poll Response Body (single occurrence)
During the earlier manual live test session (conducted in conversation, **not** captured in repository logs), one poll response body was observed:
```json
{"task_status":"error","error":"Request failed with status code 403"}
```
This is direct evidence that the polling failure occurred server-side with a 403, but it does **not** conclusively establish the root cause — e.g. it is suggestive of, but does not prove, an account-entitlement or permissions issue.

## Evidence Missing from Existing Logs
- No `X-Request-ID`, `X-Correlation-ID`, or any request header was captured
- No response body (only status code) is logged for poll failures
- No timestamp of the specific 403 occurrence is recorded in the repo
- No task ID from the failed request is available
- No dedicated log files exist (searched `*.log`, `.next/`, and git history)
- The previous live test session ran manually with no persistent logging

## Request ID / 403 Body
Neither was captured. The code only logs `res.status` on failure, not `res.headers` or the response body.

## Configuration (redacted)
- `YOUCAM_API_KEY` is set in `.env.local` (not committed)
- `MOCK_MODE` is currently `true` (blocks live calls)
- `YOUCAM_BASE_URL` is set to the v2.0 endpoint above

## Next Steps to Diagnose
1. Temporarily set `MOCK_MODE=false` and add response body logging to `pollTask`
2. Re-run the skin-tone test with a valid API key
3. Capture the full 403 response body — it likely contains a reason (quota, key permissions, IP block)
4. Check if the upload endpoint should be `/file/skin-tone-analysis` instead of `/file`
5. Verify API key has skin-tone-analysis scope/permissions

## No Credentials Included
This document contains no API keys, Authorization headers, cookies, or personal image data.
