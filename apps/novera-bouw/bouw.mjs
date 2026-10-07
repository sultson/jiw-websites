// Bouwt dist/ uit pagina/ en src/. Eén schil, twee talen, meerdere pagina's.
// Draai: node bouw.mjs   (of: pnpm --filter @jiw/novera-bouw build)
//
//   pagina/*.html      -> dist/*.html        (Nederlands, /badkamer)
//   pagina/en/*.html   -> dist/en/*.html     (Engels,     /en/bathroom)
//   src/*              -> dist/*             (styles.css, app.js, img/, favicon, 404)
//
// De schil staat één keer in pagina/_schil.html. Alles wat daarin tekst is
// (menu, voet, knoppen, schema) komt uit SCHIL hieronder, per taal.
//
// dist/ wordt bij elke build weggegooid en opnieuw geschreven. Bewerk pagina/ en src/,
// nooit iets in dist/.
import { readFile, writeFile, readdir, mkdir, rm, cp, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const PAG = path.join(HIER, 'pagina')
const SRC = path.join(HIER, 'src')
const DIST = path.join(HIER, 'dist')
const SITE = 'https://noverabouw.nl'

/* ── de gegevens van het bedrijf ───────────────────────────
   Deze stonden tot de overzetting alleen in src/app.js en werden door de browser
   op de pagina gezet. Daarmee stond het telefoonnummer nergens in de HTML, en dat
   is precies wat een zoekmachine van een plaatselijk bouwbedrijf wil lezen. Nu
   zet bouw.mjs ze erin, en app.js raakt ze niet meer aan.
   telefoon/whatsapp in E.164 zonder +. */
const BEDRIJF = {
  telefoon: '31648569040',
  whatsapp: '31648569040',
  naam: 'Ekrem',
  // Nog geen mailbox op het eigen domein. Zodra die er is komt hij hier, dan staat
  // hij op de contactpagina en in de voet.
  email: '',
}

// 31648569040 -> 06 48 56 90 40
function telLeesbaar(nummer) {
  if (!nummer.startsWith('31')) return '+' + nummer
  const kaal = '0' + nummer.slice(2)
  return kaal.replace(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
}

/* De drie pictogrammen van de contactkaarten. Stonden in app.js; nu hier, want de
   kaarten worden hier geschreven. */
const IC = {
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6.5 3z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.8 8.4c.3-.7 1.4-.6 1.7 0l.5 1.1-.7.8a5 5 0 0 0 2.9 2.9l.8-.7 1.1.5c.6.3.7 1.4 0 1.7-1.4.6-3.6-.3-5-1.7s-2.3-3.6-1.3-4.6z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
}

/* Dezelfde zinnen die app.js gebruikte, nu per taal op één plek. */
const CONTACTWOORDEN = {
  nl: { belOns: 'Bel ons', uKrijgt: ', u krijgt ', waBij: 'Stuur uw klus of een foto', mailOns: 'Mail ons', bel: 'Bel ', ofWa: 'Of stuur een WhatsApp' },
  en: { belOns: 'Call us', uKrijgt: ', you get ', waBij: 'Send us the job or a photo', mailOns: 'Email us', bel: 'Call ', ofWa: 'Or send a WhatsApp' },
}

/* ── contactgegevens in de HTML zetten ─────────────────────
   Vijf plekken op de pagina's dragen het telefoonnummer, WhatsApp of het mailadres.
   Die werden door de browser gevuld en stonden dus leeg in de HTML. Hier worden ze
   gevuld tijdens de build. Blijft er één leeg, dan stopt de build: een belknop die
   naar '#' wijst is erger dan geen belknop. */
function contactInvullen(html, code) {
  const t = CONTACTWOORDEN[code]
  const tel = BEDRIJF.telefoon
  const wa = BEDRIJF.whatsapp || BEDRIJF.telefoon
  const mail = BEDRIJF.email
  const toon = telLeesbaar(tel)

  // 1. elke <a data-bel href="#">...<em></em></a>: echt tel:-adres en het nummer erin
  html = html.replaceAll(/(<a [^>]*\bdata-bel\b[^>]*)href="#"/g, `$1href="tel:+${tel}"`)
  html = html.replaceAll(/(<a [^>]*\bdata-bel\b[^>]*>(?:(?!<\/a>).)*?)<em><\/em>/g, `$1<em>${toon}</em>`)

  // 2. de knoppen in de voet
  html = html.replace(
    '<div class="voet__knoppen" id="voetKnoppen"></div>',
    `<div class="voet__knoppen" id="voetKnoppen"><a class="btn btn--accent btn--klein" href="tel:+${tel}">${t.bel}${toon}</a><a class="btn btn--glas btn--klein" href="https://wa.me/${wa}" rel="noopener">WhatsApp</a></div>`
  )

  // 3. de contactkolom in de voet
  html = html.replace(
    '<div id="voetContact"></div>',
    `<div id="voetContact"><a href="tel:+${tel}">${toon}</a>${mail ? `<a href="mailto:${mail}">${mail}</a>` : ''}</div>`
  )

  // 4. de kaarten op de contactpagina: bellen en WhatsApp vóór de adreskaart
  html = html.replace(
    '<div class="contact__kaarten" id="contactKaarten">',
    `<div class="contact__kaarten" id="contactKaarten">` +
      `<a class="ckaart" href="tel:+${tel}"><span class="ckaart__ic" aria-hidden="true">${IC.tel}</span><span><b>${toon}</b><i>${t.belOns}${BEDRIJF.naam ? t.uKrijgt + BEDRIJF.naam : ''}</i></span></a>` +
      `<a class="ckaart" href="https://wa.me/${wa}" rel="noopener"><span class="ckaart__ic" aria-hidden="true">${IC.wa}</span><span><b>WhatsApp</b><i>${t.waBij}</i></span></a>` +
      (mail
        ? `<a class="ckaart" href="mailto:${mail}"><span class="ckaart__ic" aria-hidden="true">${IC.mail}</span><span><b>${mail}</b><i>${t.mailOns}</i></span></a>`
        : '')
  )

  // 5. de WhatsApp-knop naast de slotknop onderaan
  html = html.replace(
    /(<div class="slot__knop[^"]*" id="slotKnop">\s*<a [^>]*>[^<]*<\/a>)/,
    `$1<a class="btn btn--glas btn--groot" href="https://wa.me/${wa}" rel="noopener">${t.ofWa}</a>`
  )

  if (/data-bel[^>]*href="#"/.test(html)) throw new Error('belknop zonder nummer')
  if (/<em><\/em>/.test(html)) throw new Error('belknop zonder leesbaar nummer')
  if (/id="voetKnoppen"><\/div>|id="voetContact"><\/div>/.test(html)) throw new Error('voet zonder contactgegevens')
  if (/id="slotKnop">\s*<a [^>]*>[^<]*<\/a>\s*<\/div>/.test(html)) throw new Error('slotknop zonder WhatsApp')

  return html
}

/* ── de twee talen ────────────────────────────────────────
   map    waar de bronbestanden staan en waar ze heen gaan
   voor   wat er voor elk pad komt ('' of '/en')
   Elk paar hieronder is dezelfde pagina in de twee talen.
   Links de Nederlandse bestandsnaam, rechts de Engelse.
   Dit is de enige plek waar dat vastligt: bouw.mjs zet er de
   taalknop en de hreflang-regels uit op. */
const PAAR = [
  ['index.html', 'index.html'],
  ['badkamer.html', 'bathroom.html'],
  ['werkzaamheden.html', 'services.html'],
  ['cv-ketel.html', 'boiler.html'],
  ['materialen.html', 'materials.html'],
  ['aanbod.html', 'products.html'],
  ['werkwijze.html', 'how-we-work.html'],
  ['contact.html', 'contact.html'],
  ['toilet.html', 'toilet.html'],
  ['tegelwerk.html', 'tiling.html'],
  ['stucwerk.html', 'plastering.html'],
  ['schilderwerk.html', 'painting.html'],
  ['laminaat.html', 'flooring.html'],
  ['traprenovatie.html', 'stairs.html'],
  ['vloerverwarming.html', 'underfloor-heating.html'],
]

const TALEN = [
  { code: 'nl', map: '', voor: '', locale: 'nl_NL', kolom: 0 },
  { code: 'en', map: 'en', voor: '/en', locale: 'en_GB', kolom: 1 },
]

/* ── de negen diensten, voor de voet ───────────────────────── */
const DIENSTEN = [
  ['badkamer.html', 'Badkamerrenovatie', 'Bathroom renovation'],
  ['toilet.html', 'Toiletrenovatie', 'Toilet renovation'],
  ['tegelwerk.html', 'Tegelwerk', 'Tiling'],
  ['stucwerk.html', 'Stucwerk', 'Plastering'],
  ['schilderwerk.html', 'Schilderwerk', 'Painting'],
  ['laminaat.html', 'Laminaat en PVC', 'Laminate and vinyl'],
  ['traprenovatie.html', 'Traprenovatie', 'Staircase renovation'],
  ['vloerverwarming.html', 'Vloerverwarming', 'Underfloor heating'],
  ['cv-ketel.html', 'Cv-ketel en onderhoud', 'Boilers and servicing'],
]

/* ── alles wat in de schil tekst is ───────────────────────── */
const SCHIL = {
  nl: {
    naarInhoud: 'Naar hoofdinhoud',
    merkLabel: 'Novera Bouw — naar de startpagina',
    hoofdmenu: 'Hoofdmenu',
    menu: 'Menu',
    offerte: 'Offerte aanvragen',
    andereTaal: 'English',
    andereTaalKort: 'EN',
    andereTaalLabel: 'Switch to English',
    voetKort: 'Badkamer, toilet, tegels, vloeren en afwerking. Één bedrijf voor de hele verbouwing.',
    voetWerk: 'Werkzaamheden',
    voetSite: 'Deze site',
    voetContact: 'Contact',
    prijsKnop: 'Vraag de prijs',
    lijstLeeg: 'Lijst leegmaken',
    door: 'Website door Jouw Ideale Website',
    actieMerk: 'Actie',
    actieLang: 'Via ons 10 tot 30% korting op meubels, vloeren en tegels — wij gaan mee naar de winkel',
    actieKort: 'Via ons 10 tot 30% korting',
    actieBestand: 'aanbod.html#samenwerking',
    schemaOmschrijving:
      'Bouwbedrijf voor badkamer- en toiletrenovatie, tegelwerk, stucwerk, schilderwerk, laminaat en PVC, traprenovatie, vloerverwarming en cv-ketels.',
    site: [
      ['werkzaamheden.html', 'Alle werkzaamheden'],
      ['aanbod.html', 'Aanbod'],
      ['materialen.html', 'Materialen'],
      ['werkwijze.html', 'Werkwijze'],
      ['werkwijze.html#over', 'Over ons'],
      ['werkwijze.html#vragen', 'Vragen'],
      ['contact.html', 'Offerte aanvragen'],
    ],
  },
  en: {
    naarInhoud: 'Skip to main content',
    merkLabel: 'Novera Bouw — back to the home page',
    hoofdmenu: 'Main menu',
    menu: 'Menu',
    offerte: 'Request a quote',
    andereTaal: 'Nederlands',
    andereTaalKort: 'NL',
    andereTaalLabel: 'Ga naar de Nederlandse site',
    voetKort: 'Bathrooms, toilets, tiling, floors and finishing. One company for the whole job.',
    voetWerk: 'What we do',
    voetSite: 'This site',
    voetContact: 'Contact',
    prijsKnop: 'Ask for the price',
    lijstLeeg: 'Clear the list',
    door: 'Website by Jouw Ideale Website',
    actieMerk: 'Deal',
    actieLang: '10 to 30% off furniture, flooring and tiles through us — we come along to the shop',
    actieKort: '10 to 30% off through us',
    actieBestand: 'products.html#samenwerking',
    schemaOmschrijving:
      'Building company in Vlaardingen for bathroom and toilet renovation, tiling, plastering, painting, laminate and vinyl floors, staircase renovation, underfloor heating and boilers. We speak English.',
    site: [
      ['services.html', 'Everything we do'],
      ['products.html', 'Tiles and sanitary ware'],
      ['materials.html', 'Materials'],
      ['how-we-work.html', 'How we work'],
      ['how-we-work.html#over', 'About us'],
      ['how-we-work.html#vragen', 'Questions'],
      ['contact.html', 'Request a quote'],
    ],
  },
}

/* de negen diensten in het schema, per taal */
const AANBOD = {
  nl: [
    'Badkamerrenovatie',
    'Toiletrenovatie',
    'Tegelwerk',
    'Stucwerk',
    'Schilderwerk',
    'Laminaat en PVC leggen',
    'Traprenovatie',
    'Vloerverwarming',
    'Cv-ketel plaatsen en onderhouden',
  ],
  en: [
    'Bathroom renovation',
    'Toilet renovation',
    'Tiling',
    'Plastering',
    'Painting',
    'Laminate and vinyl flooring',
    'Staircase renovation',
    'Underfloor heating',
    'Boiler installation and servicing',
  ],
}

/* ── hulp ─────────────────────────────────────────────────── */
// bestandsnaam -> pad in die taal. index.html wordt / en /en.
// Let op de Engelse startpagina: die is /en en niet /en/. Cloudflare staat op
// html_handling: "drop-trailing-slash" en leidt /en/ met een 307 naar /en. Schreven we
// hier /en/, dan wees de canonical van die pagina naar een adres dat omleidt naar de
// pagina zelf, stond er in de sitemap een omleiding in plaats van een pagina, en liep
// elke taalknop op de site via een extra sprong. De Nederlandse startpagina blijft wel
// '/', want de root heeft geen slash om te laten vallen.
function pad(taal, bestand) {
  const [naam, anker] = bestand.split('#')
  const kaal = naam === 'index.html' ? taal.voor || '/' : taal.voor + '/' + naam.replace(/\.html$/, '')
  return kaal + (anker ? '#' + anker : '')
}

// de tweelingpagina in de andere taal
function tweeling(taal, bestand) {
  const rij = PAAR.find((r) => r[taal.kolom] === bestand)
  if (!rij) throw new Error(`${bestand} staat niet in PAAR in bouw.mjs`)
  return rij
}

// kop van een pagina: <!-- titel: .. | beschrijving: .. | menu: .. | beeld: .. -->
function kop(bron) {
  const m = bron.match(/^<!--([\s\S]*?)-->/)
  if (!m) throw new Error('pagina zonder kopblok')
  const uit = {}
  for (const regel of m[1].split('\n')) {
    const p = regel.indexOf(':')
    if (p < 0) continue
    const k = regel.slice(0, p).trim()
    if (k) uit[k] = regel.slice(p + 1).trim()
  }
  return [uit, bron.slice(m[0].length).trim()]
}

const schil = await readFile(path.join(PAG, '_schil.html'), 'utf8')
const alle = []
// pad -> datum van de laatste wijziging van de bron zelf. Daar komt lastmod in de
// sitemap uit, niet de builddatum: anders zou elke build beweren dat alle dertig
// pagina's vandaag veranderd zijn, en dan betekent lastmod niets meer.
const gewijzigd = new Map()

/* ── dist/ leeghalen en src/ erin zetten ──────────────────
   Alles in src/ is bron en gaat ongewijzigd mee: styles.css, app.js, favicon.svg,
   404.html en img/. De HTML-pagina's komen eroverheen uit pagina/. */
await rm(DIST, { recursive: true, force: true })
await mkdir(DIST, { recursive: true })
await cp(SRC, DIST, { recursive: true })

/* ── bouwen, taal voor taal ───────────────────────────────── */
for (const taal of TALEN) {
  const bronmap = path.join(PAG, taal.map)
  const uitmap = path.join(DIST, taal.map)
  await mkdir(uitmap, { recursive: true })
  const t = SCHIL[taal.code]

  const bestanden = (await readdir(bronmap, { withFileTypes: true }))
    .filter((d) => d.isFile() && d.name.endsWith('.html') && !d.name.startsWith('_'))
    .map((d) => d.name)

  const verwacht = PAAR.map((r) => r[taal.kolom])
  const mist = verwacht.filter((v) => !bestanden.includes(v))
  if (mist.length) throw new Error(`${taal.code}: pagina ontbreekt: ${mist.join(', ')}`)

  const paginas = []
  for (const f of bestanden) {
    const [meta, body] = kop(await readFile(path.join(bronmap, f), 'utf8'))
    paginas.push({ f, meta, body })
  }

  // menu uit de kopblokken, zoals het altijd al ging
  const menuLijst = paginas
    .filter((p) => p.meta.menu)
    .sort((a, b) => Number(a.meta.orde || 99) - Number(b.meta.orde || 99))

  // voet: de tien diensten en de vaste pagina's, in deze taal
  const voetWerk = DIENSTEN.map(([nlBestand, nlTekst, enTekst]) => {
    const rij = tweeling(TALEN[0], nlBestand)
    return `<a href="${pad(taal, rij[taal.kolom])}">${taal.code === 'en' ? enTekst : nlTekst}</a>`
  }).join('\n          ')

  const voetSite = t.site.map(([b, tekst]) => `<a href="${pad(taal, b)}">${tekst}</a>`).join('\n          ')

  const aanbod = AANBOD[taal.code]
    .map((n) => `          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${n}" } }`)
    .join(',\n')

  for (const { f, meta, body } of paginas) {
    const menu = menuLijst
      .map((p) => `<a href="${pad(taal, p.f)}"${p.f === f ? ' aria-current="page"' : ''}>${p.meta.menu}</a>`)
      .join('\n          ')

    const rij = tweeling(taal, f)
    const anderePad = pad(TALEN[taal.code === 'nl' ? 1 : 0], rij[taal.code === 'nl' ? 1 : 0])
    const ditPad = pad(taal, f)

    // hreflang: allebei de talen plus x-default naar het Nederlands
    const alternatief = [
      `<link rel="alternate" hreflang="nl" href="${SITE}${pad(TALEN[0], rij[0])}" />`,
      `<link rel="alternate" hreflang="en" href="${SITE}${pad(TALEN[1], rij[1])}" />`,
      `<link rel="alternate" hreflang="x-default" href="${SITE}${pad(TALEN[0], rij[0])}" />`,
    ].join('\n    ')

    let uit = schil
      .replaceAll('{{lang}}', taal.code)
      .replaceAll('{{locale}}', taal.locale)
      .replaceAll('{{alternatief}}', alternatief)
      .replaceAll('{{anderetaalkort}}', t.andereTaalKort)
      .replaceAll('{{anderetaal}}', t.andereTaal)
      .replaceAll('{{anderetaalcode}}', taal.code === 'nl' ? 'en' : 'nl')
      .replaceAll('{{anderetaallabel}}', t.andereTaalLabel)
      .replaceAll('{{anderetaalpad}}', anderePad)
      .replaceAll('{{naarinhoud}}', t.naarInhoud)
      .replaceAll('{{merklabel}}', t.merkLabel)
      .replaceAll('{{hoofdmenu}}', t.hoofdmenu)
      .replaceAll('{{menulabel}}', t.menu)
      .replaceAll('{{offerte}}', t.offerte)
      .replaceAll('{{contactpad}}', pad(taal, 'contact.html'))
      .replaceAll('{{home}}', pad(taal, 'index.html'))
      .replaceAll('{{voetkort}}', t.voetKort)
      .replaceAll('{{voetwerk}}', t.voetWerk)
      .replaceAll('{{voetsite}}', t.voetSite)
      .replaceAll('{{voetcontact}}', t.voetContact)
      .replaceAll('{{voetwerklinks}}', voetWerk)
      .replaceAll('{{voetsitelinks}}', voetSite)
      .replaceAll('{{prijsknop}}', t.prijsKnop)
      .replaceAll('{{lijstleeg}}', t.lijstLeeg)
      .replaceAll('{{door}}', t.door)
      .replaceAll('{{actiemerk}}', t.actieMerk)
      .replaceAll('{{actielang}}', t.actieLang)
      .replaceAll('{{actiekort}}', t.actieKort)
      .replaceAll('{{actiepad}}', pad(taal, t.actieBestand))
      .replaceAll('{{schemaomschrijving}}', t.schemaOmschrijving)
      .replaceAll('{{schemaaanbod}}', aanbod)
      .replaceAll('{{titel}}', meta.titel)
      .replaceAll('{{beschrijving}}', meta.beschrijving)
      .replaceAll('{{beeld}}', meta.beeld || 'img/hero.webp')
      // voorlaad: is het beeld dat de browser als eerste moet binnenhalen. Meestal is
      // dat hetzelfde als beeld:, maar op de startpagina niet: daar is beeld: de 16:9
      // deelafbeelding voor WhatsApp en Facebook, en staat in de kop zelf de eerste
      // dia. Preloaden van de verkeerde haalt de verkeerde foto als eerste binnen.
      .replaceAll('{{voorlaad}}', meta.voorlaad || meta.beeld || 'img/hero.webp')
      .replaceAll('{{pad}}', ditPad)
      .replaceAll('{{site}}', SITE)
      .replaceAll('{{klasse}}', meta.klasse || '')
      .replaceAll('{{menu}}', menu)
      .replaceAll('{{inhoud}}', body)

    if (/\{\{[a-z]+\}\}/.test(uit)) throw new Error(`${f}: onvervangen plek ${uit.match(/\{\{[a-z]+\}\}/)[0]}`)

    uit = contactInvullen(uit, taal.code)

    await writeFile(path.join(uitmap, f), uit)
    // De schil hoort bij elke pagina, dus een wijziging daarin is een wijziging van
    // alle pagina's: de jongste van de twee is wat lastmod moet zeggen.
    const bronTijd = (await stat(path.join(bronmap, f))).mtime
    const schilTijd = (await stat(path.join(PAG, '_schil.html'))).mtime
    gewijzigd.set(ditPad, new Date(Math.max(bronTijd.getTime(), schilTijd.getTime())).toISOString().slice(0, 10))
    alle.push(ditPad)
    console.log(`ok   ${taal.code}  ${ditPad.padEnd(26)} ${Math.round(uit.length / 1024)}kB`)
  }
}

/* ── sitemap ───────────────────────────────────────────────
   Allebei de talen, met de andere taal er per adres bij, en per adres een lastmod
   uit de bron zelf. De startpagina's staan vooraan: PAAR begint met index.html. */
const sm =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  PAAR.map(([nl, en]) => {
    const dn = pad(TALEN[0], nl)
    const de = pad(TALEN[1], en)
    const pn = SITE + dn
    const pe = SITE + de
    const links =
      `\n    <xhtml:link rel="alternate" hreflang="nl" href="${pn}" />` +
      `\n    <xhtml:link rel="alternate" hreflang="en" href="${pe}" />` +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pn}" />`
    return (
      `  <url><loc>${pn}</loc><lastmod>${gewijzigd.get(dn)}</lastmod>${links}\n  </url>\n` +
      `  <url><loc>${pe}</loc><lastmod>${gewijzigd.get(de)}</lastmod>${links}\n  </url>`
    )
  }).join('\n') +
  `\n</urlset>\n`
await writeFile(path.join(DIST, 'sitemap.xml'), sm)

/* robots.txt: alles mag behalve de worker-paden. /api/ heeft niets te indexeren en
   een crawler die het toch probeert krijgt een 404 uit het pakket. */
await writeFile(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`
)
console.log(`\n${alle.length} pagina's in ${TALEN.length} talen, sitemap en robots.txt`)

/* Een 404-pagina die er niet is zou als soft 404 uitgeleverd worden; wrangler wijst
   not_found_handling naar dit bestand. Hij staat buiten PAAR want hij heeft geen
   tegenhanger in de andere taal en hoort niet in de sitemap. */
await stat(path.join(DIST, '404.html')).catch(() => {
  throw new Error('src/404.html ontbreekt — not_found_handling in wrangler.jsonc wijst ernaar')
})
