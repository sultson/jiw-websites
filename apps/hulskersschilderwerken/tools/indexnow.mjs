/**
 * Meldt de adressen uit dist/sitemap.xml aan bij IndexNow (Bing, Yandex, Seznam,
 * Naver). Draai na een deploy: `pnpm --filter @jiw/hulskersschilderwerken indexnow`.
 *
 * Google doet hier niet aan mee; daar blijft Search Console de weg. Bing is hier geen
 * bijzaak: die voedt ook de zoekresultaten van ChatGPT en Copilot, en voor een domein
 * dat vandaag voor het eerst een site draagt is dat precies de plek waar hij moet
 * landen. Google vindt hem via de sitemap in robots.txt en via Search Console.
 *
 * De sleutel is de naam van het .txt-bestand in public/, en de inhoud van dat bestand is
 * dezelfde sleutel. Hij moet op het live adres opvraagbaar zijn, anders weigert IndexNow
 * de hele lijst - vandaar de proef hieronder, die eerder afbreekt dan dat hij een lijst
 * stuurt die toch wordt weggegooid.
 *
 * De host komt uit BEDRIJF.domein in inhoud.mjs en staat hier niet apart. Bij een
 * verhuizing is dat het verschil tussen een regel omzetten en een script dat maanden
 * later nog het oude domein aanmeldt.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { BEDRIJF } from '../inhoud.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = BEDRIJF.domein;

const sleutel = (await readdir(path.join(APP, 'public')))
  .filter((f) => /^[0-9a-f]{16,}\.txt$/.test(f))
  .map((f) => f.replace(/\.txt$/, ''))[0];
if (!sleutel) throw new Error('geen sleutelbestand in public/ gevonden');

const sitemap = await readFile(path.join(APP, 'dist', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error('geen adressen in dist/sitemap.xml - eerst bouwen met `pnpm build`');

/* De adressen in de sitemap moeten op deze host staan. Staat er nog een oud domein in,
   dan weigert IndexNow de hele melding met een 422 en is dat niet te zien aan de lijst
   zelf. */
const vreemd = urls.filter((u) => new URL(u).hostname !== HOST);
if (vreemd.length) throw new Error(`sitemap noemt een andere host: ${vreemd[0]}`);

const proef = await fetch(`https://${HOST}/${sleutel}.txt`);
if (!proef.ok) throw new Error(`de sleutel staat niet live (${proef.status}) - eerst uitrollen`);
if ((await proef.text()).trim() !== sleutel) {
  throw new Error('het sleutelbestand op de live site bevat iets anders dan de sleutel');
}

const antwoord = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: sleutel, keyLocation: `https://${HOST}/${sleutel}.txt`, urlList: urls }),
});

/* 200 en 202 zijn allebei goed: 202 betekent "aangenomen, sleutel wordt nog
   gecontroleerd". Alles daarboven is een weigering en die moet luid zijn, anders denk
   je dat je hebt aangemeld. */
if (![200, 202].includes(antwoord.status)) {
  throw new Error(`IndexNow weigerde de melding: ${antwoord.status} ${await antwoord.text()}`);
}
console.log(`IndexNow: ${urls.length} adres(sen) aangemeld voor ${HOST} (${antwoord.status})`);
for (const u of urls) console.log(`  ${u}`);
