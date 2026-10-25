---
name: youcam-hackathon-ideation
description: Identify, research, rank and red-team product concepts for the YouCam API Skin AI & eCommerce VTO Hackathon. Use when selecting a hackathon concept, evaluating ideas, or preparing a competition entry.
---

# YouCam Hackathon Ideation Workflow

Identify, research, rank and red-team product concepts for maximum competitive advantage in the YouCam API Skin AI & eCommerce VTO Hackathon.

## Competition Facts (Verified)

**Source:** https://youcam-api-skin-ai-ecommerce.devpost.com/

| Item | Value |
|------|-------|
| Title | YouCam API Skin AI & eCommerce VTO Hackathon |
| Organizer | Perfect Corp (YouCam) |
| Deadline | **November 2, 2026, 11:45 AM EST** |
| Participants | 918+ (as of Oct 15, 2026) |
| Prize Pool | $6,000 total ($2,500 / $1,000 / $500) |
| Special Awards | $1,000 Women in Tech; $1,000 Rising Star (Student) |
| Free Allocation | 1,000 API units per participant |
| Track | Two tracks: **Skin AI** and **eCommerce VTO** |

**Judging Dimensions (equal weight):**
1. **Technological Implementation** — depth of YouCam API integration, consumer/retail value, genuine non-trivial implementation
2. **Design** — complete coherent product experience (not just a PoC)
3. **Potential Impact** — credible case for solving a real problem for a real audience
4. **Quality of Idea** — creative, non-obvious use of YouCam API; genuine understanding of the problem space

**Requirements:**
- Integrate at least one YouCam API into a functional web or mobile prototype
- Deliver clear consumer or retail value
- Fresh, unexpected solutions — **not surface-level wrappers**
- Intuitive enough that a first-time user grasps value instantly
- Repository must contain source code + instructions for functionality
- Text description explaining features and consumer value
- Screenshots included
- 1–3 minute demo video showing end-to-end experience on the built device
- YouTube/Vimeo link on submission form

**Constraints:**
- Solo builder in India
- Beginner-level coding; AI agents handle implementation
- ~4–6 hrs/day, ~3 weeks until deadline
- Max out-of-pocket budget: ₹500
- Existing stack: Next.js 14, TypeScript, Tailwind CSS
- Existing code: VTO route at `src/app/api/vto/route.ts`, mock mode supported
- Goal: Maximize comparative likelihood of winning a cash prize

---

## Mandatory Ideation Workflow

### Stage A — Understand the Competition

Read the official rules page and note:
- All judging criteria with exact wording
- Required submission artifacts
- Any rules about team size, tech stack, or IP
- Whether mock-mode is acceptable for demo purposes

Fetch the API documentation at https://yce.makeupar.com/ai-api and catalog every available endpoint with:
- Endpoint name and purpose
- Input parameters
- Output shape
- Approximate unit cost (check pricing page)
- Known limitations

Record verified facts separately from assumptions in `docs/research/competition-facts.md`.

**Verify before relying on any detail.** Do not assume pricing, endpoint availability, or restrictions without checking.

### Stage B — Research the Landscape

Use web search and browser tools to find:
1. Existing commercial products solving similar problems
2. Other Devpost hackathon submissions (search GitHub for "youcam hackathon")
3. Credible user-problem evidence (forums, Reddit, product reviews)
4. Competing API providers in the beauty/fashion tech space

Key competitors from this hackathon to investigate:
- `StephenSook/aloud` — 1st place winner: voice-first skincare for blind shoppers, WebRTC + YouCam Skin Analysis
- `liutingqiu/youcam-ai-agent-vto` — 14-parameter clinical skin diagnostic engine
- `25f3001314-dev/skin-to-style` — skin analysis + virtual try-on styling engine
- `sweety-HJH223/Draping` — personal color analysis + outfit styling (Korean personal color ritual)
- `PranjaySrivastava/auratone-skin-vto` — skin undertone analysis + color-harmonized fashion bundles
- `vishnuvardhan49/glowfit` — dated countdown plan + styled virtual try-on
- `abdulmalik-codeWithFaith/proof` — AI decision layer around try-on results
- `0xConsole/skinsense-agent` — autonomous AI skincare & fashion assistant
- `uicharu-kazari/anywear` — screenshot any look, see it on you, styled for your skin today
- `Abhinav0905/shadespan` — catalog inclusivity audits for fashion e-commerce

Never equate a lack of search results with proof of originality.

### Stage C — Discover Opportunities

Before naming products, identify specific user problems. For each:
- Who is affected? (specific persona, not "everyone")
- What is the situation? (context, trigger, frequency)
- What is the current workaround? (painful, expensive, time-consuming)
- Why do existing solutions fail? (gaps, limitations, wrong approach)
- What evidence shows this problem matters? (search results, forum posts, reviews)

Explore meaningfully different audiences and workflows across:
- Skincare (analysis, routines, product matching, progress tracking)
- Beauty (makeup try-on, color consultation, occasion prep)
- Fashion (VTO, styling, fit advice, wardrobe management)
- Jewelry (accessories matching, occasion coordination)
- E-commerce (conversion, returns reduction, personalization)

### Stage D — Generate Divergent Concepts

Produce **at least 12 materially different product concepts**. Each must have:
- A distinct problem statement
- A different user workflow
- A unique value proposition
- A specific YouCam API combination

Avoid superficial variations of: generic skin scanners, basic product recommenders, simple VTO storefronts.

Non-obvious directions to explore:
- Accessibility-first solutions (like the 1st place winner)
- Cultural specificity (Indian festival wear, local fashion contexts)
- Temporal/dimensional thinking (progress over time, seasonality)
- Multi-API orchestration (skin analysis → recommendation → VTO pipeline)
- Social/communal features (sharing, consulting, gifting)
- Decision support (not just display — advice, reasoning, confidence scores)

### Stage E — Verify Technical Feasibility

Map each shortlisted idea to actual YouCam capabilities:

For each concept, document:
- Which YouCam endpoints are required
- Authentication flow (Bearer token, API key)
- Processing model (synchronous vs. async task polling)
- Estimated unit cost per user session
- Known limitations (processing time, input constraints, error cases)
- Mock-mode viability for demo purposes

**Never invent API capabilities.** If a feature requires an endpoint that doesn't exist, note it as a blocker.

Test the highest-risk technical assumption before committing to implementation.

### Stage F — Evaluate and Rank

Score every viable concept on the **four official judging dimensions** (0–10 each):

| Dimension | What matters |
|-----------|-------------|
| Technological Implementation | Depth of API integration, non-trivial architecture, working prototype |
| Design | Complete product experience, intuitive UX, visual polish |
| Potential Impact | Real problem, real audience, credible value proposition |
| Quality of Idea | Creative, non-obvious, demonstrates problem-space understanding |

Also score supplementary dimensions:
- Differentiation (how unlike existing entries?)
- Problem evidence (how strong is the user need?)
- Demo reliability (can it work live on a judge's device?)
- Implementation feasibility (can a solo beginner ship this in 3 weeks?)
- Budget risk (will 1,000 API units be enough?)

Calculate:
- **Official Score** = average of the 4 judging dimensions
- **Supplementary Score** = average of the 5 supplementary dimensions

**Do not fabricate numerical winning probabilities.** Present scores with rationale.

### Stage G — Red-Team the Top 3

For each top concept, search specifically for:
- Direct competitors (other hackathon entries, commercial products)
- Existing equivalent functionality
- Unsupported product claims
- API limitations that would break the concept
- Weak demand signals
- Execution risks (complexity, timeline, dependencies)

Be willing to reject an initially attractive idea.

### Stage H — Recommend One Winner

Deliver a decisive recommendation with:
1. **Winner** — the single best concept
2. **Evidence-backed rationale** — why it wins on the rubric
3. **Strongest alternative** — the runner-up and why it lost
4. **Unresolved assumptions** — what you don't know yet
5. **Early kill criteria** — what would make you pivot before building
6. **First validation tests** — the minimum experiments to de-risk the concept

Save all research to `docs/research/` as persistent Markdown files.

---

## Behaviour Rules

- Make reasonable assumptions when sufficient context already exists.
- Do not ask repetitive clarification questions.
- Browse whenever current competition facts or API details need verification.
- Distinguish evidence, inference, and speculation clearly.
- Never select an idea solely because it sounds futuristic or uses multiple APIs.
- Optimize for a **differentiated working product and memorable demo**, not feature count.
- Persist major research findings, source links, and the final recommendation to Markdown files in `docs/research/`.
- Avoid overwriting existing project documents (`docs/research/hackathon-recommendation.md` and the retired `docs/archive/2026-10-demo-script-vto-legacy.md`).
- **Do not generate implementation code during ideation.** This skill stops at recommendation.

---

## After Ideation

When a concept is selected:
1. Invoke `writing-plans` to create an implementation plan
2. Invoke `product-discovery` to validate the problem and map assumptions
3. Invoke `systematic-debugging` when building hits errors
4. Invoke `verification-before-completion` before claiming anything is done
