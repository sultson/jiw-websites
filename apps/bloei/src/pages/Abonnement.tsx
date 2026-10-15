import {ArrowRight, Flower2, Leaf, Phone} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {Bullet, KNOP_HOOFD, KNOP_TWEEDE_LICHT, Section, TEL, TEL_DISPLAY} from '../ui';

/* ------------------------------------------------------------------ */

/**
 * Het abonnement. Dit is iets anders dan dat van Fleurig!, waar een boeket thuis
 * werd bezorgd: hier gaat het om plantenbakken en vazen die blijven staan en die
 * de winkel komt verversen. Deze pagina heette daarom eerst "Zakelijk", maar de
 * winkel wil dat het abonnement blijft heten, dus heet het weer zo — ook in het
 * adres (/abonnement/), want een menu-item dat Abonnement heet en naar
 * /zakelijk/ wijst is een halve hernoeming.
 *
 * Stond tot 14-10-2026 helemaal op restaurants en bedrijven. Een particulier
 * die dit las zag een dienst waar hij zelf buiten viel, terwijl dezelfde
 * afspraak thuis net zo goed werkt. Nu staat thuis overal vooraan.
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
      'Voor op tafel, in de vensterbank, bij de entree of op het terras',
      'Keramiek, beton of mand, in de kleur van de ruimte',
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

/* Hier stonden tot 15-10-2026 twee secties: "Vier stappen" (langskomen,
   voorstel, neerzetten, verversen) en "Waar het meestal staat" (thuis,
   restaurants, kantoren, winkels). Allebei op verzoek van de winkel eruit. Wat
   er in die vier stappen stond staat in het kort ook in de intro hierboven, en
   het formulier vraagt op stap 1 al waar het komt te staan. */

export default function Abonnement() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Abonnement voor thuis en voor de zaak"
        titel="Verse bloemen op tafel, zonder omkijken"
        intro="Een abonnement op opgemaakte plantenbakken of vazen met bloemen, bij u thuis of in de zaak. Wij maken ze op, zetten ze neer en komen ze verversen, zodat er nooit iets staat dat over zijn hoogtepunt heen is."
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
          <h2 className="text-3xl font-semibold sm:text-4xl">Bakken of vazen</h2>
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
    </Pagina>
  );
}
