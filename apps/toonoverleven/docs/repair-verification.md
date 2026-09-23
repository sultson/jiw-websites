# Design repair verification — 22 September 2026

This supersedes the premature completion assessment recorded before `design-gap-audit.md`. The audit remains as the record of what was missing.

| Audited gap | Correction | Evidence |
| --- | --- | --- |
| Dated event layouts | Breadcrumbs, photo from CMS (or category fallback), warm photographic header, content/sidebar layout, date/time/location/registration information and shared welcome section | `ActivityPage`, `ActivityPractical`; source-copy/render checks and browser inspection |
| Five original activity bodies | Full supplied explanatory sections, suitability guidance and links restored; real upcoming dates replace mockup dates | `reference-activity-copy.json` compared against rendered pages and live CMS text |
| Five fallback activity pages | Full editable templates for inloop met activiteit, encaustic art, junk journaling, voetreflexmassage and sponsordiner | Template inventory, image/layout checks, live CMS document verification |
| Agenda audience panel and filters | Original audience guidance restored; Ontmoeten/Ontspannen labels; reset for empty selections; working audience/theme filters | Template/source comparison and browser filter reset |
| News/privacy shared layout | Breadcrumbs and welcome blocks restored; news articles use the shared photo/header and content/sidebar pattern | Browser and rendering checks |
| Global styling | Warm background, supplied font rules and mobile text sizing retained; unnecessary overrides removed | Stylesheet inspection and desktop/mobile screenshots |
| Image controls | Sanity crop applied to image URLs, hotspot passed to image framing; clearing a CMS page image removes it; event-card image fallback | Crop/hotspot and removal checks; detail/card inspection |
| CMS guidance | Correct descriptions for audience/theme filters; targeted events appear on matching visitor routes; event preview points to its detail page | Schema inspection, rendering checks with audience-specific fixtures |
| Editable content | CMS fields for videos; shared editable form/video/activity labels; privacy, newsletter and all activity pages editable; shared address/phone/email connected | 38 live page/shared documents checked, local override checks |
| Organisation anchors and copy | Bestuur/Raad van Advies anchor IDs and board introduction restored | Original-copy and live/browser anchor checks |
| Event titles | Event titles used in browser navigation as well as server output | Browser title checks |
| Registration | Event/date context and receipt-versus-confirmed-place wording restored; respects full capacity, explicit email/external destinations; own form only for eligible events | Render-only checks; Worker checks eligibility against the current CMS before forwarding |
| Recurring dates | Per-occurrence URLs include the date; detail and signup resolution use that occurrence | Three-date recurrence fixture with unique URLs and exact resolution |

## Verification commands

- `pnpm --filter @jiw/toonoverleven lint`
- `pnpm --filter @jiw/toonoverleven-studio lint`
- `pnpm --filter @jiw/toonoverleven check:approved`
- `pnpm --filter @jiw/toonoverleven check:design`
- `pnpm --filter @jiw/toonoverleven-studio exec tsx scripts/check-repair-cms.ts`
- `pnpm --filter @jiw/toonoverleven ship:dry-run`

The CMS repair script creates a backup and updates documents with revision checks. Existing text/link/image edits are preserved by their stable keys. New content and video/form controls are added; unused fixed-template rows are removed from the editing interface.

No form was submitted, including locally or with a mocked delivery response. Registration was checked through pure rendering and code/type checks only. Browser inspection blocks `/api/forms/*` requests and asserts that none were attempted. The existing recipient remains `info@toonoverleven.nl`; the 90-day R2 retention rule is unchanged.

## Published result

Deployed to `https://toonoverleven.jouwidealewebsite.nl/`, including Studio at `/beheer`.
Final Worker version: `1d9b5cef-f0c9-4572-b1b4-c3f37eaeeb4a`.

The published browser pass covered 46 desktop routes and nine mobile routes, with no hydration/JavaScript errors, broken images, horizontal overflow, missing on-page anchor targets, or form requests. The result inventory is in `browser-repair-verification.json`. Following the final removal of redundant CMS contact-link fields, a focused published check confirmed shared email links and the event title on five pages, again without browser errors or form requests. All 38 live CMS documents were rechecked after the final synchronization.

The registration delivery path was deliberately not exercised: the user's prohibition on resubmitting forms takes precedence. No claim of a new end-to-end email delivery test is made.
