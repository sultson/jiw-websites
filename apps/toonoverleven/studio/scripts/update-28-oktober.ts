/**
 * CMS changes of 28-10-2026 (Marcel and Ron): "Ben je jonger of ouder" on the Vraagbaak texts,
 * the Vraagbaak's dates in the agenda (two monthly series, 2nd and 4th Tuesday, with Marcel's
 * photo), and Harvey Portier in the Raad van Advies.
 *
 * Every sitePage is brought in line with src/next/pages.json. A text or link the template
 * changed is only overwritten when the CMS still holds the previous template value (OLD_PAGES);
 * anything an editor changed is reported and left alone. Backs up first, refuses drafts, dry run
 * without --apply.
 *
 *   OLD_PAGES=/path/to/previous-pages.json pnpm exec tsx scripts/update-28-oktober.ts [--apply]
 */
import { readFileSync, writeFileSync, mkdirSync, createReadStream } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
if (!process.env.SANITY_AUTH_TOKEN && !process.env.SANITY_WRITE_TOKEN)
  process.env.SANITY_AUTH_TOKEN = JSON.parse(readFileSync(path.join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;
const { client } = await import('./sanity');
const { templates } = await import('../../src/next/model');
const { slugify } = await import('../../src/meta');
const apply = process.argv.includes('--apply');
if (!process.env.OLD_PAGES) throw new Error('OLD_PAGES (the previous pages.json) is required to tell template changes from editor changes.');
const old: any[] = JSON.parse(readFileSync(process.env.OLD_PAGES, 'utf8'));

const docs = await client.fetch<any[]>('*[_type in ["sitePage","activiteit","siteTeksten"]]');
const backup = path.resolve('../raw/cms-backups');
mkdirSync(backup, { recursive: true });
writeFileSync(path.join(backup, 'before-28-oktober-' + Date.now() + '.json'), JSON.stringify(docs, null, 2), { mode: 0o600 });
if (docs.some((d) => d._id.startsWith('drafts.'))) throw new Error('Review existing drafts before applying this migration.');

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


/* Raad van Advies (Ron, 28-10) ------------------------------------------------ */
{
  const doc = docs.find((d) => d._id === 'siteTeksten');
  const advies = (doc?.verantwoording?.advies ?? []) as any[];
  if (doc && !advies.some((p) => p.naam === 'Harvey Portier')) {
    report.push('advies add Harvey Portier');
    tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).setIfMissing({ 'verantwoording.advies': [] })
      .append('verantwoording.advies', [{ _key: 'harvey-portier', _type: 'object', naam: 'Harvey Portier', rol: 'opticien te Zeewolde' }]));
  }
}

/* Vraagbaak Koers en Kanker in the agenda (Marcel, 28-10) ---------------------- */
// "Elke maand op dezelfde weekdag" counts from the first date: 10 November is the second
// Tuesday, 24 November the fourth. The button goes to the Vraagbaak's own form.
const REEKSEN = [
  { id: 'agenda-vraagbaak-tweede-dinsdag', datum: '2026-11-10', slug: 'vraagbaak-koers-en-kanker-tweede-dinsdag' },
  { id: 'agenda-vraagbaak-vierde-dinsdag', datum: '2026-11-24', slug: 'vraagbaak-koers-en-kanker-vierde-dinsdag' },
];
if (REEKSEN.some((r) => !docs.some((d) => d._id === r.id))) {
  let afbeelding: any;
  if (apply) {
    const asset = await client.assets.upload('image', createReadStream(path.resolve('../public/img/approved/vraagbaak-gesprek.webp')),
      { filename: 'vraagbaak-gesprek.webp', title: 'Vraagbaak Koers en Kanker', description: 'Aangeleverd door Marcel Jansen, 28 oktober 2026.' });
    afbeelding = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  }
  for (const r of REEKSEN) {
    if (docs.some((d) => d._id === r.id)) continue;
    report.push(`create ${r.id} from ${r.datum}`);
    tx = tx.createIfNotExists({
      _id: r.id, _type: 'activiteit', soort: 'activiteit', titel: 'Vraagbaak Koers en Kanker',
      datum: r.datum, heleDag: false, begintijd: '09:00', eindtijd: '10:00', herhaling: 'maandelijks',
      categorie: 'Overig', doelgroepen: ['iedereen', 'jongeren-15-35', '35-50'], themas: ['werk-en-studie'],
      omschrijving: 'Hét vragenuur over jouw studie, werk en toekomst met of na kanker.\n\nAls je kanker hebt of hebt gehad, kunnen je plannen veranderen. Misschien twijfel je over je studie, wil je weer aan het werk of zoek je naar een richting die past bij hoe je leven er nu uitziet. Bij Vraagbaak Koers en Kanker is er ruimte voor jouw vragen.',
      aanmelden: true, volgeboekt: false, archief: false,
      aanmeldUrl: 'https://toonoverleven.nl/vraagbaak-koers-en-kanker#afspraak',
      slug: { _type: 'slug', current: r.slug },
      ...(afbeelding ? { afbeelding } : {}),
    });
  }
}

console.log(report.join('\n'));
if (conflicts.length) console.log('\nNeeds a look:\n' + conflicts.join('\n'));
if (apply) {
  await tx.commit();
  console.log('\nApplied.');
} else console.log('\nDry run. Add --apply to write.');
