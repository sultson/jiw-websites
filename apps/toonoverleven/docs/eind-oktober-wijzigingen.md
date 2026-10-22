# Toon over Leven: late-October round, done and open

Source: `Toon-over-Leven-agent-handoff.md` (22-10-2026), built from the mails of Marcel and Ron of 19–21 October.
Live on toonoverleven.jouwidealewebsite.nl since 22-10-2026. Code and CMS were changed together. The CMS migration is
`studio/scripts/update-eind-oktober.ts`, and its backup is `raw/cms-backups/before-eind-oktober-*.json`.

## Done

**Signing up and asking questions (Marcel 21-10, Ron 19-10)**
- New page `/aanmelden`. It has a choice at the top: **Aanmelden** or **Vraag**. It uses Marcel's text, including "Leuk dat je mee wilt doen!", the field labels, "Je hoeft hier niets over je gezondheid…" and the thank-you message.
- When you register, you choose an activity and date, then fill in name, e-mail, phone (optional), number of people (1–5) and a comment or question (optional).
- When you ask a question, you don't choose an activity or date; the question itself is required.
- Every "Aanmelden of meer informatie" button on an activity now goes to `/aanmelden/<activiteit>/<datum>` with that moment already selected. Opening `/aanmelden` directly shows a list of every activity that needs signing up; full ones are greyed out.
- No mail is sent to say a place is confirmed. The visitor reads, and receives by mail, that the house will let them know whether there is room. Signing up does not add anyone to the newsletter.
- The activity descriptions no longer say "stuur een mailtje om je aan te melden". They point to the button instead. On full workshops they point to the question form.
- Activities without signing up, such as the inloop, have a "Heb je een vraag?" link.
- `/contact`: the form now has a choice between "Ik wil kennismaken" and "Ik heb een vraag". A question needs no appointment.
- Mail: registrations go through `/api/forms/activity`, which still checks the moment against the agenda. Questions go through the new `/api/forms/vraag`. Both are sent to `LEAD_RECIPIENT`, which is `info@toonoverleven.nl`. Tested locally with simulated sending to hallo@jouwidealewebsite.nl. Nothing was submitted to production.
- All the new form texts can be edited in the CMS under "Formulieren en vaste labels".

**Sponsors (Ron 21-10)**
- Removed 11 sponsors: Café het Plein, Kinderveiligheidswinkel, Auto Zuiderzee, Bevri, Chris Koelewijn, Diergigant, Harton, Oog van de Dag, Ribbootwinkel, Secondant2, Tegeldepot.
- Added Swim to Fight Cancer Zeewolde, Oranje Fonds, Notaris Vriesinga and Vakgarage JWS, made from Ron's own files. The Swim to Fight Cancer logo was cut to its round badge, without the blue background.
- The homepage now shows all 14 sponsors (two rows on desktop). Ron's four come first: Vaillant Fonds, Windpark, Swim to Fight Cancer, Oranje Fonds.
- Steun ons: "vriend worden" and "sponsoring" now go to penningmeester@toonoverleven.nl. "Onze deur staat open" and "Liever even contact?" are gone. Onze sponsors: "sponsoring" also goes to penningmeester@.

**Privacy (Ron's document of 19-10)**
- `/privacy` contains Ron's text in full. In his document `[bewaartermijn invullen]` was already a tracked deletion, so the IPSO line reads "niet langer … dan noodzakelijk". The separate 24-month line is still there.
- The download PDF has been regenerated from this text.
- Checked against how the site actually works:
  - Forms go to the mailbox.
  - No form has a medical field.
  - Signing up does not add anyone to the newsletter.
  - YouTube only loads after the visitor clicks, and "Video sluiten en toestemming intrekken" removes the player.
  - SponsorKliks is an ordinary link.
  - The copy of each form submission in our storage (R2) is deleted after 90 days, which is within the 24 months.

**Documents (Ron 19-10, 20:24)**
- The eight final PDFs are under `public/documents/*-202610.pdf`, in alphabetical order. IPSO privacy-spelregels replaces AVG-spelregels; it is a newer version of the same document.
- The old files were removed, so their addresses now return 404.
- Checked: the complaints procedure contains Marcel's three corrections, and every file says "Versie oktober 2026" (the IPSO one has no footer).

**Logos**
- Header logo is 148 px instead of 172 px, and the header is 88 px tall instead of 100 px (72 px on a phone).
- Footer logo is 200 px instead of 170 px. This applies only to the four-column footer, where the green band stays 359 px tall.

**Agenda**
- The sponsordiner of 6 November has been removed, along with its page, photo, link to tegenkanker.nl and fallback data. Old addresses 301 to /activiteiten.
- Following Ron's flyer:
  - Open atelier on 22 October, and a normal inloopochtend on 29 October.
  - The walk on 27 November is 10:30–13:00.
  - The evening inloop stays removed.

**Checks**
- `pnpm lint` and `pnpm check:approved` pass (41 pages).
- The check script had fallen behind since the 18 October round. It now knows the new state: the poem is on /na-de-behandeling, there are 14 sponsors, it checks /documents links against the files, and it accepts registration addresses.

## Open

1. **Websites for the four new sponsors** are unknown, so their logos are not clickable. They can be added in the CMS under Sponsoren → Website.
2. **Walk on 27 November**: the flyer says 10:30–13:00 and we used that. The old description said "koffie 10.00, vertrek 10.30"; that line has been removed for this date.
3. **Agenda before going live**: check it again against the newest flyer.
4. **Not part of this round** (handoff §7):
   - CMS handover to Marcel (Armando).
   - Youth activities (Ron).
   - WhatsApp button.
   - Backing up the old site before the switch.
5. The sponsordiner photo is still in the Sanity media library, but nothing refers to it any more.
