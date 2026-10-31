# SangeetFit — Devpost description draft

Updated 31 October 2026. **Draft — not published or submitted.** Paste the section under "Devpost text" only after the final build, video and every [CONFIRM] item are settled and the exact text is approved.

---

## Devpost text

**Tagline:** Plan five celebrations with clothes you already own, preview uncertain looks, and choose what to wear.

**For:** a guest at a five-event Indian wedding who doesn't want to buy five new outfits.

**Built with:** the YouCam AI Clothes Virtual Try-On API (Cloth V4).

### Inspiration

An Indian wedding is rarely one event. Sangeet, Mehendi, Haldi, the wedding and the reception can fall in a single week, and each one asks "what am I wearing?" The usual answer is a group chat full of photos and a shopping trip. We started from a different question: *what can I wear from the clothes I already own?*

### What it does

1. **Plan five events on one board.** Assign an outfit to Sangeet, Mehendi, Haldi, Wedding and Reception. Reuse a favourite across events, and the board counts it as a planned rewear.
2. **Add the clothes you own.** Photograph a garment and confirm its name, type, colour, style and occasions. Adding clothes never starts an AI task.
3. **Preview only the looks you're unsure about.** Add a full-body photo, accept the photo notice and press **Generate try-on**. YouCam Cloth V4 renders the garment on you, with an original/result slider.
4. **Decide and take the plan with you.** The board shows events planned, owned outfits used and planned rewears. **Print / Save as PDF** gives a text-only plan with no photos or links.
5. **Browse for inspiration without a photo.** A collection of 26 original AI-generated outfit concepts, each labelled as inspiration or as tested on a real photo.

### How we use the YouCam API

Most virtual try-on puts a button next to a product you might buy. SangeetFit uses Cloth V4 as a **decision tool for clothes you already own**: the planner does the organising, and a try-on is spent only on the look you can't decide about.

Under the hood, the browser shrinks the photos, our server validates them, uploads the person and garment through the YouCam File API, submits a `cloth-v4` task, and polls with back-off until the render is ready. In our two recorded live runs, Generate-to-render took about 16 seconds. See the [architecture note]([CONFIRM: repository URL]/blob/main/docs/submission/ARCHITECTURE.md).

### How we built it

Next.js 16, React 19 and TypeScript on Vercel, with a small Redis store for the shared try-on allowance and private result saving. The server reserves allowance *before* any photo is uploaded, a 429 stops without automatic retries, and a missing API key fails closed instead of showing a fake result.

### Challenges

- **Keeping the AI honest.** A mock image must never look like a personal result, so every result carries a visible live-or-mock label, and live mode never falls back to mock.
- **Async rendering inside serverless limits.** Uploads, task submission and polling share one request deadline, with polling that starts fast and backs off.
- **Privacy by default.** Photos are sent only after an explicit notice and a Generate click, and saved results expire after 24 hours.

### Accomplishments

- A complete own-clothes → preview → five-event plan → PDF journey that works on a phone.
- A planner that's useful with zero AI calls, with AI used only where it changes a decision.

### What we learned

Virtual try-on is most valuable at the moment of indecision, not at the moment of purchase. Trust comes from labelling clearly what is generated and what isn't.

### Built vs next

| Built and shown | Next |
|---|---|
| Five-event board with rewear counts | Family and friends planning together |
| Add your own clothes | Separate top and bottom combinations |
| Cloth V4 try-on with original/result slider | A permanent saved wardrobe |
| Text-only PDF plan | Optional checkout for a missing piece |
| Private 24-hour result saving | |

### FAQ

**Who is it for?** A guest at a multi-event Indian wedding who would rather rewear what they own than buy a new outfit for every event.

**Why YouCam Cloth V4?** It takes a person photo plus a single garment or full-outfit reference, so it works with a photo of clothes you own, not only catalogue items.

**What happens to my photos?** Nothing is sent anywhere until you accept the photo notice and press Generate. In live mode, your photo and the garment go to YouCam to create the look. We keep your photo, the garment and the result privately for 24 hours so the look stays saved, then delete them automatically. Only you and the SangeetFit team can view them, and you can remove them sooner. YouCam handles its own retention.

**Does it preserve my face and the fit?** It's visual guidance, not a fit guarantee. AI previews can change facial or garment details and can't tell you how something fits physically.

**How is this different from a shop's try-on widget?** Shop widgets help you buy one product. SangeetFit plans a whole week of events around clothes you already own and uses try-on only for the uncertain looks.

### Try it

- **App:** https://sangeet-fit.vercel.app (no account needed). [CONFIRM: live or mock mode during judging, and the judging try-on allowance]
- **Video:** [CONFIRM: video link]
- **Code:** [CONFIRM: repository access route the organisers require]

### AI disclosure

[CONFIRM exact wording and tools] We built SangeetFit with AI coding assistants. The outfit concepts in the collection and the demo person image were generated with AI and are labelled in the app.

---

## Internal notes — do not paste

- Tagline and persona must match [DEMO_SCRIPT.md](DEMO_SCRIPT.md) and [README.md](../../README.md) word for word.
- "About 16 seconds" comes from the two 26 October live runs (15.7 s and 16.0 s) on AI-created demo sources ([pilot record](../testing/CATALOGUE_AI_PILOT_2026_10_26.md)). Owned-garment live quality is **not** verified; don't claim it.
- No problem statistics, savings, time-saved or demand numbers anywhere.
- Video upload, Devpost publishing and submission each need the user's approval of the exact text.
- Older evidence notes from this file's previous version live in [PROJECT_STATE.md](../agent-workflow/PROJECT_STATE.md) and the dated testing records.
