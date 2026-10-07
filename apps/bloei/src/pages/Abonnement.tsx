import {ArrowRight, Building2, Flower2, Leaf, Phone, Repeat, Utensils} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {Bullet, KNOP_HOOFD, KNOP_TWEEDE_LICHT, Kicker, Section, TEL, TEL_DISPLAY} from '../ui';

/* ------------------------------------------------------------------ */

/**
 * Het abonnement. Dit is iets anders dan dat van Fleurig!, waar een boeket thuis
 * werd bezorgd: hier gaat het om plantenbakken en vazen die bij een restaurant
 * of een bedrijf blijven staan en die de winkel komt verversen. Deze pagina
 * heette daarom eerst "Zakelijk", maar de winkel wil dat het abonnement blijft
 * heten, dus heet het weer zo — ook in het adres (/abonnement/), want een
 * menu-item dat Abonnement heet en naar /zakelijk/ wijst is een halve
 * hernoeming.
 *
 * NOG TE BEVESTIGEN: er staan met opzet geen prijzen en geen vaste frequenties
 * op deze pagina. Die zijn niet doorgegeven. Wat hier staat is de vorm van de
 * afspraak, niet de voorwaarden.
 */
const VORMEN = [
  {
    icon: Leaf,
    titel: 'Opgemaakte plantenbakken',
    tekst:
      'Een lage bak voor op tafel, een hoge pot bij de ingang, of een rij op het terras. Wij maken ze op met planten die bij de ruimte passen en die het binnen volhouden.',
    punten: [
      'Voor op tafel, bij de entree of op het terras',
      'Keramiek, beton of mand, in de kleur van de zaak',
      'Wij vervangen wat niet meer mooi staat',
    ],
  },
  {
    icon: Flower2,
    titel: 'Vazen met bloemen',
    tekst:
      'Liever snijbloemen dan groen? Dan komen er vazen in plaats van bakken, met wat op dat moment het mooist is. Elke keer anders, en elke keer passend bij het seizoen.',
    punten: [
      'Wisselend met het seizoen',
      'Eén grote vaas of meerdere kleine',
      'Ook de vazen zelf, als u ze nog niet heeft',
    ],
  },
];

const AANPAK: [string, string][] = [
  ['We komen langs', 'Eerst kijken wat er is: hoeveel licht, welke kleuren staan er al, en waar zou het moeten staan.'],
  ['U krijgt een voorstel', 'Wat voor bakken of vazen, welke beplanting, hoe vaak we langskomen en wat het kost.'],
  ['We zetten het neer', 'Wij maken het op in de winkel en zetten het bij u neer. U hoeft niets te doen.'],
  ['We komen verversen', 'Op het ritme dat u koos. Overslaan of stoppen kan altijd, u zit nergens aan vast.'],
];

const VOOR = [
  {icon: Utensils, kop: 'Restaurants en cafés', onder: 'Op tafel, op de bar en bij de ingang'},
  {icon: Building2, kop: 'Kantoren en praktijken', onder: 'In de ontvangst, de wachtkamer en de vergaderruimte'},
  {icon: Repeat, kop: 'Winkels en salons', onder: 'In de etalage en bij de toonbank'},
];

export default function Abonnement() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Abonnement voor restaurants en bedrijven"
        titel="Groen in de zaak, zonder omkijken"
        intro="Een abonnement op opgemaakte plantenbakken of vazen met bloemen, bij u op tafel. Wij maken ze op, zetten ze neer en komen ze verversen, zodat er nooit iets staat dat over zijn hoogtepunt heen is."
        img="/img/zakelijk.webp"
        alt="Opgemaakte plantenbakken in keramiek op de toonbank van de winkel"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#vraag-aan" className={KNOP_HOOFD}>
            Vraag een voorstel aan <ArrowRight className="h-4 w-4" />
          </a>
          <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
            <Phone className="h-4 w-4 text-accent-dark" /> {TEL_DISPLAY}
          </a>
        </div>
      </PaginaKop>

      {/* ------------------------------------------------------------------ */}

      <Section tone="cream" ranken={0}>
        <div className="max-w-2xl">
          <Kicker>Twee vormen abonnement</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Bakken of vazen</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Het verschil zit in hoe lang het meegaat en hoe vaak we langskomen. Groen staat weken, bloemen
            staan korter maar vallen meer op. Het kan ook allebei.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {VORMEN.map((v) => (
            <article key={v.titel} className="flex flex-col rounded-2xl border border-line bg-white p-7">
              <v.icon className="h-8 w-8 text-accent-dark" strokeWidth={1.5} />
              <h3 className="mt-5 text-xl font-semibold">{v.titel}</h3>
              <p className="mt-3 leading-relaxed text-ink/65">{v.tekst}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {v.punten.map((p) => (
                  <Bullet key={p}>{p}</Bullet>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}

      <Section tone="wit">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <Kicker>Hoe het gaat</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Vier stappen</h2>
            <p className="mt-4 leading-relaxed text-ink/65">
              Van een eerste rondje door uw zaak tot een bak die er staat en bijgehouden wordt.
            </p>
          </div>

          <ol className="space-y-7">
            {AANPAK.map(([kop, tekst], i) => (
              <li key={kop} className="flex gap-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-dark/10 font-semibold text-accent-dark">
                  {i + 1}
                </span>
                <div>
                  <p className="text-lg font-semibold leading-snug">{kop}</p>
                  <p className="mt-1.5 leading-relaxed text-ink/65">{tekst}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}

      <Section tone="cream">
        <div className="max-w-2xl">
          <Kicker>Voor wie</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Waar het meestal staat</h2>
        </div>

        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {VOOR.map((v) => (
            <div key={v.kop} className="rounded-2xl border border-line bg-white p-6">
              <v.icon className="h-6 w-6 text-accent-dark" strokeWidth={1.75} />
              <p className="mt-4 font-semibold">{v.kop}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{v.onder}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href="#vraag-aan" className={KNOP_HOOFD}>
            Vraag een voorstel aan <ArrowRight className="h-4 w-4" />
          </a>
          <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
            <Phone className="h-4 w-4 text-accent-dark" /> {TEL_DISPLAY}
          </a>
        </div>
      </Section>
    </Pagina>
  );
}
