# Feedback round October 2026: changes to make

**Sources** (read on 18-10-2026):
- **M**: Marcel Jansen, `Bevindingen Toon over leven.docx` (11-10). It has 22 screenshots and his own AI check table.
- **R**: Ron Wille (penningmeester), `Bevindingen TOL website-Ron.docx` (13-10). It includes the October and November flyers.
- **F**: `~/Downloads/Foto 1.png`, the sponsordiner photo (1448×1086, long table at Classic Mike).
- Email thread of 11–14 October. Alfred has already told the client three things: the inloopavond can probably go, the agenda gets finalised just before going live, and a WhatsApp button is possible.

**How content works here (read before editing).** `src/next/pages.json` holds the templates. Every `text-N` / `link-N` key in it can be **overridden by the Sanity `sitePage` document for that path**, and the live site serves the CMS value. Agenda items, contact details, board members and the opening times live in Sanity (`activiteit`, `siteTeksten`). So:
- **Structural changes** (moving a block, adding a slot, menu, CSS): edit the code / `pages.json`.
- **Text, link and data changes**: edit them in Sanity. Use a migration script, `studio/scripts/update-oktober-feedback.ts`, built the same way as `update-september-feedback.ts`: back up first, refuse to run if drafts exist, run without `--apply` to preview, and patch with `ifRevisionId`. Also update the matching default in `pages.json` / `src/content/defaults.ts` so a reseed doesn't bring the old text back.
- Marcel planned to test the CMS (beheer) on 14-10. **The client may have edited CMS documents since then.** Diff against the live documents before patching, and never overwrite their edits blindly.
- Sanity drops trailing spaces from text values. Never rely on a trailing space inside a CMS text (that is the cause of item 1).

---

## 0. Decisions and inputs: status

| # | Topic | Status | Default if no answer |
|---|---|---|---|
| D1 | **Sponsordiner of 6 Nov has been POSTPONED.** The organiser's page https://acties.tegenkanker.nl/project/sponsordiner now says (checked 18-10): *"door onvoorziene omstandigheden … uitstellen tot een latere datum (waarschijnlijk in april 2027). Daarom kunt u niet meer inschrijven."* Ron's note of 13-10 predates this. | Confirm with Ron | Archive the 6 Nov event (it disappears from the agenda and the homepage). Still apply the photo and link fixes from item 12 so the event is ready for its new date. |
| D2 | Main menu: should "Jong & kanker" and "Voor naasten" be top-level items? Marcel's mockup screenshot has them. His AI notes that the later `v5b VOOR-DE-BOUWERS.md` says to keep them out. Marcel himself says the menu needs to be "samen scherp krijgen". | Confirm with Marcel | Follow the mockup screenshot (item 4). |
| D3 | **New PDFs in the new house style.** Ron has made them, but they are **not attached** to any email we received. | Blocked: ask Ron for the files | Do the alphabetical order and the heading fix now. Swap the files when they arrive (item 16). |
| D4 | Which activities suit young people (/jong-en-kanker, "Ron, zijn dit de juiste?"). Ron is taking stock, and specific youth activities are coming. | Waiting on Ron | Keep the current three cards. |
| D5 | Is the naasten text in the green "Op jouw manier" block on /voor-naasten right? (M, screenshot 17) Marcel's AI says it is already written from the naaste's point of view. | Waiting on Ron | No change. |
| D6 | WhatsApp floating button (Alfred's proposal). It depends on someone answering the messages. | Waiting on client | Not in this round. |
| D7 | Newsletter: which tool (Laposta, Mailchimp, or a manual list)? | Ask Ron | A simple signup form that sends to the contact worker (item 18). |

---

## A. Text and layout bugs

### 1. "stap.Kom" and "langsof" in the "Op jouw manier" block (M)
- **Where:** the `@firstSteps` template and the route pages with the same `first-step-panel` (`/ik-heb-kanker`, `/na-de-behandeling`, `/jong-en-kanker`, `/voor-naasten`). The h2 is `text "Zet de eerste stap."` `<br>` `<em>"Kom langs" <br> "of doe mee."</em>`.
- **Cause:** `approved.css` has `.first-step-intro h2 br:last-of-type{display:none}`, which hides **both** `<br>`s (each is the last of its type in its own parent). The CMS also stored the texts without their trailing space, so the words run together.
- **Fix (code, covers every page and future CMS edits):** in `Tree` (`src/next/Site.tsx`), render `br` as `<>{" "}<br/></>`. Also check the h2 still breaks as the mockup intends ("Zet de eerste stap." / "Kom langs of doe mee.") at 1440, 768 and 390 px.
- **Done when:** no glued words at any width on all 5 pages.

### 2. Facebook/Instagram icon sits on top of its label in the footer (M, screenshot 7 left)
- **Where:** the `@footer` "Even contact" column. `Tree` injects a lucide `<svg>` into `<a>`. `.footer-grid a{display:block}`, and Tailwind preflight makes the svg `display:block`, so it stacks above the text.
- **Fix (CSS, `src/next/site.css`):** `.approved-site .footer-grid a:has(> svg){display:flex;align-items:center;gap:8px;width:fit-content}` and `.approved-site .footer-grid a > svg{width:18px;height:18px;flex:none}`.
- **Done when:** the icon and the label are on one line at every width, as in the right-hand screenshot.

### 3. Logo larger, top and bottom (R)
- **Where:** `approved.css`. Header `.brand img` is `132×71` (desktop), `114×58` (≤1199), `91px` (≤360) and `134px` (the other override). Footer `.footer-logo` is `width:130px`.
- **Change:** about +30% at every breakpoint. Header desktop to **172 px** wide, ≤1199 to **148 px**, ≤360 to **118 px**. Footer `.footer-logo` to **170 px**. Put the overrides in `site.css`, not in the minified reference CSS.
- **Done when:** the nav still fits on one row at 1024 px, the mobile header doesn't wrap at 360 px, and the logo is visibly larger on the homepage top and bottom.

---

## B. Menu

### 4. Menu structure (M; screenshots 1, 2, 18, 19, 20)
**Remove the duplicates.** `Header` in `src/next/Site.tsx` (≈ line 111) auto-adds `<a href={href}>Overzicht {label}</a>` to every dropdown. That duplicates:
- Activiteiten: "Overzicht activiteiten" and "Agenda" go to the same page.
- Kennis: "Overzicht kennis" and "Kennis en wegwijzer" both go to `/kennis-en-wegwijzer`.
- Over Toon: "Overzicht over toon" and "Wie wij zijn" both go to `/over-ons`.

Delete that line. The dropdowns become:
- **Activiteiten:** Agenda (`/activiteiten#agenda`), Eerste bezoek, Praktisch
- **Kennis:** Kennis en wegwijzer, Centrum voor leven met en na kanker, Psychosociale ondersteuning, Voor verwijzers
- **Over Toon:** Wie wij zijn, Vrijwilliger worden, Steun ons, Onze sponsors, Verantwoording, Nieuws

**Add top-level links (D2):** the order matches the mockup: `Activiteiten ▾ · Jong & kanker · Voor naasten · Kennis ▾ · Over Toon ▾ · [Contact →]`.
- "Jong & kanker" goes to `/jong-en-kanker` and "Voor naasten" to `/voor-naasten`. They are plain links, with no chevron.
- Style them like `.nav-trigger` (same height, padding, font, hover). Mark the current page with `aria-current="page"`.
- Mobile menu: they appear between the groups, full width, same as the triggers.
- **Done when:** 1440 px matches mockup screenshot 1, no dropdown has two entries with the same destination, and the nav fits at 1024 px together with the larger logo (item 3).

---

## C. Visitor routes (next steps)

The cards in the "Wat zou jou nu helpen?" band (`section.choice-band#vervolgstappen`) are `link-N` in `pages.json`. Change them **in the CMS `sitePage`** and in `pages.json`.

### 5. /ik-heb-kanker (M, screenshots 9–11)
| Key | Card | Now | New |
|---|---|---|---|
| link-3 | Even praten | `/contact` | `/contact#kennismaken` (lands on the form; the long privacy text is removed in item 9) |
| link-4 | Ontspanning en ontmoeting | `#route-activiteiten` | `/activiteiten#agenda` |
| link-5 | Voor je partner of gezin | `/voor-naasten` | unchanged |

- **Move Henk's poem away from this page.** Remove the `site-slot poem` from the `audience-story` section. Change the class `has-poem` to `one-story`, the same structure as `/na-de-behandeling`.

### 6. /na-de-behandeling (M, screenshot 13)
- link-4 "Rustig weer iets ondernemen": `#route-activiteiten` becomes `/activiteiten#agenda`.
- **Add Henk's poem.** In section `audience-story`, change `one-story` to `has-poem` and add `{"tag":"site-slot","attrs":{"name":"poem"}}` after the `copy-section` "Ruimte voor herstel en de toekomst". The `@poem` template stays unchanged, including its title "Toon Over Leven" and the signature "Henk".
- **Done when:** the poem shows on /na-de-behandeling in the pink card next to the text, and is gone from /ik-heb-kanker.

### 7. /jong-en-kanker: its own contact form (M screenshot 14, R, AI check)
Marcel: "dit moet naar een ander soort contact pagina". Ron: "een apart contactformulier voor jongeren … laagdrempeliger dan een generiek formulier". No new page is needed; put the form **on the route page itself**.
- **New section** `#contact-jongeren`, placed after `#vervolgstappen` and before the `onward-band`. It is a new slot, `site-slot name="routeContact" route="jongeren"`.
  - eyebrow `Even contact` · h2 `Wil je even praten of langskomen?` · intro `Laat je naam en e-mailadres achter, dan nemen we contact met je op. Je hoeft niets uit te leggen.`
  - Make all three texts CMS-editable (texts on the page, not hardcoded).
  - Choice chips (required, one): `Een goed gesprek (1-op-1)` · `Even langskomen om te chillen` · `Meedenken over activiteiten`.
  - Fields: name (required), email (required), phone (optional), message `Wil je iets kwijt? (mag ook leeg)` (optional).
  - The submission's `onderwerp` = `Jong & kanker: <chosen chip>`, sent to the existing `/api/forms/contact` endpoint (no new worker route).
- **Implementation:** give `Formulier` a `keuzes?: {waarde,label}[]` prop and a `prefix?: string` prop that is prepended to `onderwerp`. Also read `?vraag=` (chip index or key) next to the existing `?activiteit=` reading, so a card link can preselect a chip.
- **Links** (`/jong-en-kanker`):
  | Key | Label | Now | New |
  |---|---|---|---|
  | link-1 | Ik wil even contact (hero) | `/contact` | `#contact-jongeren` |
  | link-3 | Een goed gesprek (1-op-1) | `/contact` | `?vraag=gesprek#contact-jongeren` |
  | link-4 | Even chillen | `/eerste-bezoek` | `?vraag=chillen#contact-jongeren` |
  | link-5 | Denk met ons mee | `/contact` | `?vraag=meedenken#contact-jongeren` |
  | link-8 | Vraag wat bij je past (green panel) | `/contact` | `#contact-jongeren` |
  | link-6 | Contact met leeftijdsgenoten | `/leeftijdsgenoten` | unchanged |
- Check that the internal router (`useInterneLinks`) handles a same-page `?vraag=…#…` link without a full reload and scrolls to the anchor.
- **Activities block** (Junk journal / Loop binnen / Even naar buiten): **no change until D4.**

### 8. /voor-naasten: its own contact form (M screenshots 12, 16, R)
- Same component as item 7, `route="naasten"`, section `#contact-naasten` after `#vervolgstappen`.
  - h2 `Even je eigen verhaal kwijt?` · intro `Laat je naam en e-mailadres achter, dan nemen we contact met je op voor een gesprek. Je mag ook zonder degene die ziek is komen.`
  - Chips: `Een gesprek voor mijzelf` · `Mijn ouder of partner heeft kanker` · `Na verlies`.
  - `onderwerp` = `Voor naasten: <chip>`.
- **Links** (`/voor-naasten`):
  | Key | Label | Now | New |
  |---|---|---|---|
  | link-1 | Ik wil even contact (hero) | `/contact` | `#contact-naasten` |
  | link-3 | Een gesprek voor mijzelf | `/contact` | `?vraag=gesprek#contact-naasten` |
  | link-4 | Mijn ouder of partner heeft kanker | `/contact` | `?vraag=ouder-partner#contact-naasten` |
  | link-5 | Na verlies, op jouw eigen moment | `/contact` | `?vraag=verlies#contact-naasten` |
  | link-7 | Vraag wat bij je past (green panel) | `/contact` | `#contact-naasten` |
- The green-block text stays as it is (D5).
- **Testing:** submit only with `LEAD_RECIPIENT` pointed at `hallo@jouwidealewebsite.nl` (check `wrangler.jsonc` first), and use `hallo@jouwidealewebsite.nl` as the visitor address too. Check that the mail subject reads `Bericht via de site · Jong & kanker: …`.

---

## D. Contact, privacy, About

### 9. /contact: drop the full privacy statement under the form (M screenshot 10, AI check)
- In the `/contact` tree, **remove `site-slot privacyStatement`** (its output is the "Privacy en cookies / Contact en kennismaken / Verwerking…" block).
- `privacy-jump` link: label `Lees onze privacyverklaring`, href `#privacyverklaring` becomes `/privacy`.
- The form's existing "Lees hoe we met je gegevens omgaan in onze privacyverklaring" line stays; it already links to `/privacy`.
- `/privacy` already has the `privacyDownload` slot, so nothing is lost.
- If the `privacyStatement` slot is no longer used anywhere, delete it from `Slot`.

### 10. /over-ons: swap the welcome block and the video (M screenshot 21)
- In the `/over-ons` tree, put `site-slot video` (`-mYRlxVqYzc`, "Een plek voor mensen, met ruimte voor het leven.") **before** `site-slot welcome` ("Onze deur staat open").
- Only on /over-ons. Other pages keep their order.

### 11. /eerste-bezoek: second paragraph of "Toon Hermans en de gedachte achter de huizen" (R)
Replace:
> Een warme huiskamer zonder witte jassen, waar je even op adem kunt komen. Ook Toon over Leven in Zeewolde deelt die visie: we zijn een veilige haven waar niets moet en waar de deur voor je openstaat.

with (verbatim from Ron):
> Een warme huiskamer zonder witte jassen, waar je even op adem kunt komen. Ook Toon over Leven in Zeewolde deelt die visie: we zijn een veilige haven waar niets moet en waar de deur voor je openstaat. Logisch, want tot medio 2026 heette onze stichting Toon Hermans Huis Zeewolde.

---

## E. Agenda and homepage

### 12. Sponsordiner (R, M); see D1 first
Apply these regardless, so the event is correct when it is rescheduled:
- **Photo:** convert `~/Downloads/Foto 1.png` to `public/img/approved/sponsordiner-classic-mike.webp` (sRGB, about 1600 px wide, q≈80). Upload it as `afbeelding` on the sponsordiner `activiteit` document and use it as the `/activiteiten/sponsordiner` hero. It replaces the current IPSO conversation photo.
- **Signup:** set `aanmeldUrl` = `https://acties.tegenkanker.nl/project/sponsordiner` and **clear `aanmeldEmail`**. The description's "via de knop 'Meld je aan!'" refers to the button on that page, so the button now leads to the right place. The button label becomes the existing `externalSignup` ("Aanmelden of meer informatie").
- **Directions (code):** `ActivityPractical` (`Site.tsx`) always links "Bekijk hoe je er komt" to `/praktisch#bereikbaarheid` (Mazerhard). Change it: if `a.locatie` is set and doesn't contain `Mazerhard`, link to `https://www.google.com/maps/search/?api=1&query=` + `encodeURIComponent(a.locatie)` (opens in a new tab). Otherwise keep `/praktisch#bereikbaarheid`.
- **Postponement (D1 default):** set `archief: true` on the 6 Nov event. On `/activiteiten/sponsordiner`, add one line under the intro: `Het sponsordiner van 6 november is uitgesteld. De nieuwe datum volgt.`

### 13. Remove the inloopavond (R: "komt te vervallen"; M: it was on Praktisch but not in the agenda)
- Sanity `siteTeksten.praktisch.openingstijden.avond`: set it to empty. In `src/content/defaults.ts:87`, remove the `avond` default. Make the Praktisch template **skip an empty fact line** (now it says "Elke derde donderdag van de maand van 19:30 tot 21:30 uur.").
- Remove the page `/activiteiten/inloopavond`: delete the template from `pages.json`, `inloopavond` from `activityTypes` (`src/next/model.ts:53`), and the option from the `activiteitType` list in `studio/schemas/activiteit.ts`. Add `"/activiteiten/inloopavond": "/activiteiten/inloopochtend"` to `VERHUISD` (`src/meta.ts`). Check `worker/seo.ts` and the sitemap for the path.
- Search `pages.json` and the CMS for `inloopavond|Inloopavond|19:30 tot 21:30|derde donderdag` and remove every remaining mention.
- Check that no `activiteit` document has `activiteitType: 'inloopavond'`.

### 14. Agenda October/November from Ron's flyers (R; M "klopt die?")
**Series (already in the CMS, check only):** `agenda-inloopochtend`, every Thursday 10:00–12:00. October: 1, 8, 15, 22*, 29. November: 5, 12, 19, 26*.
- Ron: *"Let op: Inloop 29 oktober ontbreekt in dit lijstje!"* (on the flyer). So **29 Oct is a normal inloopochtend.**

**"Inloop met activiteit" (Ron: "waar komt dit vandaan?"):** it came from the old WordPress agenda (`/activiteit/inloop-met-activiteit-<maand>/`, the last Thursday of the month, Oct–Jun). Ron's flyers have **"Inloop/Open atelier"** instead, on **22 Oct** and **26 Nov**. So:
- **Archive** the eight `agenda-confirmed-*` documents with `activiteitType: 'inloop-met-activiteit'` (Oct–Jun). Afterwards 29 Oct falls back to the normal inloopochtend automatically, because `vervangtReeks` stops applying.
- **Create** two one-off events, `Inloop / Open atelier`: Thu 22-10-2026 and Thu 26-11-2026, 10:00–12:00. Categories Inloop + Creatief, `vervangtReeks` = `agenda-inloopochtend`, no signup.
- Rename the activity type title in `activityTypes` and the studio list to "Inloop / Open atelier". The path `/activiteiten/inloop-met-activiteit` stays, so links keep working. Change the page's h1/intro to match.

**One-off activities to create** (dates still to come on 18-10; 1–15 Oct are in the past and are skipped). Take the description, photo, contribution and the signup yes/no **from the old-site page listed**. Ron: "bruikbare omschrijvingen … ook een foto/afbeelding. Ik denk dat we die prima kunnen overnemen."

| Date | Day | Title (from flyer) | Time | Category | activiteitType | Status | Old-site source for text + image |
|---|---|---|---|---|---|---|---|
| 21-10 | wo | Junk Journaling | 19:30–22:00 | Creatief | junk-journaling | | toonoverleven.nl/activiteit/workshop-junk-journaling/ |
| 23-10 | vr | Wandelen | 10:00–12:30 | Bewegen | wandelen | | toonoverleven.nl/activiteit/wandelgroep/ |
| 28-10 | wo | Mixed Media | 10:30–13:00 | Creatief | *(new: mixed-media)* | | toonoverleven.nl/activiteit/workshop-mixed-media-6/ |
| 02-11 | ma | Meditatie | 10:00–11:30 | Wellness | zenmeditatie | | toonoverleven.nl/activiteit/mediteren-bij-toon-over-leven/ |
| 10-11 | di | Kerstbal stippen | 13:30–16:00 | Creatief | mandala-stippen | | toonoverleven.nl/activiteit/kerstbal-stippen-mandala-stippen-voor-kerst/ |
| 11-11 | wo | Encaustic Art kerst | 10:30–13:00 | Creatief | encaustic-art | | toonoverleven.nl/activiteit/encaustic-art-kerst/ |
| 16-11 | ma | Mandala stippen | 13:30–16:00 | Creatief | mandala-stippen | **volgeboekt** | toonoverleven.nl/activiteit/2936/ |
| 18-11 | wo | Junk Journaling | 19:30–22:00 | Creatief | junk-journaling | **volgeboekt** | toonoverleven.nl/activiteit/workshop-junk-journaling-7/ |
| 25-11 | wo | Mixed Media | 10:30–13:00 | Creatief | mixed-media | | toonoverleven.nl/activiteit/workshop-mixed-media-7/ |
| 27-11 | vr | Wandelen | 10:30–13:00 | Bewegen | wandelen | | toonoverleven.nl/activiteit/2904/ (check the date) |

- For the ones marked **volgeboekt**, set `volgeboekt: true`. The flyer says "(vol)".
- **mixed-media** is a new activity type. Add it to `activityTypes` + the studio list. A `/activiteiten/mixed-media` page is optional; leave it out unless it's cheap, since the event pages are enough.
- Download the old-site images into `raw/oude-site/` first (Ron: back up the old site before the switch). Process them through `scripts/images.mjs`.
- Keep `doelgroepen: ['iedereen']` unless Ron answers D4.
- Alfred has said the agenda gets set up for good right before going live. Re-check the old site's `/agenda/lijst/` then for anything newer than these flyers.
- **Done when:** /activiteiten#agenda lists exactly the flyer moments from today onwards, plus the Thursday series. There is no inloopavond, no "Inloop met activiteit" and no 6 Nov diner (D1). 22 Oct and 26 Nov show "Inloop / Open atelier", and 29 Oct shows a normal Inloopochtend.

### 15. Homepage "Binnenkort bij Toon" (M screenshots 3/4)
Right now it shows three inloopochtenden in a row because the agenda contains almost nothing else. Item 14 fixes most of this (the next three become Junk Journaling / Open atelier / Wandelen). Also guard it in code:
- `case "upcoming"` in `Site.tsx`: take the next 3 activities but **at most one per `activiteitType`**, so never two inloopochtenden.
- **Done when:** the homepage shows three different activities.

---

## F. Wording, data, documents

### 16. Organisation and accountability (`/over-ons/organisatie-en-verantwoording`) (R, M screenshot 22)
- **Intro under "Organisatiegegevens"** now reads: "Toon over Leven is de publieksnaam van Stichting Toon Hermans Huis Zeewolde. In formele documenten en bij een donatie kun je die stichtingsnaam tegenkomen." Replace it with:
  > Stichting Toon over Leven is sinds medio 2026 de opvolger van Stichting Toon Hermans Huis Zeewolde. In formele documenten en bij een donatie kun je die stichtingsnaam nog tegenkomen.
- **Table:** Stichtingsnaam `Stichting Toon Hermans Huis Zeewolde` becomes **`Stichting Toon over Leven`**. Publieksnaam stays `Toon over Leven`. (Ron: "stichtingsnaam en publieksnaam zijn beide (Stichting) Toon Over Leven". Keep the site's spelling "Toon over Leven".)
- **Telefoon row:** `036 845 02 65` becomes `036 845 02 65 / 06 38 52 90 60` (item 17).
- **Bestuur** (`siteTeksten.verantwoording.bestuur`): insert `Marcel van Kasteel · Vice-voorzitter` **directly after** Henk de Vries · Voorzitter.
- **Raad van Advies** (`siteTeksten.verantwoording.advies`):
  - `Mike Kastrop` becomes `Mike Kastrop` with rol `ondernemer in Zeewolde, eigenaar van Classic Mike`.
  - Add `Klaske Vriesinga` with rol `notaris te Zeewolde`.
  - (Ron: one or two names will follow later. Nothing to do now.)
- **Heading** `Vrijwilligersbeleid en afspraken` becomes `Vrijwilligersbeleid en -afspraken`. Make the same change in the "Op deze pagina" nav label.
- **Volunteer documents in alphabetical order** (now, with the current files): AVG-spelregels · Gedragscode en houding · Klachtenformulier · Klachtenprocedure · Vertrouwenscontactpersoon · Vrijwilligersovereenkomst · Vrijwilligersreglement · Wet- en regelgeving.
- **New PDFs (D3):** the links still point to `toonoverleven.nl/wp-content/uploads/2025/06/*-THHZ.pdf`. When Ron's files arrive, upload them to Sanity (or `public/documents/`, the same place as the privacy PDF), relink, and keep the alphabetical order. **Don't leave links pointing at the old WordPress host.** It will go offline when the domain switches over, so this has to be done before going live even without the new versions. If no new files arrive, download the current ones and host them ourselves.
  - Ask whether the same applies to the "Beleidsplan en jaarstukken" PDFs. They are also on the old host.
- **The same name fix elsewhere:** the privacy statement opens with "Stichting Toon Hermans Huis Zeewolde (Toon over Leven), Mazerhard 37…". Change that to "Stichting Toon over Leven, Mazerhard 37 3891 BR Zeewolde, …" in the `/privacy` CMS page. Then regenerate `public/documents/privacyverklaring-toon-over-leven.pdf` (`scripts/privacy-pdf.py`) and replace the `privacyFile` asset. Search the CMS and `pages.json` for `Toon Hermans Huis` and leave only the historical mentions (Toon Hermans' story and the new eerste-bezoek sentence).

### 17. Add the mobile number everywhere the landline appears (R)
Ron: "Vermelding van het mobiele nummer naast het vaste nummer geldt … voor alle plaatsen waar het vaste nummer nu vermeld staat."
- **Data:** add `mobiel` to `siteTeksten.praktisch.contact` (`studio/schemas/siteTeksten.ts:14`, `src/content/types.ts:181`, `src/content/defaults.ts:111`). Value `06 38 52 90 60`, tel link `tel:+31638529060`.
- **Show it** as two separate tap-able links: `036 845 02 65` and `06 38 52 90 60`. Places:
  1. footer "Even contact" (`@footer`: add a second `<a data-contact="mobile">` with a `fact contact.mobiel` slot, and handle `data-contact="mobile"` in `Tree`)
  2. `/contact` "Liever even bellen?"
  3. `/praktisch` "Bel 036 845 02 65" (add "of 06 38 52 90 60")
  4. `Formulier`: the "Liever bellen of mailen? Dat kan ook: …" line and the success message
  5. `/over-ons/organisatie-en-verantwoording` Telefoon row (item 16)
  6. `/privacy` "Je rechten en vragen" ("…of bel 036 845 02 65")
  7. `worker/index.ts:56`, the confirmation email "bel 036-8450265", and the same sentence in the activity worker config
- Finally, search `src/`, `worker/`, `pages.json` and a CMS export for `845 02 65|8450265|31368450265`. Every hit needs the mobile number next to it.

### 18. Newsletter signup is missing (R)
- Homepage `@newsletter` block: "Nieuws van Toon in je mailbox / Hier kun je je binnenkort aanmelden…". It has no form.
- **Default (D7):** email field (required) + name (optional) + button `Aanmelden`. It posts to `/api/forms/contact` with `onderwerp: 'Aanmelding nieuwsbrief'`, and the confirmation text is `Dank je wel, je bent aangemeld voor de nieuwsbrief.` The intro becomes `Ontvang af en toe nieuws over activiteiten en ontwikkelingen bij Toon over Leven.` If Ron names a tool, use its embed or API instead.
- Add one sentence to the privacy statement for this processing (email address for the newsletter, unsubscribe at any time).

### 19. "Vrije inloop" becomes "Inloop zonder afspraak" (R: "doet me aan vrije uitloop bij kippen denken")
- `Site.tsx` `visitAddress` h3 `Vrije inloop`
- `Site.tsx` `ActivityCards` label `"Vrije inloop"`
- Search `pages.json` + the CMS for `[Vv]rije inloop` and replace every hit (keep the capitalisation fitting where it stands).

---

## G. Out of scope this round
- CMS (beheer) testing: Marcel will report back.
- WhatsApp button (D6), youth activities (D4), extra Raad van Advies names.
- Design differences between the agenda cards and the mockup. Marcel's AI check confirms the mockup used example dates that have passed. This is not a bug.

## H. Check before reporting back
1. `pnpm --filter @jiw/toonoverleven lint` and `build`.
2. Browser check at 1440 / 1024 / 390 px: home, /ik-heb-kanker, /na-de-behandeling, /jong-en-kanker, /voor-naasten, /contact, /over-ons, /over-ons/organisatie-en-verantwoording, /eerste-bezoek, /praktisch, /activiteiten, one event page, and /activiteiten/inloopavond (should 301).
3. Run each item's "done when".
4. Form tests only against `hallo@jouwidealewebsite.nl` (both sides).
5. Write a short change report for Marcel and Ron that says, per item, what changed. List D1–D7 separately as questions.
