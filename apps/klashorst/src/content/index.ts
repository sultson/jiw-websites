import { defaults } from './defaults';
import { imgFromRef } from './image';
import { slugify } from '../meta';
import { blocksFromText, samenvatten } from './rich';

export { plainText } from './rich';
import type {
  BlogPost,
  Content,
  GalerieStatus,
  GalerieWerk,
  Img,
  RichBlock,
  Teksten,
  Werk,
} from './types';

export type { BlogPost, Content, GalerieWerk, Img, RichBlock, Teksten, Werk } from './types';
export { ui } from './ui';

/**
 * Content arrives inlined in the HTML: the Worker queries Sanity, caches the
 * answer at the edge and writes it into a script tag before the page is sent.
 * So the app starts with its content already in hand, there is no second
 * request, nothing pops in late, and the client's edits are live without a
 * build. If the tag is missing or malformed, the bundled defaults render.
 */

type RawImage = { asset?: { _ref?: string } | null } | null;

type RawPayload = {
  projectId?: string;
  dataset?: string;
  preview?: boolean;
  data?: {
    teksten?: Record<string, any> | null;
    werk?: Record<string, any>[] | null;
    // The Studio calls the document type `nieuws`; the site calls it the blog.
    // Renaming the type would orphan every post already in the dataset, so the
    // old name survives on the wire and the seam is here, in one place.
    nieuws?: Record<string, any>[] | null;
    galerie?: Record<string, any>[] | null;
  } | null;
};

const text = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback;

const maybe = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

const list = <T>(value: T[] | null | undefined, fallback: T[]): T[] =>
  Array.isArray(value) && value.length ? value : fallback;

function readPayload(): RawPayload | null {
  if (typeof document === 'undefined') return null;
  const tag = document.getElementById('klashorst-content');
  if (!tag?.textContent) return null;
  try {
    return JSON.parse(tag.textContent) as RawPayload;
  } catch {
    return null;
  }
}

/** Formats a Sanity date field the way the museum would write it. */
function formatDate(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}


function buildContent(payload: RawPayload | null): Content {
  const projectId = payload?.projectId;
  const dataset = payload?.dataset;
  const data = payload?.data;
  if (!projectId || !dataset || !data) return defaults;

  const image = (raw: RawImage): Img | null => {
    const ref = raw?.asset?._ref;
    return typeof ref === 'string' ? imgFromRef(ref, projectId, dataset) : null;
  };

  const werk: Werk[] = (data.werk ?? [])
    .map((doc): Werk | null => {
      const img = image(doc.afbeelding);
      if (!img || !doc._id) return null;
      return {
        id: String(doc._id),
        titel: text(doc.titel, 'Zonder titel'),
        techniek: text(doc.techniek, ''),
        afmetingen: text(doc.afmetingen, ''),
        toelichting: maybe(doc.toelichting),
        reeks: doc.reeks === 's21' ? 's21' : undefined,
        inZaal: doc.inZaal !== false && doc.reeks !== 's21',
        img,
      };
    })
    .filter((item): item is Werk => item !== null);

  /** Resolves the photographs dropped into the middle of an article. */
  const richBody = (value: unknown): RichBlock[] => {
    if (!Array.isArray(value)) return [];
    return value
      .map((block): RichBlock | null => {
        if (!block || typeof block !== 'object') return null;
        if (block._type !== 'image') return block as RichBlock;
        const img = image(block);
        // An image whose asset never uploaded would render as a hole.
        if (!img) return null;
        return {
          _type: 'image',
          _key: block._key,
          img,
          alt: maybe(block.alt),
          bijschrift: maybe(block.bijschrift),
        };
      })
      .filter((block): block is RichBlock => block !== null);
  };

  const blog: BlogPost[] = (data.nieuws ?? [])
    .map((doc): BlogPost | null => {
      if (!doc._id) return null;
      const titel = text(doc.titel, 'Zonder titel');
      // Written before the rich text editor existed, or written and never
      // moved over: either way the post still has to have an article page.
      const body = richBody(doc.body);
      const legacy = blocksFromText(text(doc.tekst, ''));
      const full = body.length ? body : legacy;
      const intro = text(doc.intro, '');
      return {
        id: String(doc._id),
        slug: text(doc.slug?.current, slugify(titel)),
        datum: text(doc.datumWeergave, formatDate(doc.datum) ?? ''),
        datumISO: maybe(doc.datum),
        vastgezet: doc.vastgezet === true,
        titel,
        intro,
        // Without a lead of its own, the card borrows the opening of the
        // article. Borrowed rather than copied: the article page then leads
        // with the piece itself instead of saying the same thing twice.
        samenvatting: samenvatten(intro, full),
        body: full,
        img: image(doc.afbeelding),
      };
    })
    .filter((item): item is BlogPost => item !== null);

  const galerie: GalerieWerk[] = (data.galerie ?? [])
    .map((doc): GalerieWerk | null => {
      const img = image(doc.afbeelding);
      if (!img || !doc._id) return null;
      const status: GalerieStatus =
        doc.status === 'te-koop' || doc.status === 'huur-en-koop' || doc.status === 'verkocht'
          ? doc.status
          : 'te-huur';
      return {
        id: String(doc._id),
        titel: text(doc.titel, 'Zonder titel'),
        kunstenaar: text(doc.kunstenaar, ''),
        techniek: maybe(doc.techniek),
        afmetingen: maybe(doc.afmetingen),
        jaar: maybe(doc.jaar),
        status,
        prijs: maybe(doc.prijs),
        huurprijs: maybe(doc.huurprijs),
        toelichting: maybe(doc.toelichting),
        img,
      };
    })
    .filter((item): item is GalerieWerk => item !== null);

  const cms = data.teksten ?? {};
  const fallback = defaults.teksten;

  // Merged field by field: an untouched field in the Studio keeps the copy the
  // site shipped with, so the page can never go blank because someone has not
  // filled a box in yet.
  const teksten: Teksten = {
    hero: {
      jaren: text(cms.hero?.jaren, fallback.hero.jaren),
      titel: text(cms.hero?.titel, fallback.hero.titel),
      tagline: text(cms.hero?.tagline, fallback.hero.tagline),
      lead: text(cms.hero?.lead, fallback.hero.lead),
      knop: text(cms.hero?.knop, fallback.hero.knop),
    },
    werk: {
      eyebrow: text(cms.werk?.eyebrow, fallback.werk.eyebrow),
      titel: text(cms.werk?.titel, fallback.werk.titel),
      lead: text(cms.werk?.lead, fallback.werk.lead),
    },
    peter: {
      eyebrow: text(cms.peter?.eyebrow, fallback.peter.eyebrow),
      titel: text(cms.peter?.titel, fallback.peter.titel),
      alineas: list<string>(cms.peter?.alineas, fallback.peter.alineas),
      feitenTitel: text(cms.peter?.feitenTitel, fallback.peter.feitenTitel),
      feiten: list(
        (cms.peter?.feiten ?? []).map((row: any) => ({
          jaar: text(row?.jaar, ''),
          wat: text(row?.wat, ''),
        })),
        fallback.peter.feiten,
      ),
      portret: image(cms.peter?.portret) ?? fallback.peter.portret,
      portretCredit: text(cms.peter?.portretCredit, fallback.peter.portretCredit),
    },
    s21: {
      eyebrow: text(cms.s21?.eyebrow, fallback.s21.eyebrow),
      titel: text(cms.s21?.titel, fallback.s21.titel),
      lead: text(cms.s21?.lead, fallback.s21.lead),
      body: text(cms.s21?.body, fallback.s21.body),
      knop: text(cms.s21?.knop, fallback.s21.knop),
    },
    galerie: {
      eyebrow: text(cms.galerie?.eyebrow, fallback.galerie.eyebrow),
      titel: text(cms.galerie?.titel, fallback.galerie.titel),
      lead: text(cms.galerie?.lead, fallback.galerie.lead),
      leeg: text(cms.galerie?.leeg, fallback.galerie.leeg),
    },
    // `nieuws` on the wire, the blog on the site. Same seam as the posts above.
    blog: {
      eyebrow: text(cms.nieuws?.eyebrow, fallback.blog.eyebrow),
      titel: text(cms.nieuws?.titel, fallback.blog.titel),
      lead: text(cms.nieuws?.lead, fallback.blog.lead),
    },
    bezoek: {
      eyebrow: text(cms.bezoek?.eyebrow, fallback.bezoek.eyebrow),
      titel: text(cms.bezoek?.titel, fallback.bezoek.titel),
      lead: text(cms.bezoek?.lead, fallback.bezoek.lead),
      rijen: list(
        (cms.bezoek?.rijen ?? []).map((row: any) => ({
          label: text(row?.label, ''),
          waarde: text(row?.waarde, ''),
        })),
        fallback.bezoek.rijen,
      ),
      note: text(cms.bezoek?.note, fallback.bezoek.note),
    },
    nieuwsbrief: {
      eyebrow: text(cms.nieuwsbrief?.eyebrow, fallback.nieuwsbrief.eyebrow),
      titel: text(cms.nieuwsbrief?.titel, fallback.nieuwsbrief.titel),
      lead: text(cms.nieuwsbrief?.lead, fallback.nieuwsbrief.lead),
      consent: text(cms.nieuwsbrief?.consent, fallback.nieuwsbrief.consent),
    },
    footer: {
      rechten: text(cms.footer?.rechten, fallback.footer.rechten),
      demo: text(cms.footer?.demo, fallback.footer.demo),
    },
  };

  return {
    teksten,
    werk: werk.length ? werk : defaults.werk,
    blog: blog.length ? blog : defaults.blog,
    galerie,
  };
}

/**
 * Two posts can end up wanting the same address: two titles that slugify the
 * same, or a title reused. The first one keeps it, the next gets a number, so
 * every post has an address of its own and none of them is unreachable.
 */
function withUniqueSlugs(posts: BlogPost[]): BlogPost[] {
  const taken = new Set<string>();
  return posts.map((post) => {
    let slug = post.slug;
    for (let n = 2; taken.has(slug); n += 1) slug = `${post.slug}-${n}`;
    taken.add(slug);
    return slug === post.slug ? post : { ...post, slug };
  });
}

const payload = readPayload();

const built = buildContent(payload);

export const content: Content = { ...built, blog: withUniqueSlugs(built.blog) };

/** True when the Worker served drafts: the Studio's preview, not the live site. */
export const isPreview = Boolean(payload?.preview);

export const zaalWerken = content.werk.filter((work) => work.inZaal);
export const s21Werken = content.werk.filter((work) => work.reeks === 's21');

/** Every post, newest first: the order Sanity already sorted them into. */
export const blogPosts = content.blog;

export const findPost = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);
