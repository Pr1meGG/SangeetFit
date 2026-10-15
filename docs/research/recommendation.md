# Hackathon Recommendation

## Winner: FestiWear — Festival Outfit Planner

---

## Why It Wins

### Rubric Performance
- **Highest Official Score (8.5/10):** Combines both API tracks (Skin AI + VTO), non-trivial multi-step pipeline, clear consumer value for a massive underserved market.
- **Strong Design (8/10):** Rich UI with occasion calendar, closet grid, family sharing — complete product experience.
- **High Impact (9/10):** 100M+ Indian women face this problem annually during wedding/festival season. High frequency, emotional urgency.
- **Quality of Idea (9/10):** Culturally specific, multi-API orchestration, social coordination — goes well beyond generic VTO wrappers.

### Key Differentiators vs. Competitors
1. **Only entry targeting Indian festival/wedding season** — anywear is generic, aloud is accessibility-focused, others are skin-only or VTO-only.
2. **Multi-API + social feature** — combines Skin Analysis (for skin-tone-aware suggestions) + Cloth VTO (for visualization) + family sharing (unique).
3. **Memorable demo moment** — "Sangeet night outfit picker" is instantly understandable and emotionally resonant.

### Business Viability
- Clear path to monetization: freemium (free for individuals, paid for family plans)
- WhatsApp integration for sharing (India's primary communication channel)
- Festival-season spike model aligns with usage patterns

---

## Strongest Alternative: ReturnGuard — Pre-Purchase Confidence Score

If FestiWear's scope feels too large for 3 weeks, ReturnGuard is the safer bet:
- **Simpler architecture** (single VTO call per product)
- **Lower unit cost** (2 units vs. 14 units per session)
- **Stronger implementation feasibility** (no closet management, no family features)
- **Same high impact** (30-40% return rates = $100B problem)
- **Risk:** fit-check has a similar concept — must differentiate with skin-tone harmony layer

---

## Unresolved Assumptions

| Assumption | How to Verify | Impact if Wrong |
|------------|---------------|-----------------|
| 1,000 API units is enough for 3 weeks of dev + demo | Test with 5 VTO calls + 1 skin analysis, extrapolate | Could run out before submission |
| Closet photo upload is fast enough for demo | Build a quick prototype of photo upload + crop | Slow upload kills demo pacing |
| Judges will appreciate cultural specificity | Check past winners — accessibility won in 2026 | If they prefer generic, cultural angle is weaker |
| Family sharing adds demo value | A/B test demo with vs. without sharing | If judges find it distracting, remove it |

---

## Early Kill Criteria

Pivot to ReturnGuard or MenStyle AI if ANY of these occur:
1. **YouCam VTO v4 fails on demo garments** — test with 5 sample images before committing
2. **Skin Analysis returns insufficient data** for color-palette recommendations — check API docs for skin_type + undertone fields
3. **Deadline compression** — if >1 week remains and core VTO flow isn't working, drop family sharing feature
4. **Unit budget overrun** — if demo testing shows >20 units/session, switch to VTO-only mode

---

## First Validation Tests (Do These Before Building)

### Test 1: VTO API Reliability (Day 1)
```bash
# Test with your existing VTO route
curl -X POST http://localhost:3000/api/vto \
  -H "Content-Type: application/json" \
  -d '{"userId": "test1", "garmentId": "kurta_01", "category": "ethnic"}'
# Expected: success with resultUrl (mock or live)
```
If this fails, pivot to MenStyle AI (simpler, same VTO endpoint).

### Test 2: Skin Analysis Output Schema (Day 1–2)
```bash
# Check what fields skin-analysis returns
# Look for: skin_type, undertone, redness_score, oil_score, etc.
# If undertone is NOT available, FestiWear skin-aware feature is blocked
```
If undertone is missing, FestiWear falls back to VTO-only mode (still viable).

### Test 3: Demo Pacing (Day 2–3)
Build a skeleton demo with:
1. Upload 3 closet photos
2. Select "Sangeet" occasion
3. See 3 VTO results
4. Share to "family member" (simulated)

If this takes >2 minutes end-to-end, the demo is too slow. Simplify.

---

## Implementation Priority (If Approved)

**Week 1:** Core VTO pipeline + closet upload + occasion picker
**Week 2:** Skin analysis integration + color recommendations
**Week 3:** Family sharing + polish + demo video

---

## Files Generated

- `docs/research/competition-facts.md` — Verified rules, API endpoints, costs
- `docs/research/competitive-landscape.md` — 15 competing projects analyzed
- `docs/research/opportunities.md` — 8 user problems mapped
- `docs/research/concepts.md` — 12 product concepts with workflows
- `docs/research/evaluation.md` — Full scoring matrix (12 concepts)
- `docs/research/red-team.md` — Top 3 threat analysis
- `docs/research/recommendation.md` — This file

---

*Recommendation generated: 2026-10-15*
*Next step: Run validation tests above, then invoke `writing-plans` skill for implementation planning.*
