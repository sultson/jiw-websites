import type { ComponentType, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

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
 *
 * De spatie na "Toon" is verplicht in het patroon, anders zou het ook door
 * toonoverleven.nl en info@toonoverleven.nl heen lopen.
 */
export function schrijfNaam(tekst: string): string {
  return tekst.replace(/\bToon\s+over\s*leven\b/gi, NAAM);
}

/* ------------------------------------------------------------------ */
/*  Bouwstenen                                                         */
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
  kleur?: 'room' | 'room-diep' | 'blos' | 'wijn';
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
  }[kleur];
  return (
    <section id={id} className={`relative ${vlak} ${className}`}>
      <div className={`mx-auto max-w-6xl py-14 md:py-20 ${breed ? '' : 'px-5 md:px-8'}`}>
        {children}
      </div>
    </section>
  );
}

export function Kop({
  kicker,
  titel,
  intro,
  licht = false,
  klein = false,
}: {
  kicker?: string;
  titel: string;
  intro?: string;
  licht?: boolean;
  klein?: boolean;
}) {
  return (
    <header className="max-w-2xl">
      {kicker && (
        <p
          className={`mb-3 text-sm font-semibold uppercase tracking-[0.16em] ${
            licht ? 'text-white/70' : 'text-wijn-licht'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`${licht ? 'text-white' : ''} ${
          klein ? 'text-xl leading-tight md:text-2xl' : 'text-2xl leading-tight md:text-[2rem]'
        }`}
      >
        {titel}
      </h2>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${licht ? 'text-white/80' : 'text-inkt/75'}`}>
          {intro}
        </p>
      )}
    </header>
  );
}

/**
 * Eén hoofdknop per scherm. De rest is een rand of een tekstlink, zodat er
 * nooit twee knoppen tegelijk om dezelfde aandacht vragen.
 */
export function Knop({
  href,
  children,
  soort = 'hoofd',
  className = '',
  ...rest
}: {
  href: string;
  children: ReactNode;
  soort?: 'hoofd' | 'rand' | 'licht' | 'rand-licht';
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} className={`${knopStijl(soort)} ${className}`} {...rest}>
      {children}
    </a>
  );
}

export function knopStijl(soort: 'hoofd' | 'rand' | 'licht' | 'rand-licht' = 'hoofd'): string {
  const stijl = {
    hoofd: 'bg-wijn text-white hover:bg-wijn-diep shadow-sm',
    rand: 'border border-wijn/30 text-wijn hover:border-wijn hover:bg-white',
    licht: 'bg-white text-wijn hover:bg-blos',
    'rand-licht': 'border border-white/40 text-white hover:border-white hover:bg-white/10',
  }[soort];
  return `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition ${stijl}`;
}

/* ------------------------------------------------------------------ */
/*  Waar je bent                                                       */
/* ------------------------------------------------------------------ */

/**
 * Het kruimelpad boven een pagina. Wie via Google of een gedeelde link ergens
 * middenin de site binnenkomt, ziet zo meteen waar hij terecht is gekomen en
 * hoe hij terugloopt.
 */
export function Kruimels({ pad }: { pad: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Kruimelpad" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-inkt/55">
        <li>
          <a href="/" className="hover:text-wijn hover:underline">
            Home
          </a>
        </li>
        {pad.map((stap) => (
          <li key={stap.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 flex-none text-inkt/30" aria-hidden="true" />
            {stap.href ? (
              <a href={stap.href} className="hover:text-wijn hover:underline">
                {stap.label}
              </a>
            ) : (
              <span aria-current="page" className="text-inkt/75">
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
/*  De drie geruststellingen                                           */
/* ------------------------------------------------------------------ */

export type Merkje = { icoon: ComponentType<{ className?: string }>; tekst: string };

/**
 * De regel onder de knoppen met de dingen waar iemand over twijfelt voordat
 * hij aanbelt: kost het geld, heb ik een verwijzing nodig, mag ik hier wel
 * komen. Drie korte antwoorden, geen kaarten en geen kopjes.
 */
export function Merkjes({ merkjes }: { merkjes: Merkje[] }) {
  const tint = ['bg-blos-diep text-wijn', 'bg-mint text-groen', 'bg-salie/60 text-groen'];
  return (
    <ul className="flex flex-wrap gap-x-7 gap-y-3">
      {merkjes.map((merkje, i) => {
        const Icoon = merkje.icoon;
        return (
          <li
            key={merkje.tekst}
            className="flex items-center gap-2.5 whitespace-nowrap text-[15px] text-inkt/80"
          >
            <span
              className={`grid h-8 w-8 flex-none place-items-center rounded-full ${
                tint[i % tint.length]
              }`}
            >
              <Icoon className="h-4 w-4" />
            </span>
            {merkje.tekst}
          </li>
        );
      })}
    </ul>
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
 * worden. Op een telefoon komt de tekst eerst en de foto eronder, want de kop
 * is waarvoor iemand kwam.
 */
export function PaginaHero({
  kruimels,
  titel,
  lead,
  knoppen,
  merkjes,
  foto,
  eersteFoto = false,
  smal = false,
}: {
  kruimels?: { label: string; href?: string }[];
  titel: ReactNode;
  lead?: string;
  knoppen?: ReactNode;
  merkjes?: Merkje[];
  foto?: { src: string; alt: string };
  /** De voorpagina laadt zijn hero met voorrang; de rest niet. */
  eersteFoto?: boolean;
  /** Zonder foto: dan mag de tekst niet over de volle breedte uitwaaieren. */
  smal?: boolean;
}) {
  return (
    <section className="bg-room">
      <div
        className={`mx-auto grid max-w-6xl gap-10 px-5 pt-6 md:px-8 md:pt-10 ${
          foto ? 'pb-10 md:pb-14 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-14' : 'pb-4 md:pb-6'
        }`}
      >
        <div className={smal ? 'max-w-3xl' : ''}>
          {kruimels && <Kruimels pad={kruimels} />}
          <h1 className="text-[2.35rem] leading-[1.08] md:text-[3.25rem]">{titel}</h1>
          {lead && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-inkt/75">{lead}</p>
          )}
          {knoppen && <div className="mt-8 flex flex-wrap items-center gap-3">{knoppen}</div>}
          {merkjes && (
            <div className="mt-8">
              <Merkjes merkjes={merkjes} />
            </div>
          )}
        </div>

        {foto && (
          <img
            src={foto.src}
            alt={foto.alt}
            className="order-first aspect-[4/3] w-full rounded-[1.75rem] object-cover lg:order-none lg:aspect-[7/5]"
            width={1600}
            height={1067}
            loading={eersteFoto ? 'eager' : 'lazy'}
            fetchPriority={eersteFoto ? 'high' : undefined}
            decoding="async"
          />
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  De uitnodiging                                                     */
/* ------------------------------------------------------------------ */

/**
 * Het roze vlak dat op meerdere pagina's terugkomt: je hoeft nog niet te weten
 * wat je zoekt. Er staat altijd een manier om iemand te bereiken in, want dat
 * is waar het hele blok voor bedoeld is.
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
    <div className={`rounded-3xl bg-blos p-6 md:p-8 ${className}`}>
      <h3 className="text-xl md:text-2xl">{titel}</h3>
      <p className="mt-3 leading-relaxed text-inkt/75">{tekst}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
