# Indian wear asset library

Goal: add internet-sourced Indian outfits that can be browsed in SangeetFit, with explicit image provenance and matching try-on references. Cover women's and men's wear across the five occasions where suitable assets are available.

Use the existing Next.js/TypeScript catalog and YouCam route; no new runtime dependency or paid API task. Preserve existing outfit IDs/assets and uncommitted work.

1. Source reusable full-outfit photos. Record file-level author, source URL, license URL, and any processing. Inspect downloaded candidates before choosing garment names, colors, occasion, and try-on suitability.
2. Add optimized local assets, a machine-readable library manifest, and a readable credit file. Exclude unsuitable references from try-on rather than substituting another outfit.
3. Extend `src/data/outfits.ts` with sourced entries and wire reference allowlisting in `src/app/api/vto/route.ts`. Show photo attribution and reference readiness in the gallery. Catalog preview and try-on reference must depict the exact same outfit.
4. Extend offline catalog tests for local files, unique IDs, provenance, category/occasion coverage, and correct reference mapping. Verify new mock route submissions and rejection of substituted references without network calls.
5. Run all offline suites, TypeScript, production build, and diff checks; inspect the library in a browser; request independent review and update project state/task board. Keep the local preview in mock mode. No commit, deployment, or live YouCam request in this task.

Acceptance: useful locally hosted garment photos, complete source credits, new menswear and Sangeet try-on candidates where quality permits, and honest wording that candidate references have not been live validated. Remaining sourcing gaps documented explicitly.
