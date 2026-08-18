import {ArrowRight, Flower2, Heart, Phone, Repeat} from 'lucide-react';
import {Bezoek, Footer, MobielBalk, Nav} from '../layout';
import {KNOP_HOOFD, KNOP_TWEEDE_DONKER, Kicker, Section, TEL, TEL_DISPLAY} from '../ui';

/* De vier onderwerppagina's, met dezelfde woorden als in de balk bovenaan.
   Een 404 die alleen "terug naar de homepage" aanbiedt, laat de bezoeker zelf
   opnieuw zoeken; deze zet de vier deuren waar hij waarschijnlijk heen wilde
   meteen open. */
const WEGWIJZERS = [
  {href: '/boeketten/', icon: Flower2, titel: 'Boeketten', onder: 'Meenemen uit de winkel of op maat gemaakt'},
  {href: '/abonnement/', icon: Repeat, titel: 'Bloemenabonnement', onder: 'Wekelijks, tweewekelijks of maandelijks vers'},
  {href: '/rouwbloemen/', icon: Heart, titel: 'Rouwbloemen', onder: 'Boeket, bloemstuk, hart of krans'},
  {href: '/trouwbloemen/', icon: Heart, titel: 'Trouwbloemen', onder: 'Bruidsboeket, corsages en de locatie'},
];

/**
 * De pagina die Cloudflare teruggeeft op een adres dat niet bestaat. Hij staat
 * op noindex en draagt daarom geen zoekwoorden, maar wel de gewone navigatie:
 * een bezoeker die hier via een oude link binnenkomt moet in één klik verder
 * kunnen, en niet doodlopen op een kale foutmelding.
 */
export default function NietGevonden() {
  return (
    <>
      <Nav />
      <main id="inhoud" className="pb-20 md:pb-0">
        <Section tone="ink" ranken={0} className="border-b border-white/10 pt-16 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <Kicker light>Pagina niet gevonden</Kicker>
            <h1 className="text-3xl font-semibold sm:text-4xl">Deze bloem staat hier niet</h1>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-white/70">
              Het adres dat u opvroeg bestaat niet, of niet meer. De winkel staat er gewoon nog: hieronder
              staan de pagina's waar u waarschijnlijk naartoe wilde.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="/" className={KNOP_HOOFD}>
                Naar de winkel <ArrowRight className="h-4 w-4" />
              </a>
              <a href={`tel:${TEL}`} className={KNOP_TWEEDE_DONKER}>
                <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
              </a>
            </div>
          </div>
        </Section>

        <Section>
          <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {WEGWIJZERS.map((w) => (
              <a
                key={w.href}
                href={w.href}
                className="flex items-start gap-3.5 rounded-2xl border border-line bg-white px-5 py-5 transition hover:border-accent-dark"
              >
                <w.icon className="mt-0.5 h-5 w-5 shrink-0 text-roze" />
                <span>
                  <span className="block font-semibold leading-snug">{w.titel}</span>
                  <span className="mt-1 block text-sm leading-snug text-ink/55">{w.onder}</span>
                </span>
              </a>
            ))}
          </div>
        </Section>

        <Bezoek />
      </main>
      <Footer />
      <MobielBalk />
    </>
  );
}
