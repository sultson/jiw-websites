/**
 * Fills a fresh Sanity dataset with the site as it already stands: every text,
 * every work, every news item, and the photographs from public/art uploaded as
 * real assets.
 *
 * So the first thing the client sees in the Studio is their own museum rather
 * than an empty form, and every field is an example of what belongs in it.
 *
 * Idempotent: documents are created or replaced by a fixed id, and Sanity
 * deduplicates identical image uploads by hash, so running it twice is safe.
 *
 *   SANITY_STUDIO_PROJECT_ID=xxx SANITY_AUTH_TOKEN=yyy pnpm seed
 */
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { defaults } from '../../src/content/defaults';
import type { Img } from '../../src/content/types';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_WRITE_TOKEN ?? '';

if (!projectId || !token) {
  console.error('SANITY_STUDIO_PROJECT_ID and SANITY_AUTH_TOKEN are both required.');
  process.exit(1);
}

const publicDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../../public');

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false });

/** The date as the site writes it, to tell "11 september 2024" from "2011". */
const nlDatum = (iso: string) =>
  new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

const uploaded = new Map<string, string>();

/** Uploads the largest prepared version of a photograph and returns its asset id. */
async function upload(img: Img): Promise<string> {
  const file = img.full;
  const cached = uploaded.get(file);
  if (cached) return cached;

  const absolute = path.join(publicDir, file);
  const asset = await client.assets.upload('image', createReadStream(absolute), {
    filename: path.basename(file),
  });
  uploaded.set(file, asset._id);
  console.log(`  ${file} -> ${asset._id}`);
  return asset._id;
}

const imageField = (assetId: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
});

async function main() {
  console.log(`Seeding ${projectId}/${dataset}`);

  console.log('Afbeeldingen uploaden');
  const werkAssets = new Map<string, string>();
  for (const work of defaults.werk) {
    werkAssets.set(work.id, await upload(work.img));
  }
  const blogAssets = new Map<string, string>();
  for (const item of defaults.blog) {
    if (item.img) blogAssets.set(item.id, await upload(item.img));
  }
  const portret = defaults.teksten.peter.portret ? await upload(defaults.teksten.peter.portret) : null;

  console.log('Documenten schrijven');
  const t = defaults.teksten;

  await client.createOrReplace({
    _id: 'siteTeksten',
    _type: 'siteTeksten',
    hero: t.hero,
    werk: t.werk,
    peter: {
      eyebrow: t.peter.eyebrow,
      titel: t.peter.titel,
      alineas: t.peter.alineas,
      feitenTitel: t.peter.feitenTitel,
      feiten: t.peter.feiten.map((row, i) => ({ _key: `feit-${i}`, ...row })),
      portretCredit: t.peter.portretCredit,
      ...(portret ? { portret: imageField(portret) } : {}),
    },
    s21: t.s21,
    galerie: t.galerie,
    // The field is still called `nieuws` in Sanity; the site calls it the blog.
    nieuws: t.blog,
    bezoek: {
      eyebrow: t.bezoek.eyebrow,
      titel: t.bezoek.titel,
      lead: t.bezoek.lead,
      rijen: t.bezoek.rijen.map((row, i) => ({ _key: `rij-${i}`, ...row })),
      note: t.bezoek.note,
    },
    nieuwsbrief: t.nieuwsbrief,
    footer: t.footer,
  });

  for (const [index, work] of defaults.werk.entries()) {
    await client.createOrReplace({
      _id: `werk-${work.id}`,
      _type: 'werk',
      titel: work.titel,
      techniek: work.techniek,
      afmetingen: work.afmetingen,
      ...(work.toelichting ? { toelichting: work.toelichting } : {}),
      ...(work.reeks ? { reeks: work.reeks } : {}),
      inZaal: work.inZaal,
      volgorde: (index + 1) * 10,
      afbeelding: imageField(werkAssets.get(work.id)!),
    });
  }

  for (const item of defaults.blog) {
    const iso = item.datumISO ?? new Date().toISOString().slice(0, 10);
    // Only where the museum writes the date differently than the date reads.
    const weergave = item.datum && item.datum !== nlDatum(iso) ? item.datum : undefined;
    const asset = blogAssets.get(item.id);
    await client.createOrReplace({
      _id: `nieuws-${item.id}`,
      _type: 'nieuws',
      titel: item.titel,
      slug: { _type: 'slug', current: item.slug },
      datum: iso,
      ...(weergave ? { datumWeergave: weergave } : {}),
      ...(item.intro ? { intro: item.intro } : {}),
      body: item.body,
      ...(asset ? { afbeelding: imageField(asset) } : {}),
    });
  }

  console.log(
    `Klaar: ${defaults.werk.length} werken, ${defaults.blog.length} blogberichten, teksten en ${uploaded.size} afbeeldingen.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
