import { ArrowRight, ArrowUpRight, HandCoins, Landmark, ShieldCheck, Users } from 'lucide-react';
import type { Sponsor, Teksten } from '../content/types';
import { DONATIE, Knop, Kop, PaginaHero, SPONSORKLIKS, Sectie } from '../ui';

/** Waar elke manier van steunen heen wijst. Op volgorde van het beheer. */
const BESTEMMING = [DONATIE, '/contact', SPONSORKLIKS, '/vrijwilliger'];
const LABEL = ['Ik word vriend', 'Neem contact op', 'Naar SponsorKliks', 'Word vrijwilliger'];

export default function Steun({
  teksten,
  sponsoren,
}: {
  teksten: Teksten;
  sponsoren: Sponsor[];
}) {
  return (
    <>
      <PaginaHero
        kruimels={[{ label: teksten.steun.kicker }]}
        titel={teksten.steun.titel}
        lead={teksten.steun.lead}
        foto={{
          src: '/img/cheque-rabo.jpg',
          alt: 'De overhandiging van een cheque van Rabo ClubSupport voor de creatieve workshops',
        }}
        merkjes={[
          { icoon: Landmark, tekst: 'ANBI-stichting' },
          { icoon: Users, tekst: 'Niemand in loondienst' },
          { icoon: HandCoins, tekst: 'Geen subsidie' },
        ]}
        knoppen={
          <>
            <Knop href={DONATIE} target="_blank" rel="noreferrer">
              Doe een donatie <ArrowUpRight className="h-4 w-4" />
            </Knop>
            <Knop href="/vrijwilliger" soort="rand">
              Of geef uw tijd
            </Knop>
          </>
        }
      />

      <Sectie kleur="wijn">
        <Kop licht titel="Zo kunt u helpen" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* De QR is dezelfde die zij op hun flyer gebruiken: hij wijst naar
              hun betaalverzoek bij de Rabobank. Opnieuw getekend als vector,
              zodat hij op elk formaat scherp is. */}
          <div className="rounded-3xl bg-white p-7 text-inkt md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-wijn">
              Eenmalige donatie
            </p>
            <h2 className="mt-2 text-2xl">Scan en geef</h2>
            <div className="mt-6 flex items-center gap-6">
              <img
                src="/img/qr-donatie.svg"
                alt="QR-code voor een eenmalige donatie via het betaalverzoek van de Rabobank"
                className="h-36 w-36 flex-none"
                width={144}
                height={144}
              />
              <p className="text-[15px] leading-relaxed text-inkt/70">
                Richt uw camera op de code en u komt direct in het betaalverzoek van de Rabobank. U
                bepaalt zelf het bedrag.
              </p>
            </div>
            <Knop href={DONATIE} target="_blank" rel="noreferrer" className="mt-6 w-full">
              Doe een donatie <ArrowUpRight className="h-4 w-4" />
            </Knop>
            <p className="mt-4 text-sm leading-relaxed text-inkt/55">
              De stichting staat nog onder haar oude naam Toon Hermans Huis Zeewolde geregistreerd.
              Uw gift komt gewoon bij ons aan.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {teksten.steun.manieren.map((manier, i) => {
              const href = BESTEMMING[i] ?? '/contact';
              const extern = href.startsWith('http');
              return (
                <article
                  key={manier.kop}
                  className="flex flex-col rounded-3xl border border-white/15 bg-white/5 p-6"
                >
                  <h3 className="text-lg text-white">{manier.kop}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-white/75">{manier.tekst}</p>
                  <a
                    href={href}
                    {...(extern ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="mt-4 inline-flex items-center gap-1.5 font-semibold text-blos-diep hover:underline"
                  >
                    {LABEL[i] ?? 'Lees verder'}
                    {extern ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </a>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 rounded-3xl border border-white/15 p-7 md:flex-row md:items-center md:p-8">
          <ShieldCheck className="h-8 w-8 flex-none text-blos-diep" />
          <p className="flex-1 leading-relaxed text-white/75">{teksten.steun.anbi}</p>
          <a
            href="/verantwoording"
            className="inline-flex flex-none items-center gap-2 font-semibold text-blos-diep hover:underline"
          >
            Bekijk onze verantwoording <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Sectie>

      <Sectie>
        <Kop
          titel={teksten.steun.sponsorenTitel}
          intro={teksten.steun.sponsorenTekst}
        />

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sponsoren.map((s) => {
            const beeld = (
              <img
                src={s.beeld}
                alt={s.naam}
                className="max-h-14 w-auto max-w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            );
            return (
              <li key={s.naam}>
                {s.web ? (
                  <a
                    href={s.web}
                    target="_blank"
                    rel="noreferrer"
                    title={s.naam}
                    className="grid h-24 place-items-center rounded-2xl border border-lijn bg-white p-4 transition hover:border-inkt/30 hover:shadow-sm"
                  >
                    {beeld}
                  </a>
                ) : (
                  <div
                    title={s.naam}
                    className="grid h-24 place-items-center rounded-2xl border border-lijn bg-white p-4"
                  >
                    {beeld}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Knop href="/contact">
            Ook sponsor worden <ArrowRight className="h-4 w-4" />
          </Knop>
          <p className="max-w-lg text-[15px] text-inkt/60">
            Een jaarlijkse bijdrage, een keer de koffie, of uw vak inzetten voor het huis. We horen
            graag wat bij u past.
          </p>
        </div>
      </Sectie>
    </>
  );
}
