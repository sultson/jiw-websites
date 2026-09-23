# Design and CMS gap audit — 22 September 2026

The earlier completion claim was premature. Functional checks and content migration checks did not establish fidelity to the supplied designs. This audit identifies confirmed omissions and implementation regressions; no website changes or deployments were made during this audit, and no forms were submitted.

## Evidence and scope

Compared the supplied v5a HTML, its page text and render functions, the four replacement visitor-route documents, the generated templates, the React rendering paths, and the CMS schemas/data mapping. Read-only browser inspection covered all 26 stored public templates plus an individual event and news article. Additional direct comparisons covered the original inloop and agenda designs, the published general inloop page, a dated inloop event, and the added junk-journaling page. This is not a pixel-by-pixel certification of every responsive state.

## Confirmed gaps

### 1. All dated event pages bypass the supplied page structure — high priority

`src/next/Site.tsx`, `ActivityDetail` and the individual-event branch of `Site`, render a plain text section. The event image (`a.img`) is never rendered here, although it is displayed on agenda cards. There is no breadcrumb, photographic header, separate practical-information sidebar, or shared “Onze deur staat open” section. The common typography alone does not reproduce the supplied layout or coloured sections.

Live example: `/activiteit/inloopochtend-1-oktober`. Browser inspection confirmed zero main-content images, no `.crumb`, and no `.visit`.

### 2. The five original general activity pages lost their body copy — high priority

Affected: `/activiteiten/inloopochtend`, `/activiteiten/inloopavond`, `/activiteiten/wandelen`, `/activiteiten/zenmeditatie`, `/activiteiten/mandala-stippen`.

Their headline/intro and shared welcome block survive, but the supplied body was replaced with a short hardcoded description and event cards or an empty-state message. The removed content was consequently not included in the page documents migrated to the CMS.

Examples: Inloopochtend lost “De ochtend rustig beginnen”, “Jij hebt de regie”, “Goed om te weten” and “Is dit iets voor mij?”, including the directions/contact links. Walking lost the explanatory schedule section and suitability reassurance. Meditation lost “Samen op adem komen”, the participation explanation and reassurance for first-time visitors. Updating actual dates did not require removing these sections.

Evidence: supplied `activity(r)` render function and DATA.pages compared with `src/next/pages.json`; `ActivityDetail` in `src/next/Site.tsx`. The original conversion in `/tmp/toon-next/extract.mjs` explicitly substituted an activity slot for the body and sidebar.

### 3. Five additional activity types have only a minimal fallback page — high priority

Affected: `/activiteiten/encaustic-art`, `/activiteiten/junk-journaling`, `/activiteiten/inloop-met-activiteit`, `/activiteiten/voetreflexmassage`, `/activiteiten/sponsordiner`.

They have no `sitePage` template. The fallback branch renders a title plus `ActivityDetail`, omitting the breadcrumb, image, coloured header, practical sidebar and welcome block. An image is configured for each type in `src/next/model.ts` but this renderer does not use it. Titles/descriptions are hardcoded rather than managed as page content. Several of these pages are direct destinations from the four priority visitor routes, so the visual continuity breaks immediately after clicking their cards.

### 4. The agenda lost its audience guidance panel — high priority

The source agenda includes “Zoek je leeftijdsgenoten of steun voor naasten?”, explanatory text and links to `/leeftijdsgenoten` and `/voor-naasten`. That complete panel is absent from the implementation and its CMS page content. This is particularly relevant because the visitor routes deliberately do not appear as top-level menu items.

The filter vocabulary also changed from Ontmoeten/Ontspannen to Inloop/Wellness without an explicit design instruction. The original empty-filter reset button was replaced by a generic no-events/contact message. Correct real dates and a larger set of events are appropriate adaptations; removal of the panel is not.

### 5. News articles and privacy use separate, incomplete page structures

Individual news articles omit breadcrumbs and the shared welcome block; the news listing retains both. The article image renders, but the page lacks a header treatment consistent with the supplied site design. There was no individual-news mockup, so the exact article layout is an integration decision rather than a missing literal template.

The supplied privacy page did include a breadcrumb and welcome block. The expanded implementation retains neither. Expanding its factual content did not require discarding those elements.

### 6. Global styling overrides undo parts of the supplied design

`src/next/site.css:2` forces white onto `.approved-site`, overriding the design's warm `#fffdf9` background. It also forces Arial at 18px and heading weight 600, overriding the supplied later font rules and the mobile body-size reduction. This affects otherwise-preserved pages as well as dynamic pages.

The appropriate reduction of hover motion under repository instructions is a separate, intentional adaptation.

### 7. CMS image controls are not fully connected

Activity images show on cards but not on their detail pages (finding 1). Additionally, schemas expose crop/hotspot controls, but `src/content/index.ts` passes only the image asset reference to `imgVanRef`, and `src/content/image.ts` generates URLs from that reference without crop/hotspot data. Editor-selected framing therefore has no effect across these image paths.

Clearing a page image also silently restores its bundled source image (`Tree` only overrides the source when `im.img` is truthy), rather than expressing an explicit remove/restore choice.

### 8. CMS field guidance still describes removed functionality — high priority

`studio/schemas/activiteit.ts` promises that audience selections place events on corresponding audience pages, themes place them on thematic pages, descriptions appear on cards, and missing photos receive category images.

The new implementation instead matches route dates by `activiteitType`; it does not consume `doelgroepen` or `themas` in `src/next/Site.tsx`. `ActivityCards` displays neither the description nor a fallback category image. These are editor-facing promises the published site does not fulfil.

The activity preview opens the agenda rather than the edited event's own page (`studio/tools/SitePreview.tsx`), making the missing detail-page image harder to discover during editing.

### 9. Some visible content remains outside the new CMS

Video IDs/titles/descriptions reside in fixed slot attributes; newsletter text, contact-section copy and labels, privacy text, and fallback activity descriptions remain in code. The page schema only exposes texts/images/links indexed outside these slots. Consequently, the claim that all page text/link/image content was editable was too broad.

Some shared practical details also exist separately in footer/contact page text, rather than being uniformly derived from the practical-settings document. An address change there does not automatically update every occurrence.

### 10. Organisation section links and introductory text were lost

Replacing the Bestuur and Raad van Advies sections with CMS list slots removed the original `id="bestuur"` and `id="raad-van-advies"`. Their “Op deze pagina” links remain but have no destination. Read-only browser inspection confirmed both missing anchors.

The supplied explanation “Het bestuur is verantwoordelijk voor de koers, continuïteit en verantwoording van de stichting” was removed with the original Bestuur section. Correcting board members did not require deleting that context.

### 11. Event browser titles are incorrectly overwritten

The server emits an event title, but `src/App.tsx` only resolves CMS page titles and news titles before falling back to `titelVan(pad)`. Dated events are not in its static page map. The browser therefore changes a valid event's title to “Pagina niet gevonden · Toon over Leven”. Confirmed on the published inloop event.

### 12. The supplied event registration flow was not carried through

The two supplied `/aanmelden/...` pages, with event context, date/time and receipt-versus-confirmed-place wording, were excluded from conversion and redirected to general activity pages. The current implementation uses a CMS external URL or mailto link for registration.

Some supplied real-event text explicitly directs people to email, so email links themselves are valid for those events. The gap is that the broader mockup registration flow was removed without documenting or resolving that departure. Restoring it requires respecting each event's specified registration method and the prohibition on further client-address test emails.

## Additional code-level issue for future recurring events

All occurrences of a recurring CMS event generate the same event URL from the source slug, while the detail resolver selects the first upcoming matching occurrence. Clicking a later date can therefore open the earliest occurrence instead. The currently migrated confirmed events are one-off entries, so this is a supported-CMS-feature defect, not a claim about an observed current recurring event.

## Why the previous checks missed these

The conversion replaced whole activity and agenda sections before generating CMS documents. Later checks compared those generated documents with each other, establishing consistency of the reduced implementation rather than completeness against the supplied originals. The checks verified headings, valid paths/assets, rendering, selected corrections and CMS overrides; they did not assert preservation of each original section, image placement, breadcrumb, practical sidebar and shared block on every page type. The browser pass also concentrated on stored templates, leaving dynamically generated event detail pages outside its main route loop.

Priority for remediation: restore the activity-page content and common page structure, connect event imagery and practical information, reinstate agenda guidance, then correct CMS controls and the remaining navigation/styling discrepancies. Re-audit against the source designs rather than the generated templates alone.
