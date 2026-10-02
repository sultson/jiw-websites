// Bouwt dist/ uit pagina/ (Nederlands) en pagina-en/ (Engels). Één schil, twee talen.
// Nederlands staat op /, Engels op /en. Draai: node bouw.mjs
// src/ draagt alleen wat niet gegenereerd wordt (beeld, merk, styles.css, app.js) en
// gaat ongewijzigd mee naar dist/; wrangler zet dist/ als static assets neer.
import { readFile, writeFile, readdir, mkdir, cp, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(HIER, 'src')
const DIST = path.join(HIER, 'dist')
const SITE = 'https://yanisklussenbedrijf.nl'

// Zijn eigen bedrijfsgegevens. Eén plek, zodat voet, contactpagina en de
// structured data niet uit elkaar kunnen lopen. (Opgave Alfred, 02-10-2026.)
const KVK = '91589924'
const ADRES = { straat: 'Kromhoutlaan 3', postcode: '2033 WJ', plaats: 'Haarlem' }

// Welke Engelse pagina bij welke Nederlandse hoort. Dat koppelt ook hreflang aan elkaar:
// zonder dit paar zou Google de twee talen als losse pagina's lezen.
const PAAR = {
  'index.html': 'index.html',
  'werkzaamheden.html': 'services.html',
  'woningen.html': 'homes.html',
  'appartementen.html': 'apartments.html',
  'winkels.html': 'retail.html',
  'werkwijze.html': 'how-we-work.html',
  'contact.html': 'contact.html',
}

// Alles wat in de schil staat en niet uit een pagina komt. Één tabel, twee talen,
// zodat de Engelse kant niet stil achterloopt als hier iets bijkomt.
const TALEN = [
  {
    code: 'nl',
    map: 'pagina',
    uit: '',
    basis: '',
    locale: 'nl_NL',
    ander: 'en',
    andereLabel: 'EN',
    andereTitel: 'In English',
    woorden: {
      naarInhoud: 'Naar hoofdinhoud',
      naarStart: 'naar de startpagina',
      hoofdmenu: 'Hoofdmenu',
      menuwoord: 'Menu',
      offerte: 'Offerte aanvragen',
      waTitel: 'Stuur een WhatsApp',
      waKnop: 'App ons',
      waOnder: 'via WhatsApp',
      voetRegel:
        'De complete renovatie van woningen, appartementen en winkels. Één bedrijf, één aanspreekpunt.',
      werkKop: 'Werkzaamheden',
      siteKop: 'Deze site',
      doorRegel: 'Website door Jouw Ideale Website',
      ldBeschrijving:
        'Klussenbedrijf voor de complete renovatie van woningen, appartementen en winkels in Amsterdam en heel Noord-Holland. Elektra, loodgieterswerk, tegelwerk en schilderwerk uit één hand.',
      ldDiensten: ['Complete renovatie', 'Elektra', 'Loodgieterswerk', 'Tegelwerk', 'Schilderwerk'],
      // zijn eigen opgave: "North holland" / "Amsterdam and arround" (WhatsApp 27-09-2026).
      // Haarlem staat erbij omdat het bedrijf daar zit: dat is het adres waar Google
      // de vestiging aan hangt, en zonder die plaats mist de site zijn eigen stad.
      ldGebied: ['Noord-Holland', 'Amsterdam', 'Haarlem'],
      ldRegio: 'Noord-Holland',
      gebiedKop: 'Werkgebied',
      gebiedKort: 'Amsterdam, Haarlem en heel Noord-Holland',
      adresKop: 'Adres',
      kvkKop: 'KvK',
    },
    werk: [
      ['/werkzaamheden#renovatie', 'Complete renovatie'],
      ['/werkzaamheden#elektra', 'Elektra'],
      ['/werkzaamheden#loodgieterswerk', 'Loodgieterswerk'],
      ['/werkzaamheden#tegelwerk', 'Tegelwerk'],
      ['/werkzaamheden#schilderwerk', 'Schilderwerk'],
    ],
    site: [
      ['/woningen', 'Woningen'],
      ['/appartementen', 'Appartementen'],
      ['/winkels', 'Winkels en bedrijfsruimte'],
      ['/werkwijze', 'Werkwijze'],
      ['/werkwijze#vragen', 'Veelgestelde vragen'],
      ['/contact', 'Offerte aanvragen'],
    ],
  },
  {
    code: 'en',
    map: 'pagina-en',
    uit: 'en',
    basis: '/en',
    locale: 'en_GB',
    ander: 'nl',
    andereLabel: 'NL',
    andereTitel: 'In het Nederlands',
    woorden: {
      naarInhoud: 'Skip to main content',
      naarStart: 'back to the home page',
      hoofdmenu: 'Main menu',
      menuwoord: 'Menu',
      offerte: 'Request a quote',
      waTitel: 'Send a WhatsApp',
      waKnop: 'Chat with us',
      waOnder: 'on WhatsApp',
      voetRegel: 'Full renovation of houses, apartments and shops. One company, one point of contact.',
      werkKop: 'What we do',
      siteKop: 'This site',
      doorRegel: 'Website by Jouw Ideale Website',
      ldBeschrijving:
        'Renovation contractor for the complete refurbishment of houses, apartments and shops in Amsterdam and across North Holland. Electrical work, plumbing, tiling and painting from one team.',
      ldDiensten: ['Full renovation', 'Electrical work', 'Plumbing', 'Tiling', 'Painting'],
      ldGebied: ['North Holland', 'Amsterdam', 'Haarlem'],
      ldRegio: 'North Holland',
      gebiedKop: 'Area we cover',
      gebiedKort: 'Amsterdam, Haarlem and across North Holland',
      adresKop: 'Address',
      // het nummer zelf is Nederlands; het woord ernaast niet
      kvkKop: 'Chamber of Commerce',
    },
    werk: [
      ['/en/services#renovation', 'Full renovation'],
      ['/en/services#electrical', 'Electrical work'],
      ['/en/services#plumbing', 'Plumbing'],
      ['/en/services#tiling', 'Tiling'],
      ['/en/services#painting', 'Painting'],
    ],
    site: [
      ['/en/homes', 'Houses'],
      ['/en/apartments', 'Apartments'],
      ['/en/retail', 'Shops and commercial space'],
      ['/en/how-we-work', 'How we work'],
      ['/en/how-we-work#faq', 'Frequently asked questions'],
      ['/en/contact', 'Request a quote'],
    ],
  },
]

const schilPad = path.join(HIER, 'pagina', '_schil.html')
const schil = await readFile(schilPad, 'utf8')
// lastmod in de sitemap moet een datum zijn die ergens op staat, anders leert Google
// dat onze datums niets betekenen. Vandaag invullen bij elke build doet precies dat.
// Daarom per pagina de jongste wijziging van de bron zelf of van de schil eromheen.
const schilTijd = (await stat(schilPad)).mtimeMs
const datum = (ms) => new Date(ms).toISOString().slice(0, 10)

// Het merkteken van WhatsApp, getekend in de pagina zelf. Geen plaatje en geen verzoek naar
// buiten. Hier stond een envelop, en dat leest als mail.
const WA_MERK =
  '<svg class="wamerk" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">' +
  '<path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.33 4.94L2 22.5l5.83-1.52a9.85 9.85 0 0 0 4.2.94h.01c5.44 0 9.87-4.43 9.87-9.87 0-2.64-1.03-5.12-2.9-6.98A9.8 9.8 0 0 0 12.04 2Zm0 17.98h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.17 8.17 0 0 1-1.25-4.37c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.86 5.8 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.21 8.2Z"/>' +
  '<path d="M16.6 14.15c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.65.81-.8.98-.14.16-.29.18-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.9 2.41 1.02 2.58c.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.11-.23-.17-.48-.29Z"/>' +
  '</svg>'

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

// Adressen zonder slash op het eind, want zo levert Cloudflare de assets uit
// (html_handling "drop-trailing-slash"). Zou de Engelse startpagina hier /en/ heten,
// dan wees zijn eigen canonical naar een adres dat 308'et naar /en.
const pad = (taal, f) => (f === 'index.html' ? taal.basis || '/' : taal.basis + '/' + f.replace(/\.html$/, ''))
const nl = TALEN[0]
const en = TALEN[1]

// de twee talen inlezen, elk in zijn eigen map
for (const taal of TALEN) {
  const map = path.join(HIER, taal.map)
  const bestanden = (await readdir(map)).filter((f) => f.endsWith('.html') && !f.startsWith('_'))
  taal.paginas = []
  for (const f of bestanden) {
    const [meta, body] = kop(await readFile(path.join(map, f), 'utf8'))
    const tijd = Math.max((await stat(path.join(map, f))).mtimeMs, schilTijd)
    taal.paginas.push({ f, meta, body, tijd })
  }
}

// elke Nederlandse pagina moet een Engelse tegenhanger hebben, en omgekeerd.
// Anders hangt er ergens een hreflang in de lucht en dat is precies wat Google afstraft.
for (const [bron, doel] of Object.entries(PAAR)) {
  if (!nl.paginas.some((p) => p.f === bron)) throw new Error(`pagina/${bron} bestaat niet`)
  if (!en.paginas.some((p) => p.f === doel)) throw new Error(`pagina-en/${doel} bestaat niet`)
}
if (nl.paginas.length !== Object.keys(PAAR).length) throw new Error('pagina/ heeft een bestand dat niet in PAAR staat')
if (en.paginas.length !== Object.keys(PAAR).length)
  throw new Error('pagina-en/ heeft een bestand dat niet in PAAR staat')

const alleUrls = []

// schoon beginnen, zodat een pagina die uit pagina/ verdwijnt niet in dist/ blijft staan
// en daarna alsnog uitgeleverd en geïndexeerd wordt
await rm(DIST, { recursive: true, force: true })
await mkdir(DIST, { recursive: true })
// alles uit src/ gaat ongewijzigd mee: beeld, merk, styles.css, app.js, favicon
await cp(SRC, DIST, { recursive: true })

// Het logo in de bevestigingsmail wordt door het mailprogramma van de ontvanger bij ons
// opgehaald (worker/confirmation-email.ts wijst naar dit adres). Staat het bestand er niet,
// dan valt dat niet op bij het bouwen en niet bij het uitrollen, maar wel in elke mail die
// daarna de deur uitgaat, als een leeg vak bovenaan. Dus liever hier omvallen.
const EMAIL_LOGO = 'merk/yanis-logo-email.png'
await stat(path.join(DIST, EMAIL_LOGO)).catch(() => {
  throw new Error(`${EMAIL_LOGO} ontbreekt in de build; de bevestigingsmail wijst daarnaar`)
})

for (const taal of TALEN) {
  const uitmap = path.join(DIST, taal.uit)
  await mkdir(uitmap, { recursive: true })

  const lijst = (rijen) => rijen.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n          ')

  for (const { f, meta, body, tijd } of taal.paginas) {
    const punten = taal.paginas
      .filter((p) => p.meta.menu)
      .sort((a, b) => Number(a.meta.orde || 99) - Number(b.meta.orde || 99))
    const regels = (rijen) =>
      rijen
        .map(
          (p) =>
            `<a href="${pad(taal, p.f)}"${p.f === f ? ' aria-current="page"' : ''}>${p.meta.menu}</a>`
        )
        .join('\n          ')
    // Het uitklapmenu draagt alles. De balk laat de startpagina weg: het logo links is
    // die link al, en met zeven punten erin liep de balk buiten de 1180 van de pagina —
    // op een scherm onder 1400 schoof de hele site zijwaarts.
    const menu = regels(punten)
    const menuBalk = regels(punten.filter((p) => p.f !== 'index.html'))

    // beide adressen van dezelfde pagina, dus hreflang en de taalknop wijzen naar hetzelfde blad
    const nlBestand = taal === nl ? f : Object.keys(PAAR).find((k) => PAAR[k] === f)
    const padNl = pad(nl, nlBestand)
    const padEn = pad(en, PAAR[nlBestand])
    const alternatieven = [
      `<link rel="alternate" hreflang="nl" href="${SITE}${padNl}" />`,
      `<link rel="alternate" hreflang="en" href="${SITE}${padEn}" />`,
      `<link rel="alternate" hreflang="x-default" href="${SITE}${padNl}" />`,
    ].join('\n    ')

    const w = taal.woorden
    // de pagina gaat als eerste in de schil, zodat een pagina dezelfde bouwstenen mag
    // gebruiken als de schil zelf (zoals {{waMerk}}) in plaats van ze over te typen
    const uit = schil
      .replaceAll('{{inhoud}}', body)
      .replaceAll('{{taal}}', taal.code)
      .replaceAll('{{locale}}', taal.locale)
      .replaceAll('{{alternatieven}}', alternatieven)
      .replaceAll('{{andereTaal}}', taal.ander)
      .replaceAll('{{andereLabel}}', taal.andereLabel)
      .replaceAll('{{andereTitel}}', taal.andereTitel)
      .replaceAll('{{anderePad}}', taal === nl ? padEn : padNl)
      .replaceAll('{{thuis}}', pad(taal, 'index.html'))
      .replaceAll('{{contactPad}}', taal.basis + '/contact')
      .replaceAll('{{naarInhoud}}', w.naarInhoud)
      .replaceAll('{{naarStart}}', w.naarStart)
      .replaceAll('{{hoofdmenu}}', w.hoofdmenu)
      .replaceAll('{{menuwoord}}', w.menuwoord)
      .replaceAll('{{offerte}}', w.offerte)
      .replaceAll('{{waTitel}}', w.waTitel)
      .replaceAll('{{waKnop}}', w.waKnop)
      .replaceAll('{{waOnder}}', w.waOnder)
      .replaceAll('{{waMerk}}', WA_MERK)
      .replaceAll('{{voetRegel}}', w.voetRegel)
      .replaceAll('{{werkKop}}', w.werkKop)
      .replaceAll('{{siteKop}}', w.siteKop)
      .replaceAll('{{werkLinks}}', lijst(taal.werk))
      .replaceAll('{{siteLinks}}', lijst(taal.site))
      .replaceAll('{{doorRegel}}', w.doorRegel)
      .replaceAll('{{ldBeschrijving}}', w.ldBeschrijving)
      .replaceAll('{{ldRegio}}', w.ldRegio)
      .replaceAll('{{gebiedKop}}', w.gebiedKop)
      .replaceAll('{{gebiedKort}}', w.gebiedKort)
      .replaceAll('{{adresKop}}', w.adresKop)
      .replaceAll('{{adresStraat}}', ADRES.straat)
      .replaceAll('{{adresPostcode}}', ADRES.postcode)
      .replaceAll('{{adresPlaats}}', ADRES.plaats)
      .replaceAll('{{kvkKop}}', w.kvkKop)
      .replaceAll('{{kvk}}', KVK)
      .replaceAll(
        '{{ldGebied}}',
        w.ldGebied
          .map((n) => `\n          { "@type": "AdministrativeArea", "name": "${n}" }`)
          .join(',') + '\n        '
      )
      .replaceAll(
        '{{ldDiensten}}',
        w.ldDiensten
          .map((n) => `\n          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "${n}" } }`)
          .join(',') + '\n        '
      )
      .replaceAll('{{titel}}', meta.titel)
      .replaceAll('{{beschrijving}}', meta.beschrijving)
      .replaceAll('{{beeld}}', meta.beeld || 'img/hero.webp')
      .replaceAll('{{pad}}', pad(taal, f))
      .replaceAll('{{site}}', SITE)
      .replaceAll('{{klasse}}', meta.klasse || '')
      .replaceAll('{{menuBalk}}', menuBalk)
      .replaceAll('{{menu}}', menu)

    const rest = uit.match(/\{\{[a-zA-Z]+\}\}/g)
    if (rest) throw new Error(`${taal.code}/${f}: niet ingevuld: ${[...new Set(rest)].join(', ')}`)

    await writeFile(path.join(uitmap, f), uit)
    console.log(`ok   ${taal.code}  ${pad(taal, f).padEnd(20)} ${Math.round(uit.length / 1024)}kB`)
    alleUrls.push({ loc: pad(taal, f), nl: padNl, en: padEn, tijd, start: f === 'index.html' })
  }
}

// sitemap met beide talen, en per adres de tegenhanger erbij.
// De startpagina's eerst, daarna de rest: dat is ook de volgorde waarin we gezien
// willen worden. priority is een advies dat Google negeert, lastmod niet.
const sm =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  alleUrls
    .slice()
    .sort((a, b) => Number(b.start) - Number(a.start) || a.loc.localeCompare(b.loc))
    .map(
      (u) =>
        `  <url>\n    <loc>${SITE}${u.loc}</loc>\n` +
        `    <lastmod>${datum(u.tijd)}</lastmod>\n` +
        `    <xhtml:link rel="alternate" hreflang="nl" href="${SITE}${u.nl}" />\n` +
        `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${u.en}" />\n` +
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${u.nl}" />\n  </url>`
    )
    .join('\n') +
  `\n</urlset>\n`
await writeFile(path.join(DIST, 'sitemap.xml'), sm)
// Alles mag gelezen worden behalve het formulier-endpoint: daar valt niets te indexeren
// en een crawler die erop POST't krijgt niets dan een 405.
await writeFile(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`
)
console.log(`\n${alleUrls.length} pagina's in ${TALEN.length} talen, sitemap en robots.txt`)
