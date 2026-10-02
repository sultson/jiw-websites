// Meet alle pagina's in een echte browser. node scripts/kijk.mjs [basis-url]
// Zonder url start hij zelf een servertje op dist/ (met schone adressen, net als de worker).
// Draai eerst `pnpm build`, want hij meet wat er in dist/ staat en niet wat er in pagina/ staat.
import { chromium } from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright/index.mjs'
import http from 'node:http'
import path from 'node:path'
import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(HIER, '..', 'dist')
const SHOTS = path.join(HIER, '..', 'shots')
const PADEN_NL = ['/', '/werkzaamheden', '/woningen', '/appartementen', '/winkels', '/werkwijze', '/contact']
const PADEN_EN = ['/en', '/en/services', '/en/homes', '/en/apartments', '/en/retail', '/en/how-we-work', '/en/contact']
const PADEN = [...PADEN_NL, ...PADEN_EN]
const TEL = 'tel:+31611416736'

// elke pagina heeft een tegenhanger in de andere taal; dat koppelt hreflang aan elkaar
const PAAR = Object.fromEntries(PADEN_NL.flatMap((p, i) => [[p, PADEN_EN[i]], [PADEN_EN[i], p]]))

// wat er in geen van de twee talen op mag staan: geen bedrag, geen termijn, geen belofte
const VERBODEN = [
  [/€\s?\d|\$\s?\d|£\s?\d/, 'een bedrag'],
  [/\b\d+\s*(jaar|maanden)\s+garantie/i, 'een garantietermijn (nl)'],
  [/\b\d+\s*(year|years|month|months)\s+(warranty|guarantee)/i, 'een garantietermijn (en)'],
  [/binnen\s+\d+\s*(werkdag|werkdagen|dag|dagen|uur)/i, 'een reactietermijn (nl)'],
  [/within\s+\d+\s*(working day|working days|business day|business days|day|days|hour|hours)/i, 'een reactietermijn (en)'],
  [/\bper\s+m2\b|\bper\s+vierkante\s+meter\b|\bper\s+square\s+(met|metre|meter)/i, 'een prijs per meter'],
  [/\b\d+\s*(beoordelingen|reviews|sterren|stars)\b/i, 'beoordelingen'],
  [/\d+\s*(?:%|procent|percent)/i, 'een percentage'],
  [/\bgratis\b/i, 'het woord gratis'],
  [/\bfree\s+(quote|estimate|of charge)\b/i, 'een gratis-belofte (en)'],
]

const TYPE = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

let basis = process.argv[2]
let server
if (!basis) {
  server = http.createServer(async (req, res) => {
    const vraag = decodeURIComponent(req.url.split('?')[0])
    // dezelfde keuze als Cloudflare met html_handling "drop-trailing-slash": /contact is
    // contact.html, /en is en/index.html, en / is index.html
    const kandidaten = path.extname(vraag)
      ? [vraag]
      : [path.posix.join(vraag, 'index.html'), vraag.replace(/\/$/, '') + '.html']
    for (const p of kandidaten) {
      try {
        const buf = await readFile(path.join(DIST, p))
        res.writeHead(200, { 'content-type': TYPE[path.extname(p)] || 'application/octet-stream' })
        res.end(buf)
        return
      } catch {}
    }
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('niet gevonden')
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  basis = `http://127.0.0.1:${server.address().port}`
}

let ok = 0
const fouten = []
const zeg = (goed, wat) => (goed ? ok++ : fouten.push(wat))

await mkdir(SHOTS, { recursive: true })
// Vlak na een nieuw subdomein kent de router het adres nog niet, terwijl Cloudflare
// het al serveert. MAPNAAR=<ip> stuurt de browser rechtstreeks naar de rand.
const argsExtra = process.env.MAPNAAR
  ? [`--host-resolver-rules=MAP ${new URL(basis).host} ${process.env.MAPNAAR}`]
  : []
const browser = await chromium.launch({ args: argsExtra })

for (const [naam, breed, hoog] of [
  ['desktop', 1440, 1000],
  ['telefoon', 390, 844],
]) {
  const pg = await browser.newPage({ viewport: { width: breed, height: hoog } })
  const jsFouten = []
  pg.on('console', (m) => m.type() === 'error' && jsFouten.push(m.text()))
  pg.on('pageerror', (e) => jsFouten.push(String(e)))
  const mislukt = []
  pg.on('requestfailed', (r) => mislukt.push(r.url()))

  const langs = async () => {
    await pg.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 80))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 260))
    })
    await pg.waitForLoadState('networkidle')
  }

  for (const pad of PADEN) {
    const merk = `${naam} ${pad}`
    jsFouten.length = 0
    mislukt.length = 0
    const r = await pg.goto(basis + pad, { waitUntil: 'networkidle' })
    zeg(r && r.status() < 400, `${merk}: status ${r && r.status()}`)
    await langs()
    zeg(jsFouten.length === 0, `${merk}: js-fout ${jsFouten[0]}`)
    zeg(mislukt.length === 0, `${merk}: bestand niet geladen ${mislukt[0]}`)

    zeg((await pg.title()).length > 12, `${merk}: geen fatsoenlijke titel`)
    const om = await pg.getAttribute('meta[name="description"]', 'content')
    zeg(om && om.length > 60, `${merk}: omschrijving te kort`)
    zeg((await pg.$$('h1')).length === 1, `${merk}: niet precies een h1`)
    const can = await pg.getAttribute('link[rel="canonical"]', 'href')
    zeg(can && can.endsWith(pad), `${merk}: canonical klopt niet: ${can}`)

    // ── taal: de pagina zegt zelf welke taal hij is, en wijst de andere aan ──
    const ent = PADEN_EN.includes(pad)
    const taal = await pg.getAttribute('html', 'lang')
    zeg(taal === (ent ? 'en' : 'nl'), `${merk}: html lang is ${taal}`)

    const alt = await pg.$$eval('link[rel="alternate"]', (els) =>
      els.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')])
    )
    const vind = (h) => (alt.find((a) => a[0] === h) || [])[1]
    zeg(alt.length === 3, `${merk}: ${alt.length} hreflang-regels in plaats van 3`)
    const padNl = ent ? PAAR[pad] : pad
    const padEn = ent ? pad : PAAR[pad]
    zeg((vind('nl') || '').endsWith(padNl), `${merk}: hreflang nl wijst naar ${vind('nl')}`)
    zeg((vind('en') || '').endsWith(padEn), `${merk}: hreflang en wijst naar ${vind('en')}`)
    zeg((vind('x-default') || '').endsWith(padNl), `${merk}: x-default wijst naar ${vind('x-default')}`)

    // de taalknop staat er en wijst naar dezelfde pagina in de andere taal
    const knopTaal = await pg.$$eval('a.taal', (els) =>
      els.map((a) => [a.getAttribute('href'), a.textContent.trim()])
    )
    zeg(knopTaal.length === 1, `${merk}: ${knopTaal.length} taalknoppen`)
    zeg(knopTaal[0] && knopTaal[0][0] === PAAR[pad], `${merk}: de taalknop wijst naar ${knopTaal[0] && knopTaal[0][0]}`)
    zeg(knopTaal[0] && knopTaal[0][1] === (ent ? 'NL' : 'EN'), `${merk}: de taalknop zegt ${knopTaal[0] && knopTaal[0][1]}`)

    // beeld: komt binnen, heeft alt, staat niet uitgerekt
    const beeld = await pg.$$eval('img', (els) =>
      els.map((i) => ({
        src: i.getAttribute('src'),
        alt: i.getAttribute('alt') || '',
        nw: i.naturalWidth,
        nh: i.naturalHeight,
        bw: i.getBoundingClientRect().width,
        bh: i.getBoundingClientRect().height,
        kop: i.classList.contains('hero__beeld'),
        // Een leeg alt is fout, behálve als het beeld in een link zit die zichzelf al
        // benoemt: het logo in de kopbalk. Dan is alt="" juist goed — anders leest een
        // schermlezer de naam twee keer voor. Buiten dat geval blijft de eis staan.
        gedekt: i.getAttribute('alt') === '' && !!i.closest('a[aria-label]'),
      }))
    )
    zeg(beeld.length > 0, `${merk}: geen beeld`)
    for (const b of beeld) {
      zeg(b.nw > 0, `${merk}: beeld laadt niet ${b.src}`)
      zeg(b.gedekt || b.alt.length > 3, `${merk}: beeld zonder alt ${b.src}`)
      if (b.nw && b.bw > 4) {
        const rek = b.bw / b.nw
        zeg(rek <= 1.35, `${merk}: ${b.src} staat ${rek.toFixed(2)}x uitgerekt`)
      }
      // Het vak waarin een beeld staat moet ongeveer de vorm van het beeld zelf hebben,
      // anders snijdt object-fit er het halve onderwerp af. Het height-attribuut won een
      // keer van aspect-ratio en zette elk splitbeeld op 896 px hoog; dat mag niet stil
      // terugkomen. Alleen de paginakop mag hard snijden, die is per definitie een band.
      if (!b.kop && b.nw && b.nh && b.bw > 4 && b.bh > 4) {
        const eigen = b.nw / b.nh
        const vak = b.bw / b.bh
        const scheef = Math.max(vak / eigen, eigen / vak)
        zeg(scheef <= 1.3, `${merk}: ${b.src} staat in een vak van ${Math.round(b.bw)}x${Math.round(b.bh)} terwijl het beeld ${b.nw}x${b.nh} is`)
      }
    }

    // De kop van de startpagina moet schermvullend zijn (Armando, 28-09-2026): hij loopt
    // van onder de kopbalk tot onderaan het scherm, op de telefoon tot boven de vaste balk.
    // Een kop die stil terugvalt naar een halve schermhoogte moet hier omvallen.
    if (pad === '/' || pad === '/en') {
      const vak = await pg.evaluate(() => {
        const h = document.querySelector('.hero')
        if (!h) return null
        const r = h.getBoundingClientRect()
        const balk = document.querySelector('.mobalk')
        const bh = balk && getComputedStyle(balk).display !== 'none' ? balk.getBoundingClientRect().height : 0
        const nav = document.querySelector('.nav')
        return {
          top: r.top,
          bodem: r.bottom,
          scherm: window.innerHeight,
          balk: bh,
          nav: nav ? nav.getBoundingClientRect().bottom : 0,
        }
      })
      zeg(!!vak, `${merk}: geen kop gevonden`)
      if (vak) {
        const moet = vak.scherm - vak.balk
        zeg(
          Math.abs(vak.bodem - moet) <= 8,
          `${merk}: de kop loopt tot ${Math.round(vak.bodem)} terwijl het scherm op ${Math.round(moet)} ophoudt`
        )
        zeg(
          Math.abs(vak.top - vak.nav) <= 2,
          `${merk}: de kop begint op ${Math.round(vak.top)} en de kopbalk houdt op bij ${Math.round(vak.nav)}`
        )
      }
    }

    // niets steekt buiten het scherm
    const over = await pg.evaluate((w) => {
      const afgesneden = (el) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const o = getComputedStyle(p)
          if (o.overflowX === 'hidden' || o.overflowX === 'clip' || o.overflow === 'hidden') return true
        }
        return false
      }
      return [...document.querySelectorAll('body *')]
        .filter((e) => e.getBoundingClientRect().right > w + 1)
        .filter((e) => getComputedStyle(e).position !== 'fixed' && !afgesneden(e))
        .map((e) => e.tagName + '.' + (e.className || '').toString().split(' ')[0])
        .slice(0, 4)
    }, breed)
    zeg(over.length === 0, `${merk}: steekt uit het scherm: ${over.join(', ')}`)

    // geen tekst die buiten zijn eigen kaart valt en daar weggesneden wordt
    const weg = await pg.evaluate(() =>
      [...document.querySelectorAll('h1, h2, h3, h4, p, li')]
        .filter((el) => el.textContent.trim())
        // een dichtgeklapte vraag verbergt zijn antwoord met opzet
        .filter((el) => !el.closest('details:not([open])'))
        .filter((el) => {
          const r = el.getBoundingClientRect()
          if (!r.height) return false
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const s = getComputedStyle(p)
            if (s.overflow !== 'hidden' && s.overflowY !== 'hidden') continue
            const pr = p.getBoundingClientRect()
            if (r.top > pr.bottom - 2 || r.bottom < pr.top + 2) return true
          }
          return false
        })
        .map((el) => el.tagName + ' "' + el.textContent.trim().slice(0, 28) + '"')
        .slice(0, 4)
    )
    zeg(weg.length === 0, `${merk}: tekst valt buiten zijn kaart: ${weg.join(' | ')}`)

    // de kopbalk staat dicht, anders valt het logo weg op de foto eronder
    const kop = await pg.evaluate(() => {
      const n = document.querySelector('#nav')
      if (!n) return null
      const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g) || []
      return m.length > 3 ? Number(m[3]) : 1
    })
    zeg(kop !== null && kop > 0.8, `${merk}: de kopbalk staat doorzichtig, het logo valt weg op de foto`)

    // de vaste WhatsApp-knop: op desktop rechtsonder, op de telefoon weg (daar staat de balk)
    const zweef = await pg.evaluate(() => {
      const a = document.querySelector('.wazweef')
      if (!a) return null
      const s = getComputedStyle(a)
      const r = a.getBoundingClientRect()
      return {
        zichtbaar: s.display !== 'none',
        vast: s.position === 'fixed',
        rechts: window.innerWidth - r.right,
        onder: window.innerHeight - r.bottom,
        href: a.getAttribute('href') || '',
        merk: !!a.querySelector('svg'),
        // het woord stond dichtgevouwen achter het merkteken: op desktop was de knop een
        // rondje zonder tekst. Het moet er zonder aanwijzen al staan.
        woord: (a.querySelector('.wazweef__tekst b') || {}).textContent || '',
        woordBreed: a.querySelector('.wazweef__tekst b')
          ? a.querySelector('.wazweef__tekst b').getBoundingClientRect().width
          : 0,
        groen: getComputedStyle(a).backgroundColor,
      }
    })
    zeg(zweef, `${merk}: de vaste WhatsApp-knop staat niet in de pagina`)
    if (naam === 'telefoon') {
      zeg(zweef && !zweef.zichtbaar, `${merk}: de zwevende WhatsApp-knop staat naast de vaste balk`)
    } else {
      zeg(zweef && zweef.zichtbaar && zweef.vast, `${merk}: de WhatsApp-knop rechtsonder staat er niet`)
      zeg(
        zweef && zweef.rechts > 8 && zweef.rechts < 60 && zweef.onder > 8 && zweef.onder < 60,
        `${merk}: de WhatsApp-knop staat niet rechtsonder`
      )
      zeg(zweef && /wa\.me/.test(zweef.href), `${merk}: de WhatsApp-knop wijst nergens heen`)
      zeg(zweef && zweef.merk, `${merk}: de WhatsApp-knop draagt geen merkteken`)
      zeg(
        zweef && zweef.woord.trim() === (ent ? 'Chat with us' : 'App ons'),
        `${merk}: de WhatsApp-knop zegt "${zweef && zweef.woord.trim()}"`
      )
      zeg(zweef && zweef.woordBreed > 40, `${merk}: het woord op de WhatsApp-knop staat dichtgevouwen`)
      // het groen van WhatsApp zelf, niet een groen dat wij verzonnen hebben
      zeg(
        zweef && zweef.groen === 'rgb(37, 211, 102)',
        `${merk}: de WhatsApp-knop staat niet in het groen van WhatsApp: ${zweef && zweef.groen}`
      )
    }

    if (naam === 'telefoon') {
      // menuknop tegen de rechterrand, niet tegen het logo
      const knop = await pg.evaluate(() => {
        const b = document.querySelector('#burger')
        const in_ = document.querySelector('.nav__in')
        if (!b || !in_) return null
        const rb = b.getBoundingClientRect()
        const ri = in_.getBoundingClientRect()
        return { zichtbaar: rb.width > 0, gat: ri.right - rb.right }
      })
      zeg(knop && knop.zichtbaar, `${merk}: de menuknop staat er niet`)
      zeg(knop && knop.gat < 6, `${merk}: de menuknop plakt tegen het logo`)

      // WhatsApp en de tweede knop lopen onderin mee naar beneden
      const bk = await pg.evaluate(() => {
        const d = document.querySelector('#mobalk')
        if (!d) return null
        const r = d.getBoundingClientRect()
        return {
          vast: getComputedStyle(d).position === 'fixed',
          onder: Math.abs(r.bottom - window.innerHeight) < 2,
          knoppen: [...d.querySelectorAll('a')].map((a) => a.getAttribute('href')),
        }
      })
      zeg(bk, `${merk}: de vaste knoppenbalk staat er niet`)
      zeg(bk && bk.vast && bk.onder, `${merk}: de knoppenbalk beweegt niet mee naar beneden`)
      zeg(
        bk && bk.knoppen.length === 2 && bk.knoppen.some((h) => /wa\.me/.test(h)),
        `${merk}: WhatsApp of de tweede knop mist onderin`
      )

      // het menu gaat open en weer dicht
      await pg.click('#burger')
      zeg(await pg.isVisible('#drawer'), `${merk}: het menu gaat niet open`)
      await pg.keyboard.press('Escape')
      zeg(await pg.isHidden('#drawer'), `${merk}: het menu gaat niet dicht met Escape`)
    }

    // alle interne links komen ergens aan
    const links = await pg.$$eval('a[href^="/"]', (els) => [...new Set(els.map((a) => a.getAttribute('href')))])
    for (const l of links) {
      const doel = l.split('#')[0] || '/'
      zeg(PADEN.includes(doel), `${merk}: link naar onbekende pagina ${l}`)
    }
    // binnen een taal blijf je in die taal: de enige overstap is de taalknop
    const overstap = [...new Set(links.map((l) => l.split('#')[0]))].filter((d) => PADEN_EN.includes(d) !== ent)
    zeg(overstap.length <= 1, `${merk}: links naar de andere taal buiten de taalknop: ${overstap.join(', ')}`)
    // een anker moet ook echt bestaan op de pagina waar hij heen wijst
    const ankers = await pg.$$eval('a[href^="/"]', (els) =>
      els.map((a) => a.getAttribute('href')).filter((h) => h.includes('#'))
    )
    for (const l of [...new Set(ankers)]) {
      const [doel, id] = l.split('#')
      const bestaat = await pg.evaluate(
        async ([d, i, b]) => {
          const t = await (await fetch(b + (d || '/'))).text()
          return t.includes('id="' + i + '"')
        },
        [doel, id, basis]
      )
      zeg(bestaat, `${merk}: anker ${l} bestaat niet`)
    }

    // niets blijft onzichtbaar staan
    const blind = await pg.$$eval('.op:not(.in)', (e) => e.length)
    zeg(blind === 0, `${merk}: ${blind} blokken blijven onzichtbaar`)

    // geen bedrag, termijn, garantie of beoordeling die niemand heeft toegezegd
    const tekst = await pg.textContent('body')
    for (const [re, wat] of VERBODEN) {
      zeg(!re.test(tekst), `${merk}: er staat ${wat} op de pagina`)
    }

    // geen tekst die in de verkeerde taal is blijven staan. "Klussenbedrijf" is de
    // bedrijfsnaam en staat daarom in beide talen op de pagina.
    const verkeerd = ent
      ? [/\bOfferte\b/, /\bWerkzaamheden\b/, /\bVeelgestelde\b/, /\bWerkwijze\b/, /\baanvraag\b/i, /\bwij\b/i, /\buw\b/i, /App ons/]
      : [/Request a quote/, /Skip to main content/, /How we work/, /What we do/, /Chat with us/]
    for (const re of verkeerd) zeg(!re.test(tekst), `${merk}: tekst in de verkeerde taal (${re.source})`)

    // het telwoord een draagt twee accenten, ook met een hoofdletter: Een. Anders
    // leest de bezoeker het als lidwoord en valt de hele belofte weg.
    zeg(!/Eén/.test(tekst), `${merk}: "Eén" mist het accent op de eerste e`)

    // het werkgebied staat op elke pagina. Zijn eigen opgave (WhatsApp 27-09-2026:
    // "North holland", "Amsterdam and arround"), dus het mag nergens stil wegvallen —
    // en er mag ook geen andere provincie bij verzonnen worden.
    const gebied = ent ? /North Holland/ : /Noord-Holland/
    zeg(gebied.test(tekst), `${merk}: het werkgebied staat niet op de pagina`)
    zeg(/Amsterdam/.test(tekst), `${merk}: Amsterdam staat niet op de pagina`)
    const andere = /\b(Zuid-Holland|Utrecht|Flevoland|Gelderland|Brabant|Limburg|Zeeland|Friesland|Groningen|Drenthe|Overijssel)\b/
    zeg(!andere.test(tekst), `${merk}: er staat een provincie op die hij niet genoemd heeft`)

    // vestigingsadres en KvK staan in de voet van elke pagina (opgave 02-10-2026) en
    // moeten woord voor woord kloppen met wat er in de structured data staat
    zeg(/Kromhoutlaan 3/.test(tekst), `${merk}: het adres staat niet op de pagina`)
    zeg(/2033 WJ Haarlem/.test(tekst), `${merk}: postcode en plaats staan niet op de pagina`)
    zeg(/91589924/.test(tekst), `${merk}: het KvK-nummer staat niet op de pagina`)

    // de structured data zegt hetzelfde als de pagina, en staat op het echte adres
    const ld = JSON.parse(await pg.textContent('script[type="application/ld+json"]'))
    zeg(ld['@id'] === 'https://yanisklussenbedrijf.nl/#yanis', `${merk}: ld @id is ${ld['@id']}`)
    zeg(ld.address && ld.address.streetAddress === 'Kromhoutlaan 3', `${merk}: ld streetAddress klopt niet`)
    zeg(ld.address && ld.address.postalCode === '2033 WJ', `${merk}: ld postalCode klopt niet`)
    zeg(ld.address && ld.address.addressLocality === 'Haarlem', `${merk}: ld addressLocality klopt niet`)
    zeg(ld.identifier && ld.identifier.value === '91589924', `${merk}: ld KvK klopt niet`)
    zeg((can || '').startsWith('https://yanisklussenbedrijf.nl'), `${merk}: canonical staat niet op het echte adres`)

    // geen mailadres: dat hebben wij niet van hem, dus mag het nergens staan
    const mails = await pg.$$eval('a[href^="mailto:"]', (e) => e.map((a) => a.getAttribute('href')))
    zeg(mails.length === 0, `${merk}: er staat een mailadres op de site: ${mails.join(', ')}`)
    zeg(!/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(tekst), `${merk}: er staat een mailadres in de tekst`)

    // het telefoonnummer is overal hetzelfde nummer van hem
    const tel = await pg.$$eval('a[href^="tel:"]', (e) => [...new Set(e.map((a) => a.getAttribute('href')))])
    zeg(tel.length === 1 && tel[0] === TEL, `${merk}: telefoonnummer ontbreekt of wijkt af: ${tel}`)
    const wa = await pg.$$eval('a[href*="wa.me"]', (e) => [...new Set(e.map((a) => a.getAttribute('href').split('?')[0]))])
    zeg(wa.length === 1 && wa[0] === 'https://wa.me/31611416736', `${merk}: WhatsApp wijkt af: ${wa}`)

    // geen verzoek naar een ander bedrijf, op de lettertypes na
    const vreemd = await pg.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .map((e) => new URL(e.name).host)
        .filter(
          (h) =>
            h &&
            h !== location.host &&
            !h.endsWith('gstatic.com') &&
            !h.endsWith('googleapis.com') &&
            h !== 'static.cloudflareinsights.com'
        )
    )
    zeg(vreemd.length === 0, `${merk}: verzoek naar ${[...new Set(vreemd)].join(', ')}`)

    if (naam === 'desktop') {
      const bestand = (pad === '/' ? 'home' : pad.slice(1).replace(/\/$/, 'home').replace(/\//g, '-')) + '.png'
      await pg.screenshot({ path: path.join(SHOTS, bestand), fullPage: true })
    }
  }

  // ── formulier, in beide talen ─────────────────────────
  // De aanvraag gaat niet echt de deur uit: we vangen het verzoek op en antwoorden zelf.
  // Zo meet dit het hele pad van het formulier (velden, melding, bevestiging, wat er
  // precies verstuurd wordt) zonder dat er een lead in iemands mailbox belandt.
  for (const f of [
    { pad: '/contact', endpoint: '/api/forms/offerte', werk: 'Tegelwerk', bericht: 'Badkamer van een appartement, alles eruit.' },
    { pad: '/en/contact', endpoint: '/api/forms/en/quote', werk: 'Tiling', bericht: 'Bathroom of an apartment, everything out.' },
  ]) {
    const m = `${naam} ${f.pad}`
    let verstuurd = null
    await pg.route('**/api/forms/**', async (route) => {
      verstuurd = { url: new URL(route.request().url()).pathname, body: route.request().postData() || '' }
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    })

    await pg.goto(basis + f.pad, { waitUntil: 'networkidle' })
    await langs()
    await pg.click('#formKnop')
    zeg(await pg.isVisible('#formFout'), `${m}: lege aanvraag geeft geen melding`)
    zeg(await pg.isVisible('#form'), `${m}: lege aanvraag ruimt het formulier toch op`)
    await pg.fill('input[name="firstName"]', 'Test')
    await pg.fill('input[name="lastName"]', 'Tester')
    await pg.click('#formKnop')
    zeg(await pg.isVisible('#formFout'), `${m}: aanvraag zonder telefoon komt er toch door`)
    await pg.fill('input[name="telefoon"]', '0612345678')
    await pg.click('#formKnop')
    zeg(await pg.isVisible('#formFout'), `${m}: aanvraag zonder e-mailadres komt er toch door`)
    zeg(verstuurd === null, `${m}: er ging al een verzoek de deur uit voor het formulier klaar was`)
    await pg.fill('input[name="email"]', 'hallo@jouwidealewebsite.nl')
    await pg.check(`input[name="werk"][value="${f.werk}"]`)
    await pg.check('input[name="werk"][value="Toilet"]')
    await pg.fill('textarea[name="bericht"]', f.bericht)
    await pg.click('#formKnop')
    await pg.waitForTimeout(600)

    zeg(await pg.isVisible('.klaar'), `${m}: geldige aanvraag geeft geen bevestiging`)
    zeg((await pg.$$('#formKnop')).length === 0, `${m}: de knop blijft staan na versturen`)
    // De aanvraag wordt niet meer op de pagina teruggelezen: dat deed de oude versie
    // omdat er nog geen mailbox was en je hem zelf moest doorsturen. Nu belooft de
    // bevestiging een mail, en dus moet daar iets over mail staan.
    const blok = await pg.textContent('.klaar')
    zeg(/e-mail|email/i.test(blok), `${m}: de bevestiging belooft geen mail`)
    zeg(!/nog niet verstuurd|has not been sent/i.test(blok), `${m}: de bevestiging zegt nog dat er niets verstuurd is`)

    // het verzoek zelf: juiste adres, juiste veldnamen, en de tien vinkjes samengevoegd
    zeg(verstuurd !== null, `${m}: er ging geen verzoek de deur uit`)
    if (verstuurd) {
      zeg(verstuurd.url === f.endpoint, `${m}: het verzoek ging naar ${verstuurd.url}`)
      for (const veld of ['firstName', 'lastName', 'email', 'telefoon', 'bericht', 'werk']) {
        zeg(verstuurd.body.includes(`name="${veld}"`), `${m}: ${veld} zit niet in het verzoek`)
      }
      zeg(
        verstuurd.body.includes(`${f.werk}, Toilet`) || verstuurd.body.includes(`Toilet, ${f.werk}`),
        `${m}: de twee vinkjes staan niet als een regel in het verzoek`
      )
      zeg(!/name="naam"/.test(verstuurd.body), `${m}: het oude veld naam zit er nog in`)
    }
    await pg.unroute('**/api/forms/**')
  }

  await pg.close()
}

// ── de kopbalk op elke breedte ────────────────────────────
// Dit is de meting die er niet was. De balk werd alleen op 1440 en 390 bekeken, en juist
// daar viel hij niet om: op 1440 stak hij 126px buiten de pagina maar bleef binnen het
// scherm, en op 390 staat het menu in de knop. Alles ertussen schoof zijwaarts.
{
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  for (const pad of ['/', '/en']) {
    for (const breed of [1920, 1600, 1440, 1300, 1220, 1219, 1100, 1024, 900, 768, 600, 390, 360]) {
      await pg.setViewportSize({ width: breed, height: 900 })
      await pg.goto(basis + pad, { waitUntil: 'networkidle' })
      const m = `balk ${breed} ${pad}`
      const r = await pg.evaluate(() => {
        const in_ = document.querySelector('.nav__in')
        const links = document.querySelector('.nav__links')
        const burger = document.querySelector('#burger')
        const zicht = (e) => e && getComputedStyle(e).display !== 'none'
        return {
          over: in_.scrollWidth - in_.clientWidth,
          zijwaarts: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          menu: zicht(links),
          knop: zicht(burger),
          hoog: Math.round(in_.getBoundingClientRect().height),
        }
      })
      zeg(r.over <= 1, `${m}: de kopbalk steekt ${r.over}px buiten de pagina`)
      zeg(r.zijwaarts <= 1, `${m}: de pagina schuift ${r.zijwaarts}px zijwaarts`)
      // of het menu staat uitgeklapt in de balk, of het zit in de knop. Nooit beide, nooit geen.
      zeg(r.menu !== r.knop, `${m}: menu ${r.menu ? 'aan' : 'uit'} en de menuknop ${r.knop ? 'aan' : 'uit'}`)
      zeg(r.menu === breed >= 1220, `${m}: het menu staat ${r.menu ? 'in de balk' : 'in de knop'}`)
      zeg(r.hoog <= 88, `${m}: de kopbalk is ${r.hoog}px hoog, hij is dus omgeklapt`)
    }
  }
  await pg.close()
}

await browser.close()
if (server) server.close()
console.log(`${ok} controles zonder fout`)
if (fouten.length) {
  console.log(`\n${fouten.length} FOUT:`)
  fouten.forEach((f) => console.log(' - ' + f))
  process.exit(1)
}
