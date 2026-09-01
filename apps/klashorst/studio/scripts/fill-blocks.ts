/**
 * Fills the boxes a deploy has just added to the schema.
 *
 * Copy that used to live in the code — the menu, a form's button, an empty
 * state — has no field in the document Sanity already holds. That matters more
 * than it used to: the site no longer falls back to the copy it ships with, so
 * a field missing from the CMS is a field missing from the page. This writes
 * what the page said before the move into each new box, in both languages.
 *
 * Deliberately not "fill everything that is empty". An empty box is usually a
 * decision: the museum deleted the address rows because there is no address
 * yet, and an empty English box means "show the Dutch sentence". Refilling
 * those would put back exactly the phantom copy this change removes. So only
 * the paths listed in NIEUW are touched, and that list is emptied once a
 * deploy has been run everywhere.
 *
 *   SANITY_STUDIO_PROJECT_ID=xxx SANITY_AUTH_TOKEN=yyy pnpm -C studio fill-blocks
 *
 * Add --dry-run to list what is missing without writing anything.
 */
import { createClient } from '@sanity/client';
import { defaults } from '../../src/content/defaults';
import type { Teksten } from '../../src/content/types';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_WRITE_TOKEN ?? '';
const dryRun = process.argv.includes('--dry-run');

if (!projectId || !token) {
  console.error('SANITY_STUDIO_PROJECT_ID and SANITY_AUTH_TOKEN are both required.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
  // A draft of the texts document is the version the client is looking at, so
  // it needs the boxes just as much as the published one does.
  perspective: 'raw',
});

/**
 * Where each block of `Teksten` lives in Sanity. Only one name differs: the
 * document type and this block are still called `nieuws`, because renaming
 * them would orphan every post already in the dataset.
 */
const BLOKNAAM: Partial<Record<keyof Teksten, string>> = { blog: 'nieuws' };

/**
 * The boxes this deploy adds, per block of `Teksten`. A field belongs here only
 * while it is new to the schema, because a client cannot have emptied a box
 * that did not exist yet. Anything already editable is left exactly as the
 * museum left it.
 */
const NIEUW: { blok: keyof Teksten; velden: string[] }[] = [
  { blok: 'contact', velden: ['mailVraag', 'mail'] },
];

/** Rows in an array of objects each need a key of their own in Sanity. */
const gesleuteld = (rows: unknown[], prefix: string) =>
  rows.map((row, i) =>
    row && typeof row === 'object' && !Array.isArray(row) ? { _key: `${prefix}-${i}`, ...row } : row,
  );

type Patchable = Record<string, unknown>;

/**
 * Every field of every block, as a flat list of Sanity paths and the value the
 * page shows today. The English half of a block sits under `<blok>.en`.
 */
function velden(): { pad: string; waarde: unknown }[] {
  const uit: { pad: string; waarde: unknown }[] = [];

  for (const { blok: sleutel, velden: namen } of NIEUW) {
    const blok = BLOKNAAM[sleutel] ?? sleutel;

    for (const [taal, bron, onder] of [
      ['nl', defaults.nl.teksten[sleutel] as Patchable, blok],
      ['en', defaults.en.teksten[sleutel] as Patchable, `${blok}.en`],
    ] as const) {
      for (const veld of namen) {
        const waarde = bron[veld];
        if (waarde === null || waarde === undefined) continue;
        uit.push({
          pad: `${onder}.${veld}`,
          waarde: Array.isArray(waarde) ? gesleuteld(waarde, `${veld}-${taal}`) : waarde,
        });
      }
    }
  }

  return uit;
}

/** Reads a dotted path out of a document. */
const lees = (doc: Patchable, pad: string): unknown =>
  pad.split('.').reduce<unknown>((waarde, sleutel) => (waarde as Patchable)?.[sleutel], doc);

const leeg = (waarde: unknown) =>
  waarde === undefined ||
  waarde === null ||
  (typeof waarde === 'string' && !waarde.trim()) ||
  (Array.isArray(waarde) && !waarde.length);

async function main() {
  const docs = await client.fetch<Patchable[]>('*[_type == "siteTeksten"]');
  if (!docs.length) {
    console.log('Geen siteTeksten-document gevonden. Draai eerst pnpm -C studio seed.');
    return;
  }

  const alle = velden();

  for (const doc of docs) {
    const id = String(doc._id);
    const ontbreekt = alle.filter(({ pad }) => leeg(lees(doc, pad)));

    if (!ontbreekt.length) {
      console.log(`compleet: ${id}`);
      continue;
    }
    if (dryRun) {
      console.log(`zou aanvullen in ${id}:`);
      for (const { pad } of ontbreekt) console.log(`  ${pad}`);
      continue;
    }

    // The block object first, then the fields inside it: setIfMissing on
    // `contact.titel` does nothing while `contact` itself does not exist.
    let patch = client.patch(id);
    for (const blok of new Set(ontbreekt.map(({ pad }) => pad.split('.').slice(0, -1).join('.')))) {
      patch = patch.setIfMissing({ [blok]: {} });
    }
    patch = patch.setIfMissing(Object.fromEntries(ontbreekt.map(({ pad, waarde }) => [pad, waarde])));
    await patch.commit();
    console.log(`aangevuld in ${id}: ${ontbreekt.length} ${ontbreekt.length === 1 ? 'veld' : 'velden'}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
