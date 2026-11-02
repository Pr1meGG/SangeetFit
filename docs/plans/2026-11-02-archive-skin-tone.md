# Archive skin-tone analysis

User approved archiving skin-tone analysis after reviewing the focused try-on
scope. Remove the separate selfie/colour-analysis flow from the active app.

- Page/HomeGuide owner: remove skin state, refs, calls, camera imports and step2
  UI; occasion choices go directly to the gallery. Old `step=2` links resolve to
  step3 and old skin-colour query parameters do not restore analysis state.
- Keep manual preferred-colour selection and recommendation metadata unchanged.
  Skin colour was only used in its separate palette display, not outfit ranking.
- Preserve the exact old skin route and page snapshot under
  `docs/archive/skin-tone/`; keep camera/palette implementations and styles.
- Retire active `POST /api/skin` with a no-store HTTP410 response before reading
  the body, reserving allowance or contacting a provider. Do not change shared
  budget schema, balances, VTO route, credentials or result-saving behavior.
- Test owner: preserve archived handler contracts by retargeting their imports,
  replace obsolete active-camera journeys with absence/legacy-link checks, add
  active410/no-network/no-body-read checks and retain VTO/privacy regressions.
- Primary owns current docs, integration, review and final mock verification.

Acceptance: no active selfie/camera/skin-analysis entry, old links remain useful,
no skin-provider task possible via the active route, explicit VTO still works.
Verify with `npm run verify`, `git diff --check`, independent React/TS/feature
reviews and a local Brave check. No live task, deployment, commit or push.

Preserve all existing uncommitted planning-archive work. No stored-data deletion
or new dependency. Existing videos showing either archived flow remain outdated.
