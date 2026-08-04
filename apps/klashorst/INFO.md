# Klashorst Museum — concept build

Pitch demo for the Peter Klashorst Museum (klashorstmuseum.nl), a Trustoo lead.
Deployed to `klashorst.jouwidealewebsite.nl`.

## Why this exists

The client owns klashorstmuseum.nl, which today serves an unconfigured
"Artist Art Gallery Pro" WordPress theme demo: Lorem Ipsum, stock testimonials,
invented statistics. They have bought the theme, want frequent self-service
changes to news and photos, and want a newsletter opt-in. They are collecting
quotes from four parties.

This build answers that with the one thing a WordPress theme cannot do: a real
3D room that gives a handful of major works genuine presence.

## What is real and what is not

Everything factual is sourced. Nothing about the museum is invented.

- **Artist biography** comes from Wikipedia and the estate's own shop copy:
  born Santpoort 1957, Rietveld 1976 to 1981, Buning Brongers Prize 1982, Royal
  Award for Painting 1983, After Nature 1987 with Jiří Georg Dokoupil, died
  Amsterdam 11 September 2024.
- **Artworks** are the estate's own photographs from peterklashorst.com. Medium
  and dimensions are quoted from that catalogue. Years are stated only where the
  estate states them, which is why most works carry none.
- **Opening hours, address and admission do not exist yet.** The Visit block says
  so plainly instead of inventing them, and turns that into the reason to sign up
  to the newsletter.
- **News items are labelled "example"** in the UI. Their content is still sourced
  fact rather than invented museum news.
- There are no visitor counts, ratings or testimonials anywhere.

The build is `noindex, nofollow` so it never competes with klashorstmuseum.nl.

## The 3D room

`src/components/Room3D.tsx`. Twelve works hung around the inside of a rotunda,
the visitor standing in the middle.

- Works are sized from their real dimensions, so relative scale is honest.
- Artwork uses `meshBasicMaterial`: unlit, so colour stays true to the
  photograph and the scene costs almost nothing to light.
- The wall sits just behind the works with a soft light pool per piece. Frames,
  floor and wall are the only lit surfaces.
- It is a magnetic carousel, not a free spin: it always settles on a work, so the
  framing never lands in the gap between two canvases. It advances every 5.5s
  when idle, and holds off for 3.5s after the visitor drags.
- Clicking a work steps the camera toward it and shows a wall label. Narrow
  viewports step less far in, or the canvas would crop.
- Camera aim is offset so the page copy has somewhere to sit: below the work on
  phones, beside it on wide screens.

### Affordances, without words

Neither gesture is explained in text.

- **Turning the room**: a pointing hand takes hold of a hairline track, pulls
  across, tilts and releases, then repeats. It retires for good the moment the
  visitor drags more than 24px themselves (`onFirstDrag`).
- **Opening a work**: the canvas turned to the front carries a hotspot in its
  top right corner, a still dot over a dark halo with a ring that swells out of
  it and fades. Top right is background in all of these portraits, and it stays
  clear of the page copy on a phone, where the lower third of the canvas is
  covered. It hides while dragging and while a work is open.

The hotspot follows the carousel by reading the `centred` ref every frame, so
turning the room never re-renders it.

### Things that will bite you here

- **No `StrictMode`.** Its double mount in development tears down the WebGL
  context and leaves a blank canvas. `src/main.tsx` renders the app directly.
- **Unfocusing uses `onPointerMissed` on the `Canvas`**, not a click handler on
  the wrapping div. React flushes the selection state update before the wrapper's
  synthetic click arrives, so the wrapper would immediately undo the selection
  that was just made.
- **Drag must not call `setPointerCapture`.** Capturing diverts `pointerup` away
  from the canvas and R3F never raycasts a click through to a painting. Drag is
  tracked with window listeners instead.
- `vite/preload-helper` is pinned to its own chunk, or the lazy three.js bundle
  becomes a static import of the entry.
- **The canvas wrapper must be `touch-action: pan-y`, never `none`.** With
  `none` the full-height hero swallows a downward swipe and a phone cannot
  scroll past it at all. `pan-y` leaves vertical panning to the browser and
  still delivers horizontal drags to us. Listen for `pointercancel` too: that is
  what fires when the browser takes the gesture over to scroll.
- **Drag is negated** (`velocity = -dx * 0.3`). The camera looks down +z, so
  world +x reads as screen left; without the negation the wall slides against
  the finger.

## Graceful degradation

The works are in the HTML as a plain image strip before any script runs. The 3D
canvas mounts over it only when WebGL is available, the section is near the
viewport, and the visitor has not asked for reduced motion. Nothing is gated
behind JS.

## Forms

Newsletter opt-in posts to `/api/forms/newsletter` via `@jiw/cloudflare-forms`.
Name is optional, only the address is required. There is no Turnstile widget on
this concept build, so the Worker carries the `dev` bypass secret and the client
sends `cf-turnstile-response=dev`. Recipient is the agency demo inbox.

## Curation decisions

- **The S21 series is kept out of the 3D room.** Those four canvases are painted
  after the Khmer Rouge's own photographs of prisoners who were then murdered.
  They have their own section; they do not turn past a headline as scenery.
- Klashorst's figurative nudes stay in the room and the collection grid, because
  they are the work. They are kept out of news thumbnails, where nobody chose to
  look at them.

## Open before this becomes a real build

- **The CMS is pitched, not built.** The news block reads a local file. Nothing
  on the page claims otherwise, and it should stay that way until a real editing
  surface exists. This is the client's stated first priority, so it is the first
  thing to build if they say yes.
- **The newsletter stores nothing.** It emails the agency inbox. A real build
  needs a list, double opt-in and unsubscribe before any AVG promise is printed.
- **Ask the estate to confirm:** who co-founded After Nature in 1987 (sources
  disagree, so the site now names nobody), the publication year of Kunstkannibaal
  (2011 or 2012), and whether "Lust for Life" is their chosen tagline. It is
  currently taken from the title of their own WordPress site.
- Several works in the collection grid are for sale through the estate shop. If
  the museum's collection differs from the shop stock, the list needs revisiting.

## Commands

```
pnpm --filter @jiw/klashorst dev            # port 3063
pnpm --filter @jiw/klashorst lint
pnpm --filter @jiw/klashorst ship:dry-run
pnpm --filter @jiw/klashorst ship
```

Deploys need credentials exported first:
`set -a && source .env && set +a`
