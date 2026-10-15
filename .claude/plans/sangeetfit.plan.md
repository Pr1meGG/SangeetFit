# Plan: SangeetFit — Phase 1: Foundation & Data Model

**Source PRD**: `.claude/prds/sangeetfit.md`
**Selected Milestone**: #1 — Foundation & data model
**Complexity**: Small

## Summary
Create the data layer (outfit catalog + color utilities) that all downstream features depend on. Pure TypeScript — no API calls, no UI. Four focused tasks with explicit validation at each step.

## Patterns to Mirror

| Category | Source | Pattern |
|---|---|---|
| Mock mode guard | `src/app/api/vto/route.ts:7` | `const MOCK_MODE = process.env.MOCK_MODE === "true"` |
| Path alias | `tsconfig.json:20` | `@/*` → `./src/*`; use `@/data/outfits`, `@/lib/color` |
| Glass style | `src/app/globals.css:21` | Existing `.glass` class; add `.gradient-text` to globals |
| Lucide icons | `src/components/Navbar.tsx:1` | Already installed — import directly |
| Tailwind config | `tailwind.config.ts` | Content glob already covers `src/components/**` — no change needed |

## Files to Change

| File | Action | Why |
|---|---|---|
| `src/data/outfits.ts` | **CREATE** | `Occasion` type, `Outfit` interface, `OUTFITS` array (8 entries) |
| `src/lib/color.ts` | **CREATE** | `hexToHSL`, `getUndertone`, `harmonyScore` — pure utilities |
| `src/lib/color.test.ts` | **CREATE** | Vitest tests for color utilities |
| `src/app/globals.css` | **UPDATE** | Add `.gradient-text` class |

## Tasks

### Task 1 — Create Outfit Catalog
- **Action**: Write `src/data/outfits.ts` with `Occasion` union type, `Outfit` interface, and `OUTFITS` constant (8 outfits across sangeet/mehendi/wedding/reception)
- **Validate**: `npx tsc --noEmit` — zero errors

### Task 2 — Create Color Utilities
- **Action**: Write `src/lib/color.ts` with `hexToHSL(hex)` → `{h,s,l}`, `getUndertone(itaAngle)` → `"warm"|"cool"|"neutral"`, `harmonyScore(skinHex, outfitHex)` → `0–1`
- **Validate**: `npx tsc --noEmit` passes; manual node test confirms outputs

### Task 3 — Write Unit Tests
- **Action**: Write `src/lib/color.test.ts` using vitest covering: hexToHSL white/black, harmonyScore same-hue=1.0, getUndertone boundaries
- **Validate**: `npx vitest run src/lib/color.test.ts` — all pass

### Task 4 — Add .gradient-text to globals.css
- **Action**: Append `.gradient-text` class to `src/app/globals.css`
- **Validate**: `npx tsc --noEmit` clean; `npm run dev` starts without error

## Validation

```bash
# Type check
npx tsc --noEmit

# Run tests
npx vitest run src/lib/color.test.ts

# Dev server starts cleanly
npm run dev & sleep 4 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
```

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Vitest needs config for path aliases | Low | Use relative imports in test; add `vitest.config.ts` only if needed |

## Acceptance
- [ ] `src/data/outfits.ts` exports typed catalog with 8 entries
- [ ] `src/lib/color.ts` exports 3 pure functions, no external deps
- [ ] `src/lib/color.test.ts` covers happy path + boundaries
- [ ] `npx tsc --noEmit` clean
- [ ] All tests pass

---
*Status: ready for approval*
