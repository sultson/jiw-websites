/**
 * Fills a fresh Sanity dataset with the site as it already stands: every text
 * in both languages, every work, every blog post, and the photographs from
 * public/art uploaded as real assets.
 *
 * So the first thing the client sees in the Studio is their own museum rather
 * than an empty form, and every field is an example of what belongs in it,
 * including the English half of it.
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
import { defaults, seedBronnen } from '../../src/content/defaults';
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

/** Paragraphs as the Studio's editor stores them, with keys of their own. */
const blokken = (id: string, ...paragrafen: string[]) =>
  paragrafen
    .filter(Boolean)
    .map((tekst, index) => ({
      _type: 'block',
      _key: `${id}-${index}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `${id}-${index}-0`, text: tekst, marks: [] }],
    }));

async function main() {
  console.log(`Seeding ${projectId}/${dataset}`);

  const { werkBronnen, blogBronnen, teksten } = seedBronnen;

  console.log('Afbeeldingen uploaden');
  const werkAssets = new Map<string, string>();
  for (const work of werkBronnen) {
    werkAssets.set(work.id, await upload(work.img));
  }
  const blogAssets = new Map<string, string>();
  for (const item of blogBronnen) {
    blogAssets.set(item.id, await upload(item.img));
  }
  const portret = defaults.nl.teksten.peter.portret
    ? await upload(defaults.nl.teksten.peter.portret)
    : null;

  console.log('Documenten schrijven');
  const nl = teksten.nl;
  const en = teksten.en;
  const keys = <T extends object>(rows: T[], prefix: string) =>
    rows.map((row, i) => ({ _key: `${prefix}-${i}`, ...row }));

  await client.createOrReplace({
    _id: 'siteTeksten',
    _type: 'siteTeksten',
    hero: { ...nl.hero, en: en.hero },
    over: { ...nl.over, en: en.over },
    werk: { ...nl.werk, en: en.werk },
    s21: { ...nl.s21, en: en.s21 },
    peter: {
      eyebrow: nl.peter.eyebrow,
      titel: nl.peter.titel,
      alineas: nl.peter.alineas,
      feitenTitel: nl.peter.feitenTitel,
      feiten: keys(nl.peter.feiten, 'feit'),
      portretCredit: nl.peter.portretCredit,
      ...(portret ? { portret: imageField(portret) } : {}),
      en: {
        eyebrow: en.peter.eyebrow,
        titel: en.peter.titel,
        alineas: en.peter.alineas,
        feitenTitel: en.peter.feitenTitel,
        feiten: keys(en.peter.feiten, 'feit-en'),
        portretCredit: en.peter.portretCredit,
      },
    },
    galerie: { ...nl.galerie, en: en.galerie },
    // The field is still called `nieuws` in Sanity; the site calls it the blog.
    nieuws: { ...nl.blog, en: en.blog },
    bezoek: {
      eyebrow: nl.bezoek.eyebrow,
      titel: nl.bezoek.titel,
      lead: nl.bezoek.lead,
      rijen: keys(nl.bezoek.rijen, 'rij'),
      note: nl.bezoek.note,
      en: {
        eyebrow: en.bezoek.eyebrow,
        titel: en.bezoek.titel,
        lead: en.bezoek.lead,
        rijen: keys(en.bezoek.rijen, 'rij-en'),
        note: en.bezoek.note,
      },
    },
    nieuwsbrief: { ...nl.nieuwsbrief, en: en.nieuwsbrief },
    footer: { ...nl.footer, en: en.footer },
  });

  for (const [index, work] of werkBronnen.entries()) {
    await client.createOrReplace({
      _id: `werk-${work.id}`,
      _type: 'werk',
      titel: work.titel,
      techniek: work.techniek.nl,
      afmetingen: work.afmetingen,
      ...(work.toelichting ? { toelichting: work.toelichting.nl } : {}),
      ...(work.reeks ? { reeks: work.reeks } : {}),
      inZaal: work.inZaal,
      teKoop: work.teKoop,
      teHuur: work.teHuur,
      verkocht: work.verkocht,
      volgorde: (index + 1) * 10,
      afbeelding: imageField(werkAssets.get(work.id)!),
      en: {
        techniek: work.techniek.en,
        ...(work.toelichting ? { toelichting: work.toelichting.en } : {}),
      },
    });
  }

  for (const item of blogBronnen) {
    const iso = item.datumISO;
    // Only where the museum writes the date differently than the date reads.
    const weergave = item.datum.nl && item.datum.nl !== nlDatum(iso) ? item.datum.nl : undefined;
    await client.createOrReplace({
      _id: `nieuws-${item.id}`,
      _type: 'nieuws',
      titel: item.titel.nl,
      slug: { _type: 'slug', current: item.slug },
      datum: iso,
      ...(weergave ? { datumWeergave: weergave } : {}),
      ...(item.intro.nl ? { intro: item.intro.nl } : {}),
      body: blokken(item.id, item.body.nl),
      afbeelding: imageField(blogAssets.get(item.id)!),
      en: {
        titel: item.titel.en,
        ...(item.intro.en ? { intro: item.intro.en } : {}),
        body: blokken(`${item.id}-en`, item.body.en),
      },
    });
  }

  console.log(
    `Klaar: ${werkBronnen.length} werken, ${blogBronnen.length} blogberichten, teksten in twee talen en ${uploaded.size} afbeeldingen.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
