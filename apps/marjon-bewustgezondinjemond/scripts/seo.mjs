/**
 * Zet sitemap.xml en robots.txt in dist/, na de build.
 *
 * Ze staan niet in public/ omdat in beide het adres van de site staat, en dat
 * adres komt uit site.config.mjs. Zou het in public/ staan, dan is er weer een
 * tweede plek waar het domein met de hand goed gehouden moet worden, en dat is
 * precies wat er bij een verhuizing vergeten wordt. Bij deze site stond daar
 * nog een sitemap met het conceptadres erin.
 *
 *   node scripts/seo.mjs
 */
import {execFileSync} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PAGINAS, SITE_NAAM, SITE_URL} from '../site.config.mjs';

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
        return execFileSync('git', ['log', '-1', '--format=%cI', '--', f], {
          cwd: APP,
          encoding: 'utf8',
        }).trim();
      } catch {
        return '';
      }
    })
    .filter(Boolean);

  /* Nog nooit gecommit: dan weten we het niet, en dan hoort er niets te staan.
     Een lege waarde is beter dan "vandaag" bij elke build. */
  if (!datums.length) return null;
  return datums.sort().at(-1).slice(0, 10);
}

/* De hele site is één App-component met één stijlblad, dus elke pagina hangt
   aan dezelfde handvol bestanden. Per pagina komt daar het bestand bij waar
   haar eigen tekst in staat. */
const GEDEELD = ['src/App.tsx', 'src/index.css', 'index.html', 'site.config.mjs'];

function bronnenVan(pagina) {
  if (pagina.spec) return [...GEDEELD, 'src/specialisaties.tsx'];
  if (pagina.pad.startsWith('/privacy')) return [...GEDEELD, 'src/privacy.tsx', 'src/privacytekst.js'];
  return GEDEELD;
}

/* ------------------------------------------------------------------ */
/*  sitemap.xml                                                        */
/* ------------------------------------------------------------------ */

function sitemap() {
  /* Geen changefreq en geen priority: Google negeert allebei ("Google ignores
     <priority> and <changefreq> values"), dus het was versiering die
     onderhouden moest worden. In de sitemap die hier stond stonden ze nog. */
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
 * Eén groep: iedereen mag alles.
 *
 * Een crawler volgt precies één groep, de meest specifieke die op hem past.
 * Twintig groepen onder elkaar met dezelfde inhoud lijkt zorgvuldig maar is een
 * val: wie later iets in de `*`-groep verandert, verandert niets voor Googlebot
 * of ClaudeBot, want die lezen hun eigen groep. Eén `User-agent: *` met
 * `Allow: /` laat iedereen binnen, inclusief de taalmodellen.
 *
 * De voorbeeldpagina met de verzonnen reviews staat er niet op. Die draagt
 * noindex, en een crawler die er niet mag komen leest dat nooit: uitsluiten doe
 * je met het een of het ander, nooit met allebei.
 */
function robots() {
  return [
    `# ${SITE_NAAM} - ${SITE_URL}`,
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
