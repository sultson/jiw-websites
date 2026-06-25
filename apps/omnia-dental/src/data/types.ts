// Shared content types. Localized fields are always { nl, en }.

export interface Loc {
  nl: string;
  en: string;
}

export type TreatmentCategory =
  | 'preventief' // checkups, hygiene
  | 'esthetisch' // whitening, facings
  | 'herstel' // crowns, root canal, fillings, CEREC
  | 'vervanging' // implants, dentures
  | 'kinderen' // paediatric
  | 'comfort'; // anxiety, wisdom teeth

export interface TreatmentStep {
  title: Loc;
  body: Loc;
}

export interface QA {
  q: Loc;
  a: Loc;
}

export interface Treatment {
  /** Stable key used for image filenames and cross-references. */
  key: string;
  /** Localized URL slug (kebab-case, no leading slash). */
  slug: Loc;
  category: TreatmentCategory;
  /** Sort order within the treatments grid. */
  order: number;
  /** Hero image / illustration path under /images/treatments/. */
  image: string;
  /** Short alt + card image description. */
  imageAlt: Loc;
  /** Whether the image is a clinical illustration (object-contain on light) vs a photo (object-cover). */
  imageKind: 'illustration' | 'photo';
  name: Loc;
  /** One-line card description. */
  tagline: Loc;
  /** Hero lead paragraph. */
  intro: Loc;
  /** "Wat is het" — 1–2 paragraphs explaining the treatment in plain language. */
  what: Loc;
  /** For whom / when it is relevant. */
  forWhom: Loc;
  /** Step-by-step of how the treatment goes at the practice. */
  steps: TreatmentStep[];
  /** Benefit bullets. */
  benefits: Loc[];
  /** 2–4 treatment-specific FAQs. */
  faq: QA[];
  /** Indicative duration sentence, e.g. "Eén afspraak van 60 minuten". */
  duration?: Loc;
  metaTitle: Loc;
  metaDescription: Loc;
}

export interface Review {
  name: string;
  /** City or short context, optional. */
  context?: Loc;
  rating: 5;
  /** Localized testimonial body. */
  body: Loc;
  /** Treatment key this relates to, optional (for context chip). */
  treatmentKey?: string;
}

export interface FaqItem {
  category: Loc;
  q: Loc;
  a: Loc;
}

export interface TariffItem {
  /** Official NZa code, e.g. "C11". */
  code: string;
  /** Treatment description. */
  label: Loc;
  /** 2026 NZa maximum tariff in euros (number, no currency symbol). */
  price: number;
  /** Optional note (e.g. "per element", "per 5 minuten"). */
  unit?: Loc;
}

export interface TariffCategory {
  key: string;
  title: Loc;
  /** Short intro for the category. */
  intro?: Loc;
  items: TariffItem[];
}

export interface LegalSection {
  heading: Loc;
  /** Paragraphs of body text. Plain strings; may include simple line content. */
  body: Loc[];
  /** Optional bullet list under the section. */
  bullets?: Loc[];
}

export interface LegalDoc {
  key: 'privacy' | 'cookie' | 'terms' | 'conduct' | 'complaints';
  title: Loc;
  intro: Loc;
  lastUpdated: string; // ISO date, display-formatted in the page
  sections: LegalSection[];
  metaTitle: Loc;
  metaDescription: Loc;
}
