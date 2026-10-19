/**
 * Meldt de adressen uit dist/sitemap.xml aan bij IndexNow (Bing, Yandex, Seznam,
 * Naver). Draai na een deploy: `pnpm indexnow`.
 *
 * Google doet hier niet aan mee; daar blijft Search Console de weg. Bing is
 * hier geen bijzaak: die voedt ook de zoekresultaten van ChatGPT en Copilot, en
 * dat is voor een winkel die nog onder een andere naam bekend staat precies de
 * plek waar de nieuwe naam moet landen.
 *
 * De sleutel is de naam van het .txt-bestand in public/, en de inhoud van dat
 * bestand is dezelfde sleutel. Het moet op het live adres opvraagbaar zijn,
 * anders weigert IndexNow de hele lijst — vandaar de proef hieronder, die
 * eerder afbreekt dan dat hij een lijst stuurt die toch wordt weggegooid.
 *
 * De host komt uit SITE_URL in site.config.mjs en staat hier niet apart. Bij
 * een verhuizing is dat het verschil tussen één regel omzetten en een script
 * dat maanden later nog het oude domein aanmeldt.
 */
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {SITE_URL} from '../site.config.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = new URL(SITE_URL).hostname;

const sleutel = (await readdir(path.join(APP, 'public')))
  .filter((f) => /^[0-9a-f]{16,}\.txt$/.test(f))
  .map((f) => f.replace(/\.txt$/, ''))[0];
if (!sleutel) throw new Error('geen sleutelbestand in public/ gevonden');

const sitemap = await readFile(path.join(APP, 'dist', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error('geen adressen in dist/sitemap.xml - eerst bouwen');

/* De adressen in de sitemap moeten op deze host staan. Staat er nog een oud
   domein in, dan weigert IndexNow de hele melding met een 422 en is het niet te
   zien aan de lijst zelf. */
const vreemd = urls.filter((u) => new URL(u).hostname !== HOST);
if (vreemd.length) throw new Error(`sitemap noemt een andere host: ${vreemd[0]}`);

const proef = await fetch(`https://${HOST}/${sleutel}.txt`);
if (!proef.ok) throw new Error(`de sleutel staat niet live (${proef.status}) - eerst uitrollen`);
if ((await proef.text()).trim() !== sleutel) {
  throw new Error('het sleutelbestand staat live maar bevat niet de sleutel zelf');
}

const antwoord = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {'content-type': 'application/json; charset=utf-8'},
  body: JSON.stringify({
    host: HOST,
    key: sleutel,
    keyLocation: `https://${HOST}/${sleutel}.txt`,
    urlList: urls,
  }),
});

console.log(`indexnow: ${urls.length} adressen gemeld, antwoord ${antwoord.status} ${antwoord.statusText}`);
if (!antwoord.ok) {
  console.log(await antwoord.text());
  process.exit(1);
}
