/**
 * Loopt de gebouwde site na voordat hij de deur uit gaat.
 *
 * Niet omdat er iets mis is, maar omdat de dingen die hier misgaan onzichtbaar
 * zijn: een canonical die naar het oude adres wijst, een pagina die na een
 * hernoeming uit de sitemap valt, twee pagina's met dezelfde title, een
 * beschrijving die in de zoekresultaten halverwege wordt afgekapt. Daar
 * struikelt niemand over tijdens het klikken, en het kost weken voordat je het
 * in de cijfers ziet.
 *
 * Draait als onderdeel van `ship`, dus een fout hier betekent dat er niet
 * gedeployed wordt.
 *
 *   node scripts/audit-seo.mjs
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PAGINAS, SITE_URL, WINKEL} from '../site.config.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');

assert.ok(existsSync(DIST), 'dist ontbreekt; draai eerst pnpm build');

/* Bezwaren worden verzameld en aan het eind samen gemeld: wie een build draait
   wil in één keer zien wat er allemaal langs moet, niet vijf keer achter elkaar
   op de eerste regel struikelen. */
const bezwaren = [];
const eis = (voorwaarde, melding) => {
  if (!voorwaarde) bezwaren.push(melding);
};

const ontcijfer = (v) =>
  v.replace(/&(?:amp|#38);/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function precies(html, patroon, wat, pagina) {
  const treffers = [...html.matchAll(patroon)];
  assert.equal(treffers.length, 1, `${pagina}: verwacht precies één ${wat}, gevonden ${treffers.length}`);
  return ontcijfer(treffers[0][1]);
}

/* ------------------------------------------------------------------ */
/*  Per pagina                                                         */
/* ------------------------------------------------------------------ */

const paginas = PAGINAS.map((p) => {
  const bestand = path.join(DIST, p.bestand);
  assert.ok(existsSync(bestand), `${p.pad}: ${p.bestand} staat niet in dist`);
  const html = readFileSync(bestand, 'utf8');

  const titel = precies(html, /<title>(.*?)<\/title>/gs, 'title', p.pad);
  const omschrijving = precies(html, /<meta name="description" content="([^"]*)"/g, 'meta description', p.pad);
  const h1 = precies(html, /<h1[^>]*>(.*?)<\/h1>/gs, 'h1', p.pad).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  assert.ok(titel.trim(), `${p.pad}: lege title`);
  assert.ok(omschrijving.trim(), `${p.pad}: lege description`);
  assert.ok(h1, `${p.pad}: lege h1`);

  /* De inhoud moet in de HTML staan en niet pas na het draaien van JavaScript.
     Dit is de hele reden dat scripts/prerender.mjs bestaat; hier wordt bewaakt
     dat die stap ook echt is gelopen. */
  assert.ok(!html.includes('<div id="root"></div>'), `${p.pad}: niet voorgerenderd, #root is leeg`);
  assert.ok(html.length > 15_000, `${p.pad}: verdacht weinig HTML (${html.length} tekens)`);

  /* Het stijlblad hoort in de pagina te staan; blijft er een verwijzing over,
     dan wacht de eerste weergave alsnog op een tweede verzoek. */
  assert.doesNotMatch(html, /<link rel="stylesheet"[^>]*\/assets\//, `${p.pad}: stijlblad staat nog los`);

  /* Elke plaatjesverwijzing moet ook een bestand zijn. Een hernoemde foto valt
     hier om, niet pas op de site. */
  for (const [, url] of html.matchAll(/(?:src|href|content)="(\/img\/[^"]+)"/g)) {
    assert.ok(existsSync(path.join(DIST, url)), `${p.pad}: ${url} bestaat niet in dist`);
  }

  /* Een pagina op noindex hoeft geen deelkaart en geen canonical: hij hoort
     nergens te staan waar je hem kunt delen of vinden. */
  if (noindex) return {...p, titel, omschrijving, noindex: true};

  const canoniek = precies(html, /<link rel="canonical" href="([^"]*)"/g, 'canonical', p.pad);
  const ogUrl = precies(html, /<meta property="og:url" content="([^"]*)"/g, 'og:url', p.pad);
  const ogTitel = precies(html, /<meta property="og:title" content="([^"]*)"/g, 'og:title', p.pad);
  const ogBeeld = precies(html, /<meta property="og:image" content="([^"]*)"/g, 'og:image', p.pad);

  assert.equal(canoniek, `${SITE_URL}${p.pad}`,
    `${p.pad}: canonical wijst naar ${canoniek} in plaats van naar zichzelf`);
  assert.equal(ogUrl, canoniek, `${p.pad}: og:url en canonical lopen uiteen`);
  /* De deelkaart mag zijn eigen formulering hebben: daar telt de naam van de
     winkel zwaarder dan het zoekwoord, en er is minder ruimte. Wat hij niet mag
     zijn is de titel van een andere pagina, en dat is wat een kopieerfout
     oplevert. Vandaar geen gelijkheid maar overlap: delen ze geen woorden, dan
     gaan ze over iets anders. */
  const woorden = (t) => new Set(t.toLowerCase().match(/[a-zà-ÿ]{4,}/g) ?? []);
  const gedeeld = [...woorden(ogTitel)].filter((w) => woorden(titel).has(w));
  eis(gedeeld.length >= 2,
    `${p.pad}: og:title ("${ogTitel}") lijkt niet op de title ("${titel}")`);
  eis(ogBeeld.startsWith(`${SITE_URL}/img/og-`),
    `${p.pad}: og:image is geen deelplaatje van 1200x630 (${ogBeeld})`);

  /* Een zoekresultaat toont ongeveer 60 tekens titel en 155 beschrijving. Wat
     daarboven zit schrijft Google zelf opnieuw, en dan staat er iets anders dan
     wat wij bedoelden. Wat er ver onder zit vult de regel niet. */
  eis(titel.length <= 65, `${p.pad}: title is ${titel.length} tekens (max 65), dat wordt afgekapt: "${titel}"`);
  eis(omschrijving.length >= 110 && omschrijving.length <= 165,
    `${p.pad}: description is ${omschrijving.length} tekens (110-165): "${omschrijving.slice(0, 60)}..."`);

  return {...p, titel, omschrijving, canoniek, noindex: false};
});

/* ------------------------------------------------------------------ */
/*  Over de pagina's heen                                              */
/* ------------------------------------------------------------------ */

for (const veld of ['titel', 'omschrijving', 'canoniek']) {
  const gezien = new Map();
  for (const p of paginas) {
    if (p.noindex || !p[veld]) continue;
    const eerder = gezien.get(p[veld]);
    assert.ok(!eerder, `Dubbele ${veld}: ${eerder} en ${p.pad}`);
    gezien.set(p[veld], p.pad);
  }
}

/* ------------------------------------------------------------------ */
/*  De winkel, zoals de zoekmachine hem leest                          */
/* ------------------------------------------------------------------ */

const home = readFileSync(path.join(DIST, 'index.html'), 'utf8');
const blokken = [...home.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  .map((m) => JSON.parse(m[1]));

const winkel = blokken.find((b) => b['@type'] === 'Florist');
assert.ok(winkel, 'De homepage draagt geen Florist-gegevens');
assert.equal(winkel['@id'], `${SITE_URL}/#winkel`, 'De Florist heeft geen vaste identiteit (@id)');
assert.equal(winkel.telephone, WINKEL.telefoon, 'Het telefoonnummer in de gegevens wijkt af van site.config.mjs');
assert.equal(winkel.address.streetAddress, WINKEL.straat, 'Het adres in de gegevens wijkt af van site.config.mjs');
assert.equal(winkel.address.postalCode, WINKEL.postcode, 'De postcode in de gegevens wijkt af van site.config.mjs');
assert.ok(blokken.some((b) => b['@type'] === 'WebSite'), 'De homepage draagt geen WebSite-gegevens');
/* Geen FAQPage-controle meer: Google heeft dat rich result in mei 2026 uit de
   resultaten gehaald en in juni de documentatie verwijderd. De vragen staan als
   gewone tekst op de pagina; daar is niets aan te controleren dat hier thuishoort. */

/* De winkel is drie dagen dicht, en dat hoort er ook te staan: Google leest een
   dag zonder regel als "onbekend", niet als "gesloten". */
const uren = winkel.openingHoursSpecification.flatMap((o) => o.dayOfWeek);
assert.equal(new Set(uren).size, 7, 'Niet alle zeven dagen staan in de openingstijden');

for (const p of paginas.filter((x) => !x.noindex && x.pad !== '/')) {
  const html = readFileSync(path.join(DIST, p.bestand), 'utf8');
  const eigen = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  const dienst = eigen.find((b) => b['@type'] === 'Service');
  assert.ok(dienst, `${p.pad}: geen Service-gegevens`);
  assert.equal(dienst.provider?.['@id'], `${SITE_URL}/#winkel`,
    `${p.pad}: de dienst verwijst niet naar dezelfde winkel`);
  assert.ok(eigen.some((b) => b['@type'] === 'BreadcrumbList'), `${p.pad}: geen kruimelpad`);
}

/* ------------------------------------------------------------------ */
/*  Sitemap en robots                                                  */
/* ------------------------------------------------------------------ */

const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

for (const p of paginas) {
  const url = `${SITE_URL}${p.pad}`;
  if (p.noindex) {
    assert.ok(!inSitemap.includes(url), `${p.pad} staat op noindex maar wel in de sitemap`);
  } else {
    assert.ok(inSitemap.includes(url), `${p.pad} ontbreekt in de sitemap`);
  }
}
assert.equal(inSitemap.length, paginas.filter((p) => !p.noindex).length,
  'De sitemap noemt adressen die niet gebouwd zijn');

const robots = readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), 'robots.txt wijst naar de verkeerde sitemap');
assert.ok(/User-agent: \*\nAllow: \//.test(robots), 'robots.txt laat niet iedereen binnen');

assert.ok(existsSync(path.join(DIST, '404.html')), 'Er is geen 404-pagina gebouwd');
assert.ok(existsSync(path.join(DIST, 'logo-email.png')),
  'Het logo van de bevestigingsmail zit niet in de build; een mailprogramma haalt het daar op');

/* ------------------------------------------------------------------ */

if (bezwaren.length) {
  console.error(`audit: ${bezwaren.length} punt(en) na te lopen\n`);
  for (const b of bezwaren) console.error(`  - ${b}`);
  process.exit(1);
}

const geindexeerd = paginas.filter((p) => !p.noindex);
console.log(
  `audit: ${paginas.length} pagina's gecontroleerd, ${geindexeerd.length} in de sitemap, ` +
  `alle canonicals op ${SITE_URL}.`,
);
