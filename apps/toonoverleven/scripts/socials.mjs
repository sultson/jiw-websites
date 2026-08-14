/**
 * Haalt hun Facebook- en Instagramberichten op en legt er een momentopname van
 * naast de code.
 *
 * Waarom een momentopname en geen live feed: Facebook en Instagram geven geen
 * openbare koppeling meer waar een browser rechtstreeks bij kan. Alles wat zich
 * "social feed widget" noemt is of een iframe dat trackt en traag laadt, of het
 * loopt via een sleutel die op een server moet staan. Deze site is statisch, dus
 * de berichten worden hier eenmalig opgehaald, teruggebracht in formaat en als
 * gewone bestanden meegeleverd. Snel, geen trackers, en het blijft staan als
 * Meta weer iets verandert.
 *
 * Gevolg: de strook op de site is zo actueel als de laatste keer dat dit script
 * gedraaid is. De datum staat bij elk bericht, dus dat is voor de bezoeker ook
 * te zien, en onderaan staat de knop naar hun echte pagina's.
 *
 * De berichten komen binnen via Apify (apify/instagram-scraper en
 * apify/facebook-posts-scraper). Nieuwe run starten levert nieuwe dataset-ids
 * op; die hieronder vervangen en het script opnieuw draaien.
 *
 * Draaien met: node scripts/socials.mjs
 */
import sharp from 'sharp';
import {mkdirSync, writeFileSync} from 'node:fs';

const IG_DATASET = '2s4Uytvub3KaoKfNw';
const FB_DATASET = '5DEueRJSvtmBIAgFR';
const AANTAL = 6;

const UIT = 'public/img/social';
mkdirSync(UIT, {recursive: true});

const items = (id) =>
  fetch(`https://api.apify.com/v2/datasets/${id}/items?format=json&clean=true`).then((r) => r.json());

const [ig, fb] = await Promise.all([items(IG_DATASET), items(FB_DATASET)]);

/* Instagram en Facebook krijgen bijna altijd hetzelfde bericht, dus ze worden
   op de tekst samengevoegd. Een bericht dat op beide staat, staat hier één
   keer, met een link naar allebei. */
const berichten = new Map();

const bewaar = (net, tijd, tekst, url, beeld) => {
  if (!tekst || tekst.trim().length < 40 || !beeld) return;
  const sleutel = tekst.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 120);
  const bestaand = berichten.get(sleutel);
  if (bestaand) {
    bestaand.links[net] ??= url;
    if (tijd > bestaand.tijd) bestaand.tijd = tijd;
    return;
  }
  berichten.set(sleutel, {tijd, tekst: tekst.trim(), beeld, links: {[net]: url}});
};

for (const p of ig) {
  bewaar('instagram', p.timestamp, p.caption, p.url, p.displayUrl ?? p.childPosts?.[0]?.displayUrl);
}
for (const p of fb) {
  const m = (p.media ?? []).find((x) => x?.photo_image?.uri || x?.image?.uri);
  bewaar('facebook', p.time, p.text, p.url, m?.photo_image?.uri ?? m?.image?.uri);
}

const nieuwste = [...berichten.values()].sort((a, b) => b.tijd.localeCompare(a.tijd)).slice(0, AANTAL);

const lijst = [];
for (const [i, b] of nieuwste.entries()) {
  const bytes = Buffer.from(await fetch(b.beeld).then((r) => r.arrayBuffer()));
  /* Vierkant, want het is een strook naast elkaar en hun berichten zijn een
     mengsel van staande posters en liggende foto's. Niet bijsnijden: de helft
     van wat zij posten is een poster met tekst erop, en daar valt bij een
     uitsnede net de datum of de titel vanaf. Wat overblijft wordt wit, want de
     kaarten zijn wit. */
  const uit = `${UIT}/${i}.webp`;
  const info = await sharp(bytes)
    .resize(560, 560, {fit: 'contain', background: '#ffffff'})
    .flatten({background: '#ffffff'})
    .webp({quality: 80})
    .toFile(uit);
  lijst.push({
    datum: b.tijd.slice(0, 10),
    tekst: b.tekst.replace(/\s+/g, ' ').trim(),
    beeld: `/img/social/${i}.webp`,
    links: b.links,
  });
  console.log(`${i}.webp ${(info.size / 1024).toFixed(0)} kB  ${b.tijd.slice(0, 10)}  ${b.tekst.slice(0, 60).replace(/\s+/g, ' ')}`);
}

writeFileSync('src/socials.json', JSON.stringify(lijst, null, 2) + '\n');
console.log(`\n${lijst.length} berichten weggeschreven naar src/socials.json`);
