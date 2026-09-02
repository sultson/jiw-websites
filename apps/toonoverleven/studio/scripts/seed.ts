/**
 * Vult een verse Sanity-dataset met de site zoals hij al staat: alle teksten,
 * de agenda, de berichten en de sponsorlogo's, met de foto's uit public/img als
 * echte uploads.
 *
 * Zo ziet de klant bij het eerste inloggen zijn eigen huis in het beheer staan
 * in plaats van lege formulieren, en is elk veld meteen een voorbeeld van wat
 * erin hoort. De wekelijkse inloop staat er als één regel met "elke week"
 * erop: dat is precies hoe zij er zelf een activiteit bij moeten zetten.
 *
 * Idempotent: documenten worden aangemaakt of vervangen op een vaste id, en
 * Sanity ontdubbelt identieke uploads op hun hash, dus twee keer draaien kan.
 *
 *   SANITY_AUTH_TOKEN=xxx pnpm seed
 */
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { defaults } from '../../src/content/defaults';
import { slugify } from '../../src/meta';
import type { AgendaBron, Bericht } from '../../src/content/types';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'z4gex0g7';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_WRITE_TOKEN ?? '';

if (!token) {
  console.error(
    'SANITY_AUTH_TOKEN ontbreekt. Een token met schrijfrechten staat in ~/.config/sanity/config.json of maak er een op sanity.io/manage.',
  );
  process.exit(1);
}

const publicDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../../public');

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false });

const geupload = new Map<string, string>();

/** Uploadt een bestand uit public/ en geeft de asset-id terug. */
async function upload(bestand: string): Promise<string | null> {
  const bekend = geupload.get(bestand);
  if (bekend) return bekend;

  const absoluut = path.join(publicDir, bestand.replace(/^\//, ''));
  if (!existsSync(absoluut)) {
    console.warn(`  overgeslagen, bestaat niet: ${bestand}`);
    return null;
  }
  const asset = await client.assets.upload('image', createReadStream(absoluut), {
    filename: path.basename(absoluut),
  });
  geupload.set(bestand, asset._id);
  console.log(`  ${bestand} -> ${asset._id}`);
  return asset._id;
}

const beeldVeld = (assetId: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
});

/** Een foto die als adres in public/ staat, als beeldveld voor Sanity. */
async function beeld(foto: unknown) {
  if (typeof foto !== 'string') return undefined;
  const assetId = await upload(foto);
  return assetId ? beeldVeld(assetId) : undefined;
}

/* ------------------------------------------------------------------ */
/*  Teksten                                                            */
/* ------------------------------------------------------------------ */

async function teksten() {
  const t = defaults.teksten;

  const items = await Promise.all(
    t.watWeDoen.items.map(async (item) => ({
      _type: 'object',
      _key: slugify(item.kop),
      kop: item.kop,
      wanneer: item.wanneer,
      tekst: item.tekst,
      foto: await beeld(item.foto),
    })),
  );

  const sleutels = <T extends object>(rijen: T[], naam: (rij: T) => string) =>
    rijen.map((rij) => ({ _type: 'object', _key: slugify(naam(rij)), ...rij }));

  await client.createOrReplace({
    _id: 'siteTeksten',
    _type: 'siteTeksten',
    hero: t.hero,
    open: { ...t.open, punten: sleutels(t.open.punten, (p) => p.kop) },
    nieuwsBlok: t.nieuwsBlok,
    agendaBlok: t.agendaBlok,
    welkom: t.welkom,
    wieWeZijn: t.wieWeZijn,
    watWeDoen: { ...t.watWeDoen, items },
    naam: t.naam,
    jongeren: t.jongeren,
    vrijwilliger: {
      ...t.vrijwilliger,
      rollen: sleutels(t.vrijwilliger.rollen, (r) => r.kop),
    },
    steun: { ...t.steun, manieren: sleutels(t.steun.manieren, (m) => m.kop) },
    verantwoording: {
      ...t.verantwoording,
      bestuur: sleutels(t.verantwoording.bestuur, (p) => p.naam),
      advies: sleutels(t.verantwoording.advies, (p) => p.naam),
    },
    contact: t.contact,
    praktisch: t.praktisch,
  });
  console.log('Teksten op de site klaar');
}

/* ------------------------------------------------------------------ */
/*  Agenda                                                             */
/* ------------------------------------------------------------------ */

async function agenda() {
  for (const regel of defaults.agenda as AgendaBron[]) {
    await client.createOrReplace({
      _id: `agenda-${regel.id}`,
      _type: 'activiteit',
      soort: regel.soort,
      titel: regel.titel,
      categorie: regel.categorie,
      // Voor wie het is en waar het over gaat. Zonder deze twee staat een
      // activiteit alleen in de agenda en op geen enkele thema- of
      // doelgroeppagina, terwijl de hokjes in het beheer er wel op wachten.
      ...(regel.doelgroepen?.length ? { doelgroepen: regel.doelgroepen } : {}),
      ...(regel.themas?.length ? { themas: regel.themas } : {}),
      omschrijving: regel.omschrijving,
      datum: regel.datum,
      ...(regel.totDatum ? { totDatum: regel.totDatum } : {}),
      heleDag: regel.heleDag,
      ...(regel.begintijd ? { begintijd: regel.begintijd } : {}),
      ...(regel.eindtijd ? { eindtijd: regel.eindtijd } : {}),
      herhaling: regel.herhaling,
      ...(regel.herhaalTot ? { herhaalTot: regel.herhaalTot } : {}),
      ...(regel.overslaan.length ? { overslaan: regel.overslaan } : {}),
      aanmelden: regel.aanmelden,
      ...(regel.bijdrage ? { bijdrage: regel.bijdrage } : {}),
      ...(regel.locatie ? { locatie: regel.locatie } : {}),
    });
    console.log(`  agenda: ${regel.titel}`);
  }
  console.log('Agenda klaar');
}

/* ------------------------------------------------------------------ */
/*  Nieuws & Blog                                                      */
/* ------------------------------------------------------------------ */

async function nieuws() {
  for (const bericht of defaults.nieuws as Bericht[]) {
    const afbeelding = await beeld(bericht.img);
    await client.createOrReplace({
      _id: `nieuws-${bericht.slug}`,
      _type: 'nieuws',
      titel: bericht.titel,
      slug: { _type: 'slug', current: bericht.slug },
      datum: bericht.datumISO,
      vastgezet: false,
      intro: bericht.intro,
      body: bericht.body,
      ...(afbeelding ? { afbeelding } : {}),
      ...(bericht.instagram ? { instagram: bericht.instagram } : {}),
      ...(bericht.facebook ? { facebook: bericht.facebook } : {}),
    });
    console.log(`  bericht: ${bericht.titel}`);
  }
  console.log('Nieuws & Blog klaar');
}

/* ------------------------------------------------------------------ */
/*  Sponsoren                                                          */
/* ------------------------------------------------------------------ */

async function sponsoren() {
  let volgorde = 0;
  for (const sponsor of defaults.sponsoren) {
    const logo = await beeld(sponsor.beeld);
    if (!logo) continue;
    volgorde += 10;
    await client.createOrReplace({
      _id: `sponsor-${slugify(sponsor.naam)}`,
      _type: 'sponsor',
      naam: sponsor.naam,
      logo,
      ...(sponsor.web ? { website: sponsor.web } : {}),
      volgorde,
    });
  }
  console.log(`Sponsoren klaar (${volgorde / 10})`);
}

console.log(`Vullen van ${projectId}/${dataset}`);
await teksten();
await agenda();
await nieuws();
await sponsoren();
console.log('Klaar. Open het beheer op /beheer.');
