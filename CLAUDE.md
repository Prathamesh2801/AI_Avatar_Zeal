# AI Avatar — HDFC ERGO Insurance Quiz Junior 2026

A mobile/tablet web app for the HDFC ERGO Insurance Quiz Junior 2026. A visitor
picks a gender, picks a template, takes a selfie, and gets an AI face-swapped
avatar back.

**Targets phones and tablets only.** There is no desktop or TV/kiosk mode — an
earlier SSE-driven TV screen, the details form, and the certificate backend were
all removed. Don't reintroduce `react-qr-code`, `EventSource`, or a form step.

## Running

```bash
npm run dev      # vite --host  (--host matters: you test from a real phone on the LAN)
npm run build
npm run lint
```

## Flow

```
StartupPage   /          pick Male or Female, then NEXT
   │ state:{gender}
ModelSelectionPage /model   4 templates for that gender, then NEXT
   │ state:{modelId, gender}
CameraPage    /camera    native camera → POST /api.php → wait for result
   │ state:{resultImage, modelId, gender, data}
ResultPage    /result    show avatar · Download / Back / Home
```

State travels **only through react-router `location.state`** — no store, no
persistence. Every page past the landing screen guards on its required state and
redirects to `/` when it's missing, so a reload or deep link restarts the flow
rather than rendering broken. `*` also redirects to `/`.

Routing uses `createHashRouter` so the build can be served from any subdirectory
without server rewrite rules.

## Theme

The UI follows `raw_docs/9x16 AI Photo sharing.ai` (git-ignored; a 9:16
Illustrator file that opens as PDF). Brand values were taken from its vector
paths, not sampled from a screenshot:

| token | value | use |
|---|---|---|
| `--color-brand` | `#E21F26` | pills, accents |
| `--color-brand-dark` | `#B5161C` | pressed state |
| `--color-brand-ink` | `#2D2D2D` | body text |
| `--color-brand-bg` | `#FDFDFD` | page background |

It is a **light** theme — near-white background with soft grey swooshes
(`.app-bg` in `index.css`), red pill buttons, outline doodle icons in the
margins. The earlier dark Vedanta/Cairn theme and its assets are gone.

Assets were extracted from the .ai with PyMuPDF (`pymupdf`), which is the only
PDF tooling available here — no Illustrator, Inkscape or Ghostscript. The logo
renders from vector at 4x and the doodles at 8x, so they are sharp; re-export
the same way if the artwork changes. Icons as inline SVG were tried and
rejected: clipping the page to one icon keeps every other path, so each file
came out ~186 KB versus ~10 KB as PNG.

**Landing screen proportions** come from the artwork and are held with `dvh`
spacers, not guesswork. Measured against the source (% of page height):
logo 15.7–22.9% at ~62% width, MALE 35.1%, FEMALE 47.4%, NEXT 77.2–82.1%. If
you change that page, re-check those numbers — it is what stops the screen
feeling empty.

Components: `BrandHeader` (logo lockup; `pinned={false}` puts it in normal flow
for the landing screen, `pinned` absolute for the deeper screens),
`DoodleField` (decorative margin icons, `aria-hidden`), `PillButton`
(`solid` / `ghost` / `muted`).

## Model IDs — the backend contract

Template ids are **sent to the face-swap API as-is** (`id`). They are
blocked by gender:

| id | male (100s) | female (200s) | pose |
|---|---|---|---|
| x01 | Sky Guardian | Sky Guardian | flying, fist forward |
| x02 | Digital Protector | Digital Protector | AR glasses + globe |
| x03 | Shield Bearer | Shield Bearer | shield, cape |
| x04 | Claim Investigator | Claim Investigator | magnifier + shield |

Slots line up across genders — 101 and 201 are the same pose.

To add a template: export it **2:3** (see below), save as JPG at 512×768 into
`src/assets/img/model/`, add an entry to `src/assets/data/models.js` with the
next free number in its block, and make sure the backend knows that id. The id
is shown on each card in the UI so you can verify what's being sent.

## Print ratio — 2:3

The final image is **printed at 4:6 (= 2:3, ratio 0.667)**, so the whole UI is
built around that ratio and never crops:

- Source template art is 1024×1536; the bundled cards are 512×768 JPG.
- Template cards, the camera preview and the result image all use
  `aspect-[2/3]` with `object-contain`, so what the user picks and approves is
  the framing that comes off the printer.
- Don't switch any of these to `object-cover` or another aspect — it would show
  a crop that the print won't match.
- New template art must be 2:3. Anything else will letterbox in the card.

## Backend

`config.js` holds `FACE_SWAP_BASE_URL` — a plain-HTTP LAN address that changes
per venue/network. There is no `.env`. The app posts to `${FACE_SWAP_BASE_URL}/api.php`.

**Request** (multipart form-data) — exactly two fields:

| field | value |
|---|---|
| `id` | template id, e.g. `101` |
| `source` | the captured photo (File) |

**Response** (HTTP 200):

```json
{
  "success": true,
  "id": "101",
  "swap_image":      "Swap/101_….png",
  "swap_image_url":  "http://…/Swap/101_….png",
  "final_image":     "Final/101_….png",
  "final_image_url": "http://…/Final/101_….png"
}
```

The app shows and downloads **`final_image_url`** (the framed, print-ready
composite). `swap_image*` is the bare face swap and is not used.

`src/api/faceswap.js` returns `{ ok, status, data, resultImage, error }`.
Note `ok` is not just `status === 200` — the backend returns HTTP 200 with
`success: false` on failures like "No face detected", and that message is shown
to the user. `status: 0` means network failure/timeout (120s cap).

## Hiding the download button

Download is on by default. To hide it (e.g. a shared display where visitors
shouldn't save files), add a flag to the URL:

```
?nodownload=1#/     ← preferred: survives reloads, stays visible in the URL
#/?nodownload=1     ← also works (cached at load)
```

`?kiosk=1` and `?download=0` do the same thing. The flag is resolved **once at
module load** in `src/hooks/useAppFlags.js`, which is imported by `main.jsx`
*before* `App` — the hash router rewrites the hash on init, so a flag written
inside the hash would otherwise be gone before it could be read. Don't reorder
those imports.

## Layout components

- **`PageShell`** — background, doodles and the logo lockup. Every page uses it;
  don't re-implement the chrome. Props: `doodles`, `showHeader`,
  `animatedHeader`, `pinnedHeader`, `className`.

  Safe-area insets are applied as **margins on an inner wrapper**, not as inline
  padding on the root. Inline padding silently beat the `px-*`/`pb-*` utilities
  a page passes via `className`, leaving content flush against the screen edge —
  that bug is why pills bled off both sides.

## Mobile notes

- **Use `min-h-dvh`, not `min-h-screen`.** On mobile browsers `100vh` includes
  the area behind the collapsing URL bar, so full-height pages overflow and the
  bottom sits under the chrome. `PageShell` already does this.
- Result and camera images are `max-h-[52dvh]` / `max-h-[46dvh]` with
  `object-contain` so the action buttons stay above the fold on a phone.
  Verified down to 320px (iPhone SE) with no horizontal overflow.
- The camera input uses `capture="user"` (front camera) — it's a selfie.
- Pinch-zoom is deliberately left enabled; `touch-action: manipulation` on
  buttons kills the 300ms tap delay and double-tap zoom without blocking it.
- **iOS notch:** `viewport-fit=cover` in `index.html` lets the page paint behind
  the notch and home indicator; the safe-area insets in `PageShell` and
  `BrandHeader` keep content clear of them. `BrandHeader` adds the top inset
  inside `calc()` because a `py-*` utility would override a separate `pt-*` —
  that exact bug once left the logo flush against the browser chrome.
- Tap feedback uses `active:` rather than `hover:` — hover doesn't exist on
  touch, and sticky hover states look broken after a tap.
- Template grid is **2-up on phones and portrait tablets**, 4-across only from
  `lg` (landscape tablets). Four in a row on a portrait iPad left each card
  ~160px with ~450px of height unused — a portrait tablet is tall, not wide.
- `PageShell` is `h-dvh`, not just `min-h-dvh`. With only a min-height the
  `flex-1` content region can grow past the viewport and the page scrolls; that
  is what pushed the template grid off the bottom of an iPad Mini. The inner
  wrapper is `overflow-y-auto` so genuinely tall content still scrolls.

## Performance — read before adding assets

Runs on visitors' own phones over event wifi, so weight matters:

- **The background is a CSS class (`.app-bg` in `index.css`), not an inline
  `style={{ backgroundImage }}`.** Inline styles made the browser decode the
  image per page, which visibly stuttered on route changes.
- **Images are pre-sized.** Templates are 512×768 JPG (~80 KB each, ~660 KB for
  all eight); background is 1920×1080 JPG (~24 KB). The whole `src/assets/img`
  tree is ~1.4 MB. An earlier set of 2048px PNGs totalled ~10 MB and was the
  main source of lag — resize before committing, don't ship source art.
- **Routes are code-split**; only `StartupPage` is eager.
- **The router is created at module scope**, not inside the component.

Initial JS chunk is ~415 KB (134 KB gzip) — Lottie is gone with the old theme,
so don't reintroduce `@lottiefiles/react-lottie-player`. If the chunk jumps,
check what got pulled into the eager path.

## Conventions

- Tailwind v4 via `@tailwindcss/vite` — config lives in `index.css`, there is no
  `tailwind.config.js`.
- framer-motion for animation, `lucide-react` for icons.
- Use the brand tokens (`bg-brand`, `text-brand-ink`, …) rather than raw
  `red-*` shades, so a palette change is one edit in `index.css`.
- Blob URLs from the camera must be `revokeObjectURL`'d (see `CameraPage`), and
  the file input's `value` reset on retake — otherwise re-picking the *same*
  photo won't fire `onChange`.
- Saving the result goes through `src/utils/saveImage.js`. iOS and Android need
  different paths: `<a download>` on a blob works on Android/desktop, but iOS
  Safari ignores the attribute, so it uses the Web Share sheet ("Save Image")
  and falls back to opening the image. Don't collapse these into one branch.
- API failures must surface in the UI. The old code only did `console.error`,
  so a failed generation looked like the button did nothing.
- ESLint needs `react/jsx-uses-vars`; without it every JSX-only import (like
  `motion`) is flagged unused.
