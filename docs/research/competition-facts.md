# Competition Facts — YouCam API Hackathon 2026

## Verified Facts (from official sources)

### Event Details
- **Title:** YouCam API Skin AI & eCommerce VTO Hackathon
- **Organizer:** Perfect Corp (YouCam)
- **Deadline:** November 2, 2026, 11:45 AM EST
- **Judging Period:** Nov 3–20, 2026
- **Winners Announced:** On or around Nov 24, 2026
- **Participants:** 918+
- **Prize Pool:** $6,000 total ($2,500 / $1,000 / $500)
- **Special Awards:** $1,000 Women in Tech; $1,000 Rising Star (Student)
- **Free API Allocation:** 1,000 units per participant + social sharing bonus

### Tracks
1. **Skin AI** — skin analysis, skincare guidance, product matching
2. **eCommerce VTO** — virtual try-on, styling, fashion e-commerce

### Judging Dimensions (equal weight, 0–10 each)
1. **Technological Implementation** — depth of API integration, consumer/retail value, genuine non-trivial implementation
2. **Design** — complete coherent product experience (not just a PoC)
3. **Potential Impact** — credible case for solving a real problem for a real audience
4. **Quality of Idea** — creative, non-obvious use of YouCam API; genuine problem-space understanding

### Requirements
- Functional web or mobile prototype with ≥1 YouCam API
- Clear consumer or eCommerce value
- Fresh, unexpected solutions — **not surface-level wrappers**
- Intuitive enough for first-time users to grasp value instantly
- Public (or shared) repository with source code + instructions
- Text description of features and consumer value
- Screenshots
- 1–3 min demo video (YouTube/Vimeo link required)
- Must explain which YouCam API(s) were used

### Rules (Key Points)
- Solo or team entries allowed
- Can build on existing projects if significantly updated during submission period
- Third-party SDKs/APIs must be properly authorized
- Winners may be featured in blog articles and marketing

### YouCam API — Verified Endpoints & Costs

Source: https://yce.makeupar.com/ai-api + verified from winning project (aloud, anywear)

| Endpoint | Purpose | Units/Call | Model |
|----------|---------|------------|-------|
| `POST /s2s/v2.0/file` + presigned PUT | File upload | ~1 unit/file | — |
| `POST /s2s/v2.0/task/skin-analysis` | 7-concern skin analysis + skin type/age | 12 units | async |
| `POST /s2s/v2.0/task/cloth-v4` | Apparel virtual try-on | 2 units | async |
| `GET /s2s/v1.0/client/credit` | Check remaining units | — | sync |
| `POST /s2s/v1.0/client/auth` | Authentication (RSA token) | — | sync |

**Auth flow:** POST with RSA-encrypted id_token → receive bearer token → use for all subsequent calls.

**Processing model:** All major APIs are async task-based. Submit task → poll status → retrieve result.

### India-Specific Resources
- Separate sign-up path available for India region
- Local payment/shipping support for e-commerce integrations

## Assumptions (Unverified)

- [ ] Exact unit cost per additional skin-analysis parameter set
- [ ] Whether mock-mode results are acceptable for demo video (likely yes — aloud used live API)
- [ ] Maximum concurrent API requests / rate limits
- [ ] Whether 1,000 units is sufficient for a full demo with multiple users
- [ ] Exact API response schema for cloth-v4 output format
- [ ] Availability of India-region API endpoints (same base URL or separate)

---

*Last updated: 2026-10-15*
*Sources: devpost.com rules page, github.com/uiharu-kazari/anywear README, github.com/StephenSook/aloud README*
