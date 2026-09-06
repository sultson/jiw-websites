import { defaults, nlDatum } from './defaults';
import { imgVanRef } from './image';
import { blokkenVanTekst, samenvatten } from './rich';
import { DOELGROEPEN, THEMAS } from '../agenda/model';
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

const CATEGORIEEN: Categorie[] = ['Inloop', 'Creatief', 'Bewegen', 'Wellness', 'Overig'];
const HERHALINGEN: Herhaling[] = ['eenmalig', 'wekelijks', 'tweewekelijks', 'maandelijks'];

/**
 * De aangekruiste hokjes uit het beheer, ontdaan van wat de site niet kent.
 *
 * Een waarde die hier niet in de lijst staat komt uit een oud document of uit
 * een hokje dat inmiddels anders heet, en die hoort niet als thema of doelgroep
 * mee te tellen: de pagina's eronder filteren erop.
 */
const gekozen = <T extends string>(waarde: unknown, toegestaan: readonly T[]): T[] =>
  Array.isArray(waarde) ? waarde.filter((v): v is T => toegestaan.includes(v as T)) : [];

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
  // Geen inhoud uit het beheer: de site zoals hij gebouwd is, agenda en
  // berichten inbegrepen. Dit is de storing, niet het lege beheer.
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
        // Waar de themapagina's en de doelgroeppagina's op filteren, en waar de
        // agendapagina zijn filterknopjes uit opmaakt. Zonder deze twee regels
        // komt alles uit het beheer binnen als "voor iedereen, zonder thema" en
        // staan die elf pagina's leeg zodra het bestuur zijn eerste activiteit
        // invoert, terwijl het hokje in het beheer wel aangekruist is.
        doelgroepen: gekozen(doc.doelgroepen, DOELGROEPEN),
        themas: gekozen(doc.themas, THEMAS),
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
   * Eén blok tekst, met de tekst waarmee deze build geleverd is eronder.
   *
   * Een los veld waar in het beheer niets in staat, houdt die tekst, dus de
   * pagina kan nooit leeg raken omdat iemand een vakje niet heeft ingevuld.
   * Een lijst is de uitzondering: leeg is leeg. Wie het bestuur uit het beheer
   * haalt, krijgt op de site geen bestuur uit de code terug maar de regel dat
   * het nog niet in het beheer staat. Alleen een lijst die er nog nooit in
   * gestaan heeft (een veld dat later is bijgekomen) valt terug.
   */
  const blok = (naam: string) => {
    const eigen = ((cms as Record<string, any>)[naam] ?? {}) as Record<string, any>;
    return {
      regel: (sleutel: string, standaard: string) => tekst(eigen[sleutel], standaard),
      alineas: (sleutel: string, standaard: string[]): string[] =>
        Array.isArray(eigen[sleutel])
          ? eigen[sleutel].map((r: unknown) => String(r ?? '').trim()).filter(Boolean)
          : standaard,
      rijen: <T>(
        sleutel: string,
        standaard: T[],
        vorm: (rij: any) => T,
        geldig: (rij: T) => boolean,
      ): T[] =>
        Array.isArray(eigen[sleutel])
          ? eigen[sleutel].map((rij: any) => vorm(rij)).filter(geldig)
          : standaard,
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

  const naam = blok('naam');
  const vrijwilliger = blok('vrijwilliger');
  const steun = blok('steun');
  const verantwoording = blok('verantwoording');
  const contact = blok('contact');
  const praktisch = blok('praktisch');
  const openingstijden = praktischeRegel('openingstijden');
  const kosten = praktischeRegel('kosten');
  const locatie = praktischeRegel('locatie');
  const bereikbaar = praktischeRegel('contact');

  const persoon = (rij: any) => ({ naam: tekst(rij?.naam, ''), rol: tekst(rij?.rol, '') });
  // Een regel zonder naam of zonder kop is een lege regel in het beheer, geen
  // persoon of rol die op de site hoort te staan.
  const metNaam = (p: { naam: string }) => Boolean(p.naam);
  const metKop = (r: { kop: string }) => Boolean(r.kop);

  const teksten: Teksten = {
    naam: {
      alineas: naam.alineas('alineas', terugval.naam.alineas),
      slot: naam.regel('slot', terugval.naam.slot),
    },
    vrijwilliger: {
      lead: vrijwilliger.regel('lead', terugval.vrijwilliger.lead),
      rollen: vrijwilliger.rijen(
        'rollen',
        terugval.vrijwilliger.rollen,
        (rij: any) => ({
          kop: tekst(rij?.kop, ''),
          tekst: tekst(rij?.tekst, ''),
          punten: Array.isArray(rij?.punten)
            ? rij.punten.map((p: unknown) => String(p ?? '').trim()).filter(Boolean)
            : [],
          slot: tekst(rij?.slot, ''),
        }),
        metKop,
      ),
      uitnodiging: vrijwilliger.regel('uitnodiging', terugval.vrijwilliger.uitnodiging),
    },
    steun: {
      anbi: steun.regel('anbi', terugval.steun.anbi),
      sponsorenTitel: steun.regel('sponsorenTitel', terugval.steun.sponsorenTitel),
      sponsorenTekst: steun.regel('sponsorenTekst', terugval.steun.sponsorenTekst),
    },
    verantwoording: {
      beloning: verantwoording.regel('beloning', terugval.verantwoording.beloning),
      bestuur: verantwoording.rijen('bestuur', terugval.verantwoording.bestuur, persoon, metNaam),
      advies: verantwoording.rijen('advies', terugval.verantwoording.advies, persoon, metNaam),
    },
    contact: {
      formulierTitel: contact.regel('formulierTitel', terugval.contact.formulierTitel),
      formulierTekst: contact.regel('formulierTekst', terugval.contact.formulierTekst),
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

  // Wat uit het beheer komt is wat er is, ook als dat niets is. Een agenda
  // waar het bestuur alles uit gehaald heeft, is leeg; de pagina zegt dat dan
  // en verzint geen voorbeeldagenda. De gebundelde inhoud is er alleen voor
  // de storing, hierboven.
  return { teksten, agenda, nieuws, sponsoren, verhalen };
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
