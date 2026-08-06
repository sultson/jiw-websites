/**
 * Moves posts written before the blog existed into the shape the blog uses.
 *
 * Those posts hold one plain text field and no address of their own. The site
 * renders them either way, but until this has run the client opens an old post
 * in the Studio and finds the text editor empty, with the text they can see on
 * the site sitting in a greyed-out box above it.
 *
 * For each post that has no `body` yet: the paragraphs of `tekst` become the
 * article and the title becomes the address. The first paragraph is lifted out
 * as the lead only where there is more than one, because a lead that says
 * exactly what the article says is the same sentence printed twice. `tekst` is
 * left alone, so nothing is lost and running this twice changes nothing the
 * second time.
 *
 * It also renames the section heading from "Nieuws en archief" to what the blog
 * is called now, but only where the wording is still the one this site was
 * seeded with. Anything the client has typed themselves is left exactly alone.
 *
 *   SANITY_STUDIO_PROJECT_ID=xxx SANITY_AUTH_TOKEN=yyy pnpm -C studio tsx scripts/migrate-blog.ts
 *
 * Add --dry-run to see what it would do without writing anything.
 */
import { createClient } from '@sanity/client';
import { defaults } from '../../src/content/defaults';
import { plainText } from '../../src/content/rich';
import type { RichBlock } from '../../src/content/types';
import { slugify } from '../../src/meta';

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
  // Drafts as well as published posts. A draft the client is halfway through
  // would otherwise keep its old shape and lose its text the moment it goes up.
  perspective: 'raw',
});

type Post = {
  _id: string;
  titel?: string;
  tekst?: string;
  intro?: string;
  slug?: { current?: string };
  body?: unknown[];
};

/** Paragraphs as the editor stores them. */
const blocksFrom = (paragrafen: string[]) =>
  paragrafen.map((paragraph, index) => ({
    _type: 'block',
    _key: `overgenomen-${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `overgenomen-${index}-0`, text: paragraph, marks: [] }],
  }));

const alineasVan = (tekst: string) =>
  tekst
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

async function main() {
  const posts = await client.fetch<Post[]>(
    '*[_type == "nieuws"]{_id, titel, tekst, intro, slug, body}',
  );

  const taken = new Set(
    posts.map((post) => post.slug?.current).filter((slug): slug is string => Boolean(slug)),
  );

  let veranderd = 0;

  for (const post of posts) {
    const patch: Record<string, unknown> = {};
    const wissen: string[] = [];

    const alineas = alineasVan(post.tekst ?? '');

    if (!post.body?.length && alineas.length) {
      // Only lift a lead out where something is left to lead into.
      if (!post.intro?.trim() && alineas.length > 1) {
        patch.intro = alineas[0];
        patch.body = blocksFrom(alineas.slice(1));
      } else {
        patch.body = blocksFrom(alineas);
      }
    }

    // A lead that says exactly what the article says is one sentence printed
    // twice on the page. Left behind by an earlier version of this script.
    const artikel = plainText((patch.body ?? post.body ?? []) as RichBlock[]).trim();
    const lead = post.intro?.trim() ?? '';
    if (lead && artikel && lead === artikel) {
      if (patch.intro) delete patch.intro;
      if (post.intro) wissen.push('intro');
    }

    if (!post.slug?.current) {
      const basis = slugify(post.titel?.trim() || 'bericht');
      let slug = basis;
      for (let n = 2; taken.has(slug); n += 1) slug = `${basis}-${n}`;
      taken.add(slug);
      patch.slug = { _type: 'slug', current: slug };
    }

    const raakt = [...Object.keys(patch), ...wissen.map((veld) => `${veld} (weg)`)];
    if (!raakt.length) {
      console.log(`  ${post._id}: al bij`);
      continue;
    }

    console.log(`  ${post._id}: ${raakt.join(', ')}`);
    if (!dryRun) {
      let transactie = client.patch(post._id);
      if (Object.keys(patch).length) transactie = transactie.set(patch);
      if (wissen.length) transactie = transactie.unset(wissen);
      await transactie.commit();
    }
    veranderd += 1;
  }

  await hernoemKop();

  console.log(
    dryRun
      ? `Proefdraai: ${veranderd} van ${posts.length} berichten zouden worden bijgewerkt.`
      : `Klaar: ${veranderd} van ${posts.length} berichten bijgewerkt.`,
  );
}

/** The wording the site was seeded with, before the blog had a page of its own. */
const OUD = {
  eyebrow: 'Nieuws',
  titel: 'Nieuws en archief',
  lead: 'Berichten uit het archief van de schilder. Nieuwe aankondigingen komen hier te staan.',
};

async function hernoemKop() {
  const huidig = await client.fetch<Record<string, string> | null>(
    '*[_id == "siteTeksten"][0].nieuws',
  );
  if (!huidig) return;

  const nieuw = defaults.teksten.blog;
  const patch: Record<string, string> = {};
  // Only where the client has not written their own words over ours.
  if (huidig.eyebrow === OUD.eyebrow) patch['nieuws.eyebrow'] = nieuw.eyebrow;
  if (huidig.titel === OUD.titel) patch['nieuws.titel'] = nieuw.titel;
  if (huidig.lead === OUD.lead) patch['nieuws.lead'] = nieuw.lead;

  if (!Object.keys(patch).length) {
    console.log('  siteTeksten: kop staat al goed of is zelf aangepast');
    return;
  }

  console.log(`  siteTeksten: ${Object.keys(patch).join(', ')}`);
  if (!dryRun) await client.patch('siteTeksten').set(patch).commit();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
