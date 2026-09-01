/**
 * Gives every work the rank the drag-and-drop list sorts on, in the order the
 * site shows them today.
 *
 * The two walls used to be ordered by a `volgorde` number the client had to
 * type, which is the arrangement they asked to be rid of. The Studio now hangs
 * them by dragging, and that list sorts on `orderRank`. Works that already
 * exist have no rank, so without this they would all sort equal and the
 * collection would come back in an order nobody chose.
 *
 * Runs in the order the site renders right now — `volgorde` first, then oldest
 * first — so the wall looks identical the moment this lands, and the museum
 * starts dragging from where they left off. `volgorde` is unset in the same
 * pass, or the Studio would show it to the client as an unknown field.
 *
 *   SANITY_STUDIO_PROJECT_ID=xxx SANITY_AUTH_TOKEN=yyy pnpm -C studio set-order-rank
 *
 * Add --dry-run to see the order it would write without writing anything.
 * Safe to re-run: a work that already has a rank keeps it.
 */
import { createClient } from '@sanity/client';
import { LexoRank } from 'lexorank';

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
  // Drafts hang on the same wall, so they need a rank of their own.
  perspective: 'raw',
});

type Doc = { _id: string; titel?: string; volgorde?: number; orderRank?: string };

/**
 * The order the site renders today, so the wall does not move when this lands.
 * The tiebreak differs per wall and has to be copied exactly: the collection
 * listed oldest first, the other-artists wall newest first.
 */
const query = (tiebreak: 'asc' | 'desc') =>
  `*[_type == $type] | order(coalesce(volgorde, 9999) asc, _createdAt ${tiebreak}){
    _id, titel, volgorde, orderRank
  }`;

async function rangschik(type: string, label: string, tiebreak: 'asc' | 'desc') {
  const docs = await client.fetch<Doc[]>(query(tiebreak), { type });
  if (!docs.length) {
    console.log(`${label}: geen documenten.`);
    return;
  }

  // A work that already has a rank has been dragged, or was created after this
  // ran; it keeps what it has and the rest are threaded around it.
  let rank = LexoRank.middle();
  const teSchrijven: { id: string; rank: string; titel: string }[] = [];

  for (const doc of docs) {
    if (doc.orderRank) {
      rank = LexoRank.parse(doc.orderRank);
    } else {
      teSchrijven.push({ id: doc._id, rank: rank.toString(), titel: doc.titel ?? 'zonder titel' });
    }
    rank = rank.genNext();
  }

  const metVolgorde = docs.filter((doc) => doc.volgorde !== undefined);

  console.log(`\n${label}: ${docs.length} werken, ${teSchrijven.length} zonder rangschikking.`);
  for (const { rank: waarde, titel } of teSchrijven.slice(0, 5)) {
    console.log(`  ${waarde}  ${titel}`);
  }
  if (teSchrijven.length > 5) console.log(`  … nog ${teSchrijven.length - 5}`);
  if (metVolgorde.length) console.log(`  en ${metVolgorde.length}x het oude veld "volgorde" wordt verwijderd.`);

  if (dryRun || (!teSchrijven.length && !metVolgorde.length)) return;

  let transactie = client.transaction();
  for (const { id, rank: waarde } of teSchrijven) {
    transactie = transactie.patch(id, (patch) => patch.set({ orderRank: waarde }));
  }
  for (const doc of metVolgorde) {
    transactie = transactie.patch(doc._id, (patch) => patch.unset(['volgorde']));
  }
  await transactie.commit();
  console.log(`  geschreven.`);
}

async function main() {
  await rangschik('werk', 'Klashorst Collectie', 'asc');
  await rangschik('galeriewerk', 'Andere Kunst', 'desc');
  console.log(dryRun ? '\nDry run: er is niets geschreven.' : '\nKlaar.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
