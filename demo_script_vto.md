# "Proof" → Garment VTO Demo Script (2:30)
# Project: Proof (pivoted from skin-analysis; skin noise > 3pt spread / weak 2pt shift → dead)
# Goal: end-to-end clothes virtual try-on via YouCam Clothes VTO (docs.perfectcorp.com/reference/ai_clothes)
# Tech: Next.js app + agent UI; backend: garment_test.py (POST /file/cloth-v3 → PUT → POST /task/cloth-v4 → poll)
# Assets: out/garment_test/{user_fullbody.jpg, saree.png, kurta_set.png, lehenga_ethnic.png, western_dress.png}

RUN TIME: ~2:30 | FORMAT: screen-record + voiceover | TARGET: hackathon judge / investor

---

0:00 - 0:15 | PROBLEM (15s)
SCREEN: Title card "Proof — Garment VTO" / subtitle "Skin analysis → pivoted to clothes (noise killed signal)" + noise-test.md bullet: spread 3pt > shift 2pt
VOICE: "Proof started as skin-analysis. Noise was too high — 3-point spread, 2-point shift, not a real change proxy. We pivoted to garment virtual try-on: upload a body, pick a garment, see it on you.
KEY LINE (subtitle): Pivot reason in 2 lines — no speculation.

0:15 - 1:15 | DEMO: UPLOAD → TRY-ON (60s)
SCREEN: Next.js app split-pane. LEFT: user's full-body photo (out/garment_test/user_fullbody.jpg). RIGHT: garment picker (saree, kurta, lehenga, western). MIDDLE: result panel loading → rendered.
ACTION: Drop user_fullbody.jpg → pick sari → click "Try On" → show loading spinner (poll loop, 3s intervals, ~10-30s real) → result image appears (out/garment_test/saree_result.png).
VOICE: "Two inputs only: your full-body photo and a garment reference. One API call to YouCam Clothes VTO — file upload, submit task, poll until success. No manual masking, no 3D model. The agent orchestrates the upload-poll-render loop behind the UI."
ON-SCREEN LABELS: "Source file" / "Garment ref" / "Task status: polling..." / "Result URL"
NOTE: Show real result if cached; else describe "polled to success, saved to out/garment_test/"

1:15 - 2:00 | MULTIPLE GARMENT TYPES (45s)
SCREEN: Quick carousel / split-4 showing all 4 outputs side-by-side.
- 0:00  saree (category: ethnic) — flowing drape, full-body
- 0:10  kurta_set (category: full_body) — structured upper + lower
- 0:20  lehenga_ethnic (category: full_body) — layered skirt + blouse
- 0:30  western_dress (category: full_body) — fitted silhouette
VOICE: "Same body, four garment categories — saree for ethnic, kurta and lehenga full-body, western dress. The API handles category tagging via garment_category param; no per-garment model needed. All from one full-body source."
KEY LINE (lower-third): "One body → 4 garments → 1 API (YouCam /s2s/v2.0/task/cloth-v4)"

2:00 - 2:30 | API INTEGRATION + AGENT WORKFLOW (30s)
SCREEN: Code snippet from scripts/garment_test.py (simplified, 6 lines):
  upload_file() → file_id
  submit_task(src_id, ref_id, garment_cat) → task_id
  poll() → success → result URL
Plus agent-flow diagram: User upload → Agent parses inputs → Agent calls YouCam API → Agent renders result → User sees it.
VOICE: "Under the hood: Next.js frontend, agent manages the 3-step VTO pipeline — upload, submit, poll. YouCam endpoint at yce-api-01.makeupar.com. No skin-analysis noise here; the signal is visual: does the garment fit and drape correctly?"
KEY LINE: "Agent = UI glue + API orchestration; API = rendering engine"

2:30 - 2:45 | RESULTS / CONCLUSION (15s)
SCREEN: Summary card — 4 garments rendered, zero manual editing, ~30s per try-on, pivot validated.
VOICE: "Proof pivoted from noisy skin data to visual garment VTO. End-to-end in minutes. Need a new category? Just change garment_category in the payload. That's the demo — ask me anything."
FINAL SLIDE: "Next: batch try-on | size-adjustment layer | mobile camera input"

---

PRODUCTION NOTES (for recorder — not in video):
- Assets pre-staged in out/garment_test/; cache results so demo never waits on real API.
- If demo runs live: pre-run garment_test.py once per garment to populate results; show cached outputs.
- Voiceover tone: direct, no fluff — matches ponytail mode (lazy/efficient; explain only what's asked).
- No over-built animation: static splits + simple fade. Code snippet from real garment_test.py (line 31 submit_task, 42 poll).
- Pivot context (noise-test.md) shown only once at 0:00 — explains why we're here, not history for history's sake.
