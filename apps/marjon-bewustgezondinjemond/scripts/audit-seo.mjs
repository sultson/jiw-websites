/**
 * Loopt de gebouwde site na voordat hij de deur uit gaat.
 *
 * Niet omdat er iets mis is, maar omdat de dingen die hier misgaan onzichtbaar
 * zijn: een canonical die naar het conceptadres wijst, een pagina die na een
 * hernoeming uit de sitemap valt, twee pagina's met dezelfde title, een
 * beschrijving die in de zoekresultaten halverwege wordt afgekapt, of een
 * pagina die na een wijziging ineens weer leeg de deur uit gaat omdat het
 * bakken stilletjes is overgeslagen. Daar struikelt niemand over tijdens het
 * klikken, en het kost weken voordat je het in de cijfers ziet.
 *
 * Draait als onderdeel van `ship`, dus een fout hier betekent dat er niet
 * gedeployed wordt.
 *
 *   node scripts/audit-seo.mjs
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {PAGINAS, PRAKTIJK, SITE_URL, VORIG_ADRES} from '../site.config.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');

assert.ok(existsSync(DIST), 'dist ontbreekt; draai eerst pnpm build');

const {SPEC_META, ALIAS_PADEN} = await import(
  pathToFileURL(path.join(APP, 'dist-ssr/entry-server.js')).href
);

/* Bezwaren worden verzameld en aan het eind samen gemeld: wie een build draait
   wil in één keer zien wat er allemaal langs moet, niet vijf keer achter elkaar
   op de eerste regel struikelen. */
const bezwaren = [];
const eis = (voorwaarde, melding) => {
  if (!voorwaarde) bezwaren.push(melding);
};

const ontcijfer = (v) =>
  v
    .replace(/&(?:amp|#38);/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

function precies(html, patroon, wat, pagina) {
  const treffers = [...html.matchAll(patroon)];
  assert.equal(treffers.length, 1, `${pagina}: verwacht precies één ${wat}, gevonden ${treffers.length}`);
  return ontcijfer(treffers[0][1]);
}

/** De <title> in de head, niet de <title> in een svg verderop in de pagina. */
const KOPTITEL = /<head>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<\/head>/g;

/* ------------------------------------------------------------------ */
/*  Per pagina                                                         */
/* ------------------------------------------------------------------ */

const ALLE = [
  ...PAGINAS.map((p) => (p.spec ? {...p, ...SPEC_META[p.pad]} : p)),
  ...ALIAS_PADEN,
];

const paginas = ALLE.map((p) => {
  const bestand = path.join(DIST, p.bestand);
  assert.ok(existsSync(bestand), `${p.pad}: ${p.bestand} staat niet in dist`);
  const html = readFileSync(bestand, 'utf8');

  const titel = precies(html, KOPTITEL, 'title in de head', p.pad);
  const omschrijving = precies(html, /<meta name="description" content="([^"]*)"/g, 'meta description', p.pad);
  const h1 = precies(html, /<h1[^>]*>(.*?)<\/h1>/gs, 'h1', p.pad)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  assert.ok(titel.trim(), `${p.pad}: lege title`);
  assert.ok(omschrijving.trim(), `${p.pad}: lege description`);
  assert.ok(h1, `${p.pad}: lege h1`);

  /* De inhoud moet in de HTML staan en niet pas na het draaien van JavaScript.
     Dit is de hele reden dat scripts/prerender.mjs bestaat; hier wordt bewaakt
     dat die stap ook echt gelopen heeft. Op het conceptadres was dit precies
     wat er misging: elke pagina was voor een crawler leeg. */
  assert.ok(!html.includes('<div id="root"></div>'), `${p.pad}: niet voorgerenderd, #root is leeg`);

  /* Echte tekst tellen, niet tags. Een pagina die hieronder zakt is stuk, hoe
     groot het bestand ook is. De 404 mag kort zijn: die hoort juist kort te
     zijn, en hij staat op noindex. */
  const woorden = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const vloer = noindex ? 60 : 250;
  assert.ok(woorden > vloer, `${p.pad}: maar ${woorden} woorden tekst in de HTML (minstens ${vloer})`);

  /* Niets mag meer naar het conceptadres wijzen. Dat is de fout die bij een
     verhuizing het langst onzichtbaar blijft: de site staat live op het nieuwe
     domein en verwijst zichzelf naar het oude. */
  const oudeHost = new URL(VORIG_ADRES).hostname;
  assert.ok(!html.includes(oudeHost), `${p.pad}: verwijst nog naar ${oudeHost}`);

  /* Elke verwijzing naar beeld of lettertype moet een bestand zijn. Een
     hernoemde foto valt hier om, niet pas op de site. De ?v=... is de
     cache-breker uit de huisafspraak en hoort niet bij de bestandsnaam op
     schijf, dus die gaat er eerst af. */
  for (const [, url] of html.matchAll(/(?:src|href|content)="(\/(?:img|fonts)\/[^"]+)"/g)) {
    assert.ok(existsSync(path.join(DIST, url.split('?')[0])), `${p.pad}: ${url} bestaat niet in dist`);
  }

  /* Hetzelfde voor de srcset: daar staan meerdere adressen in één attribuut,
     elk met een breedte erachter. Zonder deze lus glipt een hernoemde of
     vergeten maat ongezien door de poort. */
  for (const [, lijst] of html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const deel of lijst.split(',')) {
      const url = deel.trim().split(/\s+/)[0];
      if (!url.startsWith('/img/') && !url.startsWith('/fonts/')) continue;
      assert.ok(existsSync(path.join(DIST, url.split('?')[0])), `${p.pad}: ${url} uit srcset bestaat niet in dist`);
    }
  }

  const canoniek = precies(html, /<link rel="canonical" href="([^"]*)"/g, 'canonical', p.pad);
  assert.equal(
    canoniek,
    `${SITE_URL}${p.canoniek ?? p.pad}`,
    `${p.pad}: canonical wijst naar ${canoniek} in plaats van naar ${p.canoniek ?? p.pad}`,
  );

  /* Een pagina op noindex hoeft verder niets te bewijzen: hij hoort nergens te
     staan waar je hem kunt vinden. */
  if (noindex) return {...p, titel, omschrijving, canoniek, noindex: true};

  const ogUrl = precies(html, /<meta property="og:url" content="([^"]*)"/g, 'og:url', p.pad);
  const ogTitel = precies(html, /<meta property="og:title" content="([^"]*)"/g, 'og:title', p.pad);
  const ogBeeld = precies(html, /<meta property="og:image" content="([^"]*)"/g, 'og:image', p.pad);

  assert.equal(ogUrl, canoniek, `${p.pad}: og:url en canonical lopen uiteen`);
  assert.equal(ogTitel, titel, `${p.pad}: og:title en title lopen uiteen`);
  assert.ok(ogBeeld.startsWith(`${SITE_URL}/img/`), `${p.pad}: og:image staat niet op deze site (${ogBeeld})`);

  /* Een zoekresultaat toont ongeveer 60 tekens titel en 155 beschrijving. Wat
     daarboven zit schrijft Google zelf opnieuw, en dan staat er iets anders dan
     wat wij bedoelden. Wat er ver onder zit vult de regel niet. */
  eis(titel.length <= 65, `${p.pad}: title is ${titel.length} tekens (max 65): "${titel}"`);
  eis(
    omschrijving.length >= 110 && omschrijving.length <= 165,
    `${p.pad}: description is ${omschrijving.length} tekens (110-165): "${omschrijving.slice(0, 70)}..."`,
  );

  return {...p, titel, omschrijving, canoniek, noindex: false};
});

/* ------------------------------------------------------------------ */
/*  Over de pagina's heen                                              */
/* ------------------------------------------------------------------ */

/* Dubbele titels en omschrijvingen laten Google kiezen welke van de twee hij
   toont, en dat is precies de keuze die je zelf wilt maken. De oude adressen
   van de pijlers vallen hierbuiten: die dragen met opzet dezelfde kop als de
   pagina waar hun canonical naartoe wijst. */
const eigen = paginas.filter((p) => !p.noindex && !p.canoniek);

for (const veld of ['titel', 'omschrijving', 'canoniek']) {
  const gezien = new Map();
  for (const p of eigen) {
    const eerder = gezien.get(p[veld]);
    assert.ok(!eerder, `Dubbele ${veld}: ${eerder} en ${p.pad}`);
    gezien.set(p[veld], p.pad);
  }
}

/* ------------------------------------------------------------------ */
/*  Wie ze is, zoals de zoekmachine het leest                          */
/* ------------------------------------------------------------------ */

function graaf(bestand) {
  const html = readFileSync(path.join(DIST, bestand), 'utf8');
  const blokken = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blokken.length, 1, `${bestand}: verwacht precies één schema.org-blok`);
  const data = JSON.parse(blokken[0][1]);
  assert.ok(Array.isArray(data['@graph']), `${bestand}: het schema.org-blok heeft geen @graph`);
  return data['@graph'];
}

const home = graaf('index.html');

const persoon = home.find((b) => b['@type'] === 'Person');
assert.ok(persoon, 'De voorpagina draagt geen Person-gegevens');
assert.equal(persoon['@id'], `${SITE_URL}/#marjon`, 'De Person heeft geen vaste identiteit (@id)');
assert.equal(persoon.telephone, PRAKTIJK.telefoon, 'Het telefoonnummer wijkt af van site.config.mjs');
assert.equal(persoon.address.addressLocality, PRAKTIJK.plaats, 'De plaats wijkt af van site.config.mjs');
assert.ok(persoon.sameAs.includes(PRAKTIJK.instagram), 'Instagram ontbreekt in sameAs');
assert.ok(persoon.sameAs.includes(PRAKTIJK.facebook), 'Facebook ontbreekt in sameAs');
assert.ok(home.some((b) => b['@type'] === 'WebSite'), 'De voorpagina draagt geen WebSite-gegevens');

const homeHtml = readFileSync(path.join(DIST, 'index.html'), 'utf8');

/**
 * Een FAQPage mag alleen in de gegevens staan als die vragen woordelijk op de
 * pagina zelf staan. Op het conceptadres was dat niet zo: vijf vragen in de
 * code, nul op de pagina. Dat blok is eruit (zie scripts/kop.mjs). Komt het
 * terug, dan hoort het pas te mogen als de tekst er ook staat.
 */
for (const p of paginas) {
  const html = p.pad === '/' ? homeHtml : readFileSync(path.join(DIST, p.bestand), 'utf8');
  const kaal = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
  for (const blok of graaf(p.bestand).filter((b) => b['@type'] === 'FAQPage')) {
    for (const v of blok.mainEntity ?? []) {
      const eersteWoorden = v.name.split(' ').slice(0, 4).join(' ');
      eis(
        kaal.includes(eersteWoorden),
        `${p.pad}: de vraag "${v.name}" staat in de gegevens maar niet als tekst op de pagina`,
      );
    }
  }
}

for (const p of paginas.filter((x) => !x.noindex && x.pad !== '/')) {
  const blokken = graaf(p.bestand);
  const kruimels = blokken.find((b) => b['@type'] === 'BreadcrumbList');
  assert.ok(kruimels, `${p.pad}: geen kruimelpad`);
  assert.equal(
    kruimels.itemListElement.at(-1).item,
    `${SITE_URL}${p.pad}`,
    `${p.pad}: het kruimelpad eindigt niet op deze pagina`,
  );
}

/* ------------------------------------------------------------------ */
/*  Sitemap en robots                                                  */
/* ------------------------------------------------------------------ */

const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const inSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

for (const p of paginas) {
  const url = `${SITE_URL}${p.pad}`;
  if (p.inSitemap) {
    assert.ok(inSitemap.includes(url), `${p.pad} ontbreekt in de sitemap`);
  } else {
    assert.ok(!inSitemap.includes(url), `${p.pad} hoort niet in de sitemap maar staat er wel in`);
  }
}
assert.equal(
  inSitemap.length,
  paginas.filter((p) => p.inSitemap).length,
  'De sitemap noemt adressen die niet gebouwd zijn',
);

const robots = readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), 'robots.txt wijst naar de verkeerde sitemap');
assert.ok(/User-agent: \*\nAllow: \//.test(robots), 'robots.txt laat niet iedereen binnen');

assert.ok(existsSync(path.join(DIST, '404.html')), 'Er is geen 404-pagina gebouwd');
assert.ok(
  existsSync(path.join(DIST, 'logo-email.png')),
  'Het logo van de bevestigingsmail zit niet in de build; een mailprogramma haalt het daar op',
);

/* ------------------------------------------------------------------ */
/*  Het formulier                                                      */
/* ------------------------------------------------------------------ */

/* Het adres waar het formulier op post moet hetzelfde zijn als het adres dat de
   Worker bedient. Lopen die uit elkaar, dan krijgt een bezoeker "Dank je wel"
   te zien en komt er nooit iets aan - en dat merkt niemand totdat Marjon vraagt
   waarom het stil blijft. */
const bundels = [...homeHtml.matchAll(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"/g)].map(
  (m) => m[1],
);
assert.ok(bundels.length, 'De voorpagina laadt geen javascript-bundel');
const code = bundels.map((b) => readFileSync(path.join(DIST, b), 'utf8')).join('\n');
const pad = readFileSync(path.join(APP, 'worker/index.ts'), 'utf8').match(/formPath: '([^']+)'/)[1];
assert.ok(code.includes(pad), `Het formulier post niet naar ${pad} (formPath in worker/index.ts)`);

/* ------------------------------------------------------------------ */

if (bezwaren.length) {
  console.error(`audit: ${bezwaren.length} punt(en) na te lopen\n`);
  for (const b of bezwaren) console.error(`  - ${b}`);
  process.exit(1);
}

const geindexeerd = paginas.filter((p) => p.inSitemap);
console.log(
  `audit: ${paginas.length} pagina's gecontroleerd, ${geindexeerd.length} in de sitemap, ` +
    `alle canonicals op ${SITE_URL}.`,
);
