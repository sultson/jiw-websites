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

/**
 * The English half of a document or a block of texts, or nothing at all on the
 * Dutch site. Every read goes English first and Dutch second, so a
 * half-translated museum is a readable museum rather than a broken one.
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
        // Empty when the work has no title. Not every doek is named, and the
        // site leaves the line off rather than inventing one.
        titel: text(vert.titel, text(doc.titel, '')),
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
        // Empty when the work has no title, the same rule the collection
        // follows: the site leaves the line off rather than inventing one.
        titel: text(vert.titel, text(doc.titel, '')),
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

  /**
   * One block of copy, read English first and Dutch second.
   *
   * There is deliberately no third step. The copy this build ships with is what
   * renders when the CMS never answered at all, and nothing else: once a query
   * came back, what the museum wrote is the site, and a box they emptied is an
   * empty box. Falling back per field meant a section the client had cleared
   * kept showing the seeded text, so from the outside the CMS looked broken and
   * deleting something changed nothing. Every component below renders nothing
   * for an empty field rather than an empty element.
   *
   * English still falls back to Dutch. That is not bundled copy, it is the
   * museum's own sentence, and it is the documented promise of every English
   * box in the Studio: leave it empty and the Dutch one is shown.
   */
  const blok = (naam: string) => {
    const eigen = ((cms as Record<string, any>)[naam] ?? {}) as Record<string, any>;
    const vert = engels(eigen);
    return {
      regel: (key: string) => text(vert[key], text(eigen[key], '')),
      lijst: <T>(key: string, vorm: (row: any) => T): T[] => {
        const bron = Array.isArray(vert[key]) && vert[key].length ? vert[key] : eigen[key];
        return Array.isArray(bron) ? bron.map(vorm) : [];
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
  const contact = blok('contact');
  const menu = blok('menu');
  const nietGevonden = blok('nietGevonden');
  const footer = blok('footer');
  const vindbaarheid = blok('vindbaarheid');

  const teksten: Teksten = {
    hero: {
      titel: hero.regel('titel'),
      tagline: hero.regel('tagline'),
      lead: hero.regel('lead'),
      knop: hero.regel('knop'),
    },
    werk: {
      eyebrow: werkT.regel('eyebrow'),
      titel: werkT.regel('titel'),
      lead: werkT.regel('lead'),
      leeg: werkT.regel('leeg'),
    },
    peter: {
      eyebrow: peter.regel('eyebrow'),
      titel: peter.regel('titel'),
      alineas: peter.lijst<string>('alineas', (row) => String(row ?? '')),
      // The portrait itself is not a translation, so it is read from the Dutch
      // side whichever language is on screen.
      portret: image((cms.peter ?? {}).portret),
      portretCredit: peter.regel('portretCredit'),
      tweedeFoto: image((cms.peter ?? {}).tweedeFoto),
      tweedeFotoCredit: peter.regel('tweedeFotoCredit'),
    },
    galerie: {
      eyebrow: galerieT.regel('eyebrow'),
      titel: galerieT.regel('titel'),
      lead: galerieT.regel('lead'),
      leeg: galerieT.regel('leeg'),
    },
    // `nieuws` on the wire, the blog on the site. Same seam as the posts above.
    blog: {
      eyebrow: blogT.regel('eyebrow'),
      titel: blogT.regel('titel'),
      lead: blogT.regel('lead'),
      leeg: blogT.regel('leeg'),
    },
    bezoek: {
      eyebrow: bezoek.regel('eyebrow'),
      titel: bezoek.regel('titel'),
      lead: bezoek.regel('lead'),
      rijen: bezoek.lijst('rijen', (row: any) => ({
        label: text(row?.label, ''),
        waarde: text(row?.waarde, ''),
      })),
      note: bezoek.regel('note'),
    },
    nieuwsbrief: {
      eyebrow: nieuwsbrief.regel('eyebrow'),
      titel: nieuwsbrief.regel('titel'),
      lead: nieuwsbrief.regel('lead'),
      consent: nieuwsbrief.regel('consent'),
      knop: nieuwsbrief.regel('knop'),
      gelukt: nieuwsbrief.regel('gelukt'),
    },
    contact: {
      eyebrow: contact.regel('eyebrow'),
      titel: contact.regel('titel'),
      lead: contact.regel('lead'),
      waarvoor: contact.lijst('waarvoor', (row: any) => ({
        label: text(row?.label, ''),
        wat: text(row?.wat, ''),
      })),
      knop: contact.regel('knop'),
      gelukt: contact.regel('gelukt'),
      mailVraag: contact.regel('mailVraag'),
      mail: contact.regel('mail'),
    },
    menu: {
      werk: menu.regel('werk'),
      peter: menu.regel('peter'),
      galerie: menu.regel('galerie'),
      blog: menu.regel('blog'),
      bezoek: menu.regel('bezoek'),
      contact: menu.regel('contact'),
      nieuwsbrief: menu.regel('nieuwsbrief'),
    },
    nietGevonden: {
      titel: nietGevonden.regel('titel'),
      tekst: nietGevonden.regel('tekst'),
    },
    footer: {
      rechten: footer.regel('rechten'),
      demo: footer.regel('demo'),
    },
    vindbaarheid: {
      titel: vindbaarheid.regel('titel'),
      omschrijving: vindbaarheid.regel('omschrijving'),
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
