/**
 * Meldt de adressen uit dist/sitemap.xml aan bij IndexNow (Bing, Yandex, Seznam,
 * Naver). Draai na een uitrol: `pnpm indexnow`. Overgenomen van apps/bloei.
 *
 * Google doet hier niet aan mee; daar is Search Console de weg (zie SEO.md).
 * Bing voedt ook ChatGPT en Copilot, dus dat is geen bijzaak.
 *
 * De sleutel is het .txt-bestand met een hex-naam dat bouw.mjs op de wortel van
 * dist/ zet. Het moet live opvraagbaar zijn, anders gooit IndexNow de hele lijst
 * weg - dus eerst die proef.
 */
import { readdir, readFile } from 'node:fs/promises';

const HOST = 'puurgenieten.tv';

const sleutel = (await readdir('dist')).filter(f => /^[0-9a-f]{16,}\.txt$/.test(f)).map(f => f.replace(/\.txt$/, ''))[0];
if (!sleutel) throw new Error('geen sleutelbestand in dist/ - eerst bouwen');

const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!urls.length) throw new Error('geen adressen in dist/sitemap.xml - eerst bouwen');
const vreemd = urls.filter(u => new URL(u).hostname !== HOST);
if (vreemd.length) throw new Error(`sitemap noemt een andere host: ${vreemd[0]}`);

const proef = await fetch(`https://${HOST}/${sleutel}.txt`);
if (!proef.ok) throw new Error(`de sleutel staat niet live (${proef.status}) - eerst uitrollen`);
if ((await proef.text()).trim() !== sleutel) throw new Error('het sleutelbestand staat live maar bevat niet de sleutel');

const antwoord = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: sleutel, keyLocation: `https://${HOST}/${sleutel}.txt`, urlList: urls }),
});
console.log(`indexnow: ${urls.length} adressen gemeld, antwoord ${antwoord.status} ${antwoord.statusText}`);
if (!antwoord.ok && antwoord.status !== 202) process.exitCode = 1;
