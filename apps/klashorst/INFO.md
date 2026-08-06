# Klashorst Museum — concept build

Pitch demo for the Peter Klashorst Museum (klashorstmuseum.nl), a Trustoo lead.
Site: `klashorst.jouwidealewebsite.nl`. CMS: `klashorst.jouwidealewebsite.nl/beheer`.

## Why this exists

The client owns klashorstmuseum.nl, which today serves an unconfigured
"Artist Art Gallery Pro" WordPress theme demo: Lorem Ipsum, stock testimonials,
invented statistics. They are collecting quotes from four parties.

Their own words set the brief: uploading texts and photos themselves is
essential, the site is to be Dutch, the emphasis belongs on this being a
*museum* with a part reserved for other artists to rent and buy from, no
webshop, and above all: *"ik wil niet voor iedere wijziging of aanpassing of
nieuw blog post afhankelijk zijn van jullie buro."*

So this build answers with two things a WordPress theme demo does not have: a
real 3D room that gives the work presence, and a CMS the client owns and can
publish from without us.

## What is real and what is not

Everything factual is sourced. Nothing about the museum is invented.

- **Artist biography** comes from Wikipedia and the estate's own shop copy:
  born Santpoort 1957, Rietveld 1976 to 1981, Buning Brongers Prize 1982, Royal
  Award for Painting 1983, After Nature 1987, died Amsterdam 11 September 2024.
- **Artworks** are the estate's own photographs from peterklashorst.com. Medium
  and dimensions are quoted from that catalogue. Years are stated only where the
  estate states them, which is why most works carry none.
- **Opening hours, address and admission do not exist yet.** The Visit block says
  so plainly instead of inventing them, and turns that into the reason to sign up
  to the newsletter.
- **The gallery for other artists ships empty.** Naming artists nobody has
  agreed to would be inventing the museum's business. The section explains
  itself until the first work is added in the Studio.
- There are no visitor counts, ratings or testimonials anywhere.

The build is `noindex, nofollow` so it never competes with klashorstmuseum.nl.
It is Dutch only: the EN toggle was removed because the client asked for Dutch,
and a second language would double what they have to fill in. Sanity does
locales for free if they ever want English back.

## The CMS

Sanity. Free plan, project `banas90d`, dataset `production` (public), owned by
the account that created it.

- **Studio:** <https://klashorst.jouwidealewebsite.nl/beheer>, on the museum's
  own domain rather than a sanity.studio hostname, so the client has one address
  to remember and it moves with them to klashorstmuseum.nl/beheer later. Dutch
  interface via `@sanity/locale-nl-nl`. Source in `studio/`.
- **It opens on a welcome screen**, `studio/tools/Start.tsx`, registered as the
  first tool so `/beheer` lands there. Sanity's own landing is the structure
  list, which leaves the right half of the screen empty until you click
  something, and an empty screen is where a non-technical client decides this is
  complicated.
- **The runtime is pinned** (`deployment.autoUpdates: false`). With auto-updates
  the Studio pulls itself from Sanity's CDN, so their UI changes land in a
  client's CMS unannounced and what we tested is not what they see. The cost is
  a 15MB bundle instead of 700KB, which Cloudflare does not care about, and
  updating means `pnpm up sanity` plus a deploy.
- **Sanity's product marketing is hidden.** `build-studio.mjs` injects CSS that
  drops the "what's new" popovers and free-trial prompts. This is the client's
  CMS, not a showroom for Sanity. Cosmetic and fail-safe: if those hooks are
  renamed upstream the rules stop matching and nothing breaks.
- **It ships with the site.** `scripts/build-studio.mjs` runs as part of
  `pnpm build`: it builds the Studio and folds it into `dist`, so the CMS can
  never drift from the schema in this repo. There is no separate deploy. The
  copy that used to live on sanity.studio has been undeployed, so there is
  exactly one address.
- **Four things in it:** *Teksten op de site* (one document, all editable copy),
  *Collectie*, *Galerie: andere kunstenaars*, *Blog*. Section order, buttons
  and interface labels stay in `src/content/ui.ts`, so no edit can restructure
  or break the page.
- **Editing is free-tier-safe.** No personal data goes in Sanity: newsletter
  sign-ups and interest enquiries are e-mail, not documents. A public dataset
  means every *published* document is world-readable, which is fine for a museum
  site and would not be fine for an address list. Drafts are not public.

### The blog

The client asked for a page they can keep themselves, with photographs and text.
So the news section became a blog: three cards on the museum page, a page of its
own at `/blog` listing everything, and a page per post at `/blog/<adres>`.

- **The document type is still called `nieuws`.** Every post already in the
  dataset carries that name and renaming the type would leave them behind. The
  seam is in two places and nowhere else: `RawPayload.nieuws` in
  `src/content/index.ts` and the `nieuws` block in `siteTeksten`. Everything the
  client reads, and everything else in the code, says blog.
- **The article is Portable Text**, written in the Studio's editor: paragraphs,
  two levels of heading, bold, italic, links, lists, quotes, and photographs
  dropped between the paragraphs. The editor offers exactly what
  `src/components/RichText.tsx` renders and nothing else, so a post cannot be
  written into a shape the page has no way of showing.
- **Lead and article never repeat each other.** `intro` is the lead; where the
  client wrote none, the card borrows the opening of the article and the article
  page then leads with the piece itself. One rule, `samenvatten()` in
  `src/content/rich.ts`, used by the CMS path and the bundled defaults alike.
- **Posts written before the editor existed still render.** They hold one plain
  `tekst` field; `blocksFromText()` turns its paragraphs into the same rich text
  at load, so the blog worked the moment it shipped, against untouched data. In
  the Studio that field is read-only and hidden as soon as `body` has anything
  in it, with a line telling the client to move the text across.
  `studio/scripts/migrate-blog.ts` does that for them: it fills `body`, `intro`
  and `slug` where they are missing, leaves `tekst` alone, and is safe to run
  twice.
- **Order is the date, with one override.** Newest first, and a post can be
  ticked *Bovenaan houden* to be held at the front regardless of its date:
  `order(coalesce(vastgezet, false) desc, datum desc, _createdAt asc)`. That
  also decides which post gets the large opening place on `/blog`, so the tick
  box is how an announcement is featured. There is deliberately no *volgorde*
  number like the collection has: on a blog a new post would then need a number
  or sink to the bottom. `datumWeergave` stays the second lever — it prints
  something other than the date without moving the post.
- **An address is never missing.** `slug` is generated in the Studio, and a post
  without one falls back to its title through `slugify()` in `src/meta.ts`, with
  a number appended if two posts would collide. The Worker resolves an incoming
  address by exactly the same rule, or the HTML would describe one post and the
  screen would show another.

### Routing

Three kinds of page in one bundle, `src/router.tsx`: the museum, the blog, and
an article. Real addresses rather than anchors, because a post has to be
linkable and openable in a new tab; client-side, because the content for every
page is already in the document the Worker sent, so moving between them costs no
request. A document-level click handler turns internal links into navigations,
so no component has to import anything to link somewhere. A click starts at the
top of its new page; back and forward are left to the browser.

`run_worker_first` in `wrangler.jsonc` lists `/blog` and `/blog/*` as well as
`/`. Without them those addresses come straight off the assets layer, the Worker
never sees the navigation, and the page renders the copy it was built with
instead of the CMS.

### What a shared link shows

The Worker rewrites the head for the address being requested: the post's own
title, its lead as the description, its photograph cropped to 1200×630, and
`og:type=article`. This is the version a search engine or a WhatsApp preview
ever sees, because neither runs the script. The app writes the same strings when
it moves between pages in the browser, and both read them from `src/meta.ts` so
they cannot drift. An address under `/blog` that belongs to no post answers 404
rather than a page that merely says so — unless Sanity is unreachable, in which
case nothing is claimed to be missing.

### How content reaches the page

`worker/index.ts` queries Sanity on a navigation, holds the answer at the edge
for five seconds, and inlines it into the HTML with `HTMLRewriter` as
`<script id="klashorst-content">`. `src/content/index.ts` reads that tag
synchronously at boot. Publish to live measures about six seconds.

Five seconds rather than a minute because the client watches their own edit and
a minute reads as broken. The cost is that a busy site would query Sanity once
per five seconds per colo, against 250k uncached API requests a month on the
free plan. Nowhere near it at this traffic; if the real site ever gets busy, put
the TTL back up and purge on a publish webhook instead.

The last good answer is kept in the edge cache under `/__cms-content` and used
only when Sanity fails to answer. Without it a blip drops the page back to the
copy this build shipped with, and a client watching their own edit vanish for
one request does not think "transient".

That buys three things: an edit is live without a build, the app starts with its
content already in hand so nothing pops in late, and a CMS outage cannot take
the museum down. If the tag is missing, malformed, or `SANITY_PROJECT_ID` is
empty, the site renders `src/content/defaults.ts`, which is the full site.

`?fresh=1` on any URL skips even that five seconds.

### Previewing drafts

Every document in the Studio has a **Voorbeeld** tab beside **Bewerken**: the
real site in an iframe, rendered with unpublished drafts, with a red bar along
the bottom so nobody mistakes it for what the public sees. `studio/tools/SitePreview.tsx`.

It works by passing `?preview=<PREVIEW_KEY>` to the site. The Worker then queries
Sanity with `perspective=drafts` and a viewer token, and never caches or indexes
that answer. The token is a Worker secret (`SANITY_READ_TOKEN`) and never
reaches a browser. The key itself sits in the Studio bundle, which is public, so
treat it as unlocking unpublished museum copy and nothing else: it grants no
write access and no access to anything but this dataset's drafts.

The preview reloads on a button rather than on every keystroke. A draft changes
as you type and an iframe that reloads under your hands is unusable.

### Images

The client uploads one photograph per work. Everything else is derived:

- 700px for the collection grid, 1100px WebP for the 3D room texture, 2200px for
  the lightbox, all from `cdn.sanity.io`.
- The **aspect ratio is read out of the asset reference**
  (`image-<id>-<w>x<h>-<ext>`), so a work uploaded in the Studio hangs in the 3D
  room in its true proportion without anyone typing a number. The old hardcoded
  `ratio` per painting is gone.

### Seeding

`studio/scripts/seed.ts` imports `src/content/defaults.ts` and writes it into
Sanity, uploading the photographs from `public/art` as real assets. It is
idempotent: fixed document ids, and Sanity deduplicates identical uploads by
hash. The client's first look at the Studio is their own museum, not an empty
form.

```
cd studio
SANITY_AUTH_TOKEN=$(python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.config/sanity/config.json')))['authToken'])") \
  SANITY_STUDIO_PROJECT_ID=banas90d pnpm seed
```

`pnpm migrate-blog` in the same directory, with the same token, moves posts
written before the blog existed into its shape: `tekst` becomes `body`, its
first paragraph becomes `intro`, the title becomes `slug`, and the section
heading is renamed where it still holds the wording this site was seeded with.
It touches nothing a client has typed themselves and nothing already migrated.
`--dry-run` prints what it would do.

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

- **Sanity's image CDN 403s any request that carries an `Origin` header from an
  origin that is not on the project's CORS list.** A plain `<img>` sends no
  Origin and works anywhere; three.js sets `crossOrigin`, so the *room textures*
  fail while every other image on the page loads. It looks like a three.js bug
  and is not one. Allowed today: the live site, `localhost:3063`,
  klashorstmuseum.nl and its www. Add any new hostname before pointing a domain
  at this.
- **The Studio's origin needs `allowCredentials: true` in the project's CORS
  list**, unlike the read-only image entries: it makes authenticated requests as
  the logged-in user. Both live on the same origin here, so that one entry
  carries both.
- **`basePath` moves the Studio's router, not its asset URLs.** The build still
  emits absolute `/static/*` and `/vendor/*`, which is why `build-studio.mjs`
  puts the page at `dist/beheer/index.html` and those two directories at the
  root. Vite keeps the site's own bundles under `/assets`, so nothing collides.
- **`defaultDocumentNode` only reaches documents the structure resolves for
  itself.** A hand-built `S.document()` node, like the singleton for the texts,
  keeps whatever views it was given, so it silently loses the preview tab on the
  document the client edits most. Give that node `.views([...])` too.
- **Uploaded assets take up to a minute to answer everywhere.** In that window a
  brand new path returns the SPA fallback, which looks exactly like a broken
  route or a bad `run_worker_first`. Deploy, wait, then debug.
- **A lost WebGL context used to blank the whole page.** An error thrown in
  render unmounts everything above it, and there was no boundary. `RoomBoundary`
  in `HeroRoom.tsx` plus the `webglcontextlost` listener in `Room3D` now retreat
  to the plain image strip. Headless Chrome drops the context readily, which
  makes it a good place to test this: `agent-browser open <url>` and check that
  the sections still render.
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
  scroll past it at all.
- **Drag is negated** (`velocity = -dx * 0.3`). The camera looks down +z, so
  world +x reads as screen left; without the negation the wall slides against
  the finger.
- **`run_worker_first` includes `"/"`.** Without it the assets layer answers the
  navigation directly, the Worker never runs, and the page silently falls back to
  its bundled copy. Symptom: edits in the Studio have no effect on the live site.

## Graceful degradation

The works are in the HTML as a plain image strip before any script runs. The 3D
canvas mounts over it only when WebGL is available, the section is near the
viewport, and the visitor has not asked for reduced motion. Nothing is gated
behind JS, and nothing on the page depends on the CMS answering.

## Forms

Two, both through `@jiw/cloudflare-forms`, both to the agency demo inbox.

- `/api/forms/newsletter` — opt-in, address required, name optional.
- `/api/forms/interesse` — enquiry about a gallery work. The work's title rides
  along in the subject line. This is what "geen webshop" looks like in practice.

There is no Turnstile widget on this concept build, so the Worker carries the
`dev` bypass secret and the client sends `cf-turnstile-response=dev`.

## Curation decisions

- **The S21 series is kept out of the 3D room.** Those four canvases are painted
  after the Khmer Rouge's own photographs of prisoners who were then murdered.
  They have their own section; they do not turn past a headline as scenery. The
  `reeks` field in the CMS keeps that rule enforced for anything added later.
- Klashorst's figurative nudes stay in the room and the collection grid, because
  they are the work. They are kept out of news thumbnails, where nobody chose to
  look at them.

## Open before this becomes a real build

- **The client has no login yet.** Invite them at
  <https://sanity.io/manage/project/banas90d> once their e-mail is known. Note
  the Free plan's roles are Administrator and Viewer, so an editing client is an
  Administrator; a new project starts on a trial where Editor also exists, which
  is worth checking before promising restricted permissions.
- **The project is on a Growth trial and should be moved to Free.** Sanity puts
  new projects there and then advertises it. Plans are read-only over the API
  (`GET /v2021-06-07/subscriptions?projectId=…` works, every write is 405), so
  it is a manual switch under Plan at
  <https://sanity.io/manage/project/banas90d>. Nothing here needs Growth: the
  dataset is public, there is no scheduled publishing and no restricted roles.
  Those banners live in manage rather than the Studio, so the client would not
  have seen them, but the trial ending unannounced later would be worse.
- **The Studio is Dutch but follows the browser.** A Dutch browser gets Dutch.
  Otherwise pick Nederlands once in the user menu.
- **SEO is client-side.** Content is inlined into the HTML but the markup is
  rendered in the browser, so per-post OG tags for blog articles do not exist. If
  this becomes the real klashorstmuseum.nl, port the frontend to Astro SSR on
  Workers, keeping the room as a React island. The CMS and the content layer do
  not change.
- **The newsletter stores nothing.** It emails the agency inbox. A real build
  needs a list, double opt-in and unsubscribe before any AVG promise is printed.
- **Ask the estate to confirm:** who co-founded After Nature in 1987 (sources
  disagree, so the site now names nobody), the publication year of Kunstkannibaal
  (2011 or 2012), and whether "Lust for Life" is their chosen tagline.
- Several works in the collection are for sale through the estate shop. If the
  museum's collection differs from the shop stock, the list needs revisiting.

## Commands

```
pnpm --filter @jiw/klashorst dev              # site, port 3063
pnpm --filter @jiw/klashorst lint
pnpm --filter @jiw/klashorst ship             # builds the Studio into /beheer too

pnpm --filter @jiw/klashorst-studio dev       # Studio on its own, port 3363
pnpm --filter @jiw/klashorst-studio seed
```

Deploys need credentials exported first:
`set -a && source .env && set +a`
