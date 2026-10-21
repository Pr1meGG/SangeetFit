# SangeetFit — Pitch and release checklist

Updated 21 October 2026. Unchecked gates are pending, not achieved. The approved [milestones](../plans/2026-10-20-personal-stylist-milestones.md) supersede earlier colour-harmony/mandatory-selfie pitches.

## Consumer value and integration

**Pitch:** Choose what to wear for a celebration from clothes you already own, see two personal try-ons, compare them and save your choice. Permitted references are optional inspiration.

The core combines user-confirmed occasion/style/colour metadata with a personal YouCam Cloth V4 preview. It uses a separate full-body source and garment reference, with upload → task → polling. Optional skin-tone analysis uses a separate face selfie. Neither metadata ranking nor skin analysis proves fit, facial preservation or colour suitability.

Current collection has 14 credited photographs and eight new wired candidates, with four legacy mappings. No candidate has been promoted to live-reviewed primary recommendations. No exact seller products or retailer image permissions have been established. **View at seller** appears only for verified exact products; there is no checkout.

Historical approved Cloth V4 successes cover one sample-person/maroon-lehenga pair. They prove limited pipeline operation, not own-garment reliability or broadly retained identity. The planned twelve-case benchmark has no outcomes. Mock references must be explicitly identified in screenshots and video. The wardrobe stays in the page session; top-and-bottom combinations are future work.

## Core release gate

- [x] Record the 21 October balance/pricing snapshot: 916 units; V4 2/call; optional colour analysis 20/call; reserve 229. Recheck before spending; no live batch approved.
- [ ] Approve and run the six-task pilot: two people, each with an owned upper-body garment, owned full outfit and permitted reference; ≥5/6 rendered with identity and garment both ≥4/5 or restrict inputs before expansion.
- [ ] Complete the fixed twelve-case quality benchmark across five consenting people: eight owned and four permitted-reference attempts, at least two looks each. Reuse the pilot cases; keep failures. Gates: ≥11/12 rendered and identity ≥4/5; ≥10/12 garment and both ≥4/5; median successful render ≤60s; zero duplicate tasks.
- [ ] Observe ≥4/5 independent completion and recommendation understanding/choice; keep usability evidence separate from image ratings.
- [ ] Select only references with established image rights, exact identity and recorded visual output review for primary recommendations. Two accurate permitted alternatives suffice for the demo; twelve active references are a stretch target.
- [ ] Fresh offline suites, TypeScript, lint, mock production build and browser checks pass on final source.
- [ ] Confirm no horizontal overflow, ≥44px key controls and keyboard dialog flow.
- [ ] Test actual Android Chrome and iPhone Safari; label unavailable coverage honestly.
- [ ] Verify image save/open, expired links, source replacement and zero-task comparison/reopening.
- [ ] If seller actions exist, recheck every exact item and image permission; otherwise leave absent.
- [ ] Verify judge access, API budget protections and availability without relying on a developer's authenticated browser.
- [ ] Freeze features before recording final assets.

## Submission package

Recheck the [official rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and submission form for the current requirements, exact recipient for private repository sharing, deadline/timezone, video visibility and judging access. Earlier rule notes are historical; do not infer access from a working localhost URL.

- [ ] Repository URL with all source/assets/setup instructions; public with appropriate licensing or explicitly shared as the official rules specify.
- [ ] Settle the application code licence before public distribution; README no longer claims MIT without a LICENSE file.
- [ ] Working testable app URL/build and any necessary judge instructions/credentials through an appropriate private channel.
- [ ] Finalize the [English description draft](DEVPOST_DRAFT.md) with actual evidence, consumer value, YouCam integrations and honest limitations.
- [ ] Final screenshots: occasion home; own-garment photo/metadata; explained recommendation; explicit Generate/photo consent; actual live result if approved; two-look comparison; chosen/saved look. Label any mock segment.
- [ ] Genuine 1–3 minute end-to-end video following [DEMO_SCRIPT](DEMO_SCRIPT.md), showing the intended device and APIs used.
- [ ] Publish video and submit only with the user's separate approval; add final video URL to README/Devpost.
- [ ] Document significant improvements during the hackathon if applicable.
- [ ] Keep working access and credit contingency through the judging period; verify official end date.

Working schedule: 30–31 October freeze, 1 November submission, 2 November buffer; current roadmap assumes judging availability through 20 November. No external submission, video publication or deployment is authorized by this checklist.
