# GuySa Inboedels — SEO, beginstand

Bijgewerkt 01-11-2026, de dag dat de site van `jiw-concepts/guysa` naar
`apps/guysa` is verhuisd. Dit is de nulmeting: wat er nu staat, waarom, en wat
de volgende stap is.

## Het adres

`https://guysa.jouwidealewebsite.nl` — ons adres, niet dat van de klant.
Staat als `SITE_URL` in `site.config.mjs` en komt daar vandaan in de canonical,
in `og:url`, in de sitemap, in de schema.org blokken en in de bevestigingsmail.
Bij een verhuizing is dat één regel; `pnpm audit:seo` rekent na of alles
meeverhuisd is.

### De canonical is veranderd, en dat is een keuze

In het concept wees de canonical naar `https://guysa-inboedels.be/`, de eigen
site van GuySa. Dat is netjes bedoeld en betekent letterlijk: "wat hier staat
telt niet mee, kijk daar maar". Een pagina met zo'n canonical wordt niet
geïndexeerd, dus er viel aan de vindbaarheid van deze site niets te meten en
niets te verbeteren.

Sinds 01-11-2026 wijst de canonical naar deze site zelf. Daarmee kan hij
geïndexeerd worden en is er iets te volgen in Search Console.

De keerzijde hoort erbij en is geen detail: **er staan nu twee vindbare sites
over hetzelfde bedrijf**, op dezelfde zoekwoorden, in dezelfde regio.
`guysa-inboedels.be` geeft op dit moment een 200. Dat is te verdedigen zolang
dit een voorstel is dat nog loopt, maar het mag geen eindsituatie worden:

- **Wordt GuySa klant** — de site verhuist naar hun eigen domein, `SITE_URL`
  wordt dat domein, en `guysa.jouwidealewebsite.nl` komt in `ANDERE_HOSTS` in
  `worker/index.ts` te staan en stuurt met een 301 door.
- **Gaat het niet door** — dan hoort hier `noindex` op, of gaat het adres uit
  de lucht.

## Wat er nu technisch staat

| | |
|---|---|
| Voorgerenderd | Ja. `scripts/prerender.mjs` bakt beide pagina's als complete HTML. Het concept was een lege `<div id="root">`: een crawler zonder JavaScript zag nul woorden. Nu staan er 1143 woorden in de HTML van de startpagina. |
| Sitemap | `dist/sitemap.xml`, geschreven uit `PAGINAS`. `lastmod` komt uit de laatste commit die de pagina echt raakte, niet uit de builddatum. |
| robots.txt | Eén `User-agent: *` met `Allow: /`, plus de sitemap. Taalmodellen mogen expliciet binnen. |
| Canonical / og:url | Zelfverwijzend, afgedwongen door `scripts/audit-seo.mjs`. |
| Deelplaatje | `og-home.webp`, 1200x630, getekend door `scripts/beeld.mjs`. |
| schema.org | `MovingCompany` (met `@id`, telefoon, mail, `serviceArea` als GeoCircle van 25 km, 15 gemeentes in `areaServed`, vier diensten), `WebSite`, en `FAQPage` met dezelfde vijf vragen die als tekst op de pagina staan. De audit controleert dat die twee niet uit elkaar lopen. |
| 404 | Echte pagina met status 404 (`not_found_handling: "404-page"`), `noindex, follow`, niet in de sitemap. |
| Letters | Zelf gehost in `/fonts`, met preload. Het concept haalde ze bij Google op: twee extra DNS-opzoekingen vóór de eerste letter op het scherm. |
| Beeld | webp in plaats van jpeg, hero met `fetchpriority="high"` en een preload, de rest lazy met `width`/`height` erop tegen verspringen. |
| Stijlblad | In de pagina zelf, dus geen tweede verzoek vóór het eerste beeld. |
| IndexNow | Sleutel staat in `public/`; `pnpm indexnow` meldt de sitemap aan bij Bing en Yandex (en daarmee bij ChatGPT en Copilot). |

## Wat er bewust *niet* in zit

- **Review-opmaak.** Er staan zes echte Google-reviews op de pagina. Die als
  `Review`/`aggregateRating` markeren mag niet: beoordelingen die een bedrijf
  op zijn eigen site verzamelt of overneemt komen niet in aanmerking voor rich
  results, en het is een reden voor een handmatige maatregel. De reviews staan
  er als gewone tekst.
- **Een vestigingsadres.** GuySa werkt vanuit de bestelwagen en heeft geen
  balie. Een adres dat wij erbij verzinnen komt in schema.org terecht en
  daarmee in Google. Zonder adres is er wel een `serviceArea`, en dat is wat
  klopt.
- **`keywords`-meta.** Stond in het concept, is eruit. Google gebruikt hem niet
  en een rij zoekwoorden achter elkaar leest als spam.
- **Openingstijden.** Niet bekend, dus niet opgeschreven.

## De volgende stap, en waarom hij nog niet gezet is

De site is één lange pagina met ankers. Die kan hoogstens voor één
zoekopdracht de beste zijn, en de zoekwoorden waar GuySa op gevonden wil
worden zijn er minstens vier:

| Zoekopdracht | Hoort op |
|---|---|
| inboedel opruimen Antwerpen, woning ontruimen | `/inboedel-opruimen/` |
| inboedel opkopen, inboedel verkopen | `/inboedel-opkopen/` |
| ontruiming na overlijden, nalatenschap leegmaken | `/ontruiming-na-overlijden/` |
| huisontruiming Mortsel / Boechout / Lier / Edegem | een pagina per gemeente |

Dat is de grootste winst die er nog te halen valt, en hij is niet gezet omdat
er tekst voor nodig is die GuySa zelf moet aanleveren. Wat er nu op de site
staat is bij elkaar genoeg voor één pagina, niet voor vier van 400 woorden.
Vier dunne pagina's uit dezelfde alinea's knippen maakt de vindbaarheid
slechter, niet beter.

**Wat er per pagina nodig is, en alleen GuySa kan geven:** twee of drie echte
klussen uit die categorie (wat er stond, hoe lang het duurde, wat het kostte of
opleverde), waar de valkuilen zitten, en een foto van dat werk. Bij de
gemeentepagina's: of ze er echt komen en wat er in die gemeente anders is
(appartementen zonder lift, smalle straten, een containerpark met eigen regels).

Een gemeentepagina zonder dat is een zoek-en-vervangpagina, en daar rekent
Google sinds de helpful-content-updates hard op af.

## Open punten

- **Search Console.** `guysa.jouwidealewebsite.nl` is nog niet als property
  aangemeld en de sitemap is nog niet ingediend. Zonder dat is er geen meting.
- **Bing Webmaster Tools.** Zelfde verhaal; `pnpm indexnow` werkt los daarvan.
- **R2-levensduur.** De bijlagen van het formulier komen onder het prefix
  `guysa/` in `jiw-form-uploads-prod`. Daar hoort een lifecycle-regel op, zoals
  bij de andere sites. Let op: die API vervangt de hele regelset, dus eerst
  uitlezen en de bestaande regels meesturen.
- **Afzenderdomein.** De bevestiging gaat nu vanaf
  `no-reply@notify.jouwidealewebsite.nl`. Zodra GuySa klant is, hoort daar een
  `notify.`-subdomein van hun eigen domein te komen met DKIM, SPF en DMARC in
  Cloudflare Email Service.
