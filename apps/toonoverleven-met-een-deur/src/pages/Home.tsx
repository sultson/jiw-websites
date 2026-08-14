import { ArrowRight, Clock, HandHeart, Heart } from 'lucide-react';
import type { Activiteit, Bericht, Teksten } from '../content/types';
import { eerstvolgende } from '../agenda/model';
import DeurHero from '../components/DeurHero';
import NieuwsStrook from '../components/NieuwsStrook';
import AgendaRij from '../components/AgendaRij';
import { Knop, Kop, Sectie } from '../ui';

/**
 * De voorpagina heeft één taak: iemand binnenhalen.
 *
 * Dus geen samenvatting van de hele stichting, maar de deur, wat er speelt, en
 * wanneer je zomaar kunt binnenlopen. De rest heeft een eigen pagina, want
 * alles op één stapel was precies wat er mis was.
 */
export default function Home({
  teksten,
  agenda,
  berichten,
}: {
  teksten: Teksten;
  agenda: Activiteit[];
  berichten: Bericht[];
}) {
  const binnenkort = agenda.filter((a) => a.soort === 'activiteit').slice(0, 8);

  return (
    <>
      <DeurHero teksten={teksten} eerstvolgend={eerstvolgende(agenda)} />

      {/* Meteen onder de kop en de knoppen: dit is het levendigste van de site
          en het antwoord op de vraag of hier iets gebeurt. */}
      <NieuwsStrook teksten={teksten} berichten={berichten} />

      <Wanneer teksten={teksten} />

      <Sectie kleur="room-diep">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Kop
            kicker={teksten.agendaBlok.kicker}
            titel={teksten.agendaBlok.titel}
            intro={teksten.agendaBlok.lead}
          />
          <a
            href="/agenda"
            className="inline-flex items-center gap-2 rounded-full border border-groen/25 bg-white px-5 py-2.5 font-semibold text-groen transition hover:border-groen/60"
          >
            De hele agenda <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-10">
          <AgendaRij activiteiten={binnenkort} />
        </div>
      </Sectie>

      <VoorWie teksten={teksten} />

      <Meedoen />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Wanneer de deur openstaat                                          */
/* ------------------------------------------------------------------ */

/**
 * Hier stond eerst een rij van vier icoontjes met halve zinnen erbij. Dat leest
 * als een pakket met eigenschappen, terwijl dit de belangrijkste zin van de
 * site is. Nu is het één zin, groot, met de drie dingen eronder waar iemand
 * over twijfelt voordat hij aanbelt.
 */
function Wanneer({ teksten }: { teksten: Teksten }) {
  const iconen = [Clock, Heart, HandHeart];
  return (
    <Sectie>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <h2 className="text-3xl leading-tight md:text-[2.6rem]">{teksten.open.titel}</h2>
          <p className="mt-5 text-lg leading-relaxed text-groen/75">{teksten.open.tekst}</p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {teksten.open.punten.map((punt, i) => {
              const Icoon = iconen[i % iconen.length];
              return (
                <li key={punt.kop}>
                  <Icoon className="h-5 w-5 text-teal-tekst" />
                  <p className="mt-2.5 font-semibold">{punt.kop}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-groen/65">{punt.tekst}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Knop href="/contact" soort="rand">
              Zo vind je ons <ArrowRight className="h-4 w-4" />
            </Knop>
          </div>
        </div>

        <figure>
          <img
            src="/img/huis-buiten.jpg"
            alt="Het pand aan het Mazerhard 37, met bezoekers ervoor"
            className="w-full rounded-3xl object-cover"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="mt-3 text-sm text-groen/55">
            Dit is het huis. Op de foto hangt nog het oude bordje.
          </figcaption>
        </figure>
      </div>
    </Sectie>
  );
}

/* ------------------------------------------------------------------ */
/*  Voor wie                                                           */
/* ------------------------------------------------------------------ */

function VoorWie({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie kleur="groen">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <figure className="order-2 lg:order-1">
          <img
            src="/img/team-groen.jpg"
            alt="Het team van Toon over Leven met bekers en bloemen na de avondvierdaagse"
            className="w-full rounded-3xl object-cover"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="order-1 lg:order-2">
          <Kop licht kicker={teksten.welkom.kicker} titel={teksten.welkom.titel} />
          {teksten.welkom.alineas.map((alinea) => (
            <p key={alinea} className="mt-5 leading-relaxed text-white/75">
              {alinea}
            </p>
          ))}
          <div className="mt-8">
            <Knop href="/wie-we-zijn" soort="licht">
              {teksten.welkom.knop} <ArrowRight className="h-4 w-4" />
            </Knop>
          </div>
        </div>
      </div>
    </Sectie>
  );
}

/* ------------------------------------------------------------------ */
/*  Meedoen                                                            */
/* ------------------------------------------------------------------ */

/**
 * Twee deuren naar buiten, aan het eind van de pagina: helpen en geven. Wie
 * hier komt is vaak niet de bezoeker maar de buurvrouw, de werkgever of het
 * bedrijf uit het dorp.
 */
function Meedoen() {
  const kaarten = [
    {
      pad: '/vrijwilliger',
      kop: 'Vrijwilliger worden',
      tekst: 'Het huis draait op twintig mensen. Een zorgachtergrond is niet nodig, de training krijg je van ons.',
      foto: '/img/kraam-gesprek.jpg',
      alt: 'Twee vrijwilligers met een microfoon bij de kraam op een dorpsevenement',
    },
    {
      pad: '/steun',
      kop: 'Steun het huis',
      tekst: 'We krijgen geen vaste financiering. Een gift, een jaarlijkse bijdrage of uw vak inzetten helpt allemaal.',
      foto: '/img/cheque-rabo.jpg',
      alt: 'De overhandiging van een cheque van Rabo ClubSupport voor de creatieve workshops',
    },
  ];

  return (
    <Sectie>
      <div className="grid gap-6 md:grid-cols-2">
        {kaarten.map((kaart) => (
          <a
            key={kaart.pad}
            href={kaart.pad}
            className="group overflow-hidden rounded-3xl border border-lijn bg-white transition hover:border-teal/40 hover:shadow-lg"
          >
            <img
              src={kaart.foto}
              alt={kaart.alt}
              className="aspect-[16/9] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-7">
              <h2 className="text-2xl">{kaart.kop}</h2>
              <p className="mt-3 leading-relaxed text-groen/70">{kaart.tekst}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-teal-tekst">
                Lees verder
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </Sectie>
  );
}
