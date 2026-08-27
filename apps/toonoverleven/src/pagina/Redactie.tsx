import type { ReactNode } from 'react';
import {
  Acties,
  Alineas,
  BronKaart,
  ContactKaart,
  Kaart,
  Kaartraster,
  Kicker,
  IcoonVlak,
  Kruimels,
  PaginaHero,
  Punten,
  Regel,
  Schil,
  Vertrouwensregel,
  Zorggrens,
  schrijfNaam,
} from '../ui';
import { beeldVan } from '../inhoud/beelden';
import { CONTROLEDATUM } from '../inhoud';
import type { Blok, Pagina, Tekst } from '../inhoud';

/**
 * De datum in de vertrouwensregel komt uit één constante, niet uit de tekst die
 * de mock-up meekreeg. Anders staat er over een jaar op vijftien pagina's een
 * datum die niemand meer kan terugvinden.
 */
function metControledatum(delen: Tekst[]): Tekst[] {
  return delen.map((deel) =>
    deel.map((stuk) =>
      typeof stuk === 'string' && /\d{1,2}\s+\w+\s+20\d\d/.test(stuk)
        ? stuk.replace(/\d{1,2}\s+\w+\s+20\d\d/, CONTROLEDATUM)
        : stuk,
    ),
  );
}

/**
 * De pagina's uit de vastgestelde structuur, getekend uit hun eigen inhoud.
 *
 * Zeventig pagina's zijn met de hand niet te onderhouden en al helemaal niet
 * consequent te houden. Ze zijn allemaal uit hetzelfde kleine repertoire
 * opgebouwd — een kop met beeld, secties met tekst, kaarten, kennisblokken,
 * bronkaarten — dus dat repertoire staat hier één keer en de inhoud bepaalt
 * welke blokken een pagina krijgt.
 *
 * Waar het beheer iets te zeggen heeft (de agenda, de berichten, de sponsoren)
 * schuift de pagina zijn eigen blok in de plaats van het vaste blok, via
 * `sleuven`: de sleutel is het id dat het blok in de mock-up al had.
 */

/**
 * Wat er uit het beheer op de plek van een blok komt.
 *
 * Een gewone knoop wordt ín het blok gezet: de kop, de uitleg en de knop die
 * het bestuur eronder zette blijven staan en de lijst eronder komt uit het
 * beheer. `vervang` is voor de blokken waar de mock-up een instructie aan de
 * bouwer als tekst had staan; daar komt het echte blok in de plaats, met de
 * vervolgstap eronder die het bestuur eronder had gezet.
 */
export type Sleuf = ReactNode | { vervang: ReactNode };

export type Sleuven = Record<string, Sleuf>;

const isVervang = (sleuf: Sleuf): sleuf is { vervang: ReactNode } =>
  typeof sleuf === 'object' && sleuf !== null && 'vervang' in sleuf;

export default function Redactie({
  pagina,
  sleuven,
  onderaan,
  bovenaan,
  eersteFoto = false,
  breed = false,
}: {
  pagina: Pagina;
  /** Blokken die uit het beheer komen, op de plek van een vast blok. */
  sleuven?: Sleuven;
  /** Wat na de laatste sectie komt. */
  onderaan?: ReactNode;
  /** Wat vóór de eerste sectie komt. */
  bovenaan?: ReactNode;
  eersteFoto?: boolean;
  /** Zonder de kolom ernaast: voor een pagina die zelf een kalender naast zijn
   *  lijst zet en anders drie kolommen op één scherm zou proppen. */
  breed?: boolean;
}) {
  const foto = beeldVan(pagina);
  const variant = pagina.pad === '/' ? 'home' : pagina.hero.route ? 'route' : 'gewoon';

  return (
    <>
      {pagina.kruimels?.length ? (
        <Schil>
          <Kruimels pad={pagina.kruimels} />
        </Schil>
      ) : null}

      <PaginaHero
        kicker={pagina.hero.kicker}
        titel={schrijfNaam(pagina.hero.titel)}
        lead={pagina.hero.lead.length ? <Regel tekst={pagina.hero.lead} /> : undefined}
        onder={pagina.hero.onder.length ? <Regel tekst={pagina.hero.onder} /> : undefined}
        knoppen={
          pagina.hero.acties.length ? <Acties acties={pagina.hero.acties} /> : undefined
        }
        foto={foto}
        eersteFoto={eersteFoto}
        variant={variant}
      />

      {pagina.vertrouwen?.length ? (
        <Schil>
          <Vertrouwensregel delen={metControledatum(pagina.vertrouwen)} />
        </Schil>
      ) : null}

      <Schil
        className={`grid items-start gap-10 pb-20 ${
          breed ? '' : 'lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16 xl:gap-[5.5rem]'
        }`}
      >
        <article className="min-w-0">
          {bovenaan}
          {pagina.blokken.map((blok, i) => {
            // Twee blokken hebben in de mock-up geen id maar zijn wél juist de
            // plek waar het beheer binnenkomt: de verkenner is de echte agenda
            // en het echtheidsblok maakt plaats voor echte verhalen.
            const id =
              blok.soort === 'verkenner' || blok.soort === 'echtheid'
                ? blok.soort
                : 'id' in blok
                  ? blok.id
                  : undefined;
            return (
              <BlokWeergave
                key={id ?? i}
                blok={blok}
                eerste={i === 0}
                sleuf={id ? sleuven?.[id] : undefined}
              />
            );
          })}
          {onderaan}
        </article>

        {pagina.zijkaart && (
          <aside className={breed ? 'max-w-xl' : 'lg:sticky lg:top-[7.2rem]'}>
            <ContactKaart
              kicker={pagina.zijkaart.kicker}
              kop={pagina.zijkaart.kop}
              tekst={pagina.zijkaart.tekst}
              acties={pagina.zijkaart.acties}
            />
          </aside>
        )}
      </Schil>
    </>
  );
}

/** Eén sectie op een pagina: een streep erboven, behalve de eerste. */
function Sectie({
  id,
  eerste,
  children,
}: {
  id?: string;
  eerste: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`py-9 md:py-11 ${eerste ? '' : 'border-t border-lijn'}`}>
      {children}
    </section>
  );
}

/**
 * Eén blok. Staat er voor dit blok iets uit het beheer klaar, dan komt dat in
 * de plaats van de kaarten of de lijst die de mock-up er verzonnen in zette,
 * maar blijft de kop, de uitleg en de vervolgstap eromheen staan: dat is de
 * tekst die het bestuur heeft vastgesteld.
 */
function BlokWeergave({ blok, eerste, sleuf }: { blok: Blok; eerste: boolean; sleuf?: Sleuf }) {
  const vervangt = sleuf !== undefined && isVervang(sleuf);
  const inhoud = sleuf === undefined ? undefined : isVervang(sleuf) ? sleuf.vervang : sleuf;

  if (vervangt && (blok.soort === 'tekst' || blok.soort === 'kaarten')) {
    return (
      <Sectie id={blok.id} eerste={eerste}>
        {inhoud}
        <Acties acties={blok.acties} />
      </Sectie>
    );
  }

  switch (blok.soort) {
    /* -------------------------------------------------------------- */
    case 'echtheid':
      if (inhoud) return <Sectie eerste={eerste}>{inhoud}</Sectie>;
      return (
        <div className="mb-10 mt-8 grid gap-4 rounded-[1.25rem] border border-dashed border-blos-diep bg-blos p-7 sm:grid-cols-[auto_1fr] sm:gap-6">
          <span aria-hidden="true" className="font-display text-[5rem] leading-[0.75] text-wijn">
            “
          </span>
          <div>
            <h2 className="mb-2 max-w-[22ch] text-[1.6rem] md:text-[2rem]">{schrijfNaam(blok.kop)}</h2>
            <Alineas tekst={blok.tekst} />
          </div>
        </div>
      );

    /* -------------------------------------------------------------- */
    case 'kaart-plek':
      return (
        <div className="mb-10 mt-8 grid min-h-[20rem] overflow-hidden rounded-[1.65rem] bg-teal-licht lg:grid-cols-[1.1fr_1fr]">
          <Plattegrond />
          <div className="self-center p-7">
            <h2 className="mb-3 max-w-[22ch] text-[1.6rem] md:text-[2rem]">{schrijfNaam(blok.kop)}</h2>
            <Alineas tekst={blok.tekst} />
            <Acties acties={blok.acties} />
          </div>
        </div>
      );

    /* -------------------------------------------------------------- */
    case 'kennis':
      return (
        <Sectie id={blok.id} eerste={eerste}>
          {blok.kicker && <Kicker>{blok.kicker}</Kicker>}
          {blok.kop && <h2 className="mb-3 max-w-[25ch] text-[1.8rem] md:text-[2.2rem] lg:text-[2.75rem]">{schrijfNaam(blok.kop)}</h2>}
          {blok.intro && (
            <p className="mb-6 max-w-[72ch] text-[1.04rem] leading-relaxed text-inkt">
              <Regel tekst={blok.intro} />
            </p>
          )}
          {blok.inzichten?.length ? (
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {blok.inzichten.map((kaart, i) => (
                <Inzicht key={kaart.kop} kaart={kaart} i={i} />
              ))}
            </div>
          ) : null}
          {blok.grens && (
            <Zorggrens kop={blok.grens.kop}>
              {blok.grens.tekst.map((regel, i) => (
                <p key={i} className={i ? 'mt-2' : ''}>
                  <Regel tekst={regel} />
                </p>
              ))}
            </Zorggrens>
          )}
        </Sectie>
      );

    /* -------------------------------------------------------------- */
    case 'bronnen':
      return (
        <Sectie id={blok.id} eerste={eerste}>
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
            <div>
              {blok.kicker && <Kicker>{blok.kicker}</Kicker>}
              {blok.kop && <h2 className="max-w-[25ch] text-[1.8rem] md:text-[2.2rem] lg:text-[2.6rem]">{schrijfNaam(blok.kop)}</h2>}
            </div>
            {blok.intro && (
              <p className="leading-relaxed text-grijs">
                <Regel tekst={blok.intro} />
              </p>
            )}
          </div>
          {blok.bronnen?.length ? (
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {blok.bronnen.map((bron) => (
                <BronKaart key={bron.href + bron.kop} bron={bron} />
              ))}
            </div>
          ) : null}
        </Sectie>
      );

    /* -------------------------------------------------------------- */
    case 'kaarten':
    case 'tekst':
      return (
        <Sectie id={'id' in blok ? blok.id : undefined} eerste={eerste}>
          {blok.kicker && <Kicker>{blok.kicker}</Kicker>}
          {blok.kop && <h2 className="mb-4 max-w-[22ch] text-[1.75rem] md:text-[2.15rem] lg:text-[2.65rem]">{schrijfNaam(blok.kop)}</h2>}
          <Alineas tekst={blok.tekst} />
          <Punten punten={blok.punten} />
          {inhoud ? (
            <div className="mt-6">{inhoud}</div>
          ) : 'kaarten' in blok && blok.kaarten?.length ? (
            <Kaartraster>
              {blok.kaarten.map((kaart, i) => (
                <Kaart key={kaart.kop + i} icoon={kaart.icoon} kop={kaart.kop} i={i} acties={kaart.acties}>
                  <Alineas tekst={kaart.tekst} className="max-w-none" kleur="text-inkt-doffer" />
                </Kaart>
              ))}
            </Kaartraster>
          ) : null}
          <Acties acties={blok.acties} />
        </Sectie>
      );

    /* -------------------------------------------------------------- */
    case 'verkenner':
      // De kop hoort binnen het vlak dat de lijst tekent, dus die zet het
      // onderdeel zelf; hier staat alleen de sectie eromheen.
      if (!inhoud) return null;
      return (
        <Sectie id={blok.id} eerste={eerste}>
          {inhoud}
        </Sectie>
      );

    /* -------------------------------------------------------------- */
    default:
      return null;
  }
}

/** Eén kaart in een kennisblok: geen knop eronder, alleen uitleg. */
function Inzicht({ kaart, i }: { kaart: { icoon?: string | null; kop: string; tekst: Tekst[] }; i: number }) {
  const tint = ['bg-white', 'bg-salie-licht', 'bg-teal-licht'][i % 3];
  return (
    <article className={`rounded-[1.25rem] border border-lijn p-5 ${tint}`}>
      <IcoonVlak naam={kaart.icoon} i={i} />
      <h3 className="mb-1.5 mt-3.5 text-[1.08rem] text-inkt">{schrijfNaam(kaart.kop)}</h3>
      <Alineas tekst={kaart.tekst} className="max-w-none text-[0.93rem]" kleur="text-inkt-doffer" />
    </article>
  );
}

/**
 * De plattegrond naast het adres. Geen ingesloten kaart van Google: die zet een
 * tracker op de pagina van een inloophuis en laadt honderden kilobytes voordat
 * iemand hem gebruikt. De knop ernaast opent de echte kaart.
 */
function Plattegrond() {
  return (
    <div className="relative min-h-[13rem] overflow-hidden bg-[#e7e5da]" aria-hidden="true">
      <span className="absolute -left-[10%] top-[9%] h-[33%] w-[45%] rounded-[45%_55%_42%_58%] bg-[#c6d6c0]" />
      <span className="absolute -right-[12%] -bottom-[8%] h-[45%] w-[50%] rounded-[45%_55%_42%_58%] bg-[#c6d6c0]" />
      <span className="absolute -left-[20%] top-[35%] h-4 w-[140%] -rotate-[25deg] border border-[#d8d4ca] bg-white" />
      <span className="absolute -left-[20%] top-[62%] h-4 w-[140%] rotate-[18deg] border border-[#d8d4ca] bg-white" />
      <span className="absolute left-1/2 top-[42%] grid h-12 w-12 -rotate-45 place-items-center rounded-[50%_50%_50%_0] bg-wijn shadow-[0_5px_18px_rgba(74,25,43,0.28)]" />
    </div>
  );
}
