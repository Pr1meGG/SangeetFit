# Glowstack design reference — 26 October 2026

Reference: https://glowstack.in/. Inspected the public home in an isolated Chromium browser at 1440×1000 and 390×844; no sign-in, lead form submission or account interaction. The Brave debugging endpoint was unavailable, so the isolated browser exposed a loopback CDP endpoint to REA.

## REA evidence

- `list_browser_targets`: selected the exact `https://glowstack.in` page (`ev_c47a8f10ffbb4a5bb8515933698d3f5481a87c71eca258cb7e230f26a45271aa`).
- `inspect_web_page`: observed 1,838 DOM nodes, accessibility hierarchy, same-origin resource metadata and navigation URLs (`ev_7857f34227ac37442922b8af30d976c4bc6630a6481536f0f5a99899fd908cde`).
- `capture_web_screenshot`: observed the desktop viewport (`ev_3da9be0ffd949432246a7a3510670f0405434ce2f1582e64b3e95d924271d604`), PNG SHA-256 `5202312b3aae3b84ae5054a6f694dabf259d06fb1e10eb800e64e0c25e39d905`.
- `analyze_web_bundle`: one captured application module, `/main.js`, 8,589 UTF-8 bytes, SHA-256 `6de00754b4b3e3cd8a22fcc9094a04abfc5b267189b1917c2fbff9c69ff860ac`; no import graph edges or source maps fetched (`ev_0a227e40ed6baaf356e8f16ef91a8ebab4fb77b79edc31a01e4c5d8ee7ac7457`). The low-confidence `data.get(...)` endpoint candidates are form-field names, not verified endpoints. Static analysis is not evidence of runtime execution.

REA cannot reveal private server logic from this page. Its observation begins at attachment, so earlier network activity is absent. External font resources were outside the same-origin capture. Browser-computed styles and public module text were inspected separately through the isolated Playwright browser to explain the visual and motion patterns. No captured application source was executed independently or copied into SangeetFit.

## Structure and polish

| Layer | Observed implementation/pattern | SangeetFit adaptation |
|---|---|---|
| Header | Sticky wrapper; 1120px rounded pill; translucent plum surface and fine gold border; product links and primary CTA. Phone uses a second topical navigation row rather than a hamburger. | A pill navbar with wardrobe, collection, shortlist, walkthrough and FAQ access; plan CTA. Accessible phone disclosure suits SangeetFit's longer action labels and preserves the existing bottom navigation. |
| Hero | Dark plum backdrop, restrained warm radial glow, split copy/product preview. Instrument Serif display, Manrope body; italic gold emphasis and two action weights. | Existing local Bodoni display, original two-line heading, gold emphasis, existing AI concept images in staggered arch frames. Keep a real planning action first. |
| Capability strip | Compact inline facts under the hero. | Own wardrobe, virtual try-on, shortlist and five-event planning, with installed Lucide icons. |
| Feature hierarchy | Audience cards, AI section, alternating feature tours with videos, numbered three-step explanation. | Occasion selection, four functional feature shortcuts, three-step explanation; connect to already implemented tools. No unrelated salon billing or booking product. |
| Supporting content | Dark benefit/pricing sections, FAQ, final CTA, lead form and footer. 17 native `details` disclosures. | Six native FAQs grounded in actual session/privacy/try-on behavior, planning CTA and footer. No invented pricing, lead collection or testimonials. |
| Motion | Anchor scroll, intersection-based reveal and video playback/pause, reduced-motion branches and posters. | Existing entry/hover transitions and reduced-motion support. No decorative video dependency or scroll-hiding content. |

The home uses normal HTML sections plus a small module and stylesheet; no framework was established from this bounded capture. Computed hero colours were RGB(23,17,28) and RGB(247,242,236), with a warm accent. These are observations about the reference, not a requirement to duplicate its values.

## Asset and behavior boundaries

SangeetFit reuses its current mark, local font, Lucide package and original AI outfit references. No Glowstack images, video, logo, source code, font files, wording or claims were imported. The implementation leaves consent, explicit Generate, mock/live labels, private-session clearing, comparison and PDF behavior in their existing owners.

This is a design and frontend-structure study. It does not claim to reproduce Glowstack's private application, verify its service claims, or establish complete source equivalence.
