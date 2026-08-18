/**
 * Zet sitemap.xml en robots.txt in dist/, na de build.
 *
 * Ze staan niet in public/ omdat er in beide het adres van de site staat, en
 * dat adres komt uit site.config.mjs. Zou het in public/ staan, dan is er weer
 * een tweede plek waar het domein met de hand goed gehouden moet worden, en dat
 * is precies wat er bij een verhuizing vergeten wordt.
 *
 *   node scripts/seo.mjs
 */
import {execFileSync} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PAGINAS, SITE_URL} from '../site.config.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(APP, 'dist');

/* ------------------------------------------------------------------ */
/*  lastmod                                                            */
/* ------------------------------------------------------------------ */

/**
 * Google gebruikt lastmod alleen als hij hem kan vertrouwen: staat er bij elke
 * pagina de datum van de laatste build, dan is dat bij elke deploy zeven keer
 * "alles is nieuw" en gaat het signaal de prullenbak in. Daarom de datum van de
 * laatste commit die deze pagina echt raakte.
 */
function laatsteWijziging(bestanden) {
  const datums = bestanden
    .map((f) => {
      try {
        return execFileSync('git', ['log', '-1', '--format=%cI', '--', f], {cwd: APP, encoding: 'utf8'}).trim();
      } catch {
        return '';
      }
    })
    .filter(Boolean);

  /* Nog nooit gecommit: dan weten we het niet, en dan hoort er niets te staan.
     Hier stond eerst "vandaag", en dat is precies de fout waar Google lastmod om
     negeert: zolang de app niet in git zit, krijgt elke pagina bij elke build de
     datum van vandaag, en dan zegt de sitemap zeven keer per deploy dat alles
     veranderd is. Google gebruikt de waarde alleen "if it's consistently and
     verifiably accurate"; een lege waarde is beter dan een onware. */
  if (!datums.length) return null;
  return datums.sort().at(-1).slice(0, 10);
}

/* Wat elke pagina meebrengt: zijn eigen HTML, zijn eigen component, en de vier
   bestanden waar de balk bovenaan, het formulier en de footer in staan.
   Verandert de footer, dan verandert elke pagina, en dat klopt ook. */
const GEDEELD = ['src/layout.tsx', 'src/ui.tsx', 'src/Aanvraag.tsx', 'src/index.css'];

const bronnenVan = (pagina) => [pagina.bestand, pagina.component, ...GEDEELD];

/* ------------------------------------------------------------------ */
/*  sitemap.xml                                                        */
/* ------------------------------------------------------------------ */

function sitemap() {
  /* Geen changefreq en geen priority meer: Google negeert allebei ("Google
     ignores <priority> and <changefreq> values"), dus het was versiering die
     onderhouden moest worden. */
  const items = PAGINAS.filter((p) => p.inSitemap).map((p) => {
    const gewijzigd = laatsteWijziging(bronnenVan(p));
    return [
      '  <url>',
      `    <loc>${SITE_URL}${p.pad}</loc>`,
      ...(gewijzigd ? [`    <lastmod>${gewijzigd}</lastmod>`] : []),
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...items,
    '</urlset>',
    '',
  ].join('\n');
}

/* ------------------------------------------------------------------ */
/*  robots.txt                                                         */
/* ------------------------------------------------------------------ */

/**
 * Eén regel: iedereen mag alles.
 *
 * Hier stonden twintig groepen onder elkaar, één per crawler, allemaal met
 * dezelfde inhoud. Dat leek zorgvuldig maar is een val: een crawler volgt
 * precies één groep, de meest specifieke die op hem past. Wie hier later iets
 * verandert in de `*`-groep, verandert daarmee niets voor Googlebot, GPTBot of
 * ClaudeBot, want die lezen hun eigen groep. Twintig kopieën die uit elkaar
 * kunnen lopen, om te zeggen wat de eerste groep al zei.
 *
 * Eén `User-agent: *` met `Allow: /` laat iedereen binnen, inclusief de
 * taalmodellen: die hebben geen eigen regel nodig om te mogen, alleen om
 * geweigerd te worden. Moet er ooit één geweigerd worden, dan komt daar één
 * groep bij, en dan is meteen zichtbaar dat die afwijkt.
 *
 * De bedankpagina staat er ook niet op. Die draagt `noindex`, en een crawler
 * die er niet mag komen leest dat nooit: uitsluiten doe je met het een of het
 * ander, nooit met allebei.
 */
function robots() {
  return [
    '# Fleurig! Bloemenwinkel, Oud-Beijerland',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

/* ------------------------------------------------------------------ */

await mkdir(DIST, {recursive: true});
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(), 'utf8');
await writeFile(path.join(DIST, 'robots.txt'), robots(), 'utf8');

const aantal = PAGINAS.filter((p) => p.inSitemap).length;
console.log(`seo: sitemap.xml (${aantal} pagina's) en robots.txt geschreven voor ${SITE_URL}`);
