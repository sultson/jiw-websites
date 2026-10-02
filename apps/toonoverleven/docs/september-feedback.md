# Feedback implemented — 28 September 2026

Published on the concept site, Worker version `133eb92c-5941-4b15-a60d-77d7206b2987`.

- Homepage shows the first six sponsors in CMS order, without duplicate name captions, as in the supplied example. All 21 remain on the sponsors page. CMS ordering help explains this.
- Contact displays the complete existing CMS privacy statement, shared with `/privacy`, plus a downloadable PDF stored in Sanity. No separate source privacy file was found in the supplied pack or existing CMS; the PDF is an export of the published website statement, not a recovered client document. Text edits belong in the Privacy CMS page; replace its PDF field when updating the document.
- Restored the existing Thursday walk-in series, 10:00–12:00, as one editable CMS record. Start 1 October 2026; season endpoint 24 June 2027 follows the supplied programme. **Provisional exclusions: 24 and 31 December, based on the stated Christmas closure; exact closure dates were requested from the user and remain unconfirmed.** The endpoint avoids inventing summer opening dates.
- Each special creative morning explicitly references the regular series it replaces on that date. One occurrence is shown, preserving each existing event URL, description and photo control. Archiving the special event restores the ordinary morning; to cancel that date entirely, also switch it off in the series. Independent events can coexist by leaving the replacement field empty.
- Ordinary mornings use their main photo plus an optional ordered CMS photo set: the new coffee image and two supplied IPSO photos. A date keeps its image when the viewing window advances or another occurrence is cancelled. Editors can change/reorder/remove that set in one place. Special creative mornings have three distinct CMS image assets across their supplied dates. All asset selection comes from CMS fields.
- Editors can see up to 60 upcoming occurrences and switch dates off. Fixed misleading cancellation labels: an excluded occurrence disappears rather than being shown as cancelled. The CMS calendar understands special replacements and archived drafts.
- Fixed monthly recurrence beyond the initial calendar year and beyond the series' first two years.

## Checks

App/Worker and Studio type checks; existing design checks; focused recurrence, replacement, end-date, sponsor and privacy render checks; live CMS verification for all Thursdays through June 2027; full PDF visual review. Read-only browser checks passed for 12 desktop/mobile page visits, with no browser errors, broken images, overflow or form requests; details in `september-browser-verification.json`. No contact or registration forms submitted and no test email sent.

A broad template synchronization reached a revision conflict on Privacy because the separate PDF update changed that document. Optimistic locking preserved the PDF; no retry overwrote it. Contact changes had already synchronized, and a subsequent complete read-only CMS verifier passed all 38 page templates.

## Managing the calendar

1. Open **Inloopochtend** (weekly series) in Agenda to change common time, main photo, optional extra photo set, description or end date.
2. Turn off individual dates under **De keren dat dit plaatsvindt** for closures. Extend the season only after confirming the next schedule.
3. For a special morning, create a one-off event with its own details and image; select the ordinary series under **Vervangt op deze datum de gewone inloop**. The public agenda automatically substitutes that occurrence.
4. An additional simultaneous activity should leave that replacement field empty.

## Generated image assets

Built-in imagegen mode, three separate generations. Original PNGs remain in the Codex generated-images directory; optimized project copies and Sanity assets are the website resources. All are recorded as fictional generated atmosphere images in the image provenance registry and asset descriptions.

- [inloop-koffie-2026.webp](/Users/alfred/Projects/jiw-websites/apps/toonoverleven/public/img/approved/inloop-koffie-2026.webp)
- [inloop-creatief-collage-2026.webp](/Users/alfred/Projects/jiw-websites/apps/toonoverleven/public/img/approved/inloop-creatief-collage-2026.webp)
- [inloop-creatief-tafel-2026.webp](/Users/alfred/Projects/jiw-websites/apps/toonoverleven/public/img/approved/inloop-creatief-tafel-2026.webp)

### Final prompts

**Coffee morning:** Use case: photorealistic-natural. Asset type: landscape calendar event image for a Dutch community cancer support centre. Primary request: a quiet welcoming morning coffee table, close candid still life of three different ceramic mugs of coffee and tea on a light wooden table, an open empty chair and softly blurred houseplants in the background. Natural daylight, warm cream and muted sage colors, realistic modest Dutch home atmosphere. No people, no text, no logos, no medical equipment. Fictional atmospheric setting, not a depiction of any real centre. Wide 3:2 composition, suitable for cropping as event card.

**Creative collage:** Use case: photorealistic-natural. Asset type: landscape calendar image for a Dutch community centre's informal creative walk-in morning. Primary request: close documentary still life of a shared light wood table with colored pencils, small pieces of colored paper, simple unfinished abstract paper collage and two cups of tea. Soft daylight and warm modest home atmosphere, muted sage and cream background. Wide 3:2 photo with realistic texture. No people, no text, no logos, no medical imagery. Fictional atmospheric image; avoid suggesting a specific scheduled workshop or finished artwork.

**Creative overhead table:** Use case: photorealistic-natural. Asset type: landscape calendar image for informal creative walk-in mornings at a Dutch community support centre. Primary request: overhead editorial still-life photograph of a modest round pale wooden table with a small box of colored pencils, watercolor palette, a plain blank sketchbook, scraps of paper and two cups of tea. No finished art, no specific workshop or event implied. Natural soft daylight, realistic everyday materials, cheerful restrained earthy colors. Wide 3:2 photograph. No people, no text, no logos. Fictional atmospheric scene, not a real location. Distinct overhead composition, no window or chair visible.
