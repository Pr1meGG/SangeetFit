# YouCam Hackathon — Final Recommendation

## 🏆 Winner: SangeetFit — Indian Wedding Outfit Stylist

**Tagline:** "What do I wear to *which* event?" — answered with visual proof.

---

## Why It Wins on the Rubric

### Technological Implementation (8/10)
- Clean 2-API pipeline: `skin-tone-analysis` → color palette → `cloth VTO` (3–5 garments)
- Async task polling pattern already implemented in existing `src/app/api/vto/route.ts`
- Mock mode supported for demo; real API for production
- Multi-Garment VTO demonstrates batch processing capability

### Design (9/10)
- Occasion-first UX: user selects event → sees curated options, not a laundry list
- Family sharing feature (send shortlist via WhatsApp/link) adds social depth
- Color harmony visualization (skin tone → complementary palette → outfit matches) is visually compelling
- Complete product experience: upload → analyze → browse → try-on → share

### Potential Impact (9/10)
- $8B+ Indian wedding market, overwhelmingly offline due to uncertainty
- 5+ wedding functions per event = massive decision burden
- Directly addresses return-rate problem (67% of online fashion returns)
- Culturally resonant for judges who understand the Indian context

### Quality of Idea (9/10)
- Non-obvious: no competitor structures VTO around wedding *functions*
- Bridges beauty (skin tone) and fashion (outfit) in a culturally specific way
- "Skin tone determines which colors look best" is a genuine insight, not a wrapper
- Demonstrates understanding of both the API capabilities and the problem space

**Official Score: 8.75/10**

---

## Runner-Up: Pulse — Real-Time Outfit Mood Ring

**Why it lost:** Lower technical depth (1–2 APIs vs 2–3), weaker problem evidence, and camera dependency introduces demo risk. Strong on "Quality of Idea" and "Demo Reliability" but can't compete on "Technological Implementation."

**Best used as:** A lightweight feature *inside* SangeetFit — a "quick check" button that scores an outfit instantly without full VTO.

---

## Unresolved Assumptions

| Assumption | Confidence | How to Validate |
|------------|-----------|-----------------|
| YouCam VTO handles Indian ethnic wear (lehenga, saree drape, kurta) reasonably well | **Low** — primarily trained on Western casual wear | Upload a test image of Indian attire before committing |
| Skin tone analysis correctly handles South Asian skin tones (Types III–VI) | **Medium** — Fitzpatrick scale goes to Type VI but color accuracy on deeper tones is documented as lower | Test with actual photos of diverse skin tones |
| Judges will appreciate cultural specificity over universal appeal | **Medium** — hackathon audience is global; need to frame as "personal styling for any multi-event occasion" | Ask a few people outside the project |
| 1,000 API units covers the demo + submission | **Medium** — ~40–60 units/session × 10 sessions = 400–600; buffer for errors | Monitor unit usage via `/s2s/v1.0/client/credit` |
| We can source 15–30 high-quality Indian wedding outfit images | **Medium** — need either paid stock or AI-generated images | Check Unsplash/Pexels for ethnic wear; consider generating with YouCam's text-to-image |

---

## Early Kill Criteria

Pivot or abort if any of these fail during the first week:

1. **VTO on Indian ethnic wear produces unacceptable results** → Pivot to Western formal wear (cocktail dresses, suits) with the same pipeline. The "multi-event occasion" framework still works.
2. **Skin tone analysis fails or returns inconsistent results on test photos** → Drop skin-tone-analysis entirely; use a simple color picker or skip to VTO-only. Lose the differentiation but keep the product.
3. **Can't source enough garment images in 3 days** → Use AI-generated outfit images (YouCam text-to-image or Stable Diffusion) as placeholders. Mock mode covers the demo.
4. **Demo breaks on a generic laptop camera** → Build with photo-upload as primary flow; camera as optional enhancement. Don't let camera dependency kill the demo.

---

## First Validation Tests

Run these **before writing any feature code**:

### Test 1: VTO on Ethnic Wear (1 hour)
```bash
# Upload a photo of yourself and an Indian outfit (kurta/saree image)
# Use the existing /api/vto route with MOCK_MODE=false
# Expected: recognizable result showing the outfit on the person
# If result is garbage → pivot to Western wear or drop VTO
```

### Test 2: Skin Tone Analysis on Diverse Photos (30 min)
```bash
# Test with 3–5 photos covering skin types III, IV, V, VI
# Endpoint: POST /s2s/v2.0/task/skin-tone-analysis
# Expected: consistent ITA values and hex codes across repeats
# If results are inconsistent → investigate v2.1 endpoint or drop this API
```

### Test 3: Unit Budget Calculation (10 min)
```bash
curl -H "Authorization: Bearer $YOUCAM_API_KEY" \
  https://yce-api-01.makeupar.com/s2s/v1.0/client/credit
# Expected: >1000 remaining. If <500, request more or optimize.
```

### Test 4: Garment Image Sourcing (2 hours)
- Check Unsplash/Pexels for "Indian wedding outfit" images (free, commercial use)
- If insufficient, generate 10–15 outfit images using YouCam's text-to-image API
- Verify images are front-facing, no model, clean background

---

## Implementation Outline (High-Level)

```
src/
├── app/
│   ├── api/
│   │   ├── vto/route.ts          ← existing, extend for multi-garment
│   │   └── skin-tone/route.ts    ← new: wrap skin-tone-analysis API
│   └── (pages)
│       ├── page.tsx              ← occasion selector
│       ├── analyze/page.tsx      ← selfie upload + skin tone result
│       └── tryon/page.tsx        ← garment gallery + VTO results
├── components/
│   ├── OccasionPicker.tsx        ← sangeet/mehendi/haldi/wedding/reception
│   ├── SkinToneResult.tsx        ← ITA value, color palette display
│   ├── GarmentGallery.tsx        ← curated outfit grid
│   └── ShareSheet.tsx            ← WhatsApp/link sharing
└── data/
    └── outfits.ts                ← hardcoded garment images + metadata
```

**Key design decision:** Keep the skin tone analysis as a *one-time* step at the start. The resulting color palette then drives which garments are highlighted in the gallery — not a re-analysis per garment. This keeps unit cost low (~40 units/session).

---

## Estimated Unit Budget

| Step | API Call | Units |
|------|----------|-------|
| Skin tone analysis (once) | `skin-tone-analysis` | ~20 |
| VTO attempt 1 | `cloth VTO` | ~20 |
| VTO attempt 2 | `cloth VTO` | ~20 |
| VTO attempt 3 | `cloth VTO` | ~20 |
| **Total per session** | | **~80** |
| **Sessions on 1,000 units** | | **~12** |

With mock mode for demo and 3–4 real test sessions: well within budget.

---

## Demo Script (1–3 minutes)

1. **0:00–0:15** — "I'm going to my cousin's wedding. Which outfit should I wear to the sangeet?"
2. **0:15–0:30** — Upload selfie → skin tone analysis runs → "Your undertone is warm golden"
3. **0:30–0:50** — Select "Sangeet" occasion → 3 outfit cards appear, color-ranked by harmony
4. **0:50–1:20** — Click first outfit → VTO processes → result appears
5. **1:20–1:40** — Try second outfit → side-by-side comparison
6. **1:40–2:00** — "Send to sister for approval" → WhatsApp share sheet
7. **2:00–2:15** — "This could save me 3 hours of shopping and 2 wrong purchases"

---

## Files Created

| File | Purpose |
|------|---------|
| `docs/research/competition-facts.md` | Official rules, API catalog, endpoint details |
| `docs/research/landscape.md` | Competitor analysis, gap identification |
| `docs/research/concepts.md` | 12 product concepts with scores |
| `docs/research/evaluation.md` | Full scoring matrix and ranking |
| `docs/research/red-team.md` | Red-team analysis of top 3 concepts |
| `docs/research/hackathon-recommendation.md` | This file — final recommendation and plan |

---

Next step: Invoke `writing-plans` to create a detailed implementation plan.
