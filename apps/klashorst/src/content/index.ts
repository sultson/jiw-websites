import { defaults } from './defaults';
import { imgFromRef } from './image';
import { DEFAULT_LANG, slugify, splitLang, type Lang } from '../meta';
import { blocksFromText, samenvatten } from './rich';
import { uiPerTaal } from './ui';

export { plainText } from './rich';
export { type Ui } from './ui';
import type { BlogPost, Content, GalerieWerk, Img, RichBlock, Teksten, Werk } from './types';

export type { BlogPost, Content, GalerieWerk, Img, RichBlock, Teksten, Werk } from './types';

/**
 * Content arrives inlined in the HTML: the Worker queries Sanity, caches the
 * answer at the edge and writes it into a script tag before the page is sent.
 * So the app starts with its content already in hand, there is no second
 * request, nothing pops in late, and the client's edits are live without a
 * build. If the tag is missing or malformed, the bundled defaults render.
 *
 * Everything below is resolved in one language, decided by the address. A
 * component never sees the other one, and never has to ask which it is in.
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

/**
 * Which language this page is. Dutch unless the address says otherwise, which
 * is the client's rule: Dutch is the site, English is the translation.
 */
export const lang: Lang =
  typeof window === 'undefined' ? DEFAULT_LANG : splitLang(window.location.pathname).lang;

export const ui = uiPerTaal[lang];

const text = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback;

const maybe = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

const list = <T>(value: T[] | null | undefined, fallback: T[]): T[] =>
  Array.isArray(value) && value.length ? value : fallback;

/**
 * The English half of a document or a block of texts, or nothing at all on the
 * Dutch site. Every read goes English first, Dutch second, bundled copy third,
 * so a half-translated museum is a readable museum rather than a broken one.
 */
const engels = (value: unknown): Record<string, any> =>
  lang === 'en' && value && typeof value === 'object' && !Array.isArray(value)
    ? ((value as Record<string, any>).en ?? {})
    : {};

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

/** Formats a Sanity date field the way this language would write it. */
function formatDate(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildContent(payload: RawPayload | null): Content {
  const bundled = defaults[lang];
  const projectId = payload?.projectId;
  const dataset = payload?.dataset;
  const data = payload?.data;
  if (!projectId || !dataset || !data) return bundled;

  const image = (raw: RawImage): Img | null => {
    const ref = raw?.asset?._ref;
    return typeof ref === 'string' ? imgFromRef(ref, projectId, dataset) : null;
  };

  const werk: Werk[] = (data.werk ?? [])
    .map((doc): Werk | null => {
      const img = image(doc.afbeelding);
      if (!img || !doc._id) return null;
      const vert = engels(doc);
      return {
        id: String(doc._id),
        titel: text(vert.titel, text(doc.titel, 'Zonder titel')),
        techniek: text(vert.techniek, text(doc.techniek, '')),
        afmetingen: text(doc.afmetingen, ''),
        toelichting: maybe(vert.toelichting) ?? maybe(doc.toelichting),
        inZaal: doc.inZaal !== false,
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
      const vert = engels(doc);
      const titel = text(vert.titel, text(doc.titel, 'Zonder titel'));
      // Written before the rich text editor existed, or written and never
      // moved over: either way the post still has to have an article page.
      const nlBody = richBody(doc.body);
      const enBody = richBody(vert.body);
      const legacy = blocksFromText(text(doc.tekst, ''));
      const full = enBody.length ? enBody : nlBody.length ? nlBody : legacy;
      const intro = text(vert.intro, text(doc.intro, ''));
      return {
        id: String(doc._id),
        slug: text(doc.slug?.current, slugify(text(doc.titel, titel))),
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
        // Nothing English on an English page: say so rather than hand a reader
        // Dutch without warning.
        onvertaald: lang === 'en' && !maybe(vert.titel) && !maybe(vert.intro) && !enBody.length,
        seoTitel: maybe(vert.seoTitel) ?? maybe(doc.seoTitel),
        seoOmschrijving: maybe(vert.seoOmschrijving) ?? maybe(doc.seoOmschrijving),
      };
    })
    .filter((item): item is BlogPost => item !== null);

  const galerie: GalerieWerk[] = (data.galerie ?? [])
    .map((doc): GalerieWerk | null => {
      const img = image(doc.afbeelding);
      if (!img || !doc._id) return null;
      const vert = engels(doc);
      return {
        id: String(doc._id),
        titel: text(vert.titel, text(doc.titel, 'Zonder titel')),
        kunstenaar: text(doc.kunstenaar, ''),
        techniek: maybe(vert.techniek) ?? maybe(doc.techniek),
        afmetingen: maybe(doc.afmetingen),
        jaar: maybe(doc.jaar),
        toelichting: maybe(vert.toelichting) ?? maybe(doc.toelichting),
        img,
      };
    })
    .filter((item): item is GalerieWerk => item !== null);

  const cms = data.teksten ?? {};
  const fallback = bundled.teksten;

  /**
   * One block of copy, read English first and Dutch second, with the copy this
   * build shipped with underneath both. An untouched field in the Studio keeps
   * that copy, so the page can never go blank because someone has not filled a
   * box in yet.
   */
  const blok = (naam: string) => {
    const eigen = ((cms as Record<string, any>)[naam] ?? {}) as Record<string, any>;
    const vert = engels(eigen);
    return {
      regel: (key: string, standaard: string) => text(vert[key], text(eigen[key], standaard)),
      lijst: <T>(key: string, standaard: T[], vorm: (row: any) => T): T[] => {
        const bron = Array.isArray(vert[key]) && vert[key].length ? vert[key] : eigen[key];
        return list(Array.isArray(bron) ? bron.map(vorm) : null, standaard);
      },
    };
  };

  const hero = blok('hero');
  const werkT = blok('werk');
  const peter = blok('peter');
  const galerieT = blok('galerie');
  const blogT = blok('nieuws');
  const bezoek = blok('bezoek');
  const nieuwsbrief = blok('nieuwsbrief');
  const footer = blok('footer');

  const teksten: Teksten = {
    hero: {
      titel: hero.regel('titel', fallback.hero.titel),
      tagline: hero.regel('tagline', fallback.hero.tagline),
      lead: hero.regel('lead', fallback.hero.lead),
      knop: hero.regel('knop', fallback.hero.knop),
    },
    werk: {
      eyebrow: werkT.regel('eyebrow', fallback.werk.eyebrow),
      titel: werkT.regel('titel', fallback.werk.titel),
      lead: werkT.regel('lead', fallback.werk.lead),
    },
    peter: {
      eyebrow: peter.regel('eyebrow', fallback.peter.eyebrow),
      titel: peter.regel('titel', fallback.peter.titel),
      alineas: peter.lijst<string>('alineas', fallback.peter.alineas, (row) => String(row ?? '')),
      feitenTitel: peter.regel('feitenTitel', fallback.peter.feitenTitel),
      feiten: peter.lijst('feiten', fallback.peter.feiten, (row: any) => ({
        jaar: text(row?.jaar, ''),
        wat: text(row?.wat, ''),
      })),
      // The portrait itself is not a translation, so it is read from the Dutch
      // side whichever language is on screen.
      portret: image((cms.peter ?? {}).portret) ?? fallback.peter.portret,
      portretCredit: peter.regel('portretCredit', fallback.peter.portretCredit),
    },
    galerie: {
      eyebrow: galerieT.regel('eyebrow', fallback.galerie.eyebrow),
      titel: galerieT.regel('titel', fallback.galerie.titel),
      lead: galerieT.regel('lead', fallback.galerie.lead),
      leeg: galerieT.regel('leeg', fallback.galerie.leeg),
    },
    // `nieuws` on the wire, the blog on the site. Same seam as the posts above.
    blog: {
      eyebrow: blogT.regel('eyebrow', fallback.blog.eyebrow),
      titel: blogT.regel('titel', fallback.blog.titel),
      lead: blogT.regel('lead', fallback.blog.lead),
    },
    bezoek: {
      eyebrow: bezoek.regel('eyebrow', fallback.bezoek.eyebrow),
      titel: bezoek.regel('titel', fallback.bezoek.titel),
      lead: bezoek.regel('lead', fallback.bezoek.lead),
      rijen: bezoek.lijst('rijen', fallback.bezoek.rijen, (row: any) => ({
        label: text(row?.label, ''),
        waarde: text(row?.waarde, ''),
      })),
      note: bezoek.regel('note', fallback.bezoek.note),
    },
    nieuwsbrief: {
      eyebrow: nieuwsbrief.regel('eyebrow', fallback.nieuwsbrief.eyebrow),
      titel: nieuwsbrief.regel('titel', fallback.nieuwsbrief.titel),
      lead: nieuwsbrief.regel('lead', fallback.nieuwsbrief.lead),
      consent: nieuwsbrief.regel('consent', fallback.nieuwsbrief.consent),
    },
    footer: {
      rechten: footer.regel('rechten', fallback.footer.rechten),
      demo: footer.regel('demo', fallback.footer.demo),
    },
  };

  /**
   * An empty list is an answer. The CMS returns an array for every list it was
   * asked about, so a list that came back as an array is the museum's list,
   * even when there is nothing in it: someone who empties the collection in
   * the Studio and presses publish has to see it empty on the site. Only a
   * query that came back without the field at all is a broken answer rather
   * than an empty one, and that is the case the bundled copy is for.
   */
  const geantwoord = <T>(rauw: unknown, gelezen: T[], bundel: T[]): T[] =>
    Array.isArray(rauw) ? gelezen : bundel;

  return {
    teksten,
    werk: geantwoord(data.werk, werk, bundled.werk),
    blog: geantwoord(data.nieuws, blog, bundled.blog),
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

/** Every post, newest first: the order Sanity already sorted them into. */
export const blogPosts = content.blog;

export const findPost = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);
