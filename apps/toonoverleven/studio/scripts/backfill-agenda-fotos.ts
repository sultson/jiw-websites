/**
 * Zet de foto's bij de agendapunten die er nog geen hebben.
 *
 * De agenda is gevuld zonder foto. Op de site stond dan het sfeerbeeld van de
 * categorie, terwijl het fotoveld in het beheer leeg bleef, en dat is voor de
 * invuller onverklaarbaar: de kaart heeft een foto, het beheer zegt van niet.
 * Dit zet in het beheer de foto die bij het agendapunt hoort volgens
 * content/defaults.ts: een echte foto waar die bestaat, anders een sfeerbeeld.
 *
 * Alleen waar het veld leeg is. Een foto die het bestuur zelf heeft gekozen
 * blijft staan, en een agendapunt dat het bestuur zelf heeft aangemaakt wordt
 * niet aangeraakt: daar weet de code niets van.
 *
 *   SANITY_AUTH_TOKEN=xxx pnpm backfill:agenda-fotos
 */
import { beeld, client, dataset, projectId } from './sanity';
import { defaults } from '../../src/content/defaults';

type Stand = { _id: string; titel?: string; heeftFoto: boolean };

console.log(`Foto's aanvullen in ${projectId}/${dataset}`);

const ids = defaults.agenda.map((regel) => `agenda-${regel.id}`);
const stand = new Map<string, Stand>(
  (
    await client.fetch<Stand[]>(
      '*[_type == "activiteit" && _id in $ids]{ _id, titel, "heeftFoto": defined(afbeelding.asset) }',
      { ids },
    )
  ).map((doc) => [doc._id, doc]),
);

let gezet = 0;
for (const regel of defaults.agenda) {
  const id = `agenda-${regel.id}`;
  const doc = stand.get(id);
  if (!doc) {
    console.log(`  staat niet in het beheer, overgeslagen: ${regel.titel}`);
    continue;
  }
  if (typeof regel.img !== 'string') {
    console.log(`  geen foto voorzien: ${regel.titel}`);
    continue;
  }
  if (doc.heeftFoto) {
    console.log(`  heeft al een foto, ongemoeid: ${doc.titel ?? regel.titel}`);
    continue;
  }
  const afbeelding = await beeld(regel.img);
  if (!afbeelding) continue;
  // setIfMissing en niet set: mocht er tussen het kijken en het schrijven
  // iemand in het beheer een foto hebben gekozen, dan wint die.
  await client.patch(id).setIfMissing({ afbeelding }).commit();
  gezet += 1;
  console.log(`  foto gezet: ${doc.titel ?? regel.titel} <- ${regel.img}`);
}

console.log(`Klaar: ${gezet} foto${gezet === 1 ? '' : "'s"} gezet.`);
