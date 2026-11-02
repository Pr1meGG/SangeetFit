# SangeetFit — Devpost description draft

Updated 2 November 2026 after wedding planning/PDF were archived. **Draft — not published or submitted.** Paste the section under "Devpost text" only after the final build, video and every [CONFIRM] item are settled and the exact text is approved.

---

## Devpost text

**Tagline:** Explore Indian wedding looks, preview an outfit on your photo, and choose what to wear.

**For:** a guest choosing what to wear to an Indian wedding celebration.

**Built with:** the YouCam AI Clothes Virtual Try-On API (Cloth V4).

### Inspiration

An Indian wedding is rarely one event. Sangeet, Mehendi, Haldi, the wedding and the reception can fall in a single week, and each one asks "what am I wearing?" The usual answer is a group chat full of photos and a shopping trip. We started from a different question: *what can I wear from the clothes I already own?*

### What it does

1. **Find a look for the occasion.** Explore Sangeet, Mehendi, Haldi, Wedding and Reception styles, and keep favourites in a session shortlist.
2. **Add the clothes you own.** Photograph a garment and confirm its name, type, colour, style and occasions. Adding clothes never starts an AI task.
3. **Preview a look on your photo.** Add a full-body photo, accept the photo notice and press **Generate try-on**. YouCam Cloth V4 renders the garment on you, with an original/result slider.
4. **Compare and keep a result.** Compare two recent session results, inspect the originals, zoom and save/open an image.
5. **Browse for inspiration without a photo.** A collection of 26 original AI-generated outfit concepts, each labelled as inspiration or as tested on a real photo.

### How we use the YouCam API

SangeetFit uses Cloth V4 as a visual decision tool for Indian wedding outfits. Users can explore occasion-based ideas or add a garment they own, then explicitly request a preview when they want to see a look on their photo.

Under the hood, the browser shrinks the photos, our server validates them, uploads the person and garment through the YouCam File API, submits a `cloth-v4` task, and polls with back-off until the render is ready. In our three recorded live runs, Generate-to-render took 16 to 26 seconds. See the [architecture note](https://github.com/Pr1meGG/SangeetFit/blob/codex/redesign-v2/docs/submission/ARCHITECTURE.md).

### How we built it

Next.js 16, React 19 and TypeScript on Vercel, with a small Redis store for the shared try-on allowance and private result saving. The server reserves allowance *before* any photo is uploaded, a 429 stops without automatic retries, and a missing API key fails closed instead of showing a fake result.

### Challenges

- **Keeping the AI honest.** A mock image must never look like a personal result, so every result carries a visible live-or-mock label, and live mode never falls back to mock.
- **Async rendering inside serverless limits.** Uploads, task submission and polling share one request deadline, with polling that starts fast and backs off.
- **Privacy by default.** Photos are sent only after an explicit notice and a Generate click, and saved results expire after 24 hours.

### Accomplishments

- A focused browse/add clothes → explicit preview → compare/save interface.
- Clearly separated concept imagery, mock references and genuine live YouCam results.

### What we learned

Virtual try-on is most valuable at the moment of indecision, not at the moment of purchase. Trust comes from labelling clearly what is generated and what isn't.

### Built vs next

| Built and shown | Next |
|---|---|
| Occasion-based browsing and session shortlist | Separate top and bottom combinations |
| Add your own clothes | A permanent saved wardrobe |
| Cloth V4 try-on with original/result slider | Optional checkout for a missing piece |
| Session result comparison, zoom and save/open | |
| Private 24-hour result saving | |

### FAQ

**Who is it for?** A guest at a multi-event Indian wedding who would rather rewear what they own than buy a new outfit for every event.

**Why YouCam Cloth V4?** It takes a person photo plus a single garment or full-outfit reference, so it works with a photo of clothes you own, not only catalogue items.

**What happens to my photos?** Nothing is sent anywhere until you accept the photo notice and press Generate. In live mode, your photo and the garment go to YouCam to create the look. We keep your photo, the garment and the result privately for 24 hours so the look stays saved, then delete them automatically. Only you and the SangeetFit team can view them, and you can remove them sooner. YouCam handles its own retention.

**Does it preserve my face and the fit?** It's visual guidance, not a fit guarantee. AI previews can change facial or garment details and can't tell you how something fits physically.

**How is this different from a shop's try-on widget?** SangeetFit centres the occasion and the user's wardrobe: browse Indian wedding looks or add clothes you already own, then compare visual previews before deciding what to wear.

### Try it

- **App:** https://sangeet-fit.vercel.app (no account needed). Live mode: Generate runs a real Cloth V4 try-on from a small shared allowance. If it runs out, the app says so plainly; browsing remains available. [CONFIRM: deploy the planning-archive candidate before submitting this description.]
- **Video:** [CONFIRM: video link]
- **Code:** https://github.com/Pr1meGG/SangeetFit (private; shared with contact_event@PerfectCorp.com as the rules require [CONFIRM: invite sent — not sent as of 1 Nov]). Run it without keys (Node 22): `npm ci && MOCK_MODE=true npm run dev`.

### AI disclosure

[CONFIRM exact wording and tools] We built SangeetFit with AI coding assistants. The outfit concepts in the collection and the demo person image were generated with AI and are labelled in the app.

---

## Internal notes — do not paste

- Tagline and persona must match [DEMO_SCRIPT.md](DEMO_SCRIPT.md) and [README.md](../../README.md) word for word.
- "16 to 26 seconds" comes from three live runs on AI-created demo sources: 15.7 s and 16.0 s on 26 October, and 26.0 s on production on 31 October (the video take) ([pilot record](../testing/CATALOGUE_AI_PILOT_2026_10_26.md)). Owned-garment live quality is **not** verified; don't claim it.
- No problem statistics, savings, time-saved or demand numbers anywhere.
- Video upload, Devpost publishing and submission each need the user's approval of the exact text.
- Planning, rewear counts and PDF export were archived on 2 November. Older screenshots/videos showing them do not represent the active candidate. Owned-garment live quality remains unverified.
- Skin-tone analysis and selfie capture were also archived. The active submission integrates YouCam Cloth V4; do not describe Skin AI as an available feature.
- Older evidence notes from this file's previous version live in [PROJECT_STATE.md](../agent-workflow/PROJECT_STATE.md) and the dated testing records.
