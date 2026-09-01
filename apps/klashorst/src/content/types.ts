/**
 * The shape the components read. Sanity documents and the bundled defaults are
 * both normalised into this, in one language at a time, so no component ever
 * knows where content came from or that a second language exists.
 */

/** One photograph, in the three sizes the site asks for. */
export type Img = {
  /** width / height of the source photograph. */
  ratio: number;
  /** Collection grid and news card. */
  grid: string;
  /** Texture for the 3D room and the pre-script image strip. */
  room: string;
  /** Lightbox. */
  full: string;
};

export type Werk = {
  id: string;
  /** Empty for a work that has no title: the site then shows no title line. */
  titel: string;
  techniek: string;
  afmetingen: string;
  toelichting?: string;
  inZaal: boolean;
  img: Img;
};

/**
 * One block from the Studio's rich text editor: a paragraph, a heading, a list
 * item or a photograph. Portable Text, kept as it comes out of Sanity apart
 * from images, whose asset reference is resolved into real URLs here so no
 * component has to know about Sanity.
 */
export type RichBlock =
  | { _type: 'block'; _key?: string; [key: string]: unknown }
  | { _type: 'image'; _key?: string; img: Img; alt?: string; bijschrift?: string }
  | { _type: string; _key?: string; [key: string]: unknown };

export type BlogPost = {
  id: string;
  /** The address under /blog. Always filled: derived from the title if the CMS field is empty. */
  slug: string;
  /** Already formatted for display: "11 september 2024" or "2011". */
  datum: string;
  /** The raw date, for <time datetime="…">. Absent when the CMS has none. */
  datumISO?: string;
  /**
   * Held at the front regardless of its date, and so given the large opening
   * place on the blog page. For an announcement that has to stay put.
   */
  vastgezet: boolean;
  titel: string;
  /**
   * The lead the client wrote, above the article. Empty when they wrote none,
   * and then the article simply starts.
   */
  intro: string;
  /**
   * What the post says in one paragraph, for the card on the overview and for
   * the sentence under a search result. The lead when there is one, otherwise
   * the opening of the article itself, so a card is never blank and never
   * repeats on the page it leads to.
   */
  samenvatting: string;
  /** The article itself. Empty for a post that is only an announcement. */
  body: RichBlock[];
  img: Img | null;
  /**
   * True on the English site for a post that has no English version yet, so the
   * page can say so instead of quietly handing an English reader Dutch.
   */
  onvertaald: boolean;
  /** What the client wrote in the SEO panel, when they wrote anything. */
  seoTitel?: string;
  seoOmschrijving?: string;
};

export type GalerieWerk = {
  id: string;
  /** Empty for a work that has no title: the site then shows no title line. */
  titel: string;
  /** Empty until the museum fills it in: the line is then simply absent. */
  kunstenaar: string;
  techniek?: string;
  afmetingen?: string;
  jaar?: string;
  toelichting?: string;
  img: Img;
};

/**
 * Every sentence the museum can change, in one shape.
 *
 * All of it comes from the CMS and none of it is propped up by the copy this
 * build ships with: a field the museum emptied is an empty string here, and
 * the component that reads it renders nothing rather than an element holding
 * open a gap. The bundled copy in defaults.ts is what a CMS that never
 * answered falls back to, and what the seed writes; it is not a per-field
 * safety net.
 */
export type Teksten = {
  hero: { titel: string; tagline: string; lead: string; knop: string };
  werk: { eyebrow: string; titel: string; lead: string; leeg: string };
  peter: {
    eyebrow: string;
    titel: string;
    alineas: string[];
    portret: Img | null;
    portretCredit: string;
    /** A second photograph under the portrait, when the museum added one. */
    tweedeFoto: Img | null;
    tweedeFotoCredit: string;
  };
  galerie: { eyebrow: string; titel: string; lead: string; leeg: string };
  blog: { eyebrow: string; titel: string; lead: string; leeg: string };
  bezoek: {
    eyebrow: string;
    titel: string;
    lead: string;
    rijen: { label: string; waarde: string }[];
    note: string;
  };
  nieuwsbrief: {
    eyebrow: string;
    titel: string;
    lead: string;
    consent: string;
    knop: string;
    /** What the visitor reads once the sign-up has gone through. */
    gelukt: string;
  };
  contact: {
    eyebrow: string;
    titel: string;
    lead: string;
    /** Who the form is for: one heading and one sentence per reason to write. */
    waarvoor: { label: string; wat: string }[];
    knop: string;
    gelukt: string;
    /** For a visitor who would rather open their own mail programme. */
    mailVraag: string;
    mail: string;
  };
  /** The bar at the top and the same links again at the foot of the page. */
  menu: {
    werk: string;
    peter: string;
    galerie: string;
    blog: string;
    bezoek: string;
    contact: string;
    nieuwsbrief: string;
  };
  nietGevonden: { titel: string; tekst: string };
  footer: { rechten: string; demo: string };
  /** What the front page is called in Google and in a shared link. */
  vindbaarheid: { titel: string; omschrijving: string };
};

export type Content = {
  teksten: Teksten;
  werk: Werk[];
  blog: BlogPost[];
  galerie: GalerieWerk[];
};
