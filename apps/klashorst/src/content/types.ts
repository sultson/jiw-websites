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

/**
 * Whether a work can be bought or hired. Three states that matter on the page:
 * nothing at all, available, and sold. The museum quotes on request, so this
 * decides a label and a button and never a price at checkout.
 */
export type Beschikbaar = {
  teKoop: boolean;
  teHuur: boolean;
  verkocht: boolean;
};

export type Werk = Beschikbaar & {
  id: string;
  titel: string;
  techniek: string;
  afmetingen: string;
  toelichting?: string;
  /** The S21 series has its own section and is kept out of the room. */
  reeks?: 's21';
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

export type GalerieWerk = Beschikbaar & {
  id: string;
  titel: string;
  kunstenaar: string;
  techniek?: string;
  afmetingen?: string;
  jaar?: string;
  prijs?: string;
  huurprijs?: string;
  toelichting?: string;
  img: Img;
};

export type Teksten = {
  hero: { titel: string; tagline: string; lead: string; knop: string };
  over: { eyebrow: string; titel: string; alineas: string[] };
  werk: { eyebrow: string; titel: string; lead: string };
  s21: { eyebrow: string; titel: string; lead: string; body: string; knop: string };
  peter: {
    eyebrow: string;
    titel: string;
    alineas: string[];
    feitenTitel: string;
    feiten: { jaar: string; wat: string }[];
    portret: Img | null;
    portretCredit: string;
  };
  galerie: { eyebrow: string; titel: string; lead: string; leeg: string };
  blog: { eyebrow: string; titel: string; lead: string };
  bezoek: {
    eyebrow: string;
    titel: string;
    lead: string;
    rijen: { label: string; waarde: string }[];
    note: string;
  };
  nieuwsbrief: { eyebrow: string; titel: string; lead: string; consent: string };
  footer: { rechten: string; demo: string };
};

export type Content = {
  teksten: Teksten;
  werk: Werk[];
  blog: BlogPost[];
  galerie: GalerieWerk[];
};
