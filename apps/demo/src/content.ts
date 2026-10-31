/**
 * What the page renders. The Worker inlines Sanity's answer as
 * <script id="demo-content">; without it (local `pnpm dev`, or Sanity down with
 * nothing cached) the page shows the bundled copy below, which is also what the
 * seed writes.
 */

export type SanityImage = { asset?: { _ref?: string } };

export type Site = {
  titel: string;
  intro: string;
  heroFoto?: SanityImage;
  overTitel: string;
  overTekst: string;
  contactEmail: string;
  contactTelefoon: string;
};

export type Bericht = {
  _id: string;
  titel: string;
  datum?: string;
  tekst: string;
  foto?: SanityImage;
};

export const defaults: { site: Site; berichten: Bericht[] } = {
  site: {
    titel: 'Demo',
    intro: 'Een proefsite om het beheer mee uit te proberen. Pas deze tekst aan op /beheer en publiceer.',
    overTitel: 'Over ons',
    overTekst:
      'Alles op deze pagina komt uit Sanity.\n\nEen witregel maakt een nieuwe alinea. *Schuin* en **vet** werken ook.',
    contactEmail: 'hallo@jouwidealewebsite.nl',
    contactTelefoon: '',
  },
  berichten: [
    {
      _id: 'bericht-welkom',
      titel: 'Eerste bericht',
      datum: '2026-10-29',
      tekst: 'Berichten staan op datum, het nieuwste bovenaan. Voeg er een toe in het beheer.',
    },
  ],
};

type Payload = {
  projectId: string;
  dataset: string;
  preview: boolean;
  data: { site?: Partial<Site> | null; berichten?: Bericht[] | null };
};

function read(): Payload | null {
  try {
    const el = document.getElementById('demo-content');
    if (!el?.textContent) return null;
    const parsed = JSON.parse(el.textContent) as Payload;
    return parsed?.projectId && parsed.dataset && parsed.data ? parsed : null;
  } catch {
    return null;
  }
}

const payload = read();

/**
 * Once Sanity answered, its answer is the site: an emptied field is empty on
 * the page and an emptied list is an empty list. Bundled copy is only for when
 * no answer arrived at all.
 */
const leeg = { titel: '', intro: '', overTitel: '', overTekst: '', contactEmail: '', contactTelefoon: '' };

export const site: Site = payload ? { ...leeg, ...(payload.data.site ?? {}) } : defaults.site;

export const berichten: Bericht[] = payload
  ? Array.isArray(payload.data.berichten) ? payload.data.berichten : []
  : defaults.berichten;

export const isPreview = payload?.preview === true;

/** One upload, every size: the asset ref carries id, dimensions and format. */
export function imageUrl(image: SanityImage | undefined, width: number): string | null {
  const ref = image?.asset?._ref;
  const match = ref?.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match || !payload) return null;
  const [, id, size, ext] = match;
  return `https://cdn.sanity.io/images/${payload.projectId}/${payload.dataset}/${id}-${size}.${ext}?w=${width}&auto=format&fit=max`;
}

export function imageRatio(image: SanityImage | undefined): string | undefined {
  const size = image?.asset?._ref?.match(/-(\d+)x(\d+)-/);
  return size ? `${size[1]} / ${size[2]}` : undefined;
}
