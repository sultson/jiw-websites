import { nlDatum } from './defaults';
import { samenvatten } from './rich';
import type { Img, RichBlock } from './types';

/**
 * De verhalen van bezoekers, zoals ze uit het beheer komen.
 *
 * De vier pagina's onder Ervaringen laten zien wat een bezoek met iemand doet.
 * Wat daar staat moet van een echt mens komen, dus komt er hier niets door dat
 * niet expliciet met toestemming gepubliceerd is. Staat er nog niets klaar, dan
 * levert dit een lege lijst en zegt de pagina dat gewoon.
 */

/** De vier pagina's onder Ervaringen waar een verhaal op terecht kan komen. */
export type VerhaalRubriek = 'bezoekers' | 'jong' | 'naasten' | 'na-behandeling';

const RUBRIEKEN: VerhaalRubriek[] = ['bezoekers', 'jong', 'naasten', 'na-behandeling'];

export type Verhaal = {
  id: string;
  rubriek: VerhaalRubriek;
  kop: string;
  /** Zoals de verteller genoemd wil worden: een voornaam, of "een bezoeker". */
  verteller: string;
  samenvatting: string;
  body: RichBlock[];
  img: Img | null;
  datum?: string;
  /** Waar het hele verhaal staat, als het ergens anders verder gaat. */
  link?: string;
};

/**
 * Hoe een fotoveld uit het beheer een foto wordt. Die vertaling heeft de
 * project- en datasetnaam nodig die alleen index.ts kent, dus die geeft hem
 * mee. Het type is los: hier komt zowel een fotoveld van een document langs als
 * een foto die middenin een verhaal staat.
 */
type Beeldlezer = (ruw: any) => Img | null;

const woorden = (waarde: unknown): string =>
  typeof waarde === 'string' && waarde.trim() ? waarde.trim() : '';

/**
 * Eén verhaal, of niets.
 *
 * Niets bij alles wat er niet hoort te staan: zonder toestemming, niet
 * gepubliceerd, of zonder verteller of tekst. Dat laatste is geen formaliteit:
 * een kaart met een kop en verder niets zou de indruk wekken dat er een verhaal
 * is waar er geen is.
 */
function leesVerhaal(doc: any, beeld: Beeldlezer): Verhaal | null {
  if (!doc || typeof doc !== 'object' || !doc._id) return null;
  if (doc.toestemming !== true || doc.status !== 'gepubliceerd') return null;

  const kop = woorden(doc.kop);
  const verteller = woorden(doc.verteller);
  const intro = woorden(doc.intro);
  const body = rijkeTekst(doc.body, beeld);
  if (!kop || !verteller) return null;
  if (!body.length && !intro) return null;

  return {
    id: String(doc._id),
    // Een verhaal waarvan de pagina niet gekozen is, hoort op het algemene
    // overzicht en niet nergens.
    rubriek: RUBRIEKEN.includes(doc.rubriek) ? doc.rubriek : 'bezoekers',
    kop,
    verteller,
    samenvatting: samenvatten(intro, body),
    body,
    img: beeld(doc.afbeelding),
    datum: typeof doc.datum === 'string' ? nlDatum(doc.datum) : undefined,
    link: woorden(doc.link) || undefined,
  };
}

/** De foto's oplossen die middenin een verhaal staan. */
function rijkeTekst(waarde: unknown, beeld: Beeldlezer): RichBlock[] {
  if (!Array.isArray(waarde)) return [];
  return waarde
    .map((blok): RichBlock | null => {
      if (!blok || typeof blok !== 'object') return null;
      if (blok._type !== 'image') return blok as RichBlock;
      const img = beeld(blok);
      // Een foto waarvan de upload nooit is aangekomen, zou een gat worden.
      if (!img) return null;
      return {
        _type: 'image',
        _key: blok._key,
        img,
        alt: woorden(blok.alt) || undefined,
        bijschrift: woorden(blok.bijschrift) || undefined,
      };
    })
    .filter((blok): blok is RichBlock => blok !== null);
}

/**
 * De verhalen uit het beheer, het nieuwste vooraan. De sortering staat ook in
 * de vraag aan Sanity; hier staat hij nog een keer omdat een verhaal zonder
 * datum anders zomaar ergens tussen zou vallen.
 */
export function verhalenVan(docs: unknown, beeld: Beeldlezer): Verhaal[] {
  if (!Array.isArray(docs)) return [];
  const verhalen = docs
    .map((doc, i) => ({ doc, i, verhaal: leesVerhaal(doc, beeld) }))
    .filter((rij): rij is { doc: any; i: number; verhaal: Verhaal } => rij.verhaal !== null);

  return verhalen
    .sort((a, b) => {
      const datumA = typeof a.doc.datum === 'string' ? a.doc.datum : '';
      const datumB = typeof b.doc.datum === 'string' ? b.doc.datum : '';
      if (datumA !== datumB) return datumB.localeCompare(datumA);
      return a.i - b.i;
    })
    .map((rij) => rij.verhaal);
}
