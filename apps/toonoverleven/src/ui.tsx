import type { ComponentType, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import Icoon from './inhoud/Icoon';
import type { Actie, Bron, Kruimel, Tekst } from './inhoud';

/* ------------------------------------------------------------------ */
/*  Gegevens van de stichting                                          */
/* ------------------------------------------------------------------ */

/* Alles hieronder staat op hun eigen site. Niets is ingevuld of geschat. */
export const NAAM = 'Toon over Leven';
export const ONDERTITEL = 'IPSO-centrum voor leven met en na kanker';
export const STRAAT = 'Mazerhard 37';
export const POSTCODE = '3891 BR';
export const PLAATS = 'Zeewolde';
export const TEL = '036-8450265';
export const TEL_LINK = 'tel:+31368450265';
export const MAIL = 'info@toonoverleven.nl';
export const KVK = '32143598';
export const RSIN = '820209685';
export const FACEBOOK = 'https://www.facebook.com/ToonHermansHuisZeewolde';
export const INSTAGRAM = 'https://www.instagram.com/toon_over_leven_zeewolde/';
export const SPONSORKLIKS = 'https://www.sponsorkliks.com/products/shops.php?club=5378';
export const DONATIE = 'https://betaalverzoek.rabobank.nl/betaalverzoek/?id=9trZQwQDTT6cTUhJJ1-uJA';
export const IPSO = 'https://ipso.nl';
export const ROUTE =
  'https://www.google.com/maps/search/?api=1&query=Mazerhard+37,+3891+BR+Zeewolde';

/**
 * De naam is Toon over Leven: drie woorden, kleine o, grote L.
 *
 * In hun eigen berichten staat hij ook als "Toon Over Leven" of "Toon
 * Overleven", en wat er in het beheer getypt wordt kan er weer anders uitzien.
 * Daarom schrijven we de naam recht op het moment dat we hem tonen, zodat er
 * op de site nooit twee schrijfwijzen naast elkaar staan.
 */
export function schrijfNaam(tekst: string): string {
  return tekst.replace(/\bToon\s+over\s*leven\b/gi, NAAM);
}

/* ------------------------------------------------------------------ */
/*  Het raster                                                         */
/* ------------------------------------------------------------------ */

/** De breedte waar de hele site binnen blijft: 1180px met marge ernaast. */
export function Schil({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-[min(1180px,100%-1.2rem)] sm:w-[min(1180px,100%-2rem)] ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/*  Tekst met links erin                                               */
/* ------------------------------------------------------------------ */

/**
 * Eén alinea uit de redactielaag. De stukjes zijn gewone tekst, vet of een
 * link; een link naar buiten opent in een nieuw tabblad en zegt dat ook.
 */
export function Regel({ tekst }: { tekst: Tekst }) {
  return (
    <>
      {tekst.map((stuk, i) => {
        if (typeof stuk === 'string') return <span key={i}>{schrijfNaam(stuk)}</span>;
        if ('href' in stuk) {
          const extern = stuk.extern;
          return (
            <a
              key={i}
              href={stuk.href}
              {...(extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="font-semibold text-wijn underline decoration-blos-diep decoration-1 underline-offset-2 transition hover:decoration-wijn"
            >
              {schrijfNaam(stuk.tekst)}
              {extern && <span aria-hidden="true"> ↗</span>}
              {extern && <span className="sr-only"> (opent op een andere website)</span>}
            </a>
          );
        }
        return (
          <strong key={i} className="font-bold text-inkt">
            {schrijfNaam(stuk.tekst)}
          </strong>
        );
      })}
    </>
  );
}

/** Een rijtje alinea's uit de redactielaag. */
export function Alineas({ tekst, className = '' }: { tekst?: Tekst[]; className?: string }) {
  if (!tekst?.length) return null;
  return (
    <>
      {tekst.map((regel, i) => (
        <p key={i} className={`max-w-[68ch] leading-relaxed text-inkt-zacht ${i ? 'mt-4' : ''} ${className}`}>
          <Regel tekst={regel} />
        </p>
      ))}
    </>
  );
}

/** De opsomming met het saliegroene bolletje ervoor. */
export function Punten({ punten }: { punten?: Tekst[] }) {
  if (!punten?.length) return null;
  return (
    <ul className="mt-5 grid max-w-[68ch] gap-2.5">
      {punten.map((punt, i) => (
        <li key={i} className="relative pl-6 leading-relaxed text-inkt-zacht">
          <span
            aria-hidden="true"
            className="absolute left-0.5 top-[0.65em] h-2 w-2 rounded-full bg-salie"
          />
          <Regel tekst={punt} />
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Knoppen                                                            */
/* ------------------------------------------------------------------ */

export function knopStijl(soort: 'hoofd' | 'rand' | 'licht' | 'rand-licht' = 'hoofd'): string {
  const stijl = {
    hoofd: 'border-wijn bg-wijn text-white hover:bg-wijn-diep hover:border-wijn-diep',
    rand: 'border-wijn bg-transparent text-wijn hover:bg-blos',
    licht: 'border-white bg-white text-wijn hover:bg-blos hover:border-blos',
    'rand-licht': 'border-white/45 bg-transparent text-white hover:bg-white/10 hover:border-white',
  }[soort];
  return `inline-flex min-h-[2.9rem] items-center justify-between gap-3 rounded-full border px-[1.15rem] py-[0.72rem] text-[0.88rem] font-extrabold leading-tight no-underline transition hover:-translate-y-0.5 ${stijl}`;
}

export function Knop({
  href,
  children,
  soort = 'hoofd',
  pijl = true,
  extern = false,
  className = '',
  ...rest
}: {
  href: string;
  children: ReactNode;
  soort?: 'hoofd' | 'rand' | 'licht' | 'rand-licht';
  /** De pijl achter het label, zoals in het vastgestelde voorstel. */
  pijl?: boolean;
  extern?: boolean;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={`${knopStijl(soort)} ${className}`}
      {...(extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <span>{children}</span>
      {pijl && <span aria-hidden="true">{extern ? '↗' : '→'}</span>}
    </a>
  );
}

/** Een tekstlink die geen knop is maar wel een vervolgstap. */
export function Tekstlink({ href, children, extern = false }: { href: string; children: ReactNode; extern?: boolean }) {
  return (
    <a
      href={href}
      {...(extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="font-bold text-wijn no-underline hover:underline"
    >
      {children}
    </a>
  );
}

/**
 * De knoppenrij onder een blok. Eén hoofdknop, en wat erachter komt krijgt
 * vanzelf de rustiger vorm: twee knoppen die even hard roepen zijn er geen.
 */
export function Acties({
  acties,
  licht = false,
  marge = true,
}: {
  acties?: Actie[];
  licht?: boolean;
  /** Uit waar het omliggende blok de ruimte er al boven zet. */
  marge?: boolean;
}) {
  if (!acties?.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-3 max-sm:grid ${marge ? 'mt-6' : ''}`}>
      {acties.map((actie, i) => {
        if (actie.soort === 'tekst') {
          return (
            <Tekstlink key={actie.href + i} href={actie.href} extern={actie.href.startsWith('http')}>
              {actie.label}
            </Tekstlink>
          );
        }
        const hoofd = actie.soort === 'hoofd' && i === 0;
        const soort = licht ? (hoofd ? 'licht' : 'rand-licht') : hoofd ? 'hoofd' : 'rand';
        return (
          <Knop
            key={actie.href + i}
            href={actie.href}
            soort={soort}
            extern={actie.href.startsWith('http')}
            className="max-sm:w-full max-sm:justify-between"
          >
            {actie.label}
          </Knop>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Koppen                                                             */
/* ------------------------------------------------------------------ */

export function Kicker({ children, licht = false }: { children: ReactNode; licht?: boolean }) {
  return (
    <p
      className={`mb-2.5 text-[0.73rem] font-extrabold uppercase tracking-[0.12em] ${
        licht ? 'text-white/70' : 'text-wijn'
      }`}
    >
      {children}
    </p>
  );
}

export function Kop({
  kicker,
  titel,
  intro,
  id,
  licht = false,
  klein = false,
}: {
  kicker?: string;
  titel: ReactNode;
  intro?: ReactNode;
  id?: string;
  licht?: boolean;
  klein?: boolean;
}) {
  return (
    <header>
      {kicker && <Kicker licht={licht}>{kicker}</Kicker>}
      <h2
        id={id}
        className={`max-w-[22ch] ${
          klein ? 'text-xl md:text-2xl' : 'text-[1.75rem] md:text-[2.15rem] lg:text-[2.65rem]'
        } ${licht ? 'text-white' : ''}`}
      >
        {titel}
      </h2>
      {intro && (
        <p className={`mt-4 max-w-[72ch] text-[1.04rem] leading-relaxed ${licht ? 'text-white/80' : 'text-inkt-zacht'}`}>
          {intro}
        </p>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Waar je bent                                                       */
/* ------------------------------------------------------------------ */

/**
 * Het kruimelpad boven een pagina. Wie via Google of een gedeelde link ergens
 * middenin de site binnenkomt, ziet zo meteen waar hij terecht is gekomen en
 * hoe hij terugloopt.
 */
export function Kruimels({ pad }: { pad: Kruimel[] }) {
  if (!pad.length) return null;
  return (
    <nav aria-label="Kruimelpad" className="pt-5 pb-0.5">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8rem] text-grijs max-sm:flex-nowrap max-sm:overflow-hidden">
        {pad.map((stap, i) => (
          <li key={stap.label + i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 flex-none text-inkt/25" aria-hidden="true" />}
            {stap.href ? (
              <a href={stap.href} className="no-underline hover:text-wijn hover:underline">
                {stap.label}
              </a>
            ) : (
              <span aria-current="page" className="truncate text-inkt-zacht">
                {stap.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Kaarten                                                            */
/* ------------------------------------------------------------------ */

/** De vlakken waar de kaarten om en om in staan: wit, zeegroen, salie, roze. */
const KAARTTINT = ['bg-white', 'bg-teal-licht', 'bg-salie-licht', 'bg-blos'];
const ICOONTINT = ['bg-blos text-wijn', 'bg-teal-diep text-teal', 'bg-salie-diep text-salie-tekst'];

export function IcoonVlak({ naam, i = 0 }: { naam?: string | null; i?: number }) {
  if (!naam) return null;
  return (
    <div
      aria-hidden="true"
      className={`grid h-[2.65rem] w-[2.65rem] flex-none place-items-center rounded-full shadow-[0_4px_12px_rgba(61,38,45,0.08)] ${
        ICOONTINT[i % 3]
      }`}
    >
      <Icoon naam={naam} className="h-[1.42rem] w-[1.42rem]" />
    </div>
  );
}

/**
 * Eén kaart uit het raster: een icoon, een kop, wat tekst en onderaan de
 * vervolgstap. De knop staat altijd op dezelfde hoogte, ook als de ene kaart
 * meer tekst heeft dan de andere.
 */
export function Kaart({
  icoon,
  kop,
  i = 0,
  vlak = true,
  children,
  acties,
}: {
  icoon?: string | null;
  kop: string;
  i?: number;
  /** Uit voor een raster dat zijn eigen achtergrond zet. */
  vlak?: boolean;
  children?: ReactNode;
  acties?: Actie[];
}) {
  return (
    <article
      className={`flex flex-col rounded-[1.25rem] border border-lijn p-[1.4rem] shadow-[0_8px_24px_rgba(55,28,38,0.04)] ${
        vlak ? KAARTTINT[i % 4] : 'bg-white'
      }`}
    >
      <IcoonVlak naam={icoon} i={i} />
      <h3 className={`${icoon ? 'mt-3.5' : ''} mb-2 text-[1.16rem]`}>{schrijfNaam(kop)}</h3>
      <div className="text-inkt-doffer [&>p]:leading-relaxed">{children}</div>
      {acties?.length ? (
        <div className="mt-auto pt-4">
          <Acties acties={acties} marge={false} />
        </div>
      ) : null}
    </article>
  );
}

/** Het raster waar die kaarten in staan: twee kolommen, één op een telefoon. */
export function Kaartraster({ kolommen = 2, children }: { kolommen?: 2 | 3; children: ReactNode }) {
  return (
    <div
      className={`mt-6 grid gap-4 ${
        kolommen === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'
      }`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  De grens tussen ontmoeting en zorg                                 */
/* ------------------------------------------------------------------ */

/**
 * Het blokje dat zegt waar Toon over Leven ophoudt en de huisarts begint.
 *
 * Het staat op bijna elke inhoudelijke pagina, en dat is precies de bedoeling:
 * een inloophuis is geen behandeling, en iemand die daar op hoopt hoort dat
 * hier te lezen en niet pas aan tafel.
 */
export function Zorggrens({ kop, children }: { kop: string; children: ReactNode }) {
  return (
    <aside className="relative mt-4 rounded-[0.9rem] border border-zorg-lijn bg-zorg py-4 pl-[3.6rem] pr-5">
      <span
        aria-hidden="true"
        className="absolute left-[1.15rem] top-[1.05rem] grid h-7 w-7 place-items-center rounded-full bg-wijn font-display font-bold text-white"
      >
        i
      </span>
      <strong className="text-wijn-diep">{schrijfNaam(kop)}</strong>
      <div className="mt-1 text-[0.9rem] leading-relaxed text-inkt-zacht">{children}</div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Verder lezen bij een ander                                         */
/* ------------------------------------------------------------------ */

/**
 * Een kaart naar KWF, Kanker.nl, IPSO of het AYA Zorgnetwerk. Medische uitleg
 * hoort bij de organisatie die hem onderhoudt, niet als kopie op deze site.
 */
export function BronKaart({ bron }: { bron: Bron }) {
  return (
    <a
      href={bron.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-[1.25rem] border border-lijn bg-white p-5 no-underline shadow-[0_7px_20px_rgba(55,28,38,0.04)] transition hover:-translate-y-0.5 hover:border-blos-diep"
    >
      <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-teal">
        {bron.bron}
      </span>
      <strong className="my-2 font-display text-[1.15rem] font-medium leading-tight text-wijn-diep">
        {bron.kop}
      </strong>
      <span className="text-[0.86rem] leading-relaxed text-grijs">{bron.tekst}</span>
      <span className="mt-auto pt-3.5 text-[0.82rem] font-extrabold text-wijn">
        {bron.label} <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opent op een andere website)</span>
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  De uitnodiging naast de pagina                                     */
/* ------------------------------------------------------------------ */

/**
 * Het zeegroene vlak dat op elke pagina meeloopt: je hoeft nog niet te weten
 * wat je zoekt. Er staat altijd een manier om iemand te bereiken in, want dat
 * is waar het hele blok voor bedoeld is.
 */
export function ContactKaart({
  kicker,
  kop,
  tekst,
  acties,
}: {
  kicker?: string;
  kop: string;
  tekst?: Tekst[];
  acties?: Actie[];
}) {
  return (
    <div className="rounded-[1.25rem] bg-gradient-to-br from-teal-licht to-[#f4f8f6] p-6 shadow-[var(--shadow-zacht)]">
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 className="mb-2.5 text-[1.25rem] text-inkt">{schrijfNaam(kop)}</h2>
      {tekst?.map((regel, i) => (
        <p key={i} className="text-[0.9rem] leading-relaxed text-[#4f5f5e]">
          <Regel tekst={regel} />
        </p>
      ))}
      {acties?.length ? (
        <div className="mt-4 grid gap-2.5">
          {acties.map((actie, i) =>
            actie.soort === 'tekst' ? (
              <a
                key={actie.href + i}
                href={actie.href}
                className="text-[0.85rem] font-bold text-wijn no-underline hover:underline"
              >
                {actie.label}
              </a>
            ) : (
              <Knop key={actie.href + i} href={actie.href} className="w-full justify-between">
                {actie.label}
              </Knop>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Hetzelfde blok, maar dan midden in een pagina en in het roze. Voor waar de
 * uitnodiging niet naast maar onder de tekst hoort.
 */
export function Uitnodiging({
  titel,
  tekst,
  children,
  className = '',
}: {
  titel: string;
  tekst: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.25rem] bg-blos p-6 md:p-8 ${className}`}>
      <h3 className="text-xl md:text-2xl">{schrijfNaam(titel)}</h3>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-inkt-zacht">{schrijfNaam(tekst)}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  De regel met de geruststellingen                                   */
/* ------------------------------------------------------------------ */

export type Merkje = { icoon: ComponentType<{ className?: string }>; tekst: string };

/**
 * De dingen waar iemand over twijfelt voordat hij aanbelt: kost het geld, heb
 * ik een verwijzing nodig, mag ik hier wel komen. Korte antwoorden, geen
 * kaarten en geen kopjes.
 */
export function Merkjes({ merkjes }: { merkjes: Merkje[] }) {
  const tint = ['bg-blos-diep text-wijn', 'bg-teal-diep text-teal', 'bg-salie-diep text-salie-tekst'];
  return (
    <ul className="flex flex-wrap gap-x-7 gap-y-3">
      {merkjes.map((merkje, i) => {
        const Ic = merkje.icoon;
        return (
          <li key={merkje.tekst} className="flex items-center gap-2.5 text-[15px] text-inkt-zacht">
            <span className={`grid h-8 w-8 flex-none place-items-center rounded-full ${tint[i % tint.length]}`}>
              <Ic className="h-4 w-4" />
            </span>
            {merkje.tekst}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * De regel onder de kop van een kennis- of antwoordpagina: wanneer de tekst
 * voor het laatst is nagekeken, waar de bronnen staan, en dat dit algemene
 * informatie is en geen medisch advies.
 *
 * De opdrachtgever vraagt hier in zijn eigen eisen om, en terecht: wie op
 * internet leest wat kanker met je energie doet, hoort te kunnen zien hoe oud
 * dat antwoord is en wie het nagekeken heeft.
 */
export function Vertrouwensregel({ delen }: { delen: Tekst[] }) {
  if (!delen.length) return null;
  return (
    <aside
      aria-label="Informatie over deze inhoud"
      className="mb-6 flex flex-wrap gap-x-6 gap-y-1.5 rounded-[0.8rem] border border-lijn bg-room-diep px-4 py-3 text-[0.76rem] text-grijs"
    >
      {delen.map((deel, i) => (
        <span key={i}>
          <Regel tekst={deel} />
        </span>
      ))}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Een sectie op een pagina die uit het beheer komt                   */
/* ------------------------------------------------------------------ */

/**
 * Eén sectie. Bewust weinig varianten: de klacht over de oude site was dat het
 * een stapel blokken is, dus hier is de standaard een rustig vlak met ruimte
 * eromheen en niets eromheen getekend.
 */
export function Sectie({
  id,
  kleur = 'room',
  breed = false,
  className = '',
  children,
}: {
  id?: string;
  kleur?: 'room' | 'room-diep' | 'blos' | 'wijn' | 'teal';
  /** Zonder de binnenmarge, voor een sectie die zelf een strook tot de rand zet. */
  breed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const vlak = {
    room: 'bg-room',
    'room-diep': 'bg-room-diep',
    blos: 'bg-blos',
    wijn: 'bg-wijn text-white',
    teal: 'bg-teal-licht',
  }[kleur];
  return (
    <section id={id} className={`relative ${vlak} ${className}`}>
      <div className={`mx-auto max-w-[1180px] py-12 md:py-16 ${breed ? '' : 'px-4 sm:px-5'}`}>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  De kop van een pagina                                              */
/* ------------------------------------------------------------------ */

/**
 * Elke pagina begint hetzelfde: waar je bent, wat dit is, wat je hier kunt
 * doen, en een foto ernaast van hoe het er werkelijk aan toegaat.
 *
 * Alles staat er meteen, zonder dat er iets ingeladen of opengeklapt hoeft te
 * worden. Op een telefoon komt de foto boven de tekst en loopt hij tot buiten
 * de marge door, precies zoals in het vastgestelde voorstel.
 */
export function PaginaHero({
  kicker,
  titel,
  lead,
  onder,
  knoppen,
  merkjes,
  foto,
  eersteFoto = false,
  variant = 'gewoon',
  smal = false,
}: {
  kicker?: string;
  titel: ReactNode;
  lead?: ReactNode;
  /** De regel onder de knoppen: praten hoeft niet, ook voor naasten. */
  onder?: ReactNode;
  knoppen?: ReactNode;
  merkjes?: Merkje[];
  foto?: { src: string; alt: string; bijschrift?: string };
  /** De voorpagina laadt zijn hero met voorrang; de rest niet. */
  eersteFoto?: boolean;
  variant?: 'gewoon' | 'home' | 'route';
  /** Zonder foto: dan mag de tekst niet over de volle breedte uitwaaieren. */
  smal?: boolean;
}) {
  return (
    <section
      className={`overflow-hidden pt-7 pb-9 md:pt-12 md:pb-14 ${
        variant === 'home' ? 'bg-gradient-to-b from-room to-[#fbf5f3]' : 'bg-room'
      }`}
    >
      <Schil
        className={
          foto
            ? 'grid items-center gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(24rem,1.12fr)] lg:gap-14 max-lg:flex max-lg:flex-col-reverse'
            : ''
        }
      >
        <div className={smal || !foto ? 'max-w-[46rem]' : 'max-w-[42rem]'}>
          {kicker && <Kicker>{kicker}</Kicker>}
          <h1 className="mb-4 max-w-[18ch] text-[2.45rem] font-medium md:text-[3.4rem] lg:text-[4.25rem] max-sm:text-[clamp(2.1rem,11vw,3.2rem)]">
            {titel}
          </h1>
          {lead && (
            <p className="max-w-[58ch] text-[1.05rem] leading-relaxed text-inkt-zacht md:text-[1.12rem]">
              {lead}
            </p>
          )}
          {knoppen && <div className="mt-7 flex flex-wrap items-center gap-3 max-sm:grid">{knoppen}</div>}
          {merkjes && (
            <div className="mt-7">
              <Merkjes merkjes={merkjes} />
            </div>
          )}
          {onder && <p className="mt-6 max-w-[58ch] text-[0.95rem] text-inkt-zacht">{onder}</p>}
        </div>

        {foto && (
          <figure
            className={`relative m-0 min-h-[22rem] overflow-hidden bg-blos shadow-[var(--shadow-zacht)] max-sm:min-h-[15.5rem] max-sm:shadow-none ${
              variant === 'route' ? 'beeldvlak--route' : 'beeldvlak'
            }`}
          >
            <img
              src={foto.src}
              alt={foto.alt}
              className="absolute inset-0 h-full w-full object-cover"
              width={1400}
              height={1000}
              loading={eersteFoto ? 'eager' : 'lazy'}
              fetchPriority={eersteFoto ? 'high' : undefined}
              decoding="async"
            />
            {foto.bijschrift && (
              <figcaption className="absolute bottom-2.5 right-3 rounded-full bg-white/85 px-2 py-1 text-[0.62rem] text-grijs">
                {foto.bijschrift}
              </figcaption>
            )}
          </figure>
        )}
      </Schil>
    </section>
  );
}
