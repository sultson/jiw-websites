import { Facebook, FileText, Instagram } from 'lucide-react';
import { SPONSORS, VOETMENU } from '../navigatie';
import { VERANTWOORDING } from '../documenten';
import type { Sponsor } from '../content/types';
import {
  FACEBOOK,
  INSTAGRAM,
  IPSO,
  KVK,
  MAIL,
  PLAATS,
  POSTCODE,
  RSIN,
  STRAAT,
  Schil,
  TEL,
  TEL_LINK,
} from '../ui';

/**
 * De voet is het enige donkere vlak van de site, precies zoals in de
 * vastgestelde mock-up: het merk links en vier kolommen met wegwijzers ernaast.
 *
 * Wat de mock-up niet had en hier wél moet staan: het adres, de nummers van de
 * stichting en de stukken die een ANBI openbaar hoort te maken. Het adres hoort
 * bij het merkblok, want daar staat wie we zijn en waar we zitten bij elkaar.
 * De stukken kregen een eigen strook onder de kolommen: als zesde kolom zouden
 * ze het raster van de mock-up scheeftrekken, en zo blijven ze op elke breedte
 * te lezen.
 */
export default function Voet({ sponsoren = [] }: { sponsoren?: Sponsor[] }) {
  return (
    <footer className="bg-voet pt-16 text-voet-tekst">
      <Schil>
        <div className="grid gap-x-9 gap-y-10 pb-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.25fr_repeat(4,1fr)]">
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
            <a href="/" className="inline-block" aria-label="Toon over Leven, naar de voorpagina">
              <img
                src="/img/logo.png"
                alt="Toon over Leven"
                width={1369}
                height={606}
                className="h-[2.9rem] w-auto"
                loading="lazy"
              />
            </a>
            <p className="mt-5 max-w-[30ch] text-[0.85rem] leading-relaxed">
              Een ontmoetingsplek voor mensen die leven met of na kanker en voor hun naasten.
            </p>
            <address className="mt-5 space-y-1 text-[0.85rem] not-italic leading-relaxed">
              <p>{STRAAT}</p>
              <p>
                {POSTCODE} {PLAATS}
              </p>
              <p className="pt-2">
                <a href={TEL_LINK} className="text-white/85 no-underline hover:text-white hover:underline">
                  {TEL}
                </a>
              </p>
              <p>
                <a href={`mailto:${MAIL}`} className="text-white/85 no-underline hover:text-white hover:underline">
                  {MAIL}
                </a>
              </p>
            </address>
            <div className="mt-5 flex gap-3">
              <a
                href={FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Toon over Leven op Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-voet-lijn text-white/85 transition-colors hover:border-white hover:text-white"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Toon over Leven op Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-voet-lijn text-white/85 transition-colors hover:border-white hover:text-white"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {VOETMENU.map((kolom) => (
            <nav key={kolom.kop} aria-label={kolom.kop}>
              <h2 className="mb-4 font-sans text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white">
                {kolom.kop}
              </h2>
              {kolom.links.map((link) => (
                <a
                  key={link.pad}
                  href={link.pad}
                  className="my-[0.48rem] block text-[0.85rem] text-white/85 no-underline hover:text-white hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        {sponsoren.length > 0 && <Sponsorstrook sponsoren={sponsoren} />}

        {/* Een ANBI hoort haar beleidsplan en jaarstukken openbaar te maken, en
            een bezoeker hoort ze te kunnen vinden zonder te hoeven zoeken. */}
        <div className="border-t border-voet-lijn py-7">
          <h2 className="mb-4 font-sans text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white">
            Beleid en jaarstukken
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
            {VERANTWOORDING.map((stuk) => (
              <li key={stuk.bestand}>
                <a
                  href={stuk.bestand}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[0.85rem] text-white/85 no-underline hover:text-white hover:underline"
                >
                  <FileText className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                  {stuk.naam}
                  <span className="text-voet-tekst/70">{stuk.grootte} pdf</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Onderin blijft de rechterhoek leeg en staat er extra ruimte onder:
            daar zweeft de contactknop, en die hoort geen regel af te dekken. */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-voet-lijn py-[1.1rem] pb-24 text-[0.75rem] text-voet-tekst/85 sm:pb-[1.1rem] sm:pr-56">
          <p>
            Stichting Toon Hermans Huis Zeewolde, sinds 1 juli 2026 Toon over Leven. KvK {KVK}, RSIN
            en ANBI-nummer {RSIN}.
          </p>
          <p>
            Aangesloten bij{' '}
            <a
              href={IPSO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/85 no-underline hover:text-white hover:underline"
            >
              IPSO
            </a>
          </p>
        </div>
      </Schil>
    </footer>
  );
}

/**
 * De logo's van de sponsoren, op elke pagina.
 *
 * Ze staan boven de jaarstukken en niet tussen de kolommen: de voet is de plek
 * waar de site verantwoording aflegt, en wie het huis betaalt hoort daarbij.
 * In grijstinten, want ze mogen op geen enkele pagina harder roepen dan de
 * inhoud erboven; kleur komt terug zodra je er met de muis overheen gaat, en
 * daarmee is meteen te zien dat er iets achter zit.
 *
 * De volgorde is die uit het beheer, dus de stichting bepaalt zelf wie vooraan
 * staat. Een logo is een link naar het bedrijf zelf; van wie geen adres in het
 * beheer staat, staat het logo er zonder link, want een dode link is erger dan
 * geen link.
 */
function Sponsorstrook({ sponsoren }: { sponsoren: Sponsor[] }) {
  return (
    <div className="border-t border-voet-lijn py-7">
      <h2 className="mb-4 font-sans text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white">
        Mogelijk gemaakt door
      </h2>
      <ul className="flex flex-wrap items-center gap-2.5">
        {sponsoren.map((sponsor) => (
          <li key={sponsor.naam}>
            <Sponsorlogo sponsor={sponsor} />
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <a
          href={SPONSORS.pad}
          className="text-[0.85rem] text-white/85 no-underline hover:text-white hover:underline"
        >
          {SPONSORS.label}
        </a>
      </p>
    </div>
  );
}

function Sponsorlogo({ sponsor }: { sponsor: Sponsor }) {
  /* De logo's staan op wit ingebrand, dus ze krijgen hier een wit plaatje
     onder zich in plaats van een witte rand die niet klopt met de voet. */
  const plaat = 'grid h-11 w-[6.5rem] place-items-center rounded-[0.6rem] bg-white/90 px-2';
  const beeld = (
    <img
      src={sponsor.strook}
      alt={sponsor.naam}
      className="max-h-7 w-auto max-w-full object-contain grayscale transition-[filter] group-hover:grayscale-0"
      loading="lazy"
      decoding="async"
    />
  );

  if (!sponsor.web) return <div className={plaat}>{beeld}</div>;
  return (
    <a
      href={sponsor.web}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${plaat} transition-colors hover:bg-white`}
    >
      {beeld}
      <span className="sr-only"> (opent in een nieuw tabblad)</span>
    </a>
  );
}
