// Submits every URL in dist/sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver).
// Run after a deploy that adds or changes pages: `pnpm indexnow`.
//
// Google does not take part; Search Console stays the route there. Bing matters beyond
// Bing itself: its index feeds ChatGPT search, Copilot and DuckDuckGo.
//
// `--host <old host>` submits a host that now 301s to SITE (the concept hosts) instead:
// every URL in its /sitemap-old.xml (served by the Worker, including the addresses from
// when Dutch sat on `/` and English on `/en`), so Bing recrawls them, finds the redirect
// and drops them from its index.
//
// The key is the name of the .txt file in public/, and that file contains the key. It
// must be reachable on the live host or IndexNow rejects the whole list, so this checks
// that first and stops rather than send a list that would be thrown away.
import { readdirSync, readFileSync } from 'node:fs';

const SITE = 'https://rescuewatercraft.eu';
const hostArg = process.argv.indexOf('--host');
const host = hostArg > 0 ? process.argv[hostArg + 1] : new URL(SITE).hostname;
const origin = `https://${host}`;
const key = readdirSync(new URL('../public/', import.meta.url)).find(f => /^[0-9a-f]{32}\.txt$/.test(f))?.replace(/\.txt$/, '');
if (!key) throw new Error('no IndexNow key file in public/');

const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const canonical = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!canonical.length) throw new Error('no URLs in dist/sitemap.xml - build first');
const foreign = canonical.find(u => !u.startsWith(SITE));
if (foreign) throw new Error(`sitemap lists another host: ${foreign}`);
const urls = hostArg > 0
  ? [...(await (await fetch(`${origin}/sitemap-old.xml`, { redirect: 'manual' })).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
  : canonical;
if (!urls.length) throw new Error(`no URLs for ${host}`);

const live = await fetch(`${origin}/${key}.txt`, { redirect: 'manual' });
if (!live.ok || (await live.text()).trim() !== key) throw new Error(`key file is not live on ${host} (${live.status}) - deploy first`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `${origin}/${key}.txt`, urlList: urls }),
});
console.log(`indexnow: ${urls.length} URLs on ${host} submitted, ${res.status} ${res.statusText}`);
if (!res.ok) { console.log(await res.text()); process.exit(1); }
