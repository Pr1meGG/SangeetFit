# SangeetFit — Style System Audit

**Date:** 2026-10-25
**Scope:** `src/app/globals.css` and components. Complements `branding/README.md`
(the identity) — this document does not change the logo, palette or typeface.
**Method:** the shipped CSS of eight premium sites was mined for numeric tokens
(spacing, type, radius, motion, colour), then this codebase was measured against
the repeating patterns. No third-party asset is reproduced or reused anywhere in
this document; only scale numbers.

---

## 1. Verdict

The identity is already at premium standard. The **execution has drift** — the same
decisions are re-made inline on every component, so the numbers crowd together and
the eye reads it as slightly unsettled rather than deliberate.

Measured drift in this codebase:

| Axis | Distinct values in `src/` | Healthy target |
|---|---|---|
| Font sizes | **20** (9,10,11,12,13,14,15,16,17,20,24,25,26,27,28,29,30,34,37,40) | 8–10 |
| Border radii | **12+** (3,4,6,8,9,10,13,14,20,24px, 50%, panel var) | 3 |
| Transition durations | **10** (90ms,150ms,.15s,.16s,.18s,.2s,200ms,.22s,.25s,.6s) | 4 |
| Spacing | hand-picked (6,7,8,9,10,12,16,18,20,22,24px…) | 4px grid |
| Tabular numerals | **0 occurrences** | every stat |

`25px / 26px / 27px / 28px / 29px / 30px` are six near-identical sizes doing the
same job. That is the whole problem in one row.

---

## 2. What the premium baseline actually does

From the teardown of sweat.com, peloton.com, ouraring.com, headspace.com,
calm.com, apple.com, nykaafashion.com and tatacliq.com:

1. **Warm ground, never pure white.** Oura `#ece9e5`/`#f7f1e8`, Headspace `#F9F4F2`.
2. **Display far above body.** Oura runs 5.5rem→9rem against ~1rem UI; Apple is the
   restraint case at 28px vs 17px. Nobody premium uses a 1.3× jump.
3. **Light display weight.** Oura 200–300; Peloton uses the extreme 100/900 pair.
   Bold display type is the default failure mode.
4. **One accent, ≤10% of the viewport.** Apple `#0071e3` (19 declarations vs 13 for
   everything else); Headspace `#0040EA` alone on a warm field.
5. **One easing curve repeated hundreds of times.** Headspace
   `cubic-bezier(0.32,0.94,0.6,1)` ×210; Apple `cubic-bezier(.4,0,.6,1)` ×122.
6. **Radius is one lane.** Editorial lane = 4–8px (Nykaa 0–4, Apple 5–6, Peloton 6).
   App lane = 20–32px (Oura, Headspace). Never both.

---

## 3. Scorecard for this codebase

**Already correct — do not touch**

- `--brand-burgundy: #6b1e3a` as the single primary accent (42 uses vs 12 marigold —
  a healthy secondary ratio).
- `--brand-ivory` / `--sf-paper: #fcf8f6` — warm ground, exactly the Oura/Headspace
  move. Not pure white.
- `--sf-ink: #271a22` — warm near-black. Correct.
- Display serif at `font-weight: 400` with `letter-spacing: -.045em`. This is the
  Oura pattern and it is already right.
- `clamp(38px, 4.7vw, 64px)` on `h1` — genuine fluid display scale.
- `lucide-react` already installed — one icon family, no decision needed.

**Highest-impact gaps, in order**

1. **No spacing scale.** Every gap is hand-picked; 7px, 9px, 18px, 22px are off-grid.
   This is the single most visible "not quite premium" signal.
2. **Type scale drift.** 20 sizes with six-value clustering at 25–30px.
3. **Motion drift.** 10 durations, `.15s` and `150ms` both in use.
4. **No tabular numerals.** A fitness product whose stats reflow on every tick.
5. **Two radius lanes.** 4px buttons alongside 24px cards alongside 50% pills.
6. **System font stack for UI.** Defensible for performance, but it is the one place
   the product still reads as "web app" rather than "brand". Optional upgrade below.

---

## 4. Proposed token layer

Purely additive — existing class names keep working. Add to `:root` in
`src/app/globals.css`, then migrate components onto the tokens file by file.

### Space — 4px grid

```css
--sf-s1: 4px;  --sf-s2: 8px;  --sf-s3: 12px; --sf-s4: 16px;
--sf-s5: 24px; --sf-s6: 32px; --sf-s7: 48px; --sf-s8: 64px;
--sf-s9: 96px;
```

Rule: any `gap`, `padding` or `margin` must land on one of these nine values. 6px→
`--sf-s2`, 7px→`--sf-s2`, 9px→`--sf-s2`, 10px→`--sf-s3`, 18px→`--sf-s4`, 20px→`--sf-s5`,
22px→`--sf-s5`.

### Type — collapse 20 sizes to 9

Keep the existing ladder's intent; absorb the drift.

```css
--sf-t-eyebrow: 11px;   /* was --sf-text-eyebrow — unchanged */
--sf-t-note:    12px;   /* was --sf-text-note      — unchanged */
--sf-t-body:    14px;   /* absorbs 13px; raise support copy one step */
--sf-t-ui:      15px;   /* buttons, links, labels; absorbs 15/16px */
--sf-t-card:    17px;   /* garment names; absorbs 16/17px */
--sf-t-h3:      24px;   /* absorbs 24–30px cluster */
--sf-t-h2:      32px;   /* absorbs 34–37px */
--sf-t-h1:      clamp(38px, 4.7vw, 64px);  /* unchanged */
--sf-t-display: clamp(56px, 8vw, 96px);    /* NEW — countdown, hero only */
```

`9px` and `10px` are below the legible floor on a modern display; fold them into
`--sf-t-eyebrow` or delete. The `25/26/27/28/29/30` cluster collapses to `--sf-t-h3`
at 24px and `--sf-t-h2` at 32px — two values, not six.

Add tabular numerals where numbers move:

```css
.sf-stat, .sf-countdown, .sf-timer, .sf-price, [data-numeric] {
  font-variant-numeric: tabular-nums;
}
```

### Radius — one lane, three values

The brand is editorial (burgundy, serif, letterpress feel). Stay in the near-zero
lane; drop the 13/14/20/24px outliers.

```css
--sf-r-sm:   4px;   /* buttons, inputs — matches current button treatment */
--sf-r-md:   8px;   /* cards, panels — matches --sf-panel-radius */
--sf-r-pill: 999px; /* badges, chips only */
```

`50%` stays for avatars and circular icon buttons — that is a shape, not a radius.

### Motion — two curves, four durations

Keep the existing entrance curve; adopt one state curve.

```css
--sf-ease-enter: cubic-bezier(.2,.7,.2,1);    /* already in use — keep */
--sf-ease-state: cubic-bezier(.4,0,.2,1);     /* hover, colour, toggle */

--sf-dur-hover: 120ms;  /* absorbs 90ms, .15s */
--sf-dur-state: 200ms;  /* absorbs .16s, .18s, .2s, 200ms */
--sf-dur-enter: 400ms;  /* absorbs .4s — current .sf-home-enter */
--sf-dur-hero:  600ms;  /* absorbs .6s */
```

`.22s` and `.25s` fold into `--sf-dur-state`. Every `transition` should name one
duration token and one easing token; there is no third.

### Colour — no change

Existing palette is correct. Two additions only:

```css
--sf-accent-wash: #f6ebe2;  /* marigold-tinted backgrounds, badges — replaces raw fills */
```

Keep marigold as an accent and badge fill, never as a large surface. Current 12
uses vs burgundy's 42 is the right ratio — protect it as the codebase grows.

---

## 5. The one optional upgrade

Every premium site measured uses a **chosen** UI typeface; this app uses
`-apple-system, BlinkMacSystemFont, "Segoe UI"`. That is the last remaining
"generic web app" tell.

If you take it: add one variable UI sans — **Geist** or **Inter** (both SIL OFL,
free commercial use) — self-hosted as a `<link rel="preload">` woff2 with
`font-display: swap`, keeping the system stack as fallback. Cost is ~30–50KB;
benefit is that the UI and the serif display speak the same voice.

If you skip it: the system stack is defensible and costs nothing. The spacing, type,
radius and motion fixes above matter more than the typeface.

---

## 6. Migration order

Cheapest-to-highest risk. Each step is independently shippable.

1. **Add tokens** to `:root`. Nothing changes visually.
2. **Add tabular numerals** to `.sf-stat`, `.sf-countdown`, `.sf-timer`, `.sf-price`.
   Immediate, visible, one rule.
3. **Collapse radii** — 12+ values → 3. Sweep `border-radius` in `globals.css`.
4. **Collapse durations** — 10 → 4. `.15s`/`150ms` and `.2s`/`200ms` are literal
   duplicates.
5. **Snap spacing** to the 4px grid. Mechanical; best done as one pass.
6. **Collapse type sizes** — the 25–30px cluster first, then 13→14 and 16→15.
7. *(Optional)* Add the UI webfont.

Do not attempt a visual redesign. The palette, serif and lockups are correct; only
the numeric layer drifts.

---

## 7. Acceptance checks

Before shipping any new screen:

- [ ] Ground is `#fcf8f6`, not `#fff`
- [ ] Burgundy remains the only primary action colour; marigold stays secondary
- [ ] Every `gap`/`padding`/`margin` is one of the nine `--sf-s*` values
- [ ] No font size outside the nine `--sf-t-*` tokens
- [ ] No `border-radius` outside `4px`/`8px`/`999px`/`50%`
- [ ] No transition duration outside the four `--sf-dur-*` tokens
- [ ] Numbers that change are tabular
- [ ] `lucide-react` only; no second icon family
- [ ] Display type stays at weight 400 with negative tracking
