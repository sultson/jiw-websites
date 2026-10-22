/**
 * CMS changes for the late-October 2026 round (Marcel and Ron, 19-21 October): registration page,
 * sponsors, privacy statement, final volunteer PDFs, cancelled sponsordiner, agenda per Ron's flyers.
 *
 * Pages: every sitePage is brought in line with src/next/pages.json. A text or link the template
 * changed is only overwritten when the CMS still holds the previous template value (OLD_PAGES);
 * anything an editor changed is reported and left alone. Backs up first, refuses drafts, dry run
 * without --apply.
 *
 *   OLD_PAGES=/path/to/previous-pages.json pnpm exec tsx scripts/update-eind-oktober.ts [--apply]
 */
import { readFileSync, writeFileSync, mkdirSync, createReadStream } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
if (!process.env.SANITY_AUTH_TOKEN && !process.env.SANITY_WRITE_TOKEN)
  process.env.SANITY_AUTH_TOKEN = JSON.parse(readFileSync(path.join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;
const { client } = await import('./sanity');
const { templates } = await import('../../src/next/model');
const { interfaceDefaults, interfaceLabels } = await import('../../src/next/interface');
const { slugify } = await import('../../src/meta');
const apply = process.argv.includes('--apply');
if (!process.env.OLD_PAGES) throw new Error('OLD_PAGES (the previous pages.json) is required to tell template changes from editor changes.');
const old: any[] = JSON.parse(readFileSync(process.env.OLD_PAGES, 'utf8'));

const docs = await client.fetch<any[]>('*[_type in ["sitePage","activiteit","siteTeksten","sponsor"]]');
const backup = path.resolve('../raw/cms-backups');
mkdirSync(backup, { recursive: true });
writeFileSync(path.join(backup, 'before-eind-oktober-' + Date.now() + '.json'), JSON.stringify(docs, null, 2), { mode: 0o600 });
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
for (const page of templates.filter((t) => t.path !== '@interface')) {
  const doc = docs.find((d) => d._type === 'sitePage' && d.path === page.path);
  const before = old.find((p) => p.path === page.path);
  if (!doc) {
    report.push(`create page ${page.path}`);
    tx = tx.createIfNotExists({ _id: 'page-v5-' + slugify(page.path), _type: 'sitePage', path: page.path, title: page.title, description: page.description,
      texts: page.texts.map((t) => ({ ...t, _type: 'object' })), links: page.links.map((l) => ({ ...l, _type: 'object' })), images: [], videos: (page.videos ?? []).map((v) => ({ ...v, _type: 'object' })) });
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
  if (Object.keys(set).length) tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set(set));
}
for (const doc of docs.filter((d) => d._type === 'sitePage' && d.path !== '@interface' && !templates.some((p) => p.path === d.path))) {
  report.push(`delete page ${doc.path}`);
  tx = tx.delete(doc._id);
}

/* Form copy (@interface): Marcel's registration copy of 21-10 ------------- */
const OLD_INTERFACE: Record<string, string> = {
  signupTitle: 'Meld je aan', signupSubmit: 'Aanmelden',
  signupIntro: 'Vul je naam en e-mailadres in. Je ontvangt eerst een ontvangstbevestiging. Je plek is definitief zodra wij je deelname hebben bevestigd.',
  signupSuccessTitle: 'Je aanmelding is ontvangen',
  signupSuccessText: 'Je plek is definitief zodra wij je deelname hebben bevestigd.',
};
{
  const doc = docs.find((d) => d._type === 'sitePage' && d.path === '@interface');
  if (doc) {
    const rows = (doc.texts ?? []) as any[];
    const next = Object.entries(interfaceDefaults).map(([key, text]) => {
      const label = interfaceLabels[key as keyof typeof interfaceLabels];
      const row = rows.find((r) => r._key === key);
      if (!row) { report.push(`@interface add ${key}: ${text.slice(0, 60)}`); return { _key: key, _type: 'object', label, text }; }
      if (OLD_INTERFACE[key] !== undefined && !same(row.text, text)) {
        if (same(row.text, OLD_INTERFACE[key])) { report.push(`@interface ${key} -> ${text.slice(0, 60)}`); return { ...row, label, text }; }
        conflicts.push(`@interface ${key}: editor value ${JSON.stringify(row.text).slice(0, 60)} kept`);
      }
      return row.label === label ? row : { ...row, label };
    });
    if (JSON.stringify(next) !== JSON.stringify(rows)) tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ texts: next }));
  }
}

/* Sponsors (Ron, 21-10) ---------------------------------------------------- */
const WEG = ['sponsor-cafe-het-plein', 'sponsor-kinderveiligheidswinkel', 'sponsor-auto-zuiderzee', 'sponsor-bevri', 'sponsor-visspecialist-chris-koelewijn',
  'sponsor-diergigant', 'sponsor-harton', 'sponsor-oog-van-de-dag', 'sponsor-ribbootwinkel', 'sponsor-secondant2', 'sponsor-tegeldepot'];
for (const id of WEG) { report.push(`delete ${id} (${byId(id).naam})`); tx = tx.delete(id); }
const NIEUW = [
  { id: 'sponsor-swim-to-fight-cancer-zeewolde', naam: 'Swim to Fight Cancer Zeewolde', logo: 'swim-to-fight-cancer-zeewolde.webp', bron: 'Swim-to-fight-cancer-Zeewolde.png' },
  { id: 'sponsor-oranje-fonds', naam: 'Oranje Fonds', logo: 'oranje-fonds.webp', bron: 'Oranje Fonds Logo Landscape Orange Small RGB.jpg' },
  { id: 'sponsor-notaris-vriesinga', naam: 'Notaris Vriesinga', logo: 'notaris-vriesinga.webp', bron: 'Notaris Vriesinga logo.png' },
  { id: 'sponsor-vakgarage-jws', naam: 'Vakgarage JWS', logo: 'vakgarage-jws.webp', bron: 'logo vakgarage JWS.jpeg' },
];
// Ron's four for the homepage first, then the rest alphabetically.
const VOLGORDE = ['Vaillant Fonds', 'Windpark Zeewolde', 'Swim to Fight Cancer Zeewolde', 'Oranje Fonds', '2 Way', 'Burko Transport', 'Condoor', 'Flevotin',
  'JNS Montage', 'Loop Coaching', 'Notaris Vriesinga', 'Tolhoek', 'Trendy Woodshop', 'Vakgarage JWS'];
const sponsorDir = path.resolve('../public/img/sponsors');
for (const s of NIEUW) {
  if (docs.some((d) => d._id === s.id)) continue;
  report.push(`create ${s.id}`);
  let logo: any = undefined;
  if (apply) {
    const asset = await client.assets.upload('image', createReadStream(path.join(sponsorDir, s.logo)), { filename: s.bron, title: s.naam, description: 'Aangeleverd door Ron Wille, 21 oktober 2026.' });
    logo = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  }
  tx = tx.createIfNotExists({ _id: s.id, _type: 'sponsor', naam: s.naam, volgorde: (VOLGORDE.indexOf(s.naam) + 1) * 10, ...(logo ? { logo } : {}) });
}
for (const doc of docs.filter((d) => d._type === 'sponsor' && !WEG.includes(d._id))) {
  const i = VOLGORDE.indexOf(doc.naam);
  if (i < 0) { conflicts.push(`sponsor ${doc.naam} not in Ron's list, left as is`); continue; }
  if (doc.volgorde !== (i + 1) * 10) { report.push(`${doc.naam} volgorde ${doc.volgorde} -> ${(i + 1) * 10}`); tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ volgorde: (i + 1) * 10 })); }
}

/* Agenda --------------------------------------------------------------------- */
// The 6 November sponsordiner is cancelled (Marcel, 19-10): gone, with its photo and link.
report.push('delete sponsordiner 6 Nov');
tx = tx.delete('agenda-confirmed-sponsordiner-bij-classic-mike-zeewolde');

// Ron's October flyer: open atelier on 22 October, a normal inloop on 29 October.
{
  const doc = byId('agenda-confirmed-inloop-met-activiteit-oktober');
  const omschrijving = doc.omschrijving.replace('Op de laatste donderdag van de maand geven we', 'Deze donderdag geven we');
  report.push(`open atelier ${doc.datum} -> 2026-10-22`);
  tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ datum: '2026-10-22', omschrijving }));
}

// Ron's November flyer: the walk of 27 November is 10:30-13:00.
const signupLines: [RegExp, (vol: boolean) => string][] = [
  [/Aanmelden of meer informatie\? Stuur gerust een e-mail naar:? \[info@toonoverleven\.nl\]\(mailto:info@toonoverleven\.nl\)\.?/, () => 'Wil je mee, of eerst iets vragen? Gebruik de knop **Aanmelden of meer informatie**.'],
  [/Wil je meedoen\? (Stuur een mailtje naar|Stuur een mail naar|Laat het weten via) \[info@toonoverleven\.nl\]\(mailto:info@toonoverleven\.nl\)\./, (vol) => vol ? 'Deze keer is de workshop vol. Wil je weten wanneer er weer plek is? [Stel je vraag](/aanmelden?vraag).' : 'Wil je meedoen? Meld je aan met de knop **Aanmelden of meer informatie**.'],
  [/Opgeven via \[info@toonoverleven\.nl\]\(mailto:info@toonoverleven\.nl\)\./, () => 'Opgeven gaat met de knop **Aanmelden of meer informatie**.'],
];
const today = new Date().toISOString().slice(0, 10);
for (const doc of docs.filter((d) => d._type === 'activiteit' && !d.archief && (d.herhaling !== 'eenmalig' || (d.totDatum ?? d.datum) >= today))) {
  let omschrijving: string = doc.omschrijving ?? '';
  for (const [re, line] of signupLines) omschrijving = omschrijving.replace(re, line(doc.volgeboekt === true));
  const set: Record<string, unknown> = {};
  if (doc._id === 'agenda-oktober-wandelgroep-27-november') {
    omschrijving = omschrijving.replace('\n\n**Inloop met koffie om 10.00 uur, vertrek om 10.30 uur.**', '');
    set.begintijd = '10:30'; set.eindtijd = '13:00';
  }
  if (/mailto:/.test(omschrijving) && doc.aanmelden) conflicts.push(`${doc._id} still mentions mail for signing up`);
  if (omschrijving !== doc.omschrijving) set.omschrijving = omschrijving;
  if (Object.keys(set).length) { report.push(`${doc.datum} ${doc.titel}: ${Object.keys(set).join(', ')}`); tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set(set)); }
}

console.log(report.join('\n'));
if (conflicts.length) console.log('\nNeeds a look:\n' + conflicts.join('\n'));
if (apply) {
  await tx.commit();
  console.log('\nApplied.');
} else console.log('\nDry run. Add --apply to write.');
