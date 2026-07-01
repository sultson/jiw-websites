# Hoeve de Kooipolder Pedicuresalon — Build Spec

One-page site, Vite + React 19 + TS + Tailwind v4. Style follows `apps/smooth-by-lau`
closely (airy, editorial, serif headings, rounded-full buttons) but with the lilac
brand palette already defined in `src/index.css` (cream / lilac / lilac-deep / ink).
Fonts: Cormorant Garamond (headings) + Inter (body), already imported.

## Hard rules

- NO em dashes anywhere (no `—`, no `–` used as em dash). Use commas, periods or "|".
- No filler phrases, no fake stats, no invented facts, no invented owner name
  (owner name is unknown; she writes in first person "ik" but we write about the
  salon, or use "de pedicure" / "zij"). Female owner, confirmed.
- NL copy uses the formal "u" form (older clientele). EN translations natural, not literal.
- Never repeat the same photo in two places. Never repeat the same info nugget
  (e.g. "afspraak verplicht") in more than one section.
- Components: default export, props `{ t: (k: string) => string }` plus
  `lang: 'nl' | 'en'` and `setLang` only where listed in App.tsx.
- Use `lucide-react` for icons. Buttons/cards: use the `.btn-primary`, `.btn-lilac`,
  `.btn-outline`, `.kicker`, `.card`, `.rule` classes from index.css.
- Mobile-first responsive, sections get `id` anchors: about, behandelingen,
  fotos, bezoek, faq.

## Facts (the only facts you may use)

- Name: Hoeve de Kooipolder Pedicuresalon
- Pedicuresalon at home on a hoeve (farmhouse, built recently, brick with dark tiled
  roof, lavender + leilinden in front) at Zeedijk 16, 3329 LC Dordrecht. Rural polder
  edge of Dordrecht: fields, quiet, easy parking on the yard.
- Phone: display "06 28 57 77 11", link `tel:+31628577711`
- WhatsApp: `https://wa.me/31628577711`
- Email: hoevedekooipolder@gmail.com
- Maps: https://maps.google.com/?cid=17446167066350775375
- Facebook: https://www.facebook.com/p/Hoeve-De-Kooipolder-Pedicuresalon-100094300916991/
- Hours: ma gesloten, di 09:00-21:00, wo 09:00-17:00, do gesloten,
  vr 09:00-17:00, za 09:00-14:00, zo gesloten. (di avond open!)
- Treatments + REAL prices (updated June 2026):
  - Basisbehandeling €33,50: knippen van de nagels, verzorgen van de nagels, voetcrème
  - Basisbehandeling + €38,50: knippen + verzorgen van de nagels, eelt verwijderen,
    afvlakken van de nagels (kalknagels), kloven behandelen, likdoorn verwijderen,
    ingroeiende nagel behandelen, voetcrème
  - Gellak op de teennagels €25
  - Voetenbad met lavendel badkristallen (extra verwennerij, no price known)
  - Aan huis €45: if you can't come to the salon (slecht ter been, geen trap), she comes
    to you with her koffer.
- Products used/sold in the salon: Green Rabbit Originals foot creams (vegan,
  natural ingredients, cruelty-free, softens droge hielen/ruwe plekken) and
  Yodeyma parfums (sold in salon).
- Appointment only (afspraak verplicht). Cancellations at least 24 hours in advance;
  late cancellations may incur a charge. Pay by pin or contactless. Toilet present.
- ProVoet member and qualified pedicurist.
- Booking: PHONE primary, WhatsApp secondary. No online booking. No prices invented.
- Google: 5.0 from only 2 ratings, NO review texts exist. There is NO reviews
  section. Do not mention review scores anywhere.

## Files & ownership (do not touch files owned by others)

- App.tsx (already written, the integration contract; read it)
- index.css theme (already written)
- translations.ts + data/services.ts + data/hours.ts  → COPY AGENT
- public/* webp assets + data/gallery.ts + MEDIA.md   → MEDIA AGENT
- Nav, Hero, UspStrip, LangToggle, WhatsAppBubble, StickyCallCta → AGENT A
- About, Visit, Faq, Footer                            → AGENT B
- Services, Products, Gallery, Lightbox                → AGENT C

## Media manifest (final public/ filenames, media agent produces exactly these)

- logo.webp (transparent, trimmed, ~480px) + favicon.png (64) + apple-touch-icon.png (180)
- hero-bg.webp (~2000w, from edge-to-edge-bg.png) + hero-bg-mobile.webp (~1080w,
  portrait-ish crop centered on the farmhouse)
- og-preview.jpg (1200x630)
- about-hoeve.webp        (raw-media/hoeve-front-2026.jpg, farmhouse front + lavender)
- visit-luchtfoto.webp    (raw-media/gmaps-foto-1.jpg, second drone angle)
- products-green-rabbit.webp (green-rabbit-producten.jpg)
- products-yodeyma.webp   (yodeyma-parfum-1.jpg or -2, pick best ONE)
- gallery-*.webp: 8-10 treatment photos picked from pedicure-nov23-1/2/3,
  gellak-mrt25-1/2, gellak-nov24, gellak-okt24-1/2, gelnagels-jun25-1/3
  (NOT jun25-2, low-res; NOT graphics/prijslijst/logo dupes; NOT yodeyma-kerst).
  Semantic names, e.g. gallery-pedicure-1.webp, gallery-gellak-rood.webp.

`src/data/gallery.ts` exports:
`export type GalleryItem = { src: string; altNl: string; altEn: string };`
`export const galleryItems: GalleryItem[] = [...]` (order: mix, strongest first).

## Sections & translation keys (copy agent writes ALL of these keys, both langs;
component agents use EXACTLY these keys)

Nav: nav.about, nav.services, nav.gallery, nav.visit, nav.faq, nav.call ("Bel 06 28 57 77 11"), nav.callShort ("Bel")
Hero: hero.kicker (location), hero.title (2 lines, \n), hero.sub, hero.ctaCall, hero.ctaApp, hero.note (one quiet line, e.g. alleen op afspraak)
UspStrip: usp.1t/.1s, usp.2t/.2s, usp.3t/.3s, usp.4t/.4s
  (1: landelijke rust aan de Zeedijk; 2: persoonlijke aandacht, één klant tegelijk
   feel without inventing; 3: ook aan huis; 4: pinnen of contactloos)
About: about.kicker, about.title, about.body1, about.body2, about.certification,
  about.imgAlt
  (the hoeve story: salon at the farmhouse on the polder edge of Dordrecht, quiet
   rural setting, fixed clientele incl. older customers feel welcome; do NOT repeat
   USP texts literally)
Services: services.kicker, services.title, services.intro,
  services.note (voetenbad price line), services.cancelPolicy,
  services.home.title, services.home.price, services.home.body (aan-huis card),
  services.priceLabel not needed; prices come from data/services.ts
Products: products.kicker, products.title, products.gr.title, products.gr.body,
  products.yo.title, products.yo.body
Gallery: gallery.kicker, gallery.title
Visit: visit.kicker, visit.title, visit.body (route/parking, rural dike location),
  visit.hoursTitle, visit.addressTitle, visit.maps (button label), visit.closed,
  visit.imgAlt
Faq: faq.kicker, faq.title, faq.q1..q8, faq.a1..a8
  (1 afspraak maken: bellen of appen; 2 aan huis;
   3 betalen: pin/contactloos; 4 producten: Green Rabbit/Yodeyma kort;
   5 gellak mogelijk na pedicure; 6 waar precies / parkeren;
   7 annuleren minimaal 24 uur vooraf; 8 ProVoet + gediplomeerd)
Footer: footer.tagline, footer.contactTitle, footer.hoursTitle, footer.followTitle,
  footer.rights
WhatsApp/Sticky: wa.aria ("WhatsApp openen"), sticky.call (label)

## data/services.ts (copy agent)

export type Service = { id: string; nameNl: string; nameEn: string;
  price: string | null; itemsNl: string[]; itemsEn: string[];
  noteNl?: string; noteEn?: string };
Basis (€33,50), Basis+ (€38,50) with the exact bullet lists above; gellak (€25)
and voetenbad as smaller items; voetenbad has price null.

## data/hours.ts (copy agent)

export type DayRow = { dayNl: string; dayEn: string; hours: string | null };
Monday-first array; null = closed. "09:00 - 17:00" format with hyphen, NOT em dash.

## Layout notes

- Hero: full-bleed bg image (hero-bg.webp desktop / hero-bg-mobile.webp <md via
  <picture>), soft dark/lilac gradient overlay for text legibility, white text,
  logo NOT in hero (it's in Nav), CTAs: btn-lilac (bel) + btn-outline white-ish
  (WhatsApp). Address pill with MapPin icon.
- Nav: real logo.webp top-left (rounded, ~40px) + wordmark text; transparent over
  hero then solid cream on scroll (like smooth-by-lau Nav); mobile menu as overlay
  rendered OUTSIDE any backdrop-blur ancestor (sibling, not child of blurred header).
- Gallery: horizontal auto-scrolling marquee strip (CSS keyframes, duplicated track,
  pause on hover), click opens Lightbox (keyboard: Esc, arrows; focus trap not
  required). Images lazy, fixed aspect (4:5-ish tiles).
- Services: two big price cards (Basis, Basis+) + two slim rows (gellak, voetenbad)
  + aan-huis highlight card in lilac-wash with Home icon.
- WhatsAppBubble: fixed bottom-right, green (#25D366) round button, visible desktop
  AND mobile, aria-label, sits above StickyCallCta on mobile (bubble bottom-20 on
  mobile, bottom-6 desktop).
- StickyCallCta: mobile-only bottom bar (like smooth-by-lau StickyBookCta) with
  tel: link, hides when user is at hero (optional: appear after scrolling past hero).
- Footer: ink background, cream text, logo + tagline, contact column, hours column,
  socials (Facebook icon), bottom line: © year + name. NO fake links.
- Visit: hours table (today highlighted), address card with maps button,
  visit-luchtfoto.webp image.
- Reveal-on-scroll animations: keep light, IntersectionObserver + opacity/translate
  (copy smooth-by-lau patterns if present). No backdrop-filter on cards.
