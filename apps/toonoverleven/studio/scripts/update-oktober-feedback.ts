/**
 * CMS changes for the October 2026 feedback (Marcel 11-10, Ron 13-10); see docs/oktober-feedback.md.
 *
 * Pages: every sitePage is brought in line with src/next/pages.json. A text or link the template
 * changed is only overwritten when the CMS still holds the previous template value (OLD_PAGES, the
 * pages.json this round started from); anything an editor changed is reported and left alone.
 * Agenda and settings: the explicit edits below. Backs up first, refuses drafts, dry run without --apply.
 *
 *   OLD_PAGES=/path/to/old-pages.json pnpm exec tsx scripts/update-oktober-feedback.ts [--apply]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
if (!process.env.SANITY_AUTH_TOKEN && !process.env.SANITY_WRITE_TOKEN)
  process.env.SANITY_AUTH_TOKEN = JSON.parse(readFileSync(path.join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;
const { client, beeld } = await import('./sanity');
const { templates } = await import('../../src/next/model');
const { slugify } = await import('../../src/meta');
const apply = process.argv.includes('--apply');
if (!process.env.OLD_PAGES) throw new Error('OLD_PAGES (the previous pages.json) is required to tell template changes from editor changes.');
const old: any[] = JSON.parse(readFileSync(process.env.OLD_PAGES, 'utf8'));

const docs = await client.fetch<any[]>('*[_type in ["sitePage","activiteit","siteTeksten"]]');
const backup = path.resolve('../raw/cms-backups');
mkdirSync(backup, { recursive: true });
writeFileSync(path.join(backup, 'before-oktober-feedback-' + Date.now() + '.json'), JSON.stringify(docs, null, 2), { mode: 0o600 });
if (docs.some((d) => d._id.startsWith('drafts.'))) throw new Error('Review existing drafts before applying this migration.');
const byId = (id: string) => {
  const doc = docs.find((d) => d._id === id);
  if (!doc) throw new Error('Missing document ' + id);
  return doc;
};

const report: string[] = [];
const conflicts: string[] = [];
const same = (a: unknown, b: unknown) => String(a ?? '').trim() === String(b ?? '').trim();
let tx = client.transaction();

/* Pages ------------------------------------------------------------------ */
const pages = templates.filter((t) => t.path !== '@interface');
for (const page of pages) {
  const doc = docs.find((d) => d._type === 'sitePage' && d.path === page.path);
  const before = old.find((p) => p.path === page.path);
  if (!doc) {
    report.push(`create page ${page.path}`);
    if (apply) {
      const images = [];
      for (const img of page.images) images.push({ _key: img._key, _type: 'object', label: img.label, alt: img.alt, ...((await beeld(img.src)) ? { image: await beeld(img.src) } : {}) });
      tx = tx.createIfNotExists({ _id: 'page-v5-' + slugify(page.path), _type: 'sitePage', path: page.path, title: page.title, description: page.description,
        texts: page.texts.map((t) => ({ ...t, _type: 'object' })), links: page.links.map((l) => ({ ...l, _type: 'object' })), images, videos: (page.videos ?? []).map((v) => ({ ...v, _type: 'object' })) });
    }
    continue;
  }
  const set: Record<string, unknown> = {};
  const merge = (field: 'texts' | 'links', value: 'text' | 'href') => {
    const now = (doc[field] ?? []) as any[];
    const wasTemplate = (key: string) => before?.[field]?.find((x: any) => x._key === key)?.[value];
    const next = (page[field] as any[]).map((t) => {
      const cms = now.find((x) => x._key === t._key);
      if (!cms) { report.push(`${page.path} ${field} add ${t._key}: ${JSON.stringify(t[value]).slice(0, 80)}`); return { ...t, _type: 'object' }; }
      if (same(cms[value], t[value])) return cms.label === t.label ? cms : { ...cms, label: t.label };
      if (same(cms[value], wasTemplate(t._key))) { report.push(`${page.path} ${t._key}: ${JSON.stringify(cms[value]).slice(0, 60)} -> ${JSON.stringify(t[value]).slice(0, 80)}`); return { ...cms, label: t.label, [value]: t[value] }; }
      if (!same(t[value], wasTemplate(t._key))) conflicts.push(`${page.path} ${t._key}: editor value ${JSON.stringify(cms[value]).slice(0, 60)} kept, template wanted ${JSON.stringify(t[value]).slice(0, 60)}`);
      return cms;
    });
    const removed = now.filter((x) => !next.some((n) => n._key === x._key));
    for (const r of removed) report.push(`${page.path} ${field} remove ${r._key}: ${JSON.stringify(r[value]).slice(0, 60)}`);
    if (JSON.stringify(next) !== JSON.stringify(now)) set[field] = next;
  };
  merge('texts', 'text');
  merge('links', 'href');
  for (const key of ['title', 'description'] as const)
    if (!same(doc[key], page[key]) && same(doc[key], before?.[key])) { set[key] = page[key]; report.push(`${page.path} ${key} -> ${page[key]}`); }
  // A replaced picture in the template replaces the CMS picture only where it still is the old one.
  let images = doc.images as any[];
  for (const img of page.images) {
    const was = before?.images?.find((i: any) => i._key === img._key);
    if (was && was.src !== img.src) {
      report.push(`${page.path} ${img._key} image -> ${img.src}`);
      const asset = apply ? await beeld(img.src) : undefined;
      images = images.map((i) => (i._key === img._key ? { ...i, image: asset, alt: img.alt } : i));
      set.images = images;
    }
  }
  if (Object.keys(set).length) tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set(set));
}
for (const doc of docs.filter((d) => d._type === 'sitePage' && !templates.some((p) => p.path === d.path))) {
  report.push(`delete page ${doc.path}`);
  tx = tx.delete(doc._id);
}

/* Settings: mobile number, no inloopavond, board ----------------------------- */
const site = byId('siteTeksten');
const bestuur = [...site.verantwoording.bestuur];
if (!bestuur.some((p: any) => p.naam === 'Marcel van Kasteel'))
  bestuur.splice(bestuur.findIndex((p: any) => p.rol === 'Voorzitter') + 1, 0, { _key: 'marcel-van-kasteel', _type: 'object', naam: 'Marcel van Kasteel', rol: 'Vice-voorzitter' });
const advies = site.verantwoording.advies.map((p: any) => (p.naam === 'Mike Kastrop' ? { ...p, rol: 'ondernemer in Zeewolde, eigenaar van Classic Mike' } : p));
if (!advies.some((p: any) => p.naam === 'Klaske Vriesinga')) advies.push({ _key: 'klaske-vriesinga', _type: 'object', naam: 'Klaske Vriesinga', rol: 'notaris te Zeewolde' });
tx = tx.patch(site._id, (p) => p.ifRevisionId(site._rev)
  .set({ 'praktisch.contact.mobiel': '06 38 52 90 60', 'verantwoording.bestuur': bestuur, 'verantwoording.advies': advies })
  .unset(['praktisch.openingstijden.avond']));
report.push('siteTeksten: mobiel, no avond, Marcel van Kasteel, Mike Kastrop role, Klaske Vriesinga');

/* Agenda ------------------------------------------------------------------ */
// Sponsordiner of 6 November: postponed by the organiser (probably April 2027).
const diner = byId('agenda-confirmed-sponsordiner-bij-classic-mike-zeewolde');
const dinerFoto = apply ? await beeld('/img/approved/sponsordiner-classic-mike.webp') : null;
tx = tx.patch(diner._id, (p) => p.ifRevisionId(diner._rev).set({ archief: true, ...(dinerFoto ? { afbeelding: dinerFoto } : {}) }).unset(['aanmeldEmail']));
report.push('sponsordiner 6 Nov: archived, new photo, signup only via tegenkanker.nl');

// "Inloop met activiteit" is the old site's name for the open atelier on the last Thursday.
const atelier = `**Een beetje andere inloopochtend dan gewoonlijk**

Op de laatste donderdag van de maand geven we de gewone inloop een creatief tintje. Er liggen materialen klaar voor een klein projectje, denk aan een steentje of canvasje stippen, op nummer schilderen en meer.

Opgeven is niet nodig.

Wil je alleen genieten van een kopje koffie of thee met een praatje, dan kan dat natuurlijk ook. De koffie staat klaar en een luisterend oor vind je hier altijd.`;
const atelierFoto = apply ? await beeld('/img/approved/agenda-open-atelier.webp') : null;
for (const doc of docs.filter((d) => d.activiteitType === 'inloop-met-activiteit' && d.datum >= '2026-10-01')) {
  const recent = doc.datum < '2026-12-01';
  tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ titel: 'Inloop / Open atelier', omschrijving: atelier, ...(recent && atelierFoto ? { afbeelding: atelierFoto } : {}) }).unset(['aanmeldEmail']));
  report.push(`${doc.datum} Inloop met activiteit -> Inloop / Open atelier`);
}

// One-off activities from Ron's October/November flyers; texts and pictures from the old site.
const MAIL = '[info@toonoverleven.nl](mailto:info@toonoverleven.nl)';
const HUIS = 'Mazerhard 37, 3891 BR Zeewolde';
const creatief = ['informatie-en-inspiratie', 'ontmoeten'];
const tekst = {
  junk: `De workshop is een plek waar je onder begeleiding leert hoe je zelf een junk journal opbouwt en versiert. Je maakt je eigen journal-boek en leert verschillende technieken om materialen te verwerken.

Het is een ontspannen activiteit die ruimte biedt voor persoonlijke expressie en een moment van rust en focus. De workshops zijn bedoeld als creatieve uitlaatklep en afleiding voor mensen die leven met en na kanker en hun naasten.

Wil je meedoen? Stuur een mailtje naar ${MAIL}.`,
  wandel: `**Zin in een frisse neus, een ontspannen wandeling én fijne gesprekken? Ga gezellig met ons mee op pad! Samen ontdekken we het mooie Zeewolde tijdens een toegankelijke wandeling van ongeveer 3 kilometer.**

We beginnen de ochtend rustig met een kopje koffie bij Toon over Leven. Een perfect moment om elkaar te ontmoeten en alvast kennis te maken. Daarna trekken we eropuit, samen met Sylvia en Ernst, die gezellig meelopen.

Of je nu een ervaren wandelaar bent of juist niet zo vaak loopt: iedereen is van harte welkom! Het gaat vooral om samen zijn, genieten van de buitenlucht en op een ontspannen manier in beweging komen.

**Inloop met koffie om 10.00 uur, vertrek om 10.30 uur.**

Aanmelden of meer informatie? Stuur gerust een e-mail naar ${MAIL}.`,
  mixed: `**Creatief aan de slag met verschillende materialen en technieken**

In onze workshops mixed media zetten we verschillende technieken en materialen in om tot een mooie afbeelding te komen. Laat je sturen door je gevoel en kom tot rust via het eindresultaat. In een rustige omgeving, met een klein groepje deelnemers.

Kom kennismaken met deze kunstvorm, of maak een nieuw kunstwerk. Wil je meedoen? Stuur een mailtje naar ${MAIL}.`,
  zen: `Er bestaan veel manieren om te mediteren. Vaak wordt gezegd dat je "je hoofd leeg moet maken", en dat is een moeilijke opgave. Bij zenmeditatie gaat het om afdalen in de stilte, en vooral de stilte in jezelf. Ook in een rumoerige ruimte is die stilte er altijd.

"De geest gaat waar hij wil" is het motto van zenmeditatie. Je doet een stapje terug en kijkt wat er in je opkomt, zonder erover na te denken of te piekeren: je laat het meteen weer los. Zo worden gedachten als wolken aan de hemel: ze komen en gaan. Je oefent onder leiding van een ervaren zenleraar aan wie je al je vragen kunt stellen.

Iedere eerste maandag van de maand kun je bij ons terecht voor een meditatiesessie. We zitten op stoelen, zodat iedereen mee kan doen. Opgeven via ${MAIL}.`,
  kerstbal: `In deze workshop maak je met de dot-techniek (stippen) een mandala op een kerstbal.

Het doel is ontspanning, met als resultaat een prachtig kunstwerk. Je zult versteld staan van je eigen kunnen! Je hoeft niet te kunnen tekenen of schilderen.

Wil je meedoen? Stuur een mail naar ${MAIL}.`,
  encaustic: `**Een oude techniek met een verrassend resultaat**

Encaustic art is een oude techniek die al in de Oudheid door Grieken, Romeinen en Egyptenaren werd toegepast. Encaustic betekent ‘inbranden’. Een wastekening weerspiegelt wat jou op dit moment bewust of onbewust bezighoudt. Dat komt tijdens het tekenen naar boven en zie je terug in de vormen en kleuren op het papier.

Deze keer werken we in de kerstsfeer. Wil je meedoen? Stuur een mailtje naar ${MAIL}.`,
  mandala: `In de workshop mandalastippen leer je de techniek van het zetten van mandalastippen. De workshop is rustgevend, omdat je geconcentreerd aan het werk gaat. Je werkt met kleuren die jou aanspreken. Een cadeau voor jezelf of voor iemand anders.

Wil je meedoen? Laat het weten via ${MAIL}.`,
};
const foto = async (src: string) => (apply ? await beeld(src) : null);
const asset = (id: string) => byId(id).afbeelding;
const nieuw = [
  { id: 'junk-journaling-21-oktober', titel: 'Workshop junk journaling', datum: '2026-10-21', van: '19:30', tot: '22:00', type: 'junk-journaling', cat: 'Creatief', themas: creatief, omschrijving: tekst.junk, bijdrage: 'Gratis, een eigen bijdrage is welkom', afbeelding: await foto('/img/approved/agenda-junk-journaling.webp') },
  { id: 'wandelgroep-23-oktober', titel: 'Wandelgroep', datum: '2026-10-23', van: '10:00', tot: '12:30', type: 'wandelen', cat: 'Bewegen', themas: ['bewegen-en-ontspannen', 'ontmoeten'], omschrijving: tekst.wandel, bijdrage: 'Gratis', afbeelding: asset('agenda-wandelgroep') },
  { id: 'mixed-media-28-oktober', titel: 'Workshop mixed media', datum: '2026-10-28', van: '10:30', tot: '13:00', type: 'mixed-media', cat: 'Creatief', themas: creatief, omschrijving: tekst.mixed, bijdrage: 'Gratis, een kleine bijdrage wordt op prijs gesteld', afbeelding: await foto('/img/approved/agenda-mixed-media.webp') },
  { id: 'zenmeditatie-2-november', titel: 'Zenmeditatie', datum: '2026-11-02', van: '10:00', tot: '11:30', type: 'zenmeditatie', cat: 'Wellness', themas: ['bewegen-en-ontspannen', 'herstel-en-energie'], omschrijving: tekst.zen, bijdrage: 'Gratis, een donatie is welkom', afbeelding: asset('agenda-zenmeditatie') },
  { id: 'kerstbal-stippen-10-november', titel: 'Kerstbal stippen', datum: '2026-11-10', van: '13:30', tot: '16:00', type: 'mandala-stippen', cat: 'Creatief', themas: creatief, omschrijving: tekst.kerstbal, bijdrage: 'Gratis, een eigen bijdrage is welkom', afbeelding: await foto('/img/approved/agenda-kerstbal-stippen.webp') },
  { id: 'encaustic-art-kerst-11-november', titel: 'Encaustic art, kerst', datum: '2026-11-11', van: '10:30', tot: '13:00', type: 'encaustic-art', cat: 'Creatief', themas: creatief, omschrijving: tekst.encaustic, bijdrage: 'Gratis, een eigen bijdrage is welkom', afbeelding: await foto('/img/approved/agenda-encaustic-kerst.webp') },
  { id: 'mandala-stippen-16-november', titel: 'Mandala stippen', datum: '2026-11-16', van: '13:30', tot: '16:00', type: 'mandala-stippen', cat: 'Creatief', themas: creatief, omschrijving: tekst.mandala, bijdrage: 'Gratis, een eigen bijdrage is welkom', afbeelding: await foto('/img/approved/agenda-mandala-stippen.webp'), vol: true },
  { id: 'junk-journaling-18-november', titel: 'Workshop junk journaling', datum: '2026-11-18', van: '19:30', tot: '22:00', type: 'junk-journaling', cat: 'Creatief', themas: creatief, omschrijving: tekst.junk, bijdrage: 'Gratis, een eigen bijdrage is welkom', afbeelding: await foto('/img/approved/agenda-junk-journaling.webp'), vol: true },
  { id: 'mixed-media-25-november', titel: 'Workshop mixed media', datum: '2026-11-25', van: '10:30', tot: '13:00', type: 'mixed-media', cat: 'Creatief', themas: creatief, omschrijving: tekst.mixed, bijdrage: 'Gratis, een kleine bijdrage wordt op prijs gesteld', afbeelding: await foto('/img/approved/agenda-mixed-media.webp') },
  { id: 'wandelgroep-27-november', titel: 'Wandelgroep', datum: '2026-11-27', van: '10:00', tot: '12:30', type: 'wandelen', cat: 'Bewegen', themas: ['bewegen-en-ontspannen', 'ontmoeten'], omschrijving: tekst.wandel, bijdrage: 'Gratis', afbeelding: asset('agenda-wandelgroep') },
  { id: 'zenmeditatie-7-december', titel: 'Zenmeditatie', datum: '2026-12-07', van: '10:00', tot: '11:30', type: 'zenmeditatie', cat: 'Wellness', themas: ['bewegen-en-ontspannen', 'herstel-en-energie'], omschrijving: tekst.zen, bijdrage: 'Gratis, een donatie is welkom', afbeelding: asset('agenda-zenmeditatie') },
];
for (const a of nieuw) {
  const id = 'agenda-oktober-' + a.id;
  if (docs.some((d) => d._id === id)) continue;
  report.push(`create ${a.datum} ${a.van}-${a.tot} ${a.titel}${a.vol ? ' (vol)' : ''}`);
  tx = tx.createIfNotExists({
    _id: id, _type: 'activiteit', archief: false, soort: 'activiteit', slug: { _type: 'slug', current: a.id },
    titel: a.titel, activiteitType: a.type, categorie: a.cat, categorieen: [a.cat], doelgroepen: ['iedereen'], themas: a.themas,
    omschrijving: a.omschrijving, datum: a.datum, begintijd: a.van, eindtijd: a.tot, heleDag: false, herhaling: 'eenmalig', overslaan: [],
    aanmelden: true, aanmeldEmail: 'info@toonoverleven.nl', volgeboekt: a.vol === true, bijdrage: a.bijdrage, locatie: HUIS,
    ...(a.afbeelding ? { afbeelding: a.afbeelding } : {}),
  });
}

console.log(report.join('\n'));
if (conflicts.length) console.log('\nKept editor changes:\n' + conflicts.join('\n'));
if (apply) {
  await tx.commit();
  console.log('\nApplied.');
} else console.log('\nDry run. Add --apply to write.');
