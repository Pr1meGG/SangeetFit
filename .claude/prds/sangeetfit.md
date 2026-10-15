# SangeetFit

## Problem
Indian women face overwhelming outfit-decision fatigue across multi-event wedding seasons — 5+ functions (sangeet, mehendi, haldi, wedding, reception) each with distinct dress codes, yet existing VTO tools are Western-fashion-focused and ignore skin-tone harmony. The result: wasted shopping trips, high online return rates (~30-40%), and family conflict over mismatched event attire.

## Evidence
- 67% of online fashion returns in India are "didn't look good on me" (market research cited in ideation)
- $8B+ Indian wedding market, overwhelmingly offline due to fit/look uncertainty
- No existing YouCam hackathon entry combines skin-tone analysis with occasion-specific ethnic wear VTO
- Competitive gap: `anywear` (general VTO), `auratone-skin-vto` (skin + fashion but no occasion layer), `glowfit` (time-based planning but no skin)
- Assumption — needs validation via: live API test on Indian ethnic wear images

## Users
- **Primary**: Indian women aged 18–40 attending weddings/festivals, shopping online or in-person, who want visual confirmation before committing to an outfit
- **Secondary**: Family members consulted for approval (share feature)
- **Not for**: Men's fashion (different segment, can be added later), full closet digitization, B2B retail

## Hypothesis
We believe **a 3-step flow (occasion select → skin-tone analysis → occasion-curated VTO gallery)** will **solve outfit-decision uncertainty** for **Indian wedding attendees**. We'll know we're right when **users complete the flow end-to-end in under 3 minutes and express confidence in at least one outfit choice**.

## Success Metrics
| Metric | Target | How measured |
|---|---|---|
| End-to-end flow completion rate | ≥80% of session starters reach a VTO result | Session analytics / manual demo count |
| VTO success rate (non-mock) | ≥60% on ethnic wear | Live API test results |
| Skin-tone analysis accuracy | Consistent ITA values across repeated runs | Manual test with 5 photos |
| Demo-rehearsal pass rate | 3/3 dry runs succeed without error | Team walkthrough before judge panel |
| API unit budget adherence | ≤80 units per full session | `/s2s/v1.0/client/credit` check |

## Scope
**MVP** — A single-user, single-occasion flow that (1) selects a wedding function, (2) analyzes a selfie for skin tone, (3) shows 4–8 curated outfits filtered by occasion and sorted by color-harmony score, (4) lets the user VTO one garment, (5) shares the shortlist via WhatsApp or link copy. All backed by mock mode for reliable demo.

**Out of scope**
- Multi-person / family coordination (requires multi-user state) — defers to post-hackathon
- Full closet digitization (image categorization pipeline is a separate product)
- Men's fashion segment — different UI and catalog entirely
- Real-time camera feed — photo upload is sufficient for demo
- Purchase integration — hackathon deliverable is styling advice, not checkout

## Delivery Milestones
<!-- Status: pending | in-progress | complete -->

| # | Milestone | Outcome | Status | Plan |
|---|---|---|---|---|
| 1 | Foundation & data model | Outfit catalog + colour similarity utility ship; type-check passes | complete | `.claude/plans/fuzzy-wondering-hare.md` |
| 2 | Skin-tone analysis pipeline | Upload selfie → API call → display skin profile; works in mock mode | pending | — |
| 3 | Occasion-curated gallery | Filter + sort by harmony score; favorites toggle; shortlist view | pending | — |
| 4 | Virtual try-on | Click-to-VTO modal with loading/result/error states; batch endpoint works | pending | — |
| 5 | Share & polish | WhatsApp share, copy link, visual polish; end-to-end demoable flow | pending | — |

## Open Questions
- [ ] Does YouCam cloth-v4 handle Indian ethnic wear (lehenga, saree drape, kurta) acceptably, or does it degrade to generic results? **Validate: upload test image before Phase 3**
- [ ] Is the skin-tone-analysis API accurate on South Asian skin types (Fitzpatrick III–VI)? **Validate: test 3–5 photos covering the range**
- [ ] Can we source 8 high-quality, front-facing Indian outfit images with clean backgrounds before the deadline? **Validate: check Unsplash/Pexels; fallback = AI-generated via YouCam text-to-image**
- [ ] Will the mock-mode VTO result images look convincing enough for a live judge demo? **Validate: review mock PNG output early**

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| VTO quality poor on ethnic wear | Medium | High | Pivot to Western formal wear with same pipeline if ethnic fails; keep occasion framing |
| Skin-tone API inconsistent on deep skin | Medium | Medium | Fall back to manual color picker input; keep skin analysis as "nice to have" |
| Garment images not available | Low | Medium | Generate via YouCam text-to-image or use AI placeholder; mock mode covers demo |
| API unit budget exceeded | Low | High | Use mock mode for demo; real API only for 2–3 test runs; monitor credit balance |
| Demo breaks on judge's machine | Medium | High | Build photo-upload primary flow (no camera dependency); pre-record backup demo video |

---
*Status: DRAFT — requirements only. Implementation planning pending via /plan.*
