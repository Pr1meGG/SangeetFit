# Competitive Landscape — YouCam Hackathon 2026

## Key Competitors Found (GitHub Search)

### Top-Ranked Projects

#### 1. uiharu-kazari/anywear — ⭐14 (Most starred entry)
- **Concept:** Screenshot any look → see it on your body → styled for your skin today
- **Approach:** Agentic pipeline: Skin AI → Gemini reasoning → Cloth VTO v4 → Gemini verdict
- **Tech:** React 19 + Vite + Tailwind v4 + Hono server + Gemini (gemini-3.5-flash)
- **APIs:** Skin Analysis (12 units) + Cloth VTO v4 (2 units)
- **Live demo:** deployed on Google Cloud Run
- **Key differentiator:** "Stylist verdict" — Gemini cross-references skin brief + occasion + garment to give Wear/Maybe/Skip
- **Architecture:** Multi-stage pipeline with persistent lookbook
- **Status:** Fully functional, deployed

#### 2. StephenSook/aloud — 🏆 1st Place Winner
- **Concept:** Voice-first skincare assistant for blind/low-vision shoppers
- **Approach:** WebRTC voice conversation + YouCam Skin Analysis + EU CosIng ingredient lookup
- **Tech:** Next.js + Capacitor (iOS/Android) + OpenAI Realtime API + WebRTC
- **APIs:** Skin Analysis only
- **Key differentiator:** Accessibility-first, screen-reader + screen-off workflow
- **Safety:** CI-blocking claim linter prevents medical language
- **Status:** Deployed (web + iOS TestFlight + Android APK)

#### 3. liutingqiu/youcam-ai-agent-vto — ⭐0
- **Concept:** 14-parameter clinical skin diagnostic engine
- **Approach:** Deep skin analysis with clinical-grade parameters
- **Tech:** YouCam API integration
- **Key differentiator:** Clinical/medical framing of skin analysis
- **Status:** Repository public

#### 4. 25f3001314-dev/skin-to-style — ⭐1
- **Concept:** AI-powered skin analysis + virtual try-on styling engine
- **Approach:** Skin analysis feeds into VTO styling recommendations
- **Tech:** YouCam APIs
- **Status:** Repository public

#### 5. sweety-HJH223/Draping — ⭐0
- **Concept:** AI-powered personal color analysis + outfit styling (Korean 퍼스널 컬러 ritual)
- **Approach:** Traditional Korean color consultation adapted to AI
- **Key differentiator:** Cultural specificity (Korean personal color analysis)
- **Status:** Repository public

#### 6. PranjaySrivastava/auratone-skin-vto — ⭐0
- **Concept:** Skin undertone analysis → color-harmonized fashion & beauty bundles
- **Approach:** YouCam Skin AI + Apparel VTO + RAG for product recommendations
- **Key differentiator:** Color theory + undertone matching for fashion coordination
- **Status:** Repository public

#### 7. vishnuvardhan49/glowfit — ⭐0
- **Concept:** Skin analysis + dated countdown plan + styled virtual try-on
- **Approach:** Time-based skin improvement tracking with coordinated fashion
- **Key differentiator:** Temporal dimension — "when to wear what" based on skin condition
- **Status:** Repository public

#### 8. abdulmalik-codeWithFaith/proof — ⭐0
- **Concept:** AI-powered fashion purchase-confidence platform
- **Approach:** VTO + AI reasoning layer for "should I buy this?" decision support
- **Key differentiator:** Decision confidence scoring around purchases
- **Status:** Repository public

#### 9. 0xConsole/skinsense-agent — ⭐0
- **Concept:** Autonomous AI Skincare & Fashion Assistant
- **Approach:** YouCam Skin AI + Apparel VTO orchestrated as agent
- **Key differentiator:** Agentic/autonomous workflow
- **Status:** Repository public

#### 10. Afaquejaya/glowfit-ai — ⭐0
- **Concept:** Skin AI + apparel try-on
- **Approach:** Basic combination of both APIs
- **Status:** Repository public

#### 11. devilking7x/nikhar — ⭐0
- **Concept:** YouCam-powered skin analysis + VTO studio (Hindi/English, PWA)
- **Key differentiator:** Indian language support, PWA deployment
- **Status:** Repository public

#### 12. arindewangan/glowcart — ⭐0
- **Concept:** AI Beauty Counter — selfie → skin analysis → matched products → AM/PM routine + VTO
- **Key differentiator:** Full e-commerce pipeline (analysis → product match → try-on)
- **Status:** Repository public

#### 13. fokrulanthro16-eng/dermatwin-os — ⭐0
- **Concept:** Autonomous Biometric Skin Engine + Clinical Contraindication Gatekeeper + Headless eCommerce Formulator
- **Tech:** YouCam API + DeepSeek-V4.1-Flash
- **Key differentiator:** Clinical gatekeeping, contraindication checking
- **Status:** Repository public

#### 14. bodycount82/fit-check — ⭐0
- **Concept:** Refusal-and-budget advisor for YouCam virtual try-on
- **Key differentiator:** Decision support (yes/no to wearing) + budget constraints
- **Status:** Repository public

#### 15. jlhpacheco/tryonready-retail-platform — ⭐0
- **Concept:** Virtual try-on for small boutiques with operating and trust layer
- **Key differentiator:** B2B angle — serving small retailers, not consumers
- **Status:** Repository public

## Market Gaps Identified

1. **No entry focuses on Indian festival/occasion wear** — massive market (weddings, festivals, Durga Puja, Diwali, Eid, Christmas parties)
2. **No entry does wardrobe digitization + outfit planning** — "what can I wear today" from your own closet
3. **No entry targets the "social proof" angle** — getting style advice from friends/community before buying
4. **No entry does occasion-based outfit intelligence** — "what should I wear to THIS specific event"
5. **No entry combines VTO with return-reduction analytics** — helping shoppers decide before purchase
6. **No entry uses seasonal/temporal dimension** — how outfits change across seasons/festivals
7. **No entry focuses on men's fashion VTO** — all entries are female-skewing
8. **No entry does group/family occasion dressing** — coordinating outfits for family events
9. **No entry combines skin analysis with fabric/texture suitability** — skin type → fabric recommendation → VTO
10. **No entry does price-aware styling** — outfit suggestions within a specific budget

## Commercial Products in Space (Non-Hackathon)

- **Google Fit** — fitness-focused, not fashion
- **Stitch Fix** — human stylists, no VTO
- **Vue.ai** — enterprise VTO for retailers (B2B)
- **Zeekit (Walmart)** — basic VTO, no skin integration
- **StyleDNA** — personal styling app, no VTO
- **TrueFit** — sizing recommendation, no VTO
- **Perfect Corp's own beauty apps** — consumer-facing, not hackathon-level innovation

## Key Insight

The winning formula appears to be: **YouCam API + AI reasoning layer (Gemini/Claude) + specific user problem + memorable demo moment**. The top entries all combine multiple APIs with an AI reasoning layer. Pure single-API entries are common but less likely to win.

---

*Last updated: 2026-10-15*
*Sources: GitHub API search, Devpost hackathon page, individual README analysis*
