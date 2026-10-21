# SangeetFit — Pitch and release checklist

Updated 21 October 2026. Unchecked gates are pending, not achieved. The approved [milestones](../plans/2026-10-20-personal-stylist-milestones.md) supersede earlier colour-harmony/mandatory-selfie pitches.

## Consumer value and integration

**Pitch:** Choose what to wear for a celebration from clothes you already own, see two personal try-ons, compare them and save your choice. Permitted references are optional inspiration.

The core combines user-confirmed occasion/style/colour metadata with a personal YouCam Cloth V4 preview. It uses a separate full-body source and garment reference, with upload → task → polling. Optional skin-tone analysis uses a separate face selfie. Neither metadata ranking nor skin analysis proves fit, facial preservation or colour suitability.

The collection defaults to 26 original AI-generated model/outfit concepts, with five women's and five men's choices under each of five occasion filters; suitable looks can appear in more than one occasion. Fourteen credited sourced photos remain in the archive, eight wired as candidate references, alongside four legacy mappings. Browsing needs no person photo, but personal VTO does. No candidate has been promoted to live-reviewed primary recommendations. No exact seller products or retailer image permissions have been established. **View at seller** appears only for verified exact products; there is no checkout.

Historical approved Cloth V4 successes cover one sample-person/maroon-lehenga pair. They prove limited pipeline operation, not own-garment reliability or broadly retained identity. The planned one-person, 16-reference engineering sweep has no outcomes. Mock references must be explicitly identified in screenshots and video. The wardrobe stays in the page session; top-and-bottom combinations are future work.

## Core release gate

- [x] Record the 21 October balance/pricing snapshot: 916 units; V4 2/call; optional colour analysis 20/call; reserve 229. Recheck before spending; no live batch approved.
- [ ] With one consenting person's full-body photo, approve and run exactly two live reference tasks: Emerald Silk Kurta and Sapphire Embroidered Sherwani. Review both for rendered output, identity and garment fidelity ≥4/5 before expansion. No separate selfie/skin task.
- [ ] If the pilot is usable, separately approve the remaining 14 distinct men's references. Keep all 16 predeclared outcomes, including failures. Engineering targets: ≥15/16 rendered and identity ≥4/5; ≥13/16 garment and both ≥4/5; median successful render ≤60s; zero duplicate tasks. Recheck price and preserve the 25% credit reserve.
- [ ] Label the sweep as one person's engineering evidence. Independent usability and uploaded-own-garment quality remain unverified; make no five-user or broad reliability claim.
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
- [ ] Final screenshots: occasion home and photo-free model-led collection; own-garment photo/metadata; explained recommendation; explicit Generate/photo consent; actual live result if approved; two-look comparison; chosen/saved look. Label concepts and any mock segment.
- [ ] Keep the participant's name, photo and generated result out of GitHub and the public demo; use a separately permitted demo image.
- [ ] Genuine 1–3 minute end-to-end video following [DEMO_SCRIPT](DEMO_SCRIPT.md), showing the intended device and APIs used.
- [ ] Publish video and submit only with the user's separate approval; add final video URL to README/Devpost.
- [ ] Document significant improvements during the hackathon if applicable.
- [ ] Keep working access and credit contingency through the judging period; verify official end date.

Working schedule: 30–31 October freeze, 1 November submission, 2 November buffer; current roadmap assumes judging availability through 20 November. No external submission, video publication or deployment is authorized by this checklist.
