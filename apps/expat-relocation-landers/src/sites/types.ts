/**
 * Shape of one landing page. Every domain in this app renders the same master
 * template (brief §34: one conversion-first template, eight commercially
 * distinct pages), so all per-domain difference lives in a content object of
 * this type.
 *
 * The sections between the hero and the FAQ are optional: the eight domains
 * answer different search intents and the client's per-domain briefs give each
 * one its own section list. The template renders whichever sections a lander
 * supplies, always in the order declared below, so no lander can drift into a
 * different page architecture.
 */

export type Lang = 'nl' | 'en';

export type SiteConfig = {
  /** Directory name and Astro build target. */
  id: string;
  /** The live domain this lander is built for. */
  domain: string;
  /** Hostname the build is served from until the real domain is pointed here. */
  previewDomain: string;
  /** Form route on the Worker: /api/forms/<formKind>. */
  formKind: string;
  /** Prefix of the lead notification subject: "NEW LEAD | <domain> | <name>". */
  leadSubjectPrefix: string;
  /** Hero photo, also the og:image and the preloaded LCP image. */
  heroImage: string;
};

export type Benefit = string;

export type Cta = {
  label: string;
  /** Anchor target. Every CTA on a lander points back at a lead form (brief §4). */
  href?: string;
  /** Written into the hidden `situation` field so the lead says which CTA was used. */
  situation?: string;
};

/** A photo shipped in public/images. The 640w variant is derived from the name. */
export type Photo = {
  src: string;
  alt: string;
};

/** A priced service. Never the price of a procedure, only of our work (brief §7). */
export type Offer = {
  name: string;
  price: string;
  /** "Government fees and third-party costs are not included." */
  note: string;
};

export type LanderContent = {
  lang: Lang;
  meta: {
    title: string;
    description: string;
    imageAlt: string;
  };
  nav: {
    /** Anchor links only. No service menu (brief §22). */
    links: { label: string; href: string }[];
    cta: Cta;
    langSwitch: string;
  };
  hero: {
    eyebrow: string;
    /**
     * Rendered with set:html so one phrase can carry the marker stroke
     * (`<span class="hl">…</span>`). Content is ours, never visitor input.
     */
    h1: string;
    /**
     * The two ends of the route, shown above the H1 as the page's opening
     * image: where the partner is now, and where the couple wants to be.
     */
    route?: { from: string; to: string };
    intro: string[];
    benefits: Benefit[];
    /** Shown only where the price genuinely belongs to the searched service. */
    offer?: Offer;
    cta: Cta;
    note: string;
    photo: Photo;
  };
  /** Trust bar. Substantiated claims only, no invented success rates (brief §2). */
  stats: { value: string; label: string }[];
  /** Recognition + short substantive information (brief §8 section 3). */
  explain?: {
    eyebrow: string;
    heading: string;
    body: string[];
    points: string[];
    /**
     * `quotes` renders the points as things the visitor would say out loud,
     * which is what makes the block read "this is us" rather than "checklist".
     * `checks` (the default) is for landers whose points are explanatory.
     */
    pointsStyle?: 'quotes' | 'checks';
    cta: Cta;
    photo: Photo;
    /** Caption block that overlaps the bottom of the photo. */
    photoNote: string;
  };
  /** The commercial section: two or three clearly defined priced services. */
  packages?: {
    eyebrow: string;
    heading: string;
    intro: string;
    cards: {
      badge?: string;
      title: string;
      body: string;
      price: string;
      includesHeading?: string;
      includes: string[];
      cta: Cta;
      /** The primary conversion goal, rendered as the dominant card. */
      featured?: boolean;
    }[];
    note: string;
    photo?: Photo;
  };
  /** The trajectory as a sequence, so the visitor sees one coordinated route. */
  journey?: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: { title: string; body: string }[];
    outcome: string;
    cta: Cta;
  };
  /** Situation routing, for landers whose visitors arrive at different stages. */
  routing?: {
    eyebrow: string;
    heading: string;
    intro: string;
    cards: {
      title: string;
      body: string;
      price?: string;
      cta: Cta;
      photo: Photo;
    }[];
  };
  /** Two procedures that share a name in daily speech and must not be confused. */
  distinction?: {
    eyebrow: string;
    heading: string;
    intro: string;
    abroad: {
      badge: string;
      title: string;
      body: string;
      packageName: string;
      price: string;
      priceNote: string;
      includes: string[];
      cta: Cta;
      photo: Photo;
    };
    inNl: {
      title: string;
      body: string[];
      cta: Cta;
      photo: Photo;
    };
  };
  help: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: { title: string; body: string }[];
    cta: Cta;
    photo: Photo;
  };
  steps?: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: { title: string; body: string }[];
    cta: Cta;
  };
  reviews: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: { quote: string; name: string; context: string }[];
    /** "Clients from India, Nigeria, ..." — the client's own claim. */
    countriesLabel: string;
    countries: string[];
  };
  /** Full-bleed photo band between the reviews and the questions. */
  band?: {
    heading: string;
    body: string;
    cta: Cta;
    photo: Photo;
  };
  /**
   * One quiet link out to the sibling domain that fits a visitor this page is
   * not for. Keeps a wrong-intent visitor inside the group without opening a
   * second competing service on this page (brief §9).
   */
  aside?: {
    heading: string;
    body: string;
    linkLabel: string;
    href: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    eyebrow: string;
    heading: string;
    body: string;
    /** Reassurance, not a second copy of the hero benefits. */
    assurances: string[];
    directContact: string;
    cta: Cta;
    /** Background of the closing block. Falls back to the hero photo. */
    photo?: Photo;
  };
  form: {
    heading: string;
    intro: string;
    badge: string;
    name: string;
    namePlaceholder: string;
    email: string;
    phone: string;
    phoneHint: string;
    message: string;
    messagePlaceholder: string;
    optional: string;
    consent: string;
    consentLink: string;
    submit: string;
    submitting: string;
    error: string;
    privacyNote: string;
  };
  whatsapp: {
    label: string;
    aria: string;
    /** Prefilled WhatsApp message. */
    text: string;
  };
  stickyCta: string;
  disclaimer: string;
  footer: {
    about: string;
    contactHeading: string;
    legalHeading: string;
    privacy: string;
    rights: string;
  };
  thanks: {
    metaTitle: string;
    heading: string;
    body: string[];
    qualifyHeading: string;
    qualifyIntro: string;
    choose: string;
    fields: {
      location: { label: string; options: string[] };
      situation: { label: string; options: string[] };
      exam: { label: string; options: string[] };
      nationality: { label: string };
      arrival: { label: string; hint: string };
      notes: { label: string; placeholder: string };
    };
    submit: string;
    submitting: string;
    done: string;
    doneBody: string;
    skip: string;
    error: string;
  };
  privacy: {
    metaTitle: string;
    heading: string;
    updated: string;
    sections: { heading: string; body: string[] }[];
  };
};
