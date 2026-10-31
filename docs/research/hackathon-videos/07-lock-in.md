# Lock-in — hackathon lessons applied to SangeetFit

Written 31 October 2026 from [the five-video comparison](06-comparison.md). **Each lesson that several speakers shared appears once here** (sources in brackets). Advice that doesn't fit an online Devpost entry two days before deadline is listed as dropped in the comparison.

**Situation:** online Devpost entry, deadline **2 November 2026, 22:15 IST**. Judges score four equal dimensions (Technological Implementation, Design, Potential Impact, Quality of Idea) from the **1–3 minute video, description, screenshots and repository**, 3–20 November. No stage, no live Q&A. Features are frozen.

This document changes no release gate in [PITCH_CHECKLIST](../../submission/PITCH_CHECKLIST.md). It does not authorise live tasks, recording, deployment or publication.

## The eight locked principles

### 1. The video is the product [3, 5, 4, 2]
Judges mostly watch the video and skim the text. Anything not visible in the video effectively didn't happen.
- [ ] Treat the video as the top-priority remaining deliverable, above any new UI work.
- [ ] Spend the final hours on the video and description, not one more feature.

### 2. One persona, one problem, one sentence [1, 2, 3, 5]
- [ ] Persona sentence, used identically in the video, Devpost and README. Draft: *"A guest at a five-event Indian wedding who doesn't want to buy five new outfits."*
- [ ] One-sentence pitch (already exists): *"Plan five celebrations with clothes you already own, preview uncertain looks, and choose what to wear."*
- [ ] Problem stated in ≤15 seconds, in plain words, without opening on a statistic or the tech stack.

### 3. The demo is one chronological story, mostly solution [3, 1, 2]
- [ ] Structure: tension ("Sangeet is Friday; five events, a full wardrobe, nothing decided") → the persona's journey in order → resolution (completed five-event plan + PDF).
- [ ] About 90% of runtime on the working product; core flow first: own clothes → preview → compare → **Plan for Sangeet** → PDF.
- [ ] No isolated feature tour; each screen follows from the previous one.

### 4. Make the sponsor's API the visible hero [5, 4, 3]
YouCam is the sponsor, and "creative, non-obvious use of the YouCam API" is a judging dimension.
- [ ] In the video, show the real Cloth V4 flow clearly: explicit Generate → processing → visible render, with measured timing and no implied instant result.
- [ ] Name the API explicitly on screen and in the Devpost "APIs used" section.
- [ ] Frame the non-obvious use: VTO used as a *decision* tool for rewearing owned clothes, not a shopping wrapper.

### 5. Few working features; cut the rest [1, 2, 3, 5]
- [ ] Freeze: no results gallery, live friends, background results or other open plans before submission.
- [ ] Anything not shown in the video stays out of the "features" list and goes under "what's next".
- [ ] Working beats beautiful: no polish changes that risk the verified flow.

### 6. Honest, never faked [1, 2, 5]
- [ ] Mock/live label visible in every frame where it applies. A mock image is never narrated as a personal result.
- [ ] Devpost has a "Built vs next" section: built = the frozen flow; next = family collaboration, top/bottom outfits, permanent wardrobe, checkout.
- [ ] No unsourced numbers. Any problem statistic needs a real cited source, otherwise describe the problem qualitatively.

### 7. Show before/after with real numbers [1]
The only before/after that is honest without a user study is the plan itself.
- [ ] Use the app's real counters: before = five events, nothing decided; after = events planned, distinct owned outfits, planned rewears, and only *N* previews generated for the uncertain looks.
- [ ] No savings, purchases-avoided or time-saved claims.

### 8. Answer the judges' questions in writing [1, 2, 5]
There is no live Q&A, so the written material must answer the obvious questions.
- [ ] Devpost/README FAQ: Who is it for? Why YouCam Cloth V4? What happens to my photos? Does it preserve my face or fit? (Honest: visual guidance, not a fit guarantee.) How is it different from shop VTO widgets? (Use [competitive-landscape](../competitive-landscape.md).)
- [ ] One-page architecture note *you* can explain end to end: browser preprocessing → `/api/vto` validation → YouCam file upload → task → poll → result. Judges may check how AI-assisted code works [2].
- [ ] Repo holds up on inspection: setup instructions run, mock mode works without keys, no secrets [5].
- [ ] Deployed judge URL plus a recorded critical flow as fallback, available through 20 November [2, 3].

## Final pre-submit checklist

- [ ] Persona + one-sentence pitch identical everywhere
- [ ] Video 1–3 min: tension → chronological journey → five-event plan; Cloth V4 visibly central; mode labels on
- [ ] Devpost first three lines: pitch, persona, YouCam API used
- [ ] Before/after from real counters only
- [ ] Built vs next section; no claims beyond evidence
- [ ] FAQ answers the anticipated judge questions
- [ ] Architecture note understood by the submitter
- [ ] Repo setup verified from a clean clone in mock mode
- [ ] Judge access works in a fresh browser; recorded fallback exists
- [ ] Existing [PITCH_CHECKLIST](../../submission/PITCH_CHECKLIST.md) gates and the user's explicit publish approval
