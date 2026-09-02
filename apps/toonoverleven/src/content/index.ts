import { defaults, nlDatum } from './defaults';
import { imgVanRef } from './image';
import { blokkenVanTekst, samenvatten } from './rich';
import { verhalenVan } from './verhalen';
import type { Verhaal, VerhaalRubriek } from './verhalen';
import { slugify } from '../meta';
import type {
  AgendaBron,
  Bericht,
  Categorie,
  Content,
  Herhaling,
  Img,
  RichBlock,
  Sponsor,
  Teksten,
} from './types';

export { platteTekst } from './rich';
export { bron } from './image';
export type * from './types';
export type { Verhaal, VerhaalRubriek } from './verhalen';

/**
 * De inhoud komt mee in de HTML: de Worker vraagt hem op bij Sanity, houdt het
 * antwoord kort aan de rand van het netwerk vast en schrijft het in een
 * scripttag voordat de pagina verstuurd wordt.
 *
 * Daardoor begint de app met zijn inhoud al in handen: geen tweede verzoek,
 * niets dat te laat inspringt, en een wijziging van de klant staat online
 * zonder dat er iets gebouwd hoeft te worden. Ontbreekt de tag of klopt hij
 * niet, dan rendert de tekst waarmee de site gebouwd is.
 */

type RawImage = { asset?: { _ref?: string } | null } | null;

export type RawPayload = {
  projectId?: string;
  dataset?: string;
  preview?: boolean;
  data?: {
    teksten?: Record<string, any> | null;
    agenda?: Record<string, any>[] | null;
    nieuws?: Record<string, any>[] | null;
    sponsoren?: Record<string, any>[] | null;
    verhalen?: Record<string, any>[] | null;
  } | null;
};

const tekst = (waarde: unknown, terugval: string): string =>
  typeof waarde === 'string' && waarde.trim() ? waarde : terugval;

const misschien = (waarde: unknown): string | undefined =>
  typeof waarde === 'string' && waarde.trim() ? waarde : undefined;

const lijst = <T>(waarde: T[] | null | undefined, terugval: T[]): T[] =>
  Array.isArray(waarde) && waarde.length ? waarde : terugval;

const CATEGORIEEN: Categorie[] = ['Inloop', 'Creatief', 'Bewegen', 'Wellness', 'Overig'];
const HERHALINGEN: Herhaling[] = ['eenmalig', 'wekelijks', 'tweewekelijks', 'maandelijks'];


function leesPayload(): RawPayload | null {
  if (typeof document === 'undefined') return null;
  const tag = document.getElementById('toonoverleven-content');
  if (!tag?.textContent) return null;
  try {
    return JSON.parse(tag.textContent) as RawPayload;
  } catch {
    return null;
  }
}

function bouwContent(payload: RawPayload | null): Content {
  const gebundeld = defaults;
  const projectId = payload?.projectId;
  const dataset = payload?.dataset;
  const data = payload?.data;
  if (!projectId || !dataset || !data) return gebundeld;

  const beeld = (ruw: RawImage): Img | null => {
    const ref = ruw?.asset?._ref;
    return typeof ref === 'string' ? imgVanRef(ref, projectId, dataset) : null;
  };

  /* ---------------------------------------------------------------- */
  /*  Agenda                                                           */
  /* ---------------------------------------------------------------- */

  const agenda: AgendaBron[] = (data.agenda ?? [])
    .map((doc): AgendaBron | null => {
      const datum = misschien(doc.datum);
      if (!doc._id || !datum) return null;
      const soort = doc.soort === 'mededeling' ? 'mededeling' : 'activiteit';
      const categorie = CATEGORIEEN.includes(doc.categorie) ? doc.categorie : 'Overig';
      const herhaling = HERHALINGEN.includes(doc.herhaling) ? doc.herhaling : 'eenmalig';
      return {
        id: String(doc._id),
        soort,
        titel: tekst(doc.titel, 'Zonder titel'),
        categorie,
        omschrijving: tekst(doc.omschrijving, ''),
        img: beeld(doc.afbeelding),
        datum,
        totDatum: misschien(doc.totDatum),
        // Een mededeling loopt over dagen, niet over uren: de tijdvelden staan
        // in het beheer verborgen en horen hier dus ook niet meegerekend te
        // worden, ook niet als er ooit iets is blijven staan.
        heleDag: soort === 'mededeling' ? true : doc.heleDag === true,
        begintijd: soort === 'mededeling' ? undefined : misschien(doc.begintijd),
        eindtijd: soort === 'mededeling' ? undefined : misschien(doc.eindtijd),
        herhaling: soort === 'mededeling' ? 'eenmalig' : herhaling,
        herhaalTot: misschien(doc.herhaalTot),
        overslaan: Array.isArray(doc.overslaan)
          ? doc.overslaan.filter((d: unknown): d is string => typeof d === 'string')
          : [],
        aanmelden: doc.aanmelden === true,
        bijdrage: misschien(doc.bijdrage),
        locatie: misschien(doc.locatie),
      };
    })
    .filter((item): item is AgendaBron => item !== null);

  /* ---------------------------------------------------------------- */
  /*  Nieuws & Blog                                                    */
  /* ---------------------------------------------------------------- */

  /** Lost de foto's op die middenin een bericht staan. */
  const rijkeTekst = (waarde: unknown): RichBlock[] => {
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
          alt: misschien(blok.alt),
          bijschrift: misschien(blok.bijschrift),
        };
      })
      .filter((blok): blok is RichBlock => blok !== null);
  };

  const nieuws: Bericht[] = (data.nieuws ?? [])
    .map((doc): Bericht | null => {
      if (!doc._id) return null;
      const titel = tekst(doc.titel, 'Zonder titel');
      const body = rijkeTekst(doc.body);
      const intro = tekst(doc.intro, '');
      const geheel = body.length ? body : blokkenVanTekst(intro);
      return {
        id: String(doc._id),
        slug: tekst(doc.slug?.current, slugify(titel)),
        datum: typeof doc.datum === 'string' ? nlDatum(doc.datum) : '',
        datumISO: misschien(doc.datum),
        vastgezet: doc.vastgezet === true,
        titel,
        intro,
        // Zonder eigen inleiding leent de kaart het begin van het bericht.
        // Geleend en niet gekopieerd: het bericht zelf begint dan met het stuk
        // in plaats van twee keer hetzelfde te zeggen.
        samenvatting: samenvatten(intro, geheel),
        body: geheel,
        img: beeld(doc.afbeelding),
        instagram: misschien(doc.instagram),
        facebook: misschien(doc.facebook),
        seoTitel: misschien(doc.seoTitel),
        seoOmschrijving: misschien(doc.seoOmschrijving),
      };
    })
    .filter((item): item is Bericht => item !== null);

  /* ---------------------------------------------------------------- */
  /*  Verhalen van bezoekers                                           */
  /* ---------------------------------------------------------------- */

  // Alles wat er niet met toestemming gepubliceerd hoort te zijn valt hier af.
  const verhalen = verhalenVan(data.verhalen, beeld);

  /* ---------------------------------------------------------------- */
  /*  Sponsoren                                                        */
  /* ---------------------------------------------------------------- */

  const sponsoren: Sponsor[] = (data.sponsoren ?? [])
    .map((doc): Sponsor | null => {
      const logo = beeld(doc.logo);
      if (!logo || !doc.naam) return null;
      return {
        naam: String(doc.naam),
        beeld: logo.klein,
        strook: logo.mini,
        web: misschien(doc.website),
      };
    })
    .filter((item): item is Sponsor => item !== null);

  /* ---------------------------------------------------------------- */
  /*  Teksten                                                          */
  /* ---------------------------------------------------------------- */

  const cms = data.teksten ?? {};
  const terugval = gebundeld.teksten;

  /**
   * Eén blok tekst, met de tekst waarmee deze build geleverd is eronder. Een
   * veld waar in het beheer niets in staat, houdt die tekst, dus de pagina kan
   * nooit leeg raken omdat iemand een vakje niet heeft ingevuld.
   */
  const blok = (naam: string) => {
    const eigen = ((cms as Record<string, any>)[naam] ?? {}) as Record<string, any>;
    return {
      regel: (sleutel: string, standaard: string) => tekst(eigen[sleutel], standaard),
      alineas: (sleutel: string, standaard: string[]): string[] =>
        lijst(
          Array.isArray(eigen[sleutel])
            ? eigen[sleutel].map((r: unknown) => String(r ?? '')).filter(Boolean)
            : null,
          standaard,
        ),
      rijen: <T>(sleutel: string, standaard: T[], vorm: (rij: any, i: number) => T): T[] =>
        lijst(
          Array.isArray(eigen[sleutel]) ? eigen[sleutel].map((rij: any, i: number) => vorm(rij, i)) : null,
          standaard,
        ),
    };
  };

  /**
   * Eén onderwerp binnen de praktische gegevens. Die staan in het beheer een
   * laag dieper dan de blokken hierboven, omdat ze daar op één tabblad bij
   * elkaar horen. Verder werkt het hetzelfde: leeg is de gebundelde tekst.
   */
  const praktischeRegel = (onderwerp: string) => {
    const eigen = (((cms as Record<string, any>).praktisch ?? {})[onderwerp] ?? {}) as Record<
      string,
      any
    >;
    return (sleutel: string, standaard: string) => tekst(eigen[sleutel], standaard);
  };

  const hero = blok('hero');
  const open = blok('open');
  const nieuwsBlok = blok('nieuwsBlok');
  const agendaBlok = blok('agendaBlok');
  const welkom = blok('welkom');
  const wieWeZijn = blok('wieWeZijn');
  const watWeDoen = blok('watWeDoen');
  const naam = blok('naam');
  const jongeren = blok('jongeren');
  const vrijwilliger = blok('vrijwilliger');
  const steun = blok('steun');
  const verantwoording = blok('verantwoording');
  const contact = blok('contact');
  const praktisch = blok('praktisch');
  const openingstijden = praktischeRegel('openingstijden');
  const kosten = praktischeRegel('kosten');
  const locatie = praktischeRegel('locatie');
  const bereikbaar = praktischeRegel('contact');

  const kopTekst = (rij: any) => ({ kop: tekst(rij?.kop, ''), tekst: tekst(rij?.tekst, '') });
  const persoon = (rij: any) => ({ naam: tekst(rij?.naam, ''), rol: tekst(rij?.rol, '') });

  const teksten: Teksten = {
    hero: {
      kicker: hero.regel('kicker', terugval.hero.kicker),
      titel: hero.regel('titel', terugval.hero.titel),
      lead: hero.regel('lead', terugval.hero.lead),
      knop: hero.regel('knop', terugval.hero.knop),
      knopTwee: hero.regel('knopTwee', terugval.hero.knopTwee),
    },
    open: {
      titel: open.regel('titel', terugval.open.titel),
      tekst: open.regel('tekst', terugval.open.tekst),
      punten: open.rijen('punten', terugval.open.punten, kopTekst),
    },
    nieuwsBlok: {
      kicker: nieuwsBlok.regel('kicker', terugval.nieuwsBlok.kicker),
      titel: nieuwsBlok.regel('titel', terugval.nieuwsBlok.titel),
      lead: nieuwsBlok.regel('lead', terugval.nieuwsBlok.lead),
    },
    agendaBlok: {
      kicker: agendaBlok.regel('kicker', terugval.agendaBlok.kicker),
      titel: agendaBlok.regel('titel', terugval.agendaBlok.titel),
      lead: agendaBlok.regel('lead', terugval.agendaBlok.lead),
      paginaLead: agendaBlok.regel('paginaLead', terugval.agendaBlok.paginaLead),
    },
    welkom: {
      kicker: welkom.regel('kicker', terugval.welkom.kicker),
      titel: welkom.regel('titel', terugval.welkom.titel),
      alineas: welkom.alineas('alineas', terugval.welkom.alineas),
      knop: welkom.regel('knop', terugval.welkom.knop),
    },
    wieWeZijn: {
      kicker: wieWeZijn.regel('kicker', terugval.wieWeZijn.kicker),
      titel: wieWeZijn.regel('titel', terugval.wieWeZijn.titel),
      lead: wieWeZijn.regel('lead', terugval.wieWeZijn.lead),
      alineas: wieWeZijn.alineas('alineas', terugval.wieWeZijn.alineas),
      voorWie: wieWeZijn.alineas('voorWie', terugval.wieWeZijn.voorWie),
    },
    watWeDoen: {
      kicker: watWeDoen.regel('kicker', terugval.watWeDoen.kicker),
      titel: watWeDoen.regel('titel', terugval.watWeDoen.titel),
      lead: watWeDoen.regel('lead', terugval.watWeDoen.lead),
      items: watWeDoen.rijen('items', terugval.watWeDoen.items, (rij: any, i: number) => ({
        kop: tekst(rij?.kop, ''),
        wanneer: tekst(rij?.wanneer, ''),
        tekst: tekst(rij?.tekst, ''),
        // Zonder eigen foto blijft de foto staan die de site meegekregen heeft,
        // op dezelfde plek in het rijtje. Een activiteit zonder beeld zou hier
        // een gat in het raster zijn.
        foto: beeld(rij?.foto) ?? terugval.watWeDoen.items[i]?.foto ?? '/img/huis-binnen.jpg',
      })),
      kosten: watWeDoen.regel('kosten', terugval.watWeDoen.kosten),
    },
    naam: {
      kicker: naam.regel('kicker', terugval.naam.kicker),
      titel: naam.regel('titel', terugval.naam.titel),
      alineas: naam.alineas('alineas', terugval.naam.alineas),
      slot: naam.regel('slot', terugval.naam.slot),
    },
    jongeren: {
      kicker: jongeren.regel('kicker', terugval.jongeren.kicker),
      titel: jongeren.regel('titel', terugval.jongeren.titel),
      lead: jongeren.regel('lead', terugval.jongeren.lead),
      alineas: jongeren.alineas('alineas', terugval.jongeren.alineas),
      knop: jongeren.regel('knop', terugval.jongeren.knop),
    },
    vrijwilliger: {
      kicker: vrijwilliger.regel('kicker', terugval.vrijwilliger.kicker),
      titel: vrijwilliger.regel('titel', terugval.vrijwilliger.titel),
      lead: vrijwilliger.regel('lead', terugval.vrijwilliger.lead),
      rollen: vrijwilliger.rijen('rollen', terugval.vrijwilliger.rollen, (rij: any) => ({
        kop: tekst(rij?.kop, ''),
        tekst: tekst(rij?.tekst, ''),
        punten: Array.isArray(rij?.punten) ? rij.punten.map((p: unknown) => String(p ?? '')) : [],
        slot: tekst(rij?.slot, ''),
      })),
      uitnodigingTitel: vrijwilliger.regel(
        'uitnodigingTitel',
        terugval.vrijwilliger.uitnodigingTitel,
      ),
      uitnodiging: vrijwilliger.regel('uitnodiging', terugval.vrijwilliger.uitnodiging),
    },
    steun: {
      kicker: steun.regel('kicker', terugval.steun.kicker),
      titel: steun.regel('titel', terugval.steun.titel),
      lead: steun.regel('lead', terugval.steun.lead),
      manieren: steun.rijen('manieren', terugval.steun.manieren, kopTekst),
      anbi: steun.regel('anbi', terugval.steun.anbi),
      sponsorenTitel: steun.regel('sponsorenTitel', terugval.steun.sponsorenTitel),
      sponsorenTekst: steun.regel('sponsorenTekst', terugval.steun.sponsorenTekst),
    },
    verantwoording: {
      kicker: verantwoording.regel('kicker', terugval.verantwoording.kicker),
      titel: verantwoording.regel('titel', terugval.verantwoording.titel),
      lead: verantwoording.regel('lead', terugval.verantwoording.lead),
      doel: verantwoording.regel('doel', terugval.verantwoording.doel),
      beloning: verantwoording.regel('beloning', terugval.verantwoording.beloning),
      bestuur: verantwoording.rijen('bestuur', terugval.verantwoording.bestuur, persoon),
      advies: verantwoording.rijen('advies', terugval.verantwoording.advies, persoon),
    },
    contact: {
      kicker: contact.regel('kicker', terugval.contact.kicker),
      titel: contact.regel('titel', terugval.contact.titel),
      lead: contact.regel('lead', terugval.contact.lead),
      formulierTitel: contact.regel('formulierTitel', terugval.contact.formulierTitel),
      formulierTekst: contact.regel('formulierTekst', terugval.contact.formulierTekst),
      openingstijden: contact.regel('openingstijden', terugval.contact.openingstijden),
    },
    praktisch: {
      openingstijden: {
        ochtend: openingstijden('ochtend', terugval.praktisch.openingstijden.ochtend),
        avond: openingstijden('avond', terugval.praktisch.openingstijden.avond),
        afwijkingen: openingstijden('afwijkingen', terugval.praktisch.openingstijden.afwijkingen),
      },
      kosten: {
        inloop: kosten('inloop', terugval.praktisch.kosten.inloop),
        activiteiten: kosten('activiteiten', terugval.praktisch.kosten.activiteiten),
        drempel: kosten('drempel', terugval.praktisch.kosten.drempel),
      },
      locatie: {
        adres: locatie('adres', terugval.praktisch.locatie.adres),
        route: locatie('route', terugval.praktisch.locatie.route),
        parkeren: locatie('parkeren', terugval.praktisch.locatie.parkeren),
        ingang: locatie('ingang', terugval.praktisch.locatie.ingang),
        elders: locatie('elders', terugval.praktisch.locatie.elders),
      },
      contact: {
        wieReageert: bereikbaar('wieReageert', terugval.praktisch.contact.wieReageert),
        watGebeurtEr: bereikbaar('watGebeurtEr', terugval.praktisch.contact.watGebeurtEr),
        reactietijd: bereikbaar('reactietijd', terugval.praktisch.contact.reactietijd),
      },
      verwijzers: praktisch.regel('verwijzers', terugval.praktisch.verwijzers),
    },
  };

  return {
    teksten,
    // Staat de agenda in het beheer nog leeg, dan blijft de meegeleverde agenda
    // staan. Een lege agendapagina zou zeggen dat er niets te doen is.
    agenda: agenda.length ? agenda : gebundeld.agenda,
    nieuws: nieuws.length ? nieuws : gebundeld.nieuws,
    sponsoren: sponsoren.length ? sponsoren : gebundeld.sponsoren,
    // Geen terugval: een verhaal dat niemand verteld heeft, bestaat niet.
    verhalen,
  };
}

/**
 * Twee berichten kunnen hetzelfde adres willen: twee koppen die hetzelfde
 * opleveren, of een kop die hergebruikt is. De eerste houdt het, de volgende
 * krijgt een nummer, zodat elk bericht een eigen adres heeft en geen enkel
 * bericht onbereikbaar is.
 */
function metEigenAdres(berichten: Bericht[]): Bericht[] {
  const bezet = new Set<string>();
  return berichten.map((bericht) => {
    let slug = bericht.slug;
    for (let n = 2; bezet.has(slug); n += 1) slug = `${bericht.slug}-${n}`;
    bezet.add(slug);
    return slug === bericht.slug ? bericht : { ...bericht, slug };
  });
}

/**
 * De inhoud opgebouwd uit een payload. Geen DOM, dus ook de Worker kan hem
 * aanroepen: die rendert de pagina met dezelfde inhoud als de browser er
 * daarna op zet, en dat is precies wat hydratie nodig heeft.
 */
export function contentVan(payload: RawPayload | null): Content {
  const gebouwd = bouwContent(payload);
  return { ...gebouwd, nieuws: metEigenAdres(gebouwd.nieuws) };
}

/** Of deze payload concepten uit het beheer draagt. */
export function isVoorbeeldVan(payload: RawPayload | null): boolean {
  return Boolean(payload?.preview);
}

const payload = leesPayload();

export const content: Content = contentVan(payload);

/** Waar of de Worker concepten heeft geserveerd: het voorbeeld uit het beheer. */
export const isVoorbeeld = isVoorbeeldVan(payload);

export const berichten = content.nieuws;

export const vindBericht = (slug: string): Bericht | undefined =>
  berichten.find((bericht) => bericht.slug === slug);

export const verhalen = content.verhalen;

/** De verhalen van één pagina onder Ervaringen. */
export const verhalenIn = (rubriek: VerhaalRubriek): Verhaal[] =>
  verhalen.filter((verhaal) => verhaal.rubriek === rubriek);
