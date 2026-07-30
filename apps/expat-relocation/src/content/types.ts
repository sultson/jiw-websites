/**
 * Content model for the whole site. Every language exports the exact same
 * shape (1:1 structural mirror across en/de/nl/fr/es/ru).
 *
 * RULES FOR AUTHORS/TRANSLATORS:
 * - `slug`, `image` and `form` values are NEVER translated or changed.
 * - No em dashes in copy. Use a comma, period or "to".
 * - State a fact once per page; no within-page repetition.
 * - No fabricated ratings, review counts or badges.
 */

export type FormKind = 'immigration' | 'relocation' | 'vip';

export interface Cta {
  title: string;
  text: string;
  label: string;
}

export interface ServiceContent {
  /** URL slug, English SEO term. Never translated. */
  slug: string;
  /** Short label for hub cards, menus and cross-links. */
  menuLabel: string;
  /** H1, matches the high-search-volume service term. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Small uppercase label above the H1. */
  eyebrow: string;
  /** 1–2 intro paragraphs. */
  intro: string[];
  /** One-liner used on hub cards under the label. */
  cardText: string;
  forWho: { title: string; items: string[] };
  included: { title: string; blocks: { title: string; text: string }[] };
  process: { title: string; steps: { title: string; text: string }[] };
  /** Optional practical note (fees, IND timelines, caveats). */
  note?: string;
  faq: { title: string; items: { q: string; a: string }[] };
  cta: Cta;
  /** Which tailored form this page uses. Never changed per language. */
  form: FormKind;
  /** Path under /images/. Never changed per language. */
  image: string;
  imageAlt: string;
}

export interface CrossLink {
  /** Absolute English path, e.g. '/immigration/startup-visa-netherlands'. */
  path: string;
  label: string;
  text: string;
}

export interface SectionContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string[];
  image: string;
  imageAlt: string;
  services: ServiceContent[];
  /** Pages that live in another section but belong in this hub's list. */
  crossLinks?: CrossLink[];
  cta: Cta;
}

export interface PackageContent {
  slug: string;
  /** e.g. 'Couple VIP Package' */
  name: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  /** e.g. 'from €2,900' localized. */
  priceFrom: string;
  /** Optional highlight badge on the hub card, e.g. 'Most popular'. */
  badge?: string;
  intro: string[];
  included: { title: string; items: { title: string; text: string }[] };
  forWho: { title: string; items: string[] };
  process: { title: string; steps: { title: string; text: string }[] };
  /** Luxury framing: why this price is justified, concretely. */
  justification: { title: string; text: string[] };
  faq: { title: string; items: { q: string; a: string }[] };
  cta: Cta;
  image: string;
  imageAlt: string;
}

export interface VipContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string[];
  image: string;
  imageAlt: string;
  /** Shared pricing context shown on the hub (range, what drives price). */
  pricingNote: { title: string; text: string[] };
  /** Packages are starting points, adapted per client. Shown on hub and package pages. */
  tailored: { text: string; label: string };
  packages: PackageContent[];
  cta: Cta;
}

export interface GuideContent {
  slug: string;
  menuLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string[];
  cardText: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  cta: Cta;
}

export interface GuidesContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string[];
  guides: GuideContent[];
  cta: Cta;
}

/* ------------------------------------------------------------------ */

export interface UiStrings {
  skipToContent: string;
  nav: {
    home: string;
    immigration: string;
    housing: string;
    relocation: string;
    business: string;
    vip: string;
    guides: string;
    about: string;
    contact: string;
  };
  cta: {
    whatsapp: string;
    whatsappLong: string;
    consultation: string;
    startRelocation: string;
    readMore: string;
    allServices: string;
    backTo: string;
    send: string;
    sending: string;
    explore: string;
  };
  langBanner: {
    /** e.g. 'Prefer to read this site in {lang}?' */
    prompt: string;
    switch: string;
    dismiss: string;
  };
  form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    optional: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
    consent: string;
    /** Shown above the form: what happens after submission. */
    nextSteps: string;
  };
  footer: {
    tagline: string;
    services: string;
    company: string;
    contactHeading: string;
    legalHeading: string;
    kvkLabel: string;
    rightsReserved: string;
    builtBy: string;
  };
  misc: {
    from: string;
    whatsIncluded: string;
    otherServices: string;
    relatedGuides: string;
  };
}

export interface HomeContent {
  metaTitle: string;
  metaDescription: string;
  hero: {
    h1: string;
    sub: string;
    ctaPrimary: string;
    ctaWhatsapp: string;
    ctaSecondary: string;
    /** Short trust line under the CTAs, next to the stars. */
    trust: string;
  };
  /** Three-path split directly under the hero. */
  paths: {
    heading: string;
    sub: string;
    items: {
      key: 'immigration' | 'relocation' | 'vip';
      title: string;
      text: string;
      label: string;
      path: string;
      image: string;
      imageAlt: string;
    }[];
  };
  mostRequested: {
    heading: string;
    sub: string;
    items: { label: string; path: string }[];
  };
  vipBlock: { eyebrow: string; heading: string; text: string[]; label: string };
  immigrationBlock: {
    eyebrow: string;
    heading: string;
    text: string[];
    label: string;
    links: { label: string; path: string }[];
  };
  housingBlock: {
    eyebrow: string;
    heading: string;
    text: string[];
    label: string;
    links: { label: string; path: string }[];
  };
  businessBlock: { eyebrow: string; heading: string; text: string[]; label: string };
  /** Dedicated port, harbour and offshore section (dark band). */
  portBlock: {
    eyebrow: string;
    heading: string;
    text: string[];
    label: string;
    areas: { title: string; text: string }[];
    /** Regional focus presented as a service advantage. */
    advantages: { title: string; text: string }[];
    links: { label: string; path: string }[];
  };
  /** Image-led family relocation band. */
  familyBlock: {
    eyebrow: string;
    heading: string;
    text: string[];
    label: string;
    path: string;
    image: string;
    imageAlt: string;
    links: { label: string; path: string }[];
  };
  whyBoutique: {
    eyebrow: string;
    heading: string;
    text: string[];
    points: { title: string; text: string }[];
    stats: { value: string; label: string }[];
  };
  reviews: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: {
      quote: string;
      name: string;
      route: string;
      tags: string[];
    }[];
  };
  whatsappCta: { heading: string; text: string; label: string };
  contactBlock: { eyebrow: string; heading: string; text: string };
}

export interface AboutContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string[];
  image: string;
  imageAlt: string;
  approach: { heading: string; text: string[] };
  boutique: { heading: string; text: string[]; points: { title: string; text: string }[] };
  families: { heading: string; text: string[] };
  reviews: { heading: string; sub: string };
  cta: Cta;
}

export interface ContactContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string[];
  /** The three tailored paths on the contact page. */
  tabs: { key: FormKind; label: string; text: string }[];
  whatsapp: { heading: string; text: string; label: string };
  emergency: { heading: string; text: string };
  details: { heading: string };
  formCopy: FormsCopy;
}

/** Labels for the three tailored lead forms. */
export interface FormsCopy {
  immigration: {
    heading: string;
    text: string;
    service: string;
    serviceOptions: string[];
    nationality: string;
    currentLocation: string;
    status: string;
    statusOptions: string[];
    timeline: string;
    timelineOptions: string[];
    message: string;
    messagePlaceholder: string;
  };
  relocation: {
    heading: string;
    text: string;
    service: string;
    serviceOptions: string[];
    movingFrom: string;
    household: string;
    householdOptions: string[];
    timeline: string;
    timelineOptions: string[];
    message: string;
    messagePlaceholder: string;
  };
  vip: {
    heading: string;
    text: string;
    package: string;
    packageOptions: string[];
    preferredContact: string;
    preferredContactOptions: string[];
    arrival: string;
    movingFrom: string;
    message: string;
    messagePlaceholder: string;
  };
}

export interface PrivacyContent {
  metaTitle: string;
  title: string;
  intro: string[];
  sections: { heading: string; paragraphs: string[] }[];
}

export interface CoreContent {
  ui: UiStrings;
  home: HomeContent;
  about: AboutContent;
  contact: ContactContent;
  privacy: PrivacyContent;
  notFound: { title: string; text: string; label: string };
}

export interface SiteContent {
  core: CoreContent;
  immigration: SectionContent;
  housing: SectionContent;
  relocation: SectionContent;
  industrial: SectionContent;
  business: SectionContent;
  vip: VipContent;
  guides: GuidesContent;
}
