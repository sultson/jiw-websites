// Meet alle pagina's in een echte browser. node _ref/kijk.mjs [basis-url]
// Zonder url start hij zelf een servertje op dist/ (met schone adressen, net als de worker).
// De site staat in twee talen: Nederlands op / en Engels op /en/. Alles hieronder
// wordt per taal gemeten, met per taal de eigen adressen en de eigen zinnen.
import { chromium } from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright/index.mjs'
import http from 'node:http'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(HIER, '..', 'dist')
const SHOTS = path.join(HIER, 'shots')

/* ── de twee talen ─────────────────────────────────────────
   Per taal: de negen dienstpagina's, de vaste pagina's en de
   zinnen die app.js zelf op de pagina zet. Staat een zin hier
   fout, dan valt de meting om — dat is de bedoeling. */
const TALEN = [
  {
    code: 'nl',
    voor: '',
    naam: 'nl',
    diensten: [
      '/badkamer',
      '/toilet',
      '/tegelwerk',
      '/stucwerk',
      '/schilderwerk',
      '/laminaat',
      '/traprenovatie',
      '/vloerverwarming',
      '/cv-ketel',
    ],
    home: '/',
    overzicht: '/werkzaamheden',
    badkamer: '/badkamer',
    aanbod: '/aanbod',
    materialen: '/materialen',
    contact: '/contact',
    vast: ['/materialen', '/aanbod', '/werkwijze', '/contact'],
    opAanvraag: /^Prijs op aanvraag$/,
    pakketOpAanvraag: /^Vanaf-prijs op aanvraag$/,
    // Wat de pakketprijs dekt. Staat op de kaart zelf én in de regel eronder,
    // want dit is de vraag waarop iemand bij een pakketprijs vastloopt.
    pakketDekt: /^Inclusief materiaal en btw$/,
    pakketRegel: /inclusief btw.*materiaal/i,
    artikel: 'Hangtoilet, randloos',
    mat: ['Tegels', 'Kranen'],
    // twee waarden uit de vinkjes op de contactpagina, voor de formuliermeting
    werkEen: 'Badkamerrenovatie',
    werkTwee: 'Tegelwerk',
    korting: /10 tot 30 procent/,
    lint: /Actie.*10 tot 30%/,
    actiepad: '/aanbod#samenwerking',
    winkel: /inrichtingszaak/,
    taalknop: 'EN',
  },
  {
    code: 'en',
    voor: '/en',
    naam: 'en',
    diensten: [
      '/en/bathroom',
      '/en/toilet',
      '/en/tiling',
      '/en/plastering',
      '/en/painting',
      '/en/flooring',
      '/en/stairs',
      '/en/underfloor-heating',
      '/en/boiler',
    ],
    // /en en niet /en/: Cloudflare laat de slash op het eind vallen, dus /en/ is een
    // omleiding en /en is de pagina. Stond hier eerder /en/, waardoor de meting de
    // canonical en elke taalknop afkeurde terwijl de site juist goed stond.
    home: '/en',
    overzicht: '/en/services',
    badkamer: '/en/bathroom',
    aanbod: '/en/products',
    materialen: '/en/materials',
    contact: '/en/contact',
    vast: ['/en/materials', '/en/products', '/en/how-we-work', '/en/contact'],
    opAanvraag: /^Price on request$/,
    pakketOpAanvraag: /^Starting price on request$/,
    pakketDekt: /^Materials and VAT included$/,
    pakketRegel: /include VAT.*materials/i,
    artikel: 'Rimless wall-hung toilet',
    mat: ['Tiles', 'Taps'],
    werkEen: 'Bathroom renovation',
    werkTwee: 'Tiling',
    korting: /10 to 30 percent/,
    lint: /Deal.*10 to 30%/,
    actiepad: '/en/products#samenwerking',
    winkel: /interiors store/,
    taalknop: 'NL',
  },
]

for (const t of TALEN) t.paden = [t.home, t.overzicht, ...t.diensten, ...t.vast]
// elke interne link moet in een van de twee talen bestaan
const ALLE = TALEN.flatMap((t) => t.paden)

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
    let p = decodeURIComponent(req.url.split('?')[0])
    if (p.endsWith('/')) p += 'index.html'
    // /en is een map, geen bestand: eerst en.html proberen, anders en/index.html.
    // Cloudflare doet dat ook, dus zonder deze regel meet het servertje hier iets
    // anders dan wat er live staat (en viel de Engelse startpagina om als 404).
    const kandidaten = path.extname(p) ? [p] : [p + '.html', path.posix.join(p, 'index.html')]
    for (const k of kandidaten) {
      try {
        const buf = await readFile(path.join(DIST, k))
        res.writeHead(200, { 'content-type': TYPE[path.extname(k)] || 'application/octet-stream' })
        res.end(buf)
        return
      } catch {
        /* volgende kandidaat */
      }
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
const browser = await chromium.launch()

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

  for (const taal of TALEN) {
    for (const pad of taal.paden) {
      const merk = `${naam} ${pad}`
      jsFouten.length = 0
      mislukt.length = 0
      const r = await pg.goto(basis + pad, { waitUntil: 'networkidle' })
      zeg(r && r.status() < 400, `${merk}: status ${r && r.status()}`)
      await langs()
      zeg(jsFouten.length === 0, `${merk}: js-fout ${jsFouten[0]}`)
      zeg(mislukt.length === 0, `${merk}: bestand niet geladen ${mislukt[0]}`)

      // titel en omschrijving
      zeg((await pg.title()).length > 12, `${merk}: geen fatsoenlijke titel`)
      const om = await pg.getAttribute('meta[name="description"]', 'content')
      zeg(om && om.length > 60, `${merk}: omschrijving te kort`)
      zeg((await pg.$$('h1')).length <= 1, `${merk}: meer dan een h1`)

      // ── de taal staat vast en wijst naar zijn tweeling ──
      zeg(
        (await pg.getAttribute('html', 'lang')) === taal.code,
        `${merk}: lang op <html> is niet ${taal.code}`
      )
      const hreflang = await pg.$$eval('link[rel="alternate"]', (e) =>
        e.map((l) => l.getAttribute('hreflang') + ' ' + l.getAttribute('href'))
      )
      zeg(hreflang.length === 3, `${merk}: ${hreflang.length} hreflang-regels in plaats van 3`)
      zeg(
        hreflang.some((h) => h.startsWith('nl ')) &&
          hreflang.some((h) => h.startsWith('en ')) &&
          hreflang.some((h) => h.startsWith('x-default ')),
        `${merk}: hreflang mist nl, en of x-default`
      )
      const knop = await pg.$$eval('.taal, .drawer__taal', (e) =>
        e.map((a) => a.getAttribute('href'))
      )
      zeg(knop.length === 2, `${merk}: de taalknop staat niet in de balk en de lade`)
      zeg(
        knop.length === 2 && knop[0] === knop[1],
        `${merk}: de taalknop in de balk en in de lade wijzen niet naar hetzelfde: ${knop.join(' / ')}`
      )
      const ander = TALEN.find((x) => x !== taal)
      zeg(
        knop[0] && knop[0].startsWith(ander.voor || '/') && (ander.voor ? true : !knop[0].startsWith('/en')),
        `${merk}: de taalknop wijst niet naar de andere taal: ${knop[0]}`
      )
      zeg(ander.paden.includes(knop[0]), `${merk}: de taalknop wijst naar een pagina die niet bestaat: ${knop[0]}`)
      zeg(
        (await pg.textContent('.taal')).trim() === taal.taalknop,
        `${merk}: er staat niet ${taal.taalknop} op de taalknop`
      )

      // beeld: komt binnen, heeft alt, staat niet uitgerekt
      const beeld = await pg.$$eval('img', (els) =>
        els.map((i) => ({
          src: i.getAttribute('src'),
          alt: i.getAttribute('alt') || '',
          nw: i.naturalWidth,
          bw: i.getBoundingClientRect().width,
        }))
      )
      zeg(pad === taal.contact || beeld.length > 0, `${merk}: geen beeld`)
      for (const b of beeld) {
        zeg(b.nw > 0, `${merk}: beeld laadt niet ${b.src}`)
        zeg(b.alt.length > 3, `${merk}: beeld zonder alt ${b.src}`)
        if (b.nw && b.bw > 4) {
          const rek = b.bw / b.nw
          zeg(rek <= 1.35, `${merk}: ${b.src} staat ${rek.toFixed(2)}x uitgerekt`)
        }
      }

      // niets steekt buiten het scherm
      // een element dat uitsteekt maar door een ouder wordt afgesneden (band, hero) telt niet
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

      // ── de kopbalk past op één regel ──────────────────
      // Met acht menu-items, het telefoonnummer, de taalknop en de offerteknop
      // zit de balk vol. Breekt hij, dan staat het menu onder het logo.
      const balkMaat = await pg.evaluate(() => {
        const in_ = document.querySelector('.nav__in')
        const links = document.querySelector('.nav__links')
        const rechts = document.querySelector('.nav__right')
        if (!in_ || !rechts) return null
        const zichtbaar = links && getComputedStyle(links).display !== 'none'
        const lr = zichtbaar ? links.getBoundingClientRect() : null
        return {
          hoog: in_.getBoundingClientRect().height,
          over: rechts.getBoundingClientRect().right - in_.getBoundingClientRect().right,
          botst: lr ? lr.right - rechts.getBoundingClientRect().left : -1,
        }
      })
      zeg(balkMaat && balkMaat.hoog < 100, `${merk}: de kopbalk is ${balkMaat && Math.round(balkMaat.hoog)}px hoog, hij breekt`)
      zeg(balkMaat && balkMaat.over < 1, `${merk}: de rechterkant van de balk steekt ${Math.round(balkMaat.over)}px buiten de wrap`)
      zeg(balkMaat && balkMaat.botst < 1, `${merk}: het menu botst ${Math.round(balkMaat.botst)}px tegen de knoppen`)

      // geen kop die buiten zijn eigen kaart valt en daar weggesneden wordt
      const weg = await pg.evaluate(() =>
        [...document.querySelectorAll('h1, h2, h3, h4, p, b, li')]
          .filter((el) => el.textContent.trim())
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

      // De kopbalk zweeft: #nav zelf is een leeg doorzichtig laagje, de lichte band
      // zit op de pil .nav__in. Twee dingen moeten kloppen. De pil moet bijna dicht
      // zijn, anders valt het donkere logo weg op een lichte herofoto. En hij moet
      // echt losstaan van het lint erboven, want dat is het hele punt van de zweef:
      // zit er geen gat tussen, dan is het weer één dichte band over de foto.
      const kop = await pg.evaluate(() => {
        const n = document.querySelector('#nav')
        const pil = document.querySelector('.nav__in')
        const lint = document.querySelector('.lint')
        if (!n || !pil || !lint) return null
        const s = getComputedStyle(pil)
        const m = s.backgroundColor.match(/[\d.]+/g) || []
        return {
          alfa: m.length > 3 ? Number(m[3]) : 1,
          rond: parseFloat(s.borderTopLeftRadius) || 0,
          gat: Math.round(pil.getBoundingClientRect().top - lint.getBoundingClientRect().bottom),
          vangt: getComputedStyle(n).pointerEvents,
        }
      })
      zeg(kop && kop.alfa > 0.8, `${merk}: de kopbalk staat doorzichtig, het logo valt weg op de foto`)
      zeg(kop && kop.gat >= 6, `${merk}: de kopbalk zweeft niet, het gat onder het lint is ${kop && kop.gat}px`)
      zeg(kop && kop.rond >= 12, `${merk}: de kopbalk is geen pil meer (ronding ${kop && kop.rond}px)`)
      zeg(kop && kop.vangt === 'none', `${merk}: het lege laagje van de kop vangt kliks op de hero af`)

      // op mobiel staat de menuknop tegen de rechterrand en niet tegen het logo
      if (naam === 'telefoon') {
        // gemeten tot de binnenrand van de pil, niet tot zijn buitenrand: de pil
        // heeft sinds hij zweeft 20px eigen binnenruimte, en dat is geen gat
        const mknop = await pg.evaluate(() => {
          const b = document.querySelector('#burger')
          const in_ = document.querySelector('.nav__in')
          if (!b || !in_) return null
          const rb = b.getBoundingClientRect()
          const ri = in_.getBoundingClientRect()
          const rand = parseFloat(getComputedStyle(in_).paddingRight) || 0
          return { zichtbaar: rb.width > 0, gat: ri.right - rand - rb.right }
        })
        zeg(mknop && mknop.zichtbaar, `${merk}: de menuknop staat er niet`)
        zeg(mknop && mknop.gat < 6, `${merk}: de menuknop plakt tegen het logo in plaats van tegen de rechterrand`)
      }

      // Op mobiel lopen WhatsApp en offerte onderin mee, maar niet zomaar altijd.
      // Twee regels, en die zijn de hele reden dat dit zo uitgebreid gemeten wordt:
      // bovenaan de pagina staat hij onder het scherm (de kop heeft daar zijn eigen
      // twee knoppen), en zodra er een offerteknop of een formulier in beeld staat
      // duikt hij weg — anders ligt hij over precies de knop waar hij naartoe wijst.
      if (naam === 'telefoon') {
        // de schuif eruit voor de meting: wij meten waar hij uitkomt, niet hoe hij
        // beweegt, en anders meet je hem halverwege zijn glijbaan
        await pg.addStyleTag({ content: '.dok{transition:none!important}' })
        const lees = () =>
          pg.evaluate(() => {
            const d = document.querySelector('#dok')
            if (!d) return null
            const s = getComputedStyle(d)
            const r = d.getBoundingClientRect()
            const h = window.innerHeight
            return {
              vast: s.position === 'fixed',
              onder: Math.abs(r.bottom - h) < 2,
              zicht: s.visibility !== 'hidden' && r.top < h - 1,
              // wat er op dit moment aan offerteknoppen en formulieren in beeld staat
              cta: [...document.querySelectorAll('a.btn--accent, a.drawer__cta, form')]
                .filter((n) => !d.contains(n))
                .filter((n) => {
                  const q = n.getBoundingClientRect()
                  return q.width > 0 && q.height > 0 && q.bottom > 0 && q.top < h
                })
                .map((n) => (n.tagName === 'FORM' ? 'het formulier' : n.textContent.trim().slice(0, 22))),
              knoppen: [...d.querySelectorAll('a')].map((a) => a.getAttribute('href')),
            }
          })

        await pg.evaluate(() => window.scrollTo(0, 0))
        await pg.waitForTimeout(60)
        const boven = await lees()
        zeg(boven, `${merk}: de vaste knoppenbalk staat er niet`)
        zeg(boven && boven.vast, `${merk}: de knoppenbalk staat niet vast aan het scherm`)
        zeg(boven && !boven.zicht, `${merk}: de knoppenbalk staat al in beeld bovenaan de pagina`)
        zeg(
          boven && boven.knoppen.some((h) => /wa\.me/.test(h)) && boven.knoppen.length === 2,
          `${merk}: WhatsApp of de tweede knop mist onderin`
        )
        // de tweede knop moet in de eigen taal blijven
        zeg(
          boven && boven.knoppen.every((h) => /wa\.me|^tel:/.test(h) || h === taal.contact),
          `${merk}: de knoppenbalk wijst naar de andere taal: ${boven && boven.knoppen.join(', ')}`
        )

        // en dan de hele pagina langs: elke keer dat hij in beeld staat, moet hij
        // tegen de onderrand zitten en mag er niets onder hem liggen
        const hoog = await pg.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
        const stap = Math.max(160, Math.round(hoog / 12))
        let ooit = false
        for (let y = 0; y <= hoog; y += stap) {
          await pg.evaluate((n) => window.scrollTo(0, n), y)
          await pg.waitForTimeout(50)
          const nu = await lees()
          if (!nu || !nu.zicht) continue
          ooit = true
          zeg(nu.onder, `${merk}: de knoppenbalk hangt los van de onderrand op ${y}px`)
          zeg(nu.cta.length === 0, `${merk}: de knoppenbalk ligt over ${nu.cta.join(', ')} op ${y}px`)
        }
        // op de contactpagina is dat juist goed: daar staat het formulier bijna de
        // hele pagina in beeld, dus daar hoort hij nergens te verschijnen
        if (pad !== taal.contact) {
          zeg(ooit, `${merk}: de knoppenbalk komt nergens in beeld tijdens het scrollen`)
        }
        await pg.evaluate(() => window.scrollTo(0, 0))
      }

      // De wisselende kop moet op een telefoon ook echt bewegen. Dat deed hij eerst
      // niet: de kanteling rekent met wat er onder de onderrand hangt, en op een smal
      // scherm hangt een staande foto daar niet onder, dus stond hij stil. Nu krijgt
      // elke foto daar een eigen in-zoom (diaMobiel). Hier wordt gemeten dat de foto
      // tussen twee momenten werkelijk verschoven is, en dat er bij geen van de twee
      // een rand van de foto in beeld staat.
      if (naam === 'telefoon' && pad === taal.home) {
        const beweeg = await pg.evaluate(() => {
          const zet = (ms) =>
            document.getAnimations().forEach((a) => {
              a.pause()
              a.currentTime = ms
            })
          const lees = () =>
            [...document.querySelectorAll('.hero__dia')].map((e) => {
              const img = e.querySelector('img')
              const r = img.getBoundingClientRect()
              const v = e.getBoundingClientRect()
              return {
                dek: Number(getComputedStyle(e).opacity),
                boven: r.top - v.top,
                onder: r.bottom - v.bottom,
                draait: getComputedStyle(img).animationName,
              }
            })
          zet(1000)
          const a = lees()
          zet(5000)
          const b = lees()
          return { a, b }
        })
        const stil = beweeg.a.filter((d) => !d.draait || d.draait === 'none').length
        zeg(stil === 0, `${merk}: ${stil} van de 5 herofoto's staan stil op een telefoon`)
        const weg = Math.abs(beweeg.b[0].boven - beweeg.a[0].boven)
        zeg(weg > 4, `${merk}: de herofoto schuift in 4 seconden maar ${weg.toFixed(1)}px — dat ziet niemand`)
        for (const [moment, stand] of [['t=1s', beweeg.a], ['t=5s', beweeg.b]]) {
          for (const d of stand.filter((x) => x.dek > 0.02)) {
            zeg(d.boven <= 1, `${merk}: bovenrand van een herofoto staat op ${moment} in beeld`)
            zeg(d.onder >= -1, `${merk}: onderrand van een herofoto staat op ${moment} in beeld`)
          }
        }
      }

      // alle interne links komen ergens aan
      const links = await pg.$$eval('a[href^="/"]', (els) => [...new Set(els.map((a) => a.getAttribute('href')))])
      for (const l of links) {
        const doel = l.split('#')[0] || '/'
        zeg(ALLE.includes(doel), `${merk}: link naar onbekende pagina ${l}`)
      }
      // binnen een pagina blijven de links in dezelfde taal, op de taalknop na
      for (const l of links) {
        const doel = l.split('#')[0] || '/'
        if (doel === knop[0]) continue
        zeg(taal.paden.includes(doel), `${merk}: link springt naar de andere taal: ${l}`)
      }

      // het actielint staat bovenin, op elke pagina, en wijst naar het
      // blok waar de korting uitgelegd wordt — niet naar buiten en niet
      // naar de andere taal (dat laatste valt hierboven al om).
      const lint = await pg.$('.lint')
      zeg(!!lint, `${merk}: het actielint staat niet bovenin`)
      if (lint) {
        const lt = (await lint.textContent()).replace(/\s+/g, ' ')
        zeg(taal.lint.test(lt), `${merk}: het actielint zegt niet wat de actie is: ${lt}`)
        zeg(
          (await lint.getAttribute('href')) === taal.actiepad,
          `${merk}: het actielint wijst niet naar ${taal.actiepad}`
        )
        const boven = await lint.evaluate((e) => e.getBoundingClientRect().top)
        zeg(boven >= -1 && boven < 4, `${merk}: het actielint staat niet bovenaan (top ${Math.round(boven)})`)
      }

      // niets blijft onzichtbaar staan. Tot de overzetting stond .reveal op
      // opacity 0 tot een IntersectionObserver hem aanzette; dat is eruit, dus
      // hier wordt gemeten wat de bezoeker werkelijk ziet in plaats van of er
      // een klasse bij gezet is.
      const blind = await pg.$$eval(
        '.reveal',
        (e) => e.filter((x) => Number(getComputedStyle(x).opacity) < 0.99).length
      )
      zeg(blind === 0, `${merk}: ${blind} blokken blijven onzichtbaar`)

      // geen bedrag, termijn of garantie die niemand heeft toegezegd.
      // Op /aanbod mag een bedrag wel: dat komt uit TARIEF in app.js.
      // Op /badkamer en op de home ook: dat komt uit PAKKET. Alle drie
      // worden hieronder per kaart nagemeten. In het Engels geldt
      // hetzelfde voor /en/products, /en/bathroom en /en/.
      const tekst = await pg.textContent('body')
      const magBedrag = pad === taal.aanbod || pad === taal.badkamer || pad === taal.home
      for (const [re, wat] of [
        ...(magBedrag ? [] : [[/€\s?\d/, 'een bedrag']]),
        [/\b\d+\s*(jaar|maanden)\s+garantie/i, 'een garantietermijn'],
        [/\b\d+\s*(year|years|month|months)\s+(guarantee|warranty)/i, 'een garantietermijn'],
        [/binnen\s+\d+\s*(werkdag|dag|uur)/i, 'een reactietermijn'],
        [/\bwithin\s+\d+\s*(working day|business day|day|hour)/i, 'een reactietermijn'],
        [/\bper\s+m2\b|\bper\s+vierkante\s+meter\b|\bper\s+square\s+met/i, 'een prijs per meter'],
        [/\b\d+\s*(beoordelingen|reviews|sterren|ratings|stars)\b/i, 'beoordelingen'],
        // het telwoord krijgt een accent op allebei de e's, ook met een hoofdletter
        [/\bEén\b/i, 'Eén met een half accent in plaats van Één'],
      ]) {
        zeg(!re.test(tekst), `${merk}: er staat ${wat} op de pagina`)
      }

      // elk percentage op de site moet een getal zijn dat Ekrem zelf gaf: 10 of 30.
      // Zo kan er later geen korting bij geschreven worden die niemand toegezegd heeft.
      const KORTING = ['10', '30']
      const pct = [...tekst.matchAll(/(\d+)\s*(?:%|procent|percent)/gi)].map((m) => m[1])
      const vreemdPct = pct.filter((n) => !KORTING.includes(n))
      zeg(vreemdPct.length === 0, `${merk}: percentage dat niemand gaf: ${vreemdPct.join(', ')}`)

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
        const bestand = (pad === '/' ? 'home' : pad.slice(1).replace(/\/$/, '-home').replace(/\//g, '-')) + '.png'
        await pg.screenshot({ path: path.join(SHOTS, bestand), fullPage: true })
      }
    }
  }

  // ── het palet van blad 1 "Zeker vakwerk" ───────────────
  // Niet de css lezen maar meten wat de browser er echt van maakt: een token
  // dat verkeerd staat of een kleur die ergens hard is ingetypt valt hier om.
  // Vijf kleuren, meer niet. Wijzigt het merk, dan wijzigt deze lijst mee.
  {
    await pg.goto(basis + '/', { waitUntil: 'networkidle' })
    await langs()
    const palet = await pg.evaluate(() => {
      const w = (el, p) => (el ? getComputedStyle(el)[p] : 'weg')
      return {
        grond: w(document.body, 'backgroundColor'),
        tekst: w(document.body, 'color'),
        knop: w(document.querySelector('.btn--accent'), 'backgroundColor'),
        voet: w(document.querySelector('.voet'), 'backgroundColor'),
        kop: w(document.querySelector('h1'), 'fontFamily'),
        kopgewicht: w(document.querySelector('h1'), 'fontWeight'),
        lopend: w(document.body, 'fontFamily'),
      }
    })
    zeg(palet.grond === 'rgb(247, 243, 236)', `${naam}: grond is ${palet.grond}, moet Chalk #F7F3EC zijn`)
    zeg(palet.tekst === 'rgb(24, 35, 57)', `${naam}: tekst is ${palet.tekst}, moet Deep Navy #182339 zijn`)
    zeg(palet.knop === 'rgb(196, 122, 67)', `${naam}: knop is ${palet.knop}, moet Copper #C47A43 zijn`)
    zeg(palet.voet === 'rgb(24, 35, 57)', `${naam}: voet is ${palet.voet}, moet Deep Navy #182339 zijn`)
    // Uit het merkhandboek in _ref/branding-kit: Plus Jakarta Sans voor de koppen
    // op 700 (800 is voorbehouden aan het woordmerk), Inter voor de lopende tekst.
    zeg(/Plus Jakarta Sans/.test(palet.kop), `${naam}: h1 staat in ${palet.kop}, moet Plus Jakarta Sans zijn`)
    zeg(palet.kopgewicht === '700', `${naam}: h1 staat op gewicht ${palet.kopgewicht}, moet 700 zijn`)
    zeg(/Inter/.test(palet.lopend), `${naam}: lopende tekst staat in ${palet.lopend}, moet Inter zijn`)

    // Het merkteken is het huisje uit novera-symbol-primary.svg: één pad op
    // currentColor. In de balk is dat Copper, in de voet de reverse op Chalk.
    const merkteken = await pg.evaluate(() => {
      const vul = (sel) => [...document.querySelectorAll(sel + ' svg path')].map((p) => getComputedStyle(p).fill)
      return { balk: vul('.nav .brand__mark'), voet: vul('.voet .brand__mark') }
    })
    zeg(
      merkteken.balk.join('|') === 'rgb(196, 122, 67)',
      `${naam}: merkteken in de balk staat op ${merkteken.balk.join(', ')}, moet Copper #C47A43 zijn`
    )
    zeg(
      merkteken.voet.join('|') === 'rgb(247, 243, 236)',
      `${naam}: merkteken in de voet is niet omgekeerd: ${merkteken.voet.join(', ')}, moet Chalk #F7F3EC zijn`
    )
  }

  // ── geen beeld van Werkspot op de site ─────────────────
  // De eigen foto's van Ekrem liggen in _ref/werkspot/. Armando wilde ze er op
  // 27 sep af. Blijft zo tot hij zelf beeld aanlevert.
  for (const taal of TALEN) {
    await pg.goto(basis + taal.overzicht, { waitUntil: 'networkidle' })
    await langs()
    const ws = await pg.$$eval('img', (e) =>
      e.map((i) => i.getAttribute('src') || '').filter((s) => /echt-|werk-\d/.test(s))
    )
    zeg(ws.length === 0, `${naam} ${taal.code}: beeld van Werkspot staat er nog op: ${ws.join(', ')}`)
  }

  for (const taal of TALEN) {
    const stempel = `${naam} ${taal.code}`

    // ── elke dienst heeft een eigen pagina, en wordt ook zo gelinkt ──
    // De tegels op de home en op het overzicht moeten naar die negen pagina's wijzen.
    // Zo kan er niet stilletjes een tegel terugvallen op een anker.
    for (const waar of [taal.home, taal.overzicht]) {
      await pg.goto(basis + waar, { waitUntil: 'networkidle' })
      await langs()
      const tegels = await pg.$$eval('.werk__grid--negen .wkaart', (e) => e.map((a) => a.getAttribute('href')))
      zeg(tegels.length === 9, `${stempel} ${waar}: ${tegels.length} diensttegels in plaats van 9`)
      const mis = taal.diensten.filter((d) => !tegels.includes(d))
      zeg(mis.length === 0, `${stempel} ${waar}: geen tegel naar ${mis.join(', ')}`)
      const anker = tegels.filter((h) => (h || '').includes('#'))
      zeg(anker.length === 0, `${stempel} ${waar}: tegel wijst nog naar een anker: ${anker.join(', ')}`)
    }
    // de voet linkt naar alle negen
    const voet = await pg.$$eval('.voet__kol a', (e) => e.map((a) => a.getAttribute('href')))
    const voetMis = taal.diensten.filter((d) => !voet.includes(d))
    zeg(voetMis.length === 0, `${stempel}: de voet linkt niet naar ${voetMis.join(', ')}`)

    // ── de badkamerpakketten ───────────────────────────────
    // Ze staan twee keer: kort op de home (badkamerverkoop is de kop van de
    // site) en voluit op /badkamer. Allebei meten, anders kan de korte versie
    // stilletjes iets anders gaan beloven dan de lange.
    const prijzen = {}
    for (const waar of [taal.badkamer, taal.home]) {
      await pg.goto(basis + waar, { waitUntil: 'networkidle' })
      await langs()
      const pak = await pg.$$eval('.pakket', (e) =>
        e.map((k) => ({
          naam: k.dataset.pakket || '',
          prijs: ((k.querySelector('.ppr') || {}).textContent || '').trim(),
          vast: !!k.querySelector('.ppr--vast'),
          onbekend: !!k.querySelector('.ppr--onbekend'),
          dekt: ((k.querySelector('.pakket__dekt') || {}).textContent || '').trim(),
          doet: k.querySelectorAll('ul:not(.pakket__niet) li').length,
          niet: k.querySelectorAll('.pakket__niet li').length,
        }))
      )
      zeg(pak.length === 3, `${stempel} ${waar}: ${pak.length} badkamerpakketten in plaats van 3`)
      const pakMis = pak.filter((k) => k.onbekend || !k.naam)
      zeg(
        pakMis.length === 0,
        `${stempel} ${waar}: pakket staat niet in PAKKET in app.js: ${pakMis.map((k) => k.naam).join(', ')}`
      )
      // elk pakket zegt of een bedrag uit PAKKET, of eerlijk dat de prijs op aanvraag is
      const pakScheef = pak.filter((k) => (k.vast ? !/€ ?\d/.test(k.prijs) : !taal.pakketOpAanvraag.test(k.prijs)))
      zeg(
        pakScheef.length === 0,
        `${stempel} ${waar}: prijsregel van een pakket klopt niet: ${pakScheef.map((k) => k.prijs).join(' | ')}`
      )
      // een pakket zonder Zit er niet in is een belofte zonder grens
      const kaal = pak.filter((k) => k.doet < 3 || k.niet < 2)
      zeg(kaal.length === 0, `${stempel} ${waar}: pakket ${kaal.map((k) => k.naam).join(', ')} mist wat er wel of niet in zit`)
      // bij een bedrag hoort op de kaart zelf te staan dat het materiaal erin
      // zit. Iemand leest een pakketprijs anders als werk-alleen en dat is
      // precies de ruzie bij de oplevering.
      const dektMis = pak.filter((k) => k.vast && !taal.pakketDekt.test(k.dekt))
      zeg(
        dektMis.length === 0,
        `${stempel} ${waar}: pakket ${dektMis.map((k) => k.naam).join(', ')} zegt niet op de kaart dat materiaal en btw erin zitten: ${dektMis
          .map((k) => k.dekt || 'niets')
          .join(' | ')}`
      )
      const regel = ((await pg.textContent('#pakketRegel').catch(() => '')) || '').replace(/\s+/g, ' ')
      zeg(
        taal.pakketRegel.test(regel),
        `${stempel} ${waar}: de regel onder de pakketten zegt niet dat de bedragen btw én materiaal dekken: ${regel || 'hij staat er niet'}`
      )
      zeg(await pg.isVisible('#pakketten'), `${stempel} ${waar}: #pakketten komt nergens uit, terwijl de hero erheen linkt`)
      prijzen[waar] = pak.map((k) => k.naam + ' = ' + k.prijs).join(' | ')
    }
    // hetzelfde pakket mag op de home geen ander bedrag hebben dan op /badkamer
    zeg(
      prijzen[taal.badkamer] === prijzen[taal.home],
      `${stempel}: de pakketprijzen op de home wijken af van ${taal.badkamer}: ${prijzen[taal.home]} tegen ${prijzen[taal.badkamer]}`
    )

    // ── het aanbod: filter, en een artikel komt in de lijst ─
    await pg.goto(basis + taal.aanbod, { waitUntil: 'networkidle' })
    await langs()
    const alles = await pg.$$eval('.pkaart:not([hidden])', (e) => e.length)
    zeg(alles === 12, `${stempel}: het aanbod toont ${alles} artikelen in plaats van 12`)
    // elke kaart zegt of een bedrag uit TARIEF, of eerlijk Prijs op aanvraag.
    // Niets ertussenin, en geen artikel dat niet in TARIEF staat.
    const p = await pg.$$eval('.pkaart .prijs', (e) =>
      e.map((x) => ({
        txt: (x.textContent || '').trim(),
        vast: x.classList.contains('prijs--vast'),
        onbekend: x.classList.contains('prijs--onbekend'),
      }))
    )
    zeg(p.length === 12, `${stempel}: ${p.length} prijsregels in plaats van 12`)
    const mis = p.filter((x) => x.onbekend).length
    zeg(mis === 0, `${stempel}: ${mis} artikelen staan niet in TARIEF in app.js`)
    const scheef = p.filter((x) => (x.vast ? !/^€ ?\d/.test(x.txt) : !taal.opAanvraag.test(x.txt)))
    zeg(scheef.length === 0, `${stempel}: prijsregel klopt niet: ${scheef.map((x) => x.txt).join(' | ')}`)
    await pg.click('.filter__k[data-toon="toilet"]')
    const drie = await pg.$$eval('.pkaart:not([hidden])', (e) => e.length)
    zeg(drie === 3, `${stempel}: het filter Toilet toont ${drie} artikelen in plaats van 3`)
    await pg.click('.filter__k[data-toon="alles"]')
    zeg(
      (await pg.$$eval('.pkaart:not([hidden])', (e) => e.length)) === 12,
      `${stempel}: na Alles staan niet alle artikelen terug`
    )
    // ── de samenwerkingen: korting staat er, namen niet ────
    const sam = await pg.$('#samenwerking')
    zeg(!!sam, `${stempel}: het blok over de samenwerkingen staat er niet`)
    if (sam) {
      const st = (await sam.textContent()).replace(/\s+/g, ' ')
      zeg(taal.korting.test(st), `${stempel}: de korting van 10 tot 30 procent staat niet in het blok`)
      zeg(
        taal.winkel.test(st) && !/\b(bsxl|ikea|praxis|gamma|karwei|hornbach|leen bakker|beter bed)\b/i.test(st),
        `${stempel}: er staat een bedrijfsnaam in het samenwerkingsblok`
      )
      const uit = await sam.$$eval('a', (e) => e.map((a) => a.getAttribute('href')).filter((h) => /^https?:/.test(h)))
      zeg(uit.length === 0, `${stempel}: het samenwerkingsblok linkt naar buiten: ${uit.join(', ')}`)
    }

    await pg.click(`.pkaart[data-artikel="${taal.artikel}"]`)
    zeg(await pg.isVisible('#balk'), `${stempel}: een artikel uit het aanbod komt niet in de balk`)
    await pg.goto(basis + taal.contact, { waitUntil: 'networkidle' })
    await langs()
    const art = await pg.$$eval('#chipsMat .chip span', (e) => e.map((x) => x.textContent))
    zeg(art.join('|') === taal.artikel, `${stempel}: het artikel komt niet in het formulier: ${art}`)
    await pg.evaluate(() => {
      localStorage.removeItem('novera:wensen')
      localStorage.removeItem('novera:wensen:en')
    })

    // ── de lijst loopt over pagina's heen mee ──────────────
    await pg.goto(basis + taal.materialen, { waitUntil: 'networkidle' })
    await langs()
    await pg.click(`.mkaart[data-artikel="${taal.mat[0]}"]`)
    await pg.click(`.mkaart[data-artikel="${taal.mat[1]}"]`)
    zeg(await pg.isVisible('#balk'), `${stempel}: de wensenbalk komt niet op`)
    await pg.goto(basis + taal.home, { waitUntil: 'networkidle' })
    await langs()
    zeg(await pg.isVisible('#balk'), `${stempel}: de lijst valt weg bij het wisselen van pagina`)
    await pg.goto(basis + taal.materialen, { waitUntil: 'networkidle' })
    await langs()
    zeg(
      await pg.evaluate(
        (n) => document.querySelector(`.mkaart[data-artikel="${n}"]`).classList.contains('is-aan'),
        taal.mat[0]
      ),
      `${stempel}: de keuze valt weg bij het wisselen van pagina`
    )
    await pg.goto(basis + taal.contact, { waitUntil: 'networkidle' })
    await langs()
    const chips = await pg.$$eval('#chipsMat .chip span', (e) => e.map((x) => x.textContent))
    zeg(chips.join(',') === taal.mat.join(','), `${stempel}: de lijst komt niet in het formulier: ${chips}`)
    zeg(await pg.isHidden('#balk'), `${stempel}: de balk staat nog op de contactpagina`)

    // ── formulier ─────────────────────────────────────────
    // De aanvraag gaat sinds de overzetting echt de deur uit, naar de worker in
    // worker/index.ts. Die draait hier niet, dus het verzoek wordt onderschept en
    // wat gemeten wordt is de kant die in dit bestand zit: welke velden verplicht
    // zijn, wat er precies verstuurd wordt en wat de bezoeker daarna ziet.
    let verstuurd = null
    const eindpunt = taal.code === 'en' ? '/api/forms/en/quote' : '/api/forms/offerte'
    await pg.route('**/api/forms/**', async (route) => {
      const req = route.request()
      verstuurd = { pad: new URL(req.url()).pathname, velden: req.postData() || '' }
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    })

    await pg.click('#formKnop')
    zeg(await pg.isVisible('#formFout'), `${stempel}: lege aanvraag geeft geen melding`)
    zeg(await pg.isHidden('#dank'), `${stempel}: lege aanvraag toont toch de bedanktekst`)
    zeg(verstuurd === null, `${stempel}: lege aanvraag gaat toch de deur uit`)
    await pg.fill('input[name="firstName"]', 'Test')
    await pg.fill('input[name="lastName"]', 'Tester')
    await pg.click('#formKnop')
    zeg(await pg.isVisible('#formFout'), `${stempel}: aanvraag zonder telefoon komt er toch door`)
    await pg.fill('input[name="telefoon"]', '0612345678')
    await pg.click('#formKnop')
    zeg(await pg.isVisible('#formFout'), `${stempel}: aanvraag zonder e-mailadres komt er toch door`)
    await pg.fill('input[name="email"]', 'kapot@')
    await pg.click('#formKnop')
    zeg(await pg.isVisible('#formFout'), `${stempel}: een onzinnig e-mailadres komt er toch door`)
    zeg(verstuurd === null, `${stempel}: een onvolledige aanvraag gaat toch de deur uit`)

    await pg.fill('input[name="email"]', 'test@jouwidealewebsite.nl')
    await pg.fill('input[name="plaats"]', 'Vlaardingen')
    // de vinkjes zelf staan buiten beeld; het label eromheen is wat je aanklikt
    for (const waarde of [taal.werkEen, taal.werkTwee]) {
      await pg.click(`label.chip:has(input[name="werk"][value="${waarde}"]) span`)
    }
    await pg.fill('textarea[name="toelichting"]', 'Badkamer van 2 bij 2,5 meter.')
    await pg.click('#formKnop')
    await pg.waitForTimeout(400)
    zeg(await pg.isVisible('#dank'), `${stempel}: geldige aanvraag geeft geen bevestiging`)
    zeg(await pg.isHidden('#formKnop'), `${stempel}: de knop blijft staan na versturen`)

    zeg(verstuurd !== null, `${stempel}: de aanvraag is niet verstuurd`)
    if (verstuurd) {
      zeg(verstuurd.pad === eindpunt, `${stempel}: de aanvraag ging naar ${verstuurd.pad}, moet ${eindpunt} zijn`)
      const v = verstuurd.velden
      // de drie ingebouwde velden van @jiw/cloudflare-forms
      for (const veld of ['firstName', 'lastName', 'email', 'telefoon', 'plaats', 'toelichting']) {
        zeg(v.includes('name="' + veld + '"'), `${stempel}: ${veld} gaat niet mee in de aanvraag`)
      }
      // tien vinkjes onder dezelfde naam: de worker leest er één, dus ze moeten
      // tot één regel samengevoegd zijn voordat ze de deur uit gaan
      const keer = (v.match(/name="werk"/g) || []).length
      zeg(keer === 1, `${stempel}: werk staat ${keer} keer in de aanvraag, moet 1 keer samengevoegd zijn`)
      zeg(
        v.includes(taal.werkEen + ', ' + taal.werkTwee),
        `${stempel}: de aangevinkte werkzaamheden staan niet samengevoegd in de aanvraag`
      )
      // de lijst van /materialen moet op dezelfde manier meegaan
      const keerMat = (v.match(/name="materiaal_item"/g) || []).length
      zeg(keerMat <= 1, `${stempel}: materiaal_item staat ${keerMat} keer in de aanvraag`)
      zeg(v.includes(taal.mat[0]), `${stempel}: de lijst gaat niet mee in de aanvraag`)
      // het lokveld hoort mee te gaan (leeg), anders werkt de botvang niet
      zeg(v.includes('name="bedrijf"'), `${stempel}: het lokveld gaat niet mee in de aanvraag`)
    }
    await pg.unroute('**/api/forms/**')
    await pg.evaluate(() => {
      localStorage.removeItem('novera:wensen')
      localStorage.removeItem('novera:wensen:en')
    })

    // ── het telefoonnummer staat er, en overal hetzelfde ──
    const tel = await pg.$$eval('a[href^="tel:"]', (e) => [...new Set(e.map((a) => a.getAttribute('href')))])
    zeg(tel.length === 1 && tel[0] === 'tel:+31648569040', `${stempel}: telefoonnummer ontbreekt of wijkt af: ${tel}`)
  }

  await pg.close()
}

/* ── zonder JavaScript ────────────────────────────────────
   Dit is de ronde die zegt wat een crawler werkelijk krijgt. Google voert JS uit,
   maar niet altijd en niet meteen, en de meeste andere lezers (Bing, de bots van
   taalmodellen, een voorvertoning in WhatsApp) doen het helemaal niet. Alles wat
   deze ronde niet ziet, bestaat voor hen niet.
   Dit is ook precies waar deze site op zakte voor de overzetting: het telefoonnummer
   en de contactkaarten werden door app.js op de pagina gezet, en de halve pagina
   stond op opacity 0 te wachten op een IntersectionObserver. */
{
  const kaal = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } })
  const pg = await kaal.newPage()

  for (const taal of TALEN) {
    for (const pad of taal.paden) {
      const merk = `zonder-js ${pad}`
      const r = await pg.goto(basis + pad, { waitUntil: 'domcontentloaded' })
      zeg(r && r.status() < 400, `${merk}: status ${r && r.status()}`)

      // de kop en de lopende tekst staan er
      const koppen = await pg.$$eval('h1', (e) => e.map((x) => x.textContent.trim()))
      zeg(koppen.length === 1, `${merk}: ${koppen.length} h1-koppen, moet er precies 1 zijn`)
      zeg(koppen[0] && koppen[0].length > 8, `${merk}: de h1 is leeg of te kort`)
      // De contactpagina is vooral formulier, daar is 120 woorden geen eerlijke lat.
      const minstens = /contact/.test(pad) ? 80 : 120
      const woorden = await pg.$eval('main', (e) => e.innerText.trim().split(/\s+/).length)
      zeg(woorden > minstens, `${merk}: maar ${woorden} woorden zonder JavaScript`)

      // niets staat onzichtbaar te wachten op een observer
      const blind = await pg.$$eval(
        'main .reveal',
        (e) => e.filter((x) => Number(getComputedStyle(x).opacity) < 0.99).length
      )
      zeg(blind === 0, `${merk}: ${blind} blokken blijven onzichtbaar zonder JavaScript`)

      // het telefoonnummer staat in de HTML, niet in JavaScript
      const tel = await pg.$$eval('a[href^="tel:"]', (e) => [...new Set(e.map((a) => a.getAttribute('href')))])
      zeg(
        tel.length === 1 && tel[0] === 'tel:+31648569040',
        `${merk}: telefoonnummer ontbreekt of wijkt af zonder JavaScript: ${tel}`
      )

      // en de voet draagt het adres en het KvK-nummer
      const voet = await pg.$eval('footer', (e) => e.innerText)
      zeg(/Albertine Agneslaan 350/.test(voet), `${merk}: adres staat niet in de voet zonder JavaScript`)
      zeg(/KvK 83882057/.test(voet), `${merk}: KvK staat niet in de voet zonder JavaScript`)

      // canonical en hreflang wijzen naar het echte domein
      const can = await pg.getAttribute('link[rel="canonical"]', 'href')
      zeg(
        can === 'https://noverabouw.nl' + (pad === '/' ? '/' : pad),
        `${merk}: canonical is ${can}`
      )
      const alt = await pg.$$eval('link[rel="alternate"]', (e) =>
        e.map((x) => x.getAttribute('hreflang') + ' ' + x.getAttribute('href'))
      )
      zeg(alt.length === 3, `${merk}: ${alt.length} hreflang-regels, moeten er 3 zijn (nl, en, x-default)`)
      zeg(
        alt.every((a) => a.includes('https://noverabouw.nl')),
        `${merk}: hreflang wijst niet naar het echte domein: ${alt.join(' | ')}`
      )

      // de structured data moet leesbaar zijn zonder JS, en het telefoonnummer dragen
      const ld = await pg.$eval('script[type="application/ld+json"]', (e) => e.textContent)
      const data = JSON.parse(ld)
      zeg(data['@type'] === 'GeneralContractor', `${merk}: schema-type is ${data['@type']}`)
      zeg(data.telephone === '+31648569040', `${merk}: schema draagt telefoon ${data.telephone}`)
      zeg(data.url === 'https://noverabouw.nl/', `${merk}: schema wijst naar ${data.url}`)
    }
  }

  // de contactpagina moet zonder JS nog steeds een werkend formulier tonen
  await pg.goto(basis + '/contact', { waitUntil: 'domcontentloaded' })
  for (const veld of ['firstName', 'email', 'telefoon', 'toelichting']) {
    zeg(
      (await pg.$$(`[name="${veld}"]`)).length === 1,
      `zonder-js /contact: het veld ${veld} staat er niet`
    )
  }
  zeg((await pg.$$('#contactKaarten a[href^="tel:"]')).length === 1, 'zonder-js /contact: geen belkaart')
  zeg((await pg.$$('#contactKaarten a[href*="wa.me"]')).length === 1, 'zonder-js /contact: geen WhatsApp-kaart')

  await kaal.close()
}

await browser.close()
if (server) server.close()
console.log(`${ok} controles zonder fout`)
if (fouten.length) {
  console.log(`\n${fouten.length} FOUT:`)
  fouten.forEach((f) => console.log(' - ' + f))
  process.exit(1)
}
