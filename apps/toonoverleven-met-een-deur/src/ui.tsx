import type { ReactNode } from 'react';

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
  kleur?: 'room' | 'room-diep' | 'groen' | 'zand';
  /** Zonder de binnenmarge, voor een sectie die zelf een strook tot de rand zet. */
  breed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const vlak = {
    room: 'bg-room',
    'room-diep': 'bg-room-diep',
    groen: 'bg-groen-diep text-white',
    zand: 'bg-zand',
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
            licht ? 'text-salie' : 'text-teal-tekst'
          }`}
        >
          {kicker}
        </p>
      )}
      <h2 className={klein ? 'text-2xl leading-tight md:text-3xl' : 'text-3xl leading-tight md:text-[2.6rem]'}>
        {titel}
      </h2>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${licht ? 'text-white/75' : 'text-groen/75'}`}>
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
    hoofd: 'bg-teal text-white hover:bg-groen shadow-sm',
    rand: 'border border-groen/25 text-groen hover:border-groen/60 hover:bg-white',
    licht: 'bg-white text-groen hover:bg-salie',
    'rand-licht': 'border border-white/35 text-white hover:border-white hover:bg-white/10',
  }[soort];
  return `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition ${stijl}`;
}
