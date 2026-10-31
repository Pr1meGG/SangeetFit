# Implementation Plan: Auto-Save VTO Results Feature

## Goal & Objectives

Add an auto-save feature that automatically stores VTO (Virtual Try-On) results in the database (Upstash Redis) for 24 hours when users try on clothing images, without requiring explicit consent. This provides a seamless experience where results are automatically preserved and can be accessed later.

**Objectives:**
1. Automatically save VTO results (both user photo + garment image + result image) to Redis when VTO completes
2. Store for 24 hours (consistent with existing `SHARED_RESULTS_TTL`)
3. No explicit user consent required (auto-save is implicit)
4. Results accessible via existing shared-results API
5. Maintain existing mock mode behavior

## Architecture Overview

### Current Flow:
1. User uploads person photo + garment photo
2. POST `/api/vto` triggers YouCam API (or mock)
3. Result returned to frontend
4. User manually clicks "Save" to store in shared-results

### New Flow:
1. User uploads person photo + garment photo
2. POST `/api/vto` triggers YouCam API (or mock)
3. **Auto-save**: Result automatically stored in Redis via shared-results mechanism
4. Result returned to frontend with auto-save confirmation
5. Results accessible via existing shared-results API (`GET /api/shared-results/[id]`)

## Technology Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Upstash Redis** (via REST API) - existing infrastructure
- **Tailwind CSS** - styling

## Dependencies

Existing dependencies in `package.json`:
- `next`: 16.4.1
- `react`: 19.3.1
- Upstash Redis client (via `@upstash/redis` - not currently in deps, using REST API directly)

## Files to Modify

### 1. `/src/app/api/vto/route.ts` - Main VTO endpoint
- Add auto-save logic after VTO completes successfully
- Use existing `createSharedResult` from `shared-results.ts`
- Return auto-save receipt/token in response

### 2. `/src/lib/shared-results.ts` - Shared results library
- Ensure `createSharedResult` can be called programmatically (not just via HTTP)
- May need to export internal functions for direct use

### 3. `/src/components/FaceCameraCapture.tsx` - Frontend VTO trigger
- Update to handle auto-save response
- Show auto-save confirmation to user

### 4. `/src/app/page.tsx` - Main page component
- Handle auto-saved result display
- Potentially show indicator that result was auto-saved

## Files to Create

None - leveraging existing infrastructure

## Implementation Tasks

### Task 1: Analyze shared-results.ts for programmatic usage
**Subtasks:**
- [ ] Read `createSharedResult` function signature
- [ ] Determine if it can be called directly from vto route
- [ ] Check required parameters (person image, garment image, result image, visitor ID)

### Task 2: Modify vto route to auto-save results
**Subtasks:**
- [ ] Import `createSharedResult` from `@/lib/shared-results`
- [ ] After successful VTO (live or mock), call `createSharedResult` with:
  - Person image (data URL)
  - Garment image (data URL) 
  - Result image (from YouCam or mock)
  - Visitor identifier (from request/session)
- [ ] Include auto-save receipt in VTO response
- [ ] Handle errors gracefully (don't fail VTO if auto-save fails)

### Task 3: Update FaceCameraCapture to handle auto-save response
**Subtasks:**
- [ ] Read auto-save receipt from VTO response
- [ ] Display subtle confirmation "Result auto-saved for 24h"
- [ ] Store receipt for potential sharing

### Task 4: Test auto-save functionality
**Subtasks:**
- [ ] Run dev server
- [ ] Test VTO with mock mode
- [ ] Verify result appears in shared-results
- [ ] Test GET `/api/shared-results/[id]` returns saved result
- [ ] Verify 24h TTL behavior

## Acceptance Criteria

1. ✅ VTO completes successfully in both mock and live modes
2. ✅ Result automatically saved to Redis without user action
3. ✅ Saved result accessible via `GET /api/shared-results/[id]`
4. ✅ Auto-save receipt included in VTO response
4. ✅ Frontend shows confirmation that result was auto-saved
5. ✅ 24-hour TTL respected (uses existing `SHARED_RESULTS_TTL`)
6. ✅ No breaking changes to existing manual save functionality
7. ✅ Graceful error handling - VTO succeeds even if auto-save fails

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Redis connection failure | Low | Medium | Wrap auto-save in try/catch, don't block VTO response |
| Image size exceeds Redis limits | Medium | High | Compress images before saving, check `MAX_SHARED_IMAGE_BYTES` |
| Visitor ID collision | Low | Low | Use crypto.randomUUID() for visitor identification |
| Mock mode compatibility | Low | Low | Test both mock and live paths |

## Verification Commands

```bash
# Start dev server
npm run dev

# Run typecheck
npm run typecheck

# Run lint
npm run lint

# Run tests
npm run test

# Test VTO endpoint manually
curl -X POST http://localhost:3000/api/vto \
  -H "Content-Type: application/json" \
  -d '{"personImage":"data:image/png;base64,...","garmentImage":"data:image/png;base64,..."}'

# Verify shared result
curl http://localhost:3000/api/shared-results/<returned-id>
```

## Commit Strategy

1. `feat: add auto-save to VTO route` - Core backend change
2. `feat: handle auto-save response in FaceCameraCapture` - Frontend update
3. `feat: display auto-save confirmation in UI` - UX improvement
4. `test: verify auto-save functionality` - Test updates