// Submits every URL in dist/sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver).
// Run after a deploy that adds or changes pages: `pnpm indexnow`.
//
// Google does not take part; Search Console stays the route there. Bing matters beyond
// Bing itself: its index feeds ChatGPT search, Copilot and DuckDuckGo.
//
// The key is the name of the .txt file in public/, and that file contains the key. It
// must be reachable on the live host or IndexNow rejects the whole list, so this checks
// that first and stops rather than send a list that would be thrown away.
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://rescuewatercraft.eu';
const host = new URL(SITE).hostname;
const key = readdirSync(new URL('../public/', import.meta.url)).find(f => /^[0-9a-f]{32}\.txt$/.test(f))?.replace(/\.txt$/, '');
if (!key) throw new Error('no IndexNow key file in public/');

const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!urls.length) throw new Error('no URLs in dist/sitemap.xml - build first');
const foreign = urls.find(u => new URL(u).hostname !== host);
if (foreign) throw new Error(`sitemap lists another host: ${foreign}`);

const live = await fetch(`${SITE}/${key}.txt`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error(`key file is not live on ${host} (${live.status}) - deploy first`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls }),
});
console.log(`indexnow: ${urls.length} URLs submitted, ${res.status} ${res.statusText}`);
if (!res.ok) { console.log(await res.text()); process.exit(1); }
