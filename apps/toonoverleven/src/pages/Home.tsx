import {
  ArrowRight,
  CalendarDays,
  Clock,
  DoorOpen,
  HandHeart,
  Heart,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import type { Activiteit, Bericht, Teksten } from '../content/types';
import { beginTijd, dagNaam, eerstvolgende, maandNaam, perActiviteit } from '../agenda/model';
import NieuwsStrook from '../components/NieuwsStrook';
import AgendaKaart from '../components/AgendaKaart';
import { VRAGEN } from '../vragen';
import {
  Knop,
  Kop,
  MAIL,
  PLAATS,
  PaginaHero,
  STRAAT,
  Sectie,
  TEL,
  TEL_LINK,
  Uitnodiging,
} from '../ui';

/**
 * De voorpagina heeft één taak: iemand binnenhalen.
 *
 * Dus niet beginnen bij de agenda maar bij de bezoeker: dit is wat het is,
 * dit zijn de vier situaties waarin mensen hier binnenlopen, en dit is wat er
 * de komende weken te doen is. De rest heeft een eigen pagina, want alles op
 * één stapel was precies wat er mis was.
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
  const binnenkort = perActiviteit(agenda.filter((a) => a.soort === 'activiteit')).slice(0, 4);
  const eerste = eerstvolgende(agenda);

  return (
    <>
      <PaginaHero
        titel={teksten.hero.titel}
        lead={teksten.hero.lead}
        eersteFoto
        foto={{
          src: '/img/sfeer-huiskamer.jpg',
          alt: 'Drie bezoekers in gesprek op de bank in de huiskamer, met koffie op tafel',
        }}
        merkjes={[
          { icoon: Wallet, tekst: 'Gratis' },
          { icoon: DoorOpen, tekst: 'Zonder verwijzing' },
          { icoon: Users, tekst: 'Ook voor naasten' },
        ]}
        knoppen={
          <>
            <Knop href="/agenda">
              {teksten.hero.knop} <ArrowRight className="h-4 w-4" />
            </Knop>
            <Knop href="/contact" soort="rand">
              {teksten.hero.knopTwee}
            </Knop>
          </>
        }
      />

      <Situaties eerste={eerste} />

      <Wanneer teksten={teksten} />

      <Binnenkort teksten={teksten} activiteiten={binnenkort} />

      <NieuwsStrook teksten={teksten} berichten={berichten} />

      <VoorWie teksten={teksten} />

      <Meedoen />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Waar ben je naar op zoek?                                          */
/* ------------------------------------------------------------------ */

/**
 * Niemand komt hier binnen met de vraag "wat staat er in de agenda". Mensen
 * komen binnen met een situatie: ik ben ziek, mijn moeder is ziek, ik ben
 * uitbehandeld, ik ben twintig. Dus begint de site daar, en pas daarna bij het
 * aanbod.
 */
function Situaties({ eerste }: { eerste?: Activiteit }) {
  const kaarten = [
    {
      icoon: DoorOpen,
      tint: 'bg-blos-diep text-wijn',
      kop: 'Ik wil gewoon een keer binnenlopen',
      tekst: 'Donderdagochtend, zonder afspraak. Koffie, een tafel en mensen die het kennen.',
      pad: '/contact',
    },
    {
      icoon: Sparkles,
      tint: 'bg-mint text-groen',
      kop: 'Ik zoek iets om te doen',
      tekst: 'Wandelen, creatief werken of meditatie. Kijk wat er de komende weken is.',
      pad: '/agenda',
    },
    {
      icoon: Users,
      tint: 'bg-salie/60 text-groen',
      kop: 'Iemand die ik ken heeft kanker',
      tekst: 'Partners, kinderen, ouders, collega’s en nabestaanden zijn hier net zo welkom.',
      pad: '/wie-we-zijn#voor-wie',
    },
    {
      icoon: HeartHandshake,
      tint: 'bg-zand text-groen',
      kop: 'Ik ben jong en heb hiermee te maken',
      tekst: 'We bouwen aan een plek voor jongeren, en we doen dat het liefst samen met hen.',
      pad: '/wie-we-zijn#jongeren',
    },
  ];

  return (
    <Sectie kleur="room-diep" className="scroll-mt-24" id="waar-zoek-je">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Kop
          titel="Waar ben je naar op zoek?"
          intro="Je hoeft nog niet te weten wat je nodig hebt. Kies wat het dichtst in de buurt komt."
        />
        {eerste && (
          <p className="flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-[15px] text-inkt/75">
            <span className="stip" aria-hidden="true" />
            Eerstvolgend: {eerste.titel}, {dagNaam(eerste.start)} {eerste.start.getDate()}{' '}
            {maandNaam(eerste.start)} om {beginTijd(eerste)}
          </p>
        )}
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kaarten.map((kaart) => {
          const Icoon = kaart.icoon;
          return (
            <li key={kaart.kop}>
              <a
                href={kaart.pad}
                className="group flex h-full flex-col rounded-3xl border border-lijn bg-white p-6 transition hover:border-wijn/25"
              >
                <span className={`grid h-11 w-11 place-items-center rounded-full ${kaart.tint}`}>
                  <Icoon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg leading-snug">{kaart.kop}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-inkt/70">{kaart.tekst}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-wijn">
                  Lees verder
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Sectie>
  );
}

/* ------------------------------------------------------------------ */
/*  Wanneer de deur openstaat                                          */
/* ------------------------------------------------------------------ */

/**
 * De belangrijkste zin van de site, met daarnaast de vragen die mensen stellen
 * voordat ze aanbellen. Die twee horen bij elkaar: wanneer kan ik komen, en
 * mag ik hier wel komen.
 */
function Wanneer({ teksten }: { teksten: Teksten }) {
  const iconen = [Clock, Heart, HandHeart];
  return (
    <Sectie>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <h2 className="text-2xl leading-tight md:text-[2rem]">{teksten.open.titel}</h2>
          <p className="mt-5 text-lg leading-relaxed text-inkt/75">{teksten.open.tekst}</p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {teksten.open.punten.map((punt, i) => {
              const Icoon = iconen[i % iconen.length];
              return (
                <li key={punt.kop}>
                  <Icoon className="h-5 w-5 text-wijn" />
                  <p className="mt-2.5 font-semibold">{punt.kop}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-inkt/65">{punt.tekst}</p>
                </li>
              );
            })}
          </ul>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-lijn pt-6 text-[15px]">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-wijn" />
              <div>
                <dt className="font-semibold">
                  {STRAAT}, {PLAATS}
                </dt>
                <dd className="text-inkt/65">Een gewoon huis, geen wachtkamer</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 flex-none text-wijn" />
              <div>
                <dt className="font-semibold">
                  <a href={TEL_LINK} className="hover:underline">
                    {TEL}
                  </a>
                </dt>
                <dd className="text-inkt/65">Liever eerst even bellen? Dat mag</dd>
              </div>
            </div>
          </dl>

          <div className="mt-8">
            <Knop href="/contact" soort="rand">
              Zo vind je ons <ArrowRight className="h-4 w-4" />
            </Knop>
          </div>
        </div>

        {/* De vragen die iemand liever niet hardop stelt. Ze staan open, want
            een dichtgeklapte lijst leest als iets waar je doorheen moet. */}
        <div className="rounded-3xl bg-blos p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wijn-licht">
            Vragen die we vaker horen
          </p>
          <dl className="mt-6 divide-y divide-wijn/10">
            {VRAGEN.slice(0, 3).map((v) => (
              <div key={v.vraag} className="py-4 first:pt-0 last:pb-0">
                <dt className="font-display text-lg text-wijn">{v.vraag}</dt>
                <dd className="mt-1.5 leading-relaxed text-inkt/75">{v.antwoord}</dd>
              </div>
            ))}
          </dl>
          <a
            href="/wie-we-zijn"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-wijn hover:underline"
          >
            Lees hoe het hier werkt <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Sectie>
  );
}

/* ------------------------------------------------------------------ */
/*  Binnenkort                                                         */
/* ------------------------------------------------------------------ */

function Binnenkort({
  teksten,
  activiteiten,
}: {
  teksten: Teksten;
  activiteiten: Activiteit[];
}) {
  return (
    <Sectie kleur="room-diep">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Kop titel={teksten.agendaBlok.titel} intro={teksten.agendaBlok.lead} />
        <Knop href="/agenda" soort="rand" className="bg-white">
          De hele agenda <ArrowRight className="h-4 w-4" />
        </Knop>
      </div>

      {activiteiten.length > 0 ? (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activiteiten.map((activiteit) => (
            <li key={activiteit.id}>
              <AgendaKaart activiteit={activiteit} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-3xl border border-lijn bg-white p-6 text-inkt/70">
          Er staat op dit moment niets gepland. Bel ons gerust, dan vertellen we wanneer we er weer
          zijn.
        </p>
      )}

      <Uitnodiging
        className="mt-6"
        titel="Weet je niet wat bij je past?"
        tekst="Geen zorgen. Je hoeft niet te weten wat je zoekt. Bel of mail ons, dan denken we met je mee en zoeken we samen iets dat bij jou en je situatie past."
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={TEL_LINK}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-semibold text-wijn transition hover:bg-white/70"
          >
            <Phone className="h-4 w-4" /> {TEL}
          </a>
          <a
            href={`mailto:${MAIL}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-semibold text-wijn transition hover:bg-white/70"
          >
            <Mail className="h-4 w-4" /> {MAIL}
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-wijn/25 px-5 py-2.5 font-semibold text-wijn transition hover:border-wijn"
          >
            <CalendarDays className="h-4 w-4" /> Kom een keer kijken
          </a>
        </div>
      </Uitnodiging>
    </Sectie>
  );
}

/* ------------------------------------------------------------------ */
/*  Voor wie                                                           */
/* ------------------------------------------------------------------ */

function VoorWie({ teksten }: { teksten: Teksten }) {
  return (
    <Sectie>
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <figure className="order-2 lg:order-1">
          <img
            src="/img/sfeer-naasten.jpg"
            alt="Een partner met een arm om de ander heen op de bank"
            className="aspect-[4/3] w-full rounded-3xl object-cover"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="order-1 lg:order-2">
          <Kop kicker={teksten.welkom.kicker} titel={teksten.welkom.titel} />
          {teksten.welkom.alineas.map((alinea) => (
            <p key={alinea} className="mt-5 leading-relaxed text-inkt/75">
              {alinea}
            </p>
          ))}
          <div className="mt-8">
            <Knop href="/wie-we-zijn" soort="rand">
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
            className="group overflow-hidden rounded-3xl border border-lijn bg-white transition hover:border-wijn/25 hover:shadow-lg"
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
              <p className="mt-3 leading-relaxed text-inkt/70">{kaart.tekst}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-wijn">
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
