# Concept Evaluation & Ranking

## Scoring Method

- **Official Score** = average of 4 judging dimensions (0–10 each, equal weight)
- **Supplementary Score** = average of 5 supplementary dimensions (0–10 each)
- Ranked by Official Score, then Supplementary Score as tiebreaker

---

## Concept Scores

### 1. FestiWear — Festival Outfit Planner
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 8 | Multi-step pipeline: closet upload → occasion selection → VTO → family sharing. Non-trivial architecture. |
| Design | 8 | Rich UI with calendar, closet grid, family sharing. Complete product experience. |
| Potential Impact | 9 | Solves real pain for 100M+ Indian women during wedding season. High frequency of use. |
| Quality of Idea | 9 | Culturally specific, multi-API orchestration, social coordination — goes beyond generic VTO |
| **Official Average** | **8.5** | |
| Differentiation | 9 | No other entry targets Indian festival planning |
| Problem Evidence | 9 | Strong: outfit anxiety is well-documented, high search volume |
| Demo Reliability | 8 | VTO works reliably; family sharing is a simple UI feature |
| Implementation Feasibility | 7 | Closet digitization needs image processing; 3 weeks is tight but doable with AI agents |
| Budget Risk | 6 | ~14 units/session × ~20 demo runs = 280 units. OK, but could burn through 1,000 if overused. |
| **Supplementary Average** | **7.8** | |

### 2. ReturnGuard — Pre-Purchase Confidence Score
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 8 | URL input → garment extraction → VTO → confidence scoring. Solid pipeline. |
| Design | 7 | Score-based UI is clean but less visually impressive than others |
| Potential Impact | 9 | Addresses $100B return problem directly. Retailers would pay for this. |
| Quality of Idea | 8 | Novel metric (confidence score) makes abstract problem tangible |
| **Official Average** | **8.0** | |
| Differentiation | 8 | Only entry focused on returns/reduction |
| Problem Evidence | 9 | 30-40% return rates in India — massive, measurable problem |
| Demo Reliability | 8 | Single VTO call per product — very reliable |
| Implementation Feasibility | 8 | Simpler architecture than FestiWear. No closet management. |
| Budget Risk | 8 | ~2 units/session. Very low cost. |
| **Supplementary Average** | **7.8** | |

### 3. MenStyle AI — Men's Fashion VTO
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 7 | Standard VTO pipeline. Less complex than multi-API entries. |
| Design | 7 | Clean, focused UI. Men's fashion aesthetic is underexplored. |
| Potential Impact | 7 | Growing market but smaller than women's fashion in India |
| Quality of Idea | 7 | Underserved segment is a valid angle, but execution is standard |
| **Official Average** | **7.0** | |
| Differentiation | 8 | Only men-focused entry |
| Problem Evidence | 7 | Growing segment but less documented pain |
| Demo Reliability | 9 | Simplest architecture — most reliable demo |
| Implementation Feasibility | 9 | Easiest to build in 3 weeks. Minimal dependencies. |
| Budget Risk | 9 | Low unit cost, simple flow |
| **Supplementary Average** | **8.0** | |

### 4. SkinMatch — Outfit-to-Skin Compatibility
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 8 | Two API calls + cross-domain reasoning. Elegant integration. |
| Design | 7 | Educational UI with color palette display. Good but not flashy. |
| Potential Impact | 7 | Niche audience (women with skin concerns) |
| Quality of Idea | 9 | Brilliant bridge between two YouCam domains. Judges love domain-crossing. |
| **Official Average** | **8.0** | |
| Differentiation | 8 | Only entry connecting skin analysis to fashion choices |
| Problem Evidence | 7 | Real but narrower audience |
| Demo Reliability | 7 | Two async API calls in sequence — more failure points |
| Implementation Feasibility | 7 | Requires careful handling of two async pipelines |
| Budget Risk | 5 | 14 units/session — burns 7% of allocation per demo |
| **Supplementary Average** | **6.8** | |

### 5. BoutiqueAI — VTO for Small Retailers
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 8 | Two interfaces: merchant dashboard + customer try-on. Multi-actor design. |
| Design | 7 | Dashboard UI is complex. May look overwhelming in demo. |
| Potential Impact | 8 | B2B angle with clear revenue model. Judges appreciate business thinking. |
| Quality of Idea | 7 | Practical but less "wow" factor than consumer-facing ideas |
| **Official Average** | **7.5** | |
| Differentiation | 8 | Only B2B entry |
| Problem Evidence | 8 | 63M MSMEs in India — huge addressable market |
| Demo Reliability | 6 | Two personas to demo simultaneously — harder to execute cleanly |
| Implementation Feasibility | 5 | Merchant dashboard + customer flow = double the work |
| Budget Risk | 6 | Multiple VTO calls per merchant session |
| **Supplementary Average** | **6.6** | |

### 6. FamilyLook — Group Outfit Coordinator
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 7 | Multi-person VTO is technically straightforward but UI-heavy |
| Design | 8 | Beautiful shared mood board is a strong demo visual |
| Potential Impact | 7 | Universally relatable but harder to quantify impact |
| Quality of Idea | 8 | Social coordination angle is unique and culturally rich |
| **Official Average** | **7.5** | |
| Differentiation | 8 | No other entry does group coordination |
| Problem Evidence | 8 | Wedding/festival coordination is a real pain |
| Demo Reliability | 7 | Multiple VTO calls — okay reliability |
| Implementation Feasibility | 6 | Multi-user state management adds complexity |
| Budget Risk | 5 | N × 2 units per session — scales poorly |
| **Supplementary Average** | **7.2** | |

### 7. ClosetRevive — Rediscover Your Wardrobe
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 7 | Closet digitization + VTO + daily suggestions. Moderate complexity. |
| Design | 7 | Calendar-based UI, daily card format. Familiar pattern. |
| Potential Impact | 6 | Sustainable fashion is a trend but lower urgency |
| Quality of Idea | 7 | Fresh angle but execution is similar to existing closet apps |
| **Official Average** | **7.0** | |
| Differentiation | 7 | VTO integration is novel for closet apps |
| Problem Evidence | 6 | "Capsule wardrobe" movement is real but niche |
| Demo Reliability | 7 | Simpler than FestiWear (no family feature) |
| Implementation Feasibility | 7 | Closet digitization is the hard part |
| Budget Risk | 7 | Moderate unit usage |
| **Supplementary Average** | **7.0** | |

### 8. SkinStyle Report — Holistic Daily Briefing
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 7 | Two APIs + AI briefing generation. Clean pipeline. |
| Design | 7 | "Daily brief" format is elegant and familiar |
| Potential Impact | 6 | Daily-use app is great but narrower audience |
| Quality of Idea | 8 | "Good morning, here's your skin + style briefing" is memorable |
| **Official Average** | **7.0** | |
| Differentiation | 7 | Briefing format is novel for this space |
| Problem Evidence | 6 | People want daily routines but this is a "nice to have" |
| Demo Reliability | 7 | Two sequential API calls — acceptable |
| Implementation Feasibility | 7 | Moderate complexity, well-scoped |
| Budget Risk | 5 | 14 units/session — burns allocation fast |
| **Supplementary Average** | **6.6** | |

### 9. Virtual Stylist Chat — Conversational VTO
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 7 | Chat interface + VTO + reasoning. Chat adds complexity. |
| Design | 7 | Conversational UI is engaging and modern |
| Potential Impact | 6 | Chat interfaces have high drop-off without clear value |
| Quality of Idea | 7 | Explaining reasoning is valuable but chat is overdone |
| **Official Average** | **7.0** | |
| Differentiation | 6 | Chat UIs are common in hackathons |
| Problem Evidence | 6 | People want advice but chat fatigue is real |
| Demo Reliability | 6 | Chat + VTO = more failure points |
| Implementation Feasibility | 6 | Chat UI + VTO integration is moderate complexity |
| Budget Risk | 7 | Moderate cost |
| **Supplementary Average** | **6.6** | |

### 10. TryBefore — AR Mirror for In-Store Shopping
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 6 | Camera-based real-time VTO is technically challenging |
| Design | 7 | AR overlay UI is visually impressive |
| Potential Impact | 6 | Useful but narrower use case (in-store only) |
| Quality of Idea | 7 | Clever real-world application |
| **Official Average** | **6.8** | |
| Differentiation | 7 | Only entry targeting physical retail |
| Problem Evidence | 6 | Useful but less acute than online returns |
| Demo Reliability | 5 | Camera + real-time VTO is the hardest to demo reliably |
| Implementation Feasibility | 4 | Real-time camera VTO in 3 weeks is risky |
| Budget Risk | 7 | Per-session cost is manageable |
| **Supplementary Average** | **6.0** | |

### 11. PriceStyle — Budget-Aware Style Assistant
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 6 | Price comparison + VTO. Moderate pipeline. |
| Design | 6 | Price-tier comparison UI is functional but plain |
| Potential Impact | 7 | Budget-conscious shoppers are a large segment |
| Quality of Idea | 6 | Practical but not particularly creative |
| **Official Average** | **6.3** | |
| Differentiation | 6 | Price angle is underexplored but not unique enough |
| Problem Evidence | 7 | Price sensitivity is well-documented |
| Demo Reliability | 7 | Straightforward VTO flow |
| Implementation Feasibility | 6 | Price comparison requires external data |
| Budget Risk | 8 | Low cost per session |
| **Supplementary Average** | **6.8** | |

### 12. LookMatch — Date/Occasion Outfit Finder
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Technological Implementation | 6 | Simple VTO with occasion metadata. Basic pipeline. |
| Design | 6 | Occasion picker + VTO results. Functional. |
| Potential Impact | 6 | Universally relatable but narrow scope |
| Quality of Idea | 6 | Solid but similar to existing styling apps |
| **Official Average** | **6.0** | |
| Differentiation | 5 | Occasion-based filtering is common |
| Problem Evidence | 7 | Everyone has had this problem |
| Demo Reliability | 9 | Very reliable — single API call |
| Implementation Feasibility | 9 | Simplest architecture of all concepts |
| Budget Risk | 9 | Very low cost |
| **Supplementary Average** | **7.4** | |

---

## Final Rankings

| Rank | Concept | Official Score | Supplementary | Net |
|------|---------|---------------|---------------|-----|
| 1 | **FestiWear** | 8.5 | 7.8 | **8.15** |
| 2 | **ReturnGuard** | 8.0 | 7.8 | **7.9** |
| 3 | SkinMatch | 8.0 | 6.8 | 7.4 |
| 4 | MenStyle AI | 7.0 | 8.0 | 7.5 |
| 5 | FamilyLook | 7.5 | 7.2 | 7.35 |
| 6 | BoutiqueAI | 7.5 | 6.6 | 7.05 |
| 7 | ClosetRevive | 7.0 | 7.0 | 7.0 |
| 8 | SkinStyle Report | 7.0 | 6.6 | 6.8 |
| 9 | Virtual Stylist Chat | 7.0 | 6.6 | 6.8 |
| 10 | TryBefore | 6.8 | 6.0 | 6.4 |
| 11 | PriceStyle | 6.3 | 6.8 | 6.55 |
| 12 | LookMatch | 6.0 | 7.4 | 6.7 |

**Top 3 for Red-Teaming:** FestiWear, ReturnGuard, SkinMatch

---

*Last updated: 2026-10-15*
