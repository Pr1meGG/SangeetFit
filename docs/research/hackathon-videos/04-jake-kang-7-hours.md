# Video 4 — "I Won First Place at a Hackathon! | Building an App in 7 hours"

- **Source:** https://youtu.be/GNcqD1FEGRo (Jake Kang, 10:45)
- **Event:** MongoDB Agentic Memory & Context Engineering Hackathon, SF Tech Week 2025 — 1st of 75 teams, $15K cash + credits
- **Format:** a vlog, not a tips talk. Lessons below are **inferred from what happened**, not stated as advice.
- **Notes taken:** 31 October 2026, from YouTube's auto-generated English transcript

## What they built

A "memory layer for a person" for dementia patients: a camera recognises who walks in and shows a subtitle-style card ("This is Jake, he visited last week and you talked about the hackathon"). Conversations stored in MongoDB as embeddings and retrieved in real time. Pitched as AR-glasses-style.

## Observed timeline

- Idea finalised over breakfast on the morning of the event.
- Sketched the UI on a whiteboard first: webcam as the main interface, side panel, text near the face.
- Split into services early (video stream, speech-to-text, identification, LLM context). A **mock backend with two routes** let the frontend integrate before the real backend existed.
- **3 hours left: not yet integrated.** 1 hour left: "everything is breaking" — missing dependencies, a file in `.gitignore`, the demo machine not detecting faces, speaker diarisation wrong.
- Demo video recorded at the last minute; final code change at 4:59 for a 5:00 deadline.

## What they concluded

- "Our demo was not that good, but our presentation was absolutely amazing."
- Considered it their best **technical** product, yet the shaky live demo was nearly fatal.

## Lessons (inferred)

- A **sharp, emotional, one-sentence use case** that fits the sponsor theme (memory/context + MongoDB) carries a pitch.
- The whiteboard UI sketch made the demo story concrete before coding.
- Mock-first contracts let parallel work proceed — but late integration still almost sank them. Reinforces video 2: integrate early.
- The presentation compensated for a weak demo, which is evidence that storytelling counts heavily.
- Pick one demo machine early and test there.

## Unique to this video

- Real behind-the-scenes evidence of the late-integration failure mode
- Mock backend as an integration contract
- Strong presentation rescuing a shaky demo
- Explicitly built around the sponsor's technology
