/**
 * Vult een verse Sanity-dataset met de site zoals hij al staat: de teksten,
 * de agenda, de berichten en de sponsorlogo's, met de foto's uit public/img als
 * echte uploads.
 *
 * Zo ziet de klant bij het eerste inloggen zijn eigen huis in het beheer staan
 * in plaats van lege formulieren, en is elk veld meteen een voorbeeld van wat
 * erin hoort. De wekelijkse inloop staat er als één regel met "elke week"
 * erop: dat is precies hoe zij er zelf een activiteit bij moeten zetten.
 *
 * Alleen wat er nog niet staat. Een document dat al bestaat wordt met rust
 * gelaten, ook als het in de code inmiddels anders staat: wat de klant in het
 * beheer heeft gewijzigd is de waarheid, en een seed die daaroverheen schrijft
 * zet een foto of een aangekruist hokje stilletjes terug. (Dat deed hij eerst
 * wel, met createOrReplace.) Twee keer draaien kan dus, en doet de tweede keer
 * niets. Ontbreekt er in bestaande documenten iets dat er later bij bedacht
 * is, dan hoort daar een aparte backfill voor, zie backfill-agenda-fotos.ts.
 *
 *   SANITY_AUTH_TOKEN=xxx pnpm seed
 */
import { beeld, client, dataset, projectId } from './sanity';
import { defaults } from '../../src/content/defaults';
import { slugify } from '../../src/meta';
import type { AgendaBron, Bericht } from '../../src/content/types';

const bestaand = new Set<string>(
  await client.fetch<string[]>('*[_type in ["siteTeksten", "activiteit", "nieuws", "sponsor"]]._id'),
);

/** Maakt het document aan als het er nog niet is, en zegt wat er gebeurd is. */
async function maak(doc: { _id: string; _type: string } & Record<string, unknown>, label: string) {
  if (bestaand.has(doc._id)) {
    console.log(`  bestond al, ongemoeid: ${label}`);
    return false;
  }
  await client.createIfNotExists(doc);
  console.log(`  aangemaakt: ${label}`);
  return true;
}

/* ------------------------------------------------------------------ */
/*  Teksten                                                            */
/* ------------------------------------------------------------------ */

async function teksten() {
  const t = defaults.teksten;

  const sleutels = <T extends object>(rijen: T[], naam: (rij: T) => string) =>
    rijen.map((rij) => ({ _type: 'object', _key: slugify(naam(rij)), ...rij }));

  await maak(
    {
      _id: 'siteTeksten',
      _type: 'siteTeksten',
      naam: t.naam,
      vrijwilliger: {
        ...t.vrijwilliger,
        rollen: sleutels(t.vrijwilliger.rollen, (r) => r.kop),
      },
      steun: t.steun,
      verantwoording: {
        ...t.verantwoording,
        bestuur: sleutels(t.verantwoording.bestuur, (p) => p.naam),
        advies: sleutels(t.verantwoording.advies, (p) => p.naam),
      },
      contact: t.contact,
      praktisch: t.praktisch,
    },
    'Teksten op de site',
  );
}

/* ------------------------------------------------------------------ */
/*  Agenda                                                             */
/* ------------------------------------------------------------------ */

async function agenda() {
  for (const regel of defaults.agenda as AgendaBron[]) {
    const id = `agenda-${regel.id}`;
    if (bestaand.has(id)) {
      console.log(`  bestond al, ongemoeid: ${regel.titel}`);
      continue;
    }
    // Pas uploaden als het document er ook komt; een foto zonder document is
    // een losse upload in de dataset.
    const afbeelding = await beeld(regel.img);
    await maak(
      {
        _id: id,
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
        ...(afbeelding ? { afbeelding } : {}),
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
      },
      regel.titel,
    );
  }
  console.log('Agenda klaar');
}

/* ------------------------------------------------------------------ */
/*  Nieuws & Blog                                                      */
/* ------------------------------------------------------------------ */

async function nieuws() {
  for (const bericht of defaults.nieuws as Bericht[]) {
    const id = `nieuws-${bericht.slug}`;
    if (bestaand.has(id)) {
      console.log(`  bestond al, ongemoeid: ${bericht.titel}`);
      continue;
    }
    const afbeelding = await beeld(bericht.img);
    await maak(
      {
        _id: id,
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
      },
      bericht.titel,
    );
  }
  console.log('Nieuws & Blog klaar');
}

/* ------------------------------------------------------------------ */
/*  Sponsoren                                                          */
/* ------------------------------------------------------------------ */

async function sponsoren() {
  let volgorde = 0;
  for (const sponsor of defaults.sponsoren) {
    // De volgorde telt door over wat er al staat, zodat een sponsor die er
    // later bij komt op zijn eigen plek in de rij valt.
    volgorde += 10;
    const id = `sponsor-${slugify(sponsor.naam)}`;
    if (bestaand.has(id)) {
      console.log(`  bestond al, ongemoeid: ${sponsor.naam}`);
      continue;
    }
    const logo = await beeld(sponsor.beeld);
    if (!logo) continue;
    await maak(
      {
        _id: id,
        _type: 'sponsor',
        naam: sponsor.naam,
        logo,
        ...(sponsor.web ? { website: sponsor.web } : {}),
        volgorde,
      },
      sponsor.naam,
    );
  }
  console.log('Sponsoren klaar');
}

console.log(`Vullen van ${projectId}/${dataset} (${bestaand.size} documenten staan er al)`);
await teksten();
await agenda();
await nieuws();
await sponsoren();
console.log('Klaar. Open het beheer op /beheer.');
