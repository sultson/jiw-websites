import type { ReactElement } from 'react';
import { Download } from 'lucide-react';
import type { Sponsor, Teksten } from '../content/types';
import Formulier from '../components/Formulier';
import { VERANTWOORDING, type Stuk } from '../documenten';
import { CONTACT } from '../navigatie';
import { DONATIE, Knop, ROUTE, Tekstlink, schrijfNaam } from '../ui';

/**
 * De blokken van de organisatorische en praktische pagina's die niet uit de
 * redactielaag komen, maar uit het beheer, uit de bestanden op onze eigen
 * server of uit een echte handeling: het bericht dat iemand achterlaat, de
 * betaalroute, de logo's, het bestuur, de stukken, de rollen en de route.
 *
 * Redactie.tsx schuift ze op de plek van het vaste blok met hetzelfde id, dus
 * ze staan al in een sectie met zijn eigen ruimte en zijn streep erboven en
 * zetten die hier niet nog eens.
 *
 * Ze vallen allemaal op dezelfde manier terug: staat er niets in het beheer,
 * dan zegt de pagina dat gewoon en wijst ze naar iemand die het wél weet. Een
 * leeg raster of een verzonnen naam is erger dan geen naam.
 */

/**
 * De reisplanner krijgt ons adres als bestemming mee. Welke bus er rijdt weten
 * wij niet en verzinnen we dus niet; de planner weet het wel, en weet ook of
 * hij vandaag rijdt.
 */
const OPENBAAR_VERVOER =
  'https://www.google.com/maps/dir/?api=1&destination=Mazerhard+37%2C+3891+BR+Zeewolde&travelmode=transit';

/* ------------------------------------------------------------------ */
/*  Wat elk blok deelt                                                 */
/* ------------------------------------------------------------------ */

/** Dezelfde kop als de vaste blokken op dezelfde pagina, zodat er één ritme is. */
function Blokkop({ titel, intro }: { titel: string; intro?: string }) {
  return (
    <header className="mb-6">
      <h2 className="max-w-[22ch] text-[1.75rem] md:text-[2.15rem] lg:text-[2.65rem]">
        {schrijfNaam(titel)}
      </h2>
      {intro && (
        <p className="mt-4 max-w-[68ch] leading-relaxed text-inkt-zacht">{schrijfNaam(intro)}</p>
      )}
    </header>
  );
}

/** Wat er staat zolang het beheer op dit punt nog leeg is. */
function Terugval({
  tekst,
  actie,
}: {
  tekst: string;
  actie?: { label: string; href: string };
}) {
  return (
    <div className="rounded-[1.25rem] border border-lijn bg-room-diep p-6">
      <p className="max-w-[62ch] leading-relaxed text-inkt-zacht">{tekst}</p>
      {actie && (
        <p className="mt-3.5">
          <Tekstlink href={actie.href}>{actie.label}</Tekstlink>
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Het bericht dat iemand achterlaat                                  */
/* ------------------------------------------------------------------ */

/**
 * Het formulier met de rustige regel erboven. Het onderwerp kan al ingevuld
 * meekomen, zodat de pagina over vrijwilligerswerk niet begint met een vraag
 * waarvan het antwoord al vaststaat.
 */
export function ContactFormulier({
  teksten,
  onderwerp,
}: {
  teksten: Teksten;
  onderwerp?: string;
}): ReactElement {
  return (
    <div id="bericht">
      <Blokkop titel={teksten.contact.formulierTitel} intro={teksten.contact.formulierTekst} />
      <Formulier onderwerp={onderwerp} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Geven                                                              */
/* ------------------------------------------------------------------ */

/**
 * De echte betaalroute, niet de belofte van een betaalroute. De QR-code is
 * dezelfde die op hun flyer staat en wijst naar hetzelfde betaalverzoek als de
 * knop, zodat het aan tafel en op het scherm hetzelfde werkt.
 */
export function DoneerBlok({ teksten }: { teksten: Teksten }): ReactElement {
  return (
    <div>
      <Blokkop
        titel="Eenmalig geven"
        intro="Je gift komt binnen via het betaalverzoek van onze bank. Je bepaalt zelf het bedrag en je hoeft nergens een account voor te maken."
      />

      <div className="grid gap-6 rounded-[1.25rem] border border-lijn bg-white p-6 shadow-[var(--shadow-kaart)] sm:grid-cols-[auto_1fr] sm:items-center md:p-7">
        <img
          src="/img/qr-donatie.svg"
          alt="QR-code voor een eenmalige gift via het betaalverzoek van de Rabobank"
          width={144}
          height={144}
          className="h-36 w-36 flex-none"
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="leading-relaxed text-inkt-doffer">
            Richt je camera op de code, of gebruik de knop. Allebei komen ze uit bij hetzelfde
            betaalverzoek van de Rabobank.
          </p>
          <div className="mt-5">
            <Knop href={DONATIE} extern className="max-sm:w-full max-sm:justify-between">
              Doe een eenmalige gift
            </Knop>
          </div>
        </div>
      </div>

      <p className="mt-4 max-w-[68ch] text-[0.9rem] leading-relaxed text-grijs">
        Bij de bank staat de stichting nog onder haar oude naam Toon Hermans Huis Zeewolde. Je gift
        komt gewoon bij ons aan.
      </p>

      {teksten.steun.anbi && (
        <p className="mt-6 max-w-[68ch] rounded-[1.25rem] bg-blos px-[1.15rem] py-4 leading-relaxed text-inkt-zacht">
          {schrijfNaam(teksten.steun.anbi)}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wie het huis overeind houden                                       */
/* ------------------------------------------------------------------ */

/** De logo's uit het beheer. Zonder logo's geen leeg raster, maar een vraag. */
export function SponsorBlok({
  sponsoren,
  teksten,
}: {
  sponsoren: Sponsor[];
  teksten: Teksten;
}): ReactElement {
  return (
    <div>
      <Blokkop titel={teksten.steun.sponsorenTitel} intro={teksten.steun.sponsorenTekst} />

      {sponsoren.length ? (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sponsoren.map((sponsor) => (
              <li key={sponsor.naam}>
                <SponsorVlak sponsor={sponsor} />
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Knop href={CONTACT.pad} soort="rand" className="max-sm:w-full max-sm:justify-between">
              Ook sponsor worden
            </Knop>
          </div>
        </>
      ) : (
        <Terugval
          tekst="Er staan nog geen logo’s in het beheer. Steun je het huis als bedrijf, fonds of ondernemer, dan zetten we je logo hier graag neer."
          actie={{ label: 'Neem contact op over sponsoring', href: CONTACT.pad }}
        />
      )}
    </div>
  );
}

function SponsorVlak({ sponsor }: { sponsor: Sponsor }) {
  const vlak = 'grid h-24 place-items-center rounded-[1.25rem] border border-lijn bg-white p-4';
  const beeld = (
    <img
      src={sponsor.beeld}
      alt={sponsor.naam}
      className="max-h-14 w-auto max-w-full object-contain"
      loading="lazy"
      decoding="async"
    />
  );

  if (!sponsor.web) return <div className={vlak}>{beeld}</div>;
  return (
    <a
      href={sponsor.web}
      target="_blank"
      rel="noopener noreferrer"
      className={`${vlak} transition hover:-translate-y-0.5 hover:border-blos-diep`}
    >
      {beeld}
      <span className="sr-only"> (opent in een nieuw tabblad)</span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Wie erover gaat                                                    */
/* ------------------------------------------------------------------ */

type Persoon = Teksten['verantwoording']['bestuur'][number];

/**
 * Bestuur en raad van advies bij naam en rol. Op de pagina over de organisatie
 * staan ze samen, op Onze mensen alleen het bestuur.
 */
export function BestuurBlok({
  teksten,
  advies = false,
}: {
  teksten: Teksten;
  advies?: boolean;
}): ReactElement {
  const bestuur = teksten.verantwoording.bestuur ?? [];
  const raad = teksten.verantwoording.advies ?? [];
  const leeg = bestuur.length === 0 && (!advies || raad.length === 0);

  return (
    <div>
      <Blokkop
        titel={advies ? 'Bestuur en toezicht of advies' : 'Het bestuur'}
        intro="Het bestuur is verantwoordelijk voor de koers, de continuïteit en de verantwoording van de stichting."
      />

      {leeg ? (
        <Terugval
          tekst="Wie er in het bestuur zitten, staat nog niet in het beheer. Wil je dat weten, bel of mail ons dan, dan vertellen we het je meteen."
          actie={{ label: 'Neem contact op', href: CONTACT.pad }}
        />
      ) : (
        <div className={`grid gap-4 ${advies ? 'sm:grid-cols-2' : ''}`}>
          <Namenlijst
            kop="Bestuur"
            mensen={bestuur}
            leegTekst="De samenstelling van het bestuur staat nog niet in het beheer."
          />
          {advies && (
            <Namenlijst
              kop="Raad van advies"
              mensen={raad}
              leegTekst="De raad van advies staat nog niet in het beheer."
            />
          )}
        </div>
      )}
    </div>
  );
}

function Namenlijst({
  kop,
  mensen,
  leegTekst,
}: {
  kop: string;
  mensen: Persoon[];
  leegTekst: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-lijn bg-white p-6 shadow-[var(--shadow-kaart)]">
      <h3 className="font-sans text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-wijn">
        {kop}
      </h3>
      {mensen.length ? (
        <ul className="mt-4 grid gap-3.5">
          {mensen.map((mens) => (
            <li key={mens.naam}>
              <span className="block font-bold text-inkt">{mens.naam}</span>
              <span className="block text-[0.93rem] leading-relaxed text-inkt-doffer">
                {mens.rol}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3.5 leading-relaxed text-inkt-zacht">{leegTekst}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wat een ANBI openbaar hoort te maken                               */
/* ------------------------------------------------------------------ */

/**
 * De stukken zelf, als PDF op onze eigen server. Een ANBI moet ze publiceren,
 * en publiceren is meer dan zeggen dat ze bestaan.
 */
export function DocumentenBlok({
  stukken = VERANTWOORDING,
  titel = 'Beleidsplan en jaarstukken',
  intro = 'Als ANBI maken we deze stukken openbaar. Je kunt ze hier openen of bewaren, zonder je ergens voor op te geven.',
}: {
  /** De lijst die getoond wordt; standaard de stukken die een ANBI openbaar maakt. */
  stukken?: Stuk[];
  titel?: string;
  intro?: string;
} = {}): ReactElement {
  if (!stukken.length) {
    return (
      <div>
        <Blokkop titel={titel} />
        <Terugval
          tekst="De stukken staan op dit moment niet op de site. Vraag ze gerust bij ons op, dan sturen we ze je toe."
          actie={{ label: 'Vraag de stukken op', href: CONTACT.pad }}
        />
      </div>
    );
  }

  return (
    <div>
      <Blokkop titel={titel} intro={intro} />
      <ul className="divide-y divide-lijn overflow-hidden rounded-[1.25rem] border border-lijn bg-white shadow-[var(--shadow-kaart)]">
        {stukken.map((stuk) => (
          <li key={stuk.bestand}>
            <a
              href={stuk.bestand}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 no-underline transition hover:bg-room-diep"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 flex-none place-items-center rounded-full bg-blos text-wijn"
              >
                <Download className="h-[1.15rem] w-[1.15rem]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-inkt group-hover:underline">{stuk.naam}</span>
                {stuk.over && (
                  <span className="mt-0.5 block text-[0.93rem] leading-relaxed text-inkt-doffer">
                    {stuk.over}
                  </span>
                )}
              </span>
              <span className="mt-0.5 flex-none text-[0.82rem] text-grijs">
                pdf, {stuk.grootte}
                <span className="sr-only"> (opent in een nieuw tabblad)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Meedoen                                                            */
/* ------------------------------------------------------------------ */

/** De rollen zoals ze in het beheer staan, met wat er per rol bij komt kijken. */
export function VrijwilligerBlok({ teksten }: { teksten: Teksten }): ReactElement {
  const rollen = teksten.vrijwilliger.rollen ?? [];

  return (
    <div>
      <Blokkop titel="Wat kun je doen?" intro={teksten.vrijwilliger.lead} />

      {rollen.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {rollen.map((rol, i) => (
            <article
              key={rol.kop}
              className={`flex flex-col rounded-[1.25rem] border border-lijn p-[1.4rem] shadow-[var(--shadow-kaart)] ${
                i % 2 ? 'bg-salie-licht' : 'bg-white'
              }`}
            >
              <h3 className="text-[1.16rem]">{schrijfNaam(rol.kop)}</h3>
              <p className="mt-2 leading-relaxed text-inkt-doffer">{schrijfNaam(rol.tekst)}</p>
              {rol.punten?.length ? (
                <ul className="mt-4 grid gap-2.5">
                  {rol.punten.map((punt) => (
                    <li key={punt} className="relative pl-6 leading-relaxed text-inkt-doffer">
                      <span
                        aria-hidden="true"
                        className="absolute left-0.5 top-[0.65em] h-2 w-2 rounded-full bg-salie"
                      />
                      {schrijfNaam(punt)}
                    </li>
                  ))}
                </ul>
              ) : null}
              {rol.slot && (
                <p className="mt-auto pt-4 text-[0.93rem] leading-relaxed text-inkt-doffer">
                  {schrijfNaam(rol.slot)}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <Terugval
          tekst="Welke rollen er nu open staan, staat nog niet in het beheer. Bel of mail ons gerust, dan vertellen we waar we hulp bij kunnen gebruiken."
          actie={{ label: 'Neem contact op over vrijwilligerswerk', href: CONTACT.pad }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hoe je hier komt                                                   */
/* ------------------------------------------------------------------ */

/** De twee planners, met ons adres er al in. */
export function RouteBlok(): ReactElement {
  return (
    <div>
      <Blokkop
        titel="Route en openbaar vervoer"
        intro="Allebei de knoppen zetten ons adres al klaar als bestemming. Je vult alleen nog in waar je vandaan komt."
      />
      <div className="flex flex-wrap items-center gap-3 max-sm:grid">
        <Knop href={ROUTE} extern className="max-sm:w-full max-sm:justify-between">
          Plan je route
        </Knop>
        <Knop
          href={OPENBAAR_VERVOER}
          soort="rand"
          extern
          className="max-sm:w-full max-sm:justify-between"
        >
          Reis met het openbaar vervoer
        </Knop>
      </div>
    </div>
  );
}
