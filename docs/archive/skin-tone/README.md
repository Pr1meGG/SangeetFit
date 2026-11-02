# Archived skin-tone analysis

Archived at the user's request on 2 November 2026. The active journey is outfit
browsing → full-body virtual try-on → comparison/save. Occasion choices open the
outfit gallery directly; older `step=2` links fall back to that gallery.

## Preserved implementation

- `route.ts`: exact former skin-analysis handler. It is not imported by an active
  app route; retained unit tests exercise it only with mock/stubbed provider work.
- `page-before-archive.tsx.txt`: page snapshot before removing skin state and UI;
  already includes the user's earlier planning archive. It is not compiled.
- `src/components/FaceCameraCapture.tsx`: camera component remains unmounted.
- `src/lib/palette.ts`: palette helpers remain available as source.
- Existing selfie/camera styles, fixtures, persistence fields and shared budget
  schema are preserved. No stored photos, results or budget values were changed.
- `face-camera.test.mjs.txt`: former browser journey, kept outside the active
  test runner. The active suite now checks absence and safe old-link behavior.

## Retired API

Active `POST /api/skin` responds HTTP410 with private/no-store headers and
`Skin-tone analysis is archived.` It does not read the photo/request body,
reserve allowance, upload anything or contact YouCam, in either mock or live mode.
This also prevents stale callers from spending allowance through the retired API.

## Restoring later

Restore the page integration, intentional selfie consent/capture flow, API route
and browser coverage together. Archive unit tests are preservation coverage,
not evidence that the active app exposes skin analysis. Outfit ranking never
depended on the removed skin-colour display; manual preferred-colour selection
remains part of the active gallery.

Existing demo videos containing the optional analysis button are outdated.
Do not re-enable live skin tasks, alter allowance or publish footage as part of
routine restoration without the project's specific approvals.
