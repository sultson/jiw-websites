import {useEffect, useState} from 'react';
import {ArrowRight, Check, Copy, Info, Phone} from 'lucide-react';
import {Bezoek, Footer, MobielBalk, Nav} from '../layout';
import {datumInWoorden, OPSLAG_SLEUTEL, type Aanvraag} from '../Aanvraag';
import {
  BEZORGGEBIED, BEZORGKOSTEN, KNOP_HOOFD, KNOP_TWEEDE_DONKER, Kicker, Section,
  TEL, TEL_DISPLAY,
} from '../ui';

/* ------------------------------------------------------------------ */

type Kanaal = 'verstuurd';
type Opgeslagen = {kanaal: Kanaal; aanvraag: Aanvraag; tekst: string};

/**
 * De pagina waar het formulier op uitkomt. Hij leest wat er net verstuurd is
 * uit de opslag van dit tabblad, zodat de bezoeker zijn eigen aanvraag
 * teruggelezen krijgt in plaats van alleen het woord bedankt.
 *
 * Er staat hier alleen "binnen" omdat de bezoeker hier alleen komt als de
 * aanvraag ook echt aankwam: mislukt het versturen, dan blijft hij op het
 * formulier staan met zijn antwoorden en twee andere manieren om hem alsnog te
 * versturen. Een bedankpagina die niet weet of er iets is aangekomen, is een
 * bedankpagina die liegt.
 */
export default function Bedankt() {
  const [staat, setStaat] = useState<Opgeslagen | null>(null);
  const [gekopieerd, setGekopieerd] = useState(false);

  useEffect(() => {
    try {
      const rauw = sessionStorage.getItem(OPSLAG_SLEUTEL);
      if (rauw) setStaat(JSON.parse(rauw) as Opgeslagen);
    } catch {
      /* Niets in de opslag of prive-modus: dan blijft het bij de korte tekst. */
    }
  }, []);

  const kopieer = async () => {
    if (!staat) return;
    try {
      await navigator.clipboard.writeText(staat.tekst);
      setGekopieerd(true);
      window.setTimeout(() => setGekopieerd(false), 2500);
    } catch {
      /* Zonder toestemming voor het klembord blijft de tekst gewoon zichtbaar
         zodat hij met de hand te selecteren is. */
    }
  };

  const a = staat?.aanvraag;

  const kop = 'Uw aanvraag is bij ons binnen';
  const onder = a?.email
    ? `Bedankt voor uw aanvraag. We hebben hem ontvangen en meteen een bevestiging gestuurd naar ${a.email}. We kijken ernaar en laten u weten wat we voor u kunnen maken.`
    : 'Bedankt voor uw aanvraag. We hebben hem ontvangen, kijken ernaar en laten u weten wat we voor u kunnen maken.';

  return (
    <>
      <Nav />
      <main id="inhoud" className="pb-20 md:pb-0">
        <Section tone="ink" ranken={1} className="border-b border-white/10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-ink">
              <Check className="h-8 w-8" strokeWidth={3} />
            </span>
            <div className="mt-7">
              <Kicker light>Aanvraag</Kicker>
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{kop}</h1>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-white/70">{onder}</p>

            {/* Zonder deze regel leest een groen vinkje met "binnen" al snel als
                een geplaatste bestelling. Er is hier niet betaald en er ligt dus
                nog niets vast: dat hoort er meteen bij te staan, niet ergens
                onderaan in de kleine letters. */}
            <p className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-4 text-left text-sm leading-relaxed text-white/70">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                <span className="font-semibold text-white">Dit is een aanvraag, nog geen bestelling.</span>{' '}
                U heeft nu contact met ons opgenomen. Wij laten u weten wat mogelijk is en wat het kost.
                Pas als u dat heeft afgesproken en betaald, staat uw bestelling vast.
              </span>
            </p>

            {/* Wie iets wil toevoegen hoeft niet het hele formulier opnieuw:
                de tekst van zijn aanvraag staat hier, klaar om mee te sturen. */}
            {staat && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href={`tel:${TEL}`} className={KNOP_HOOFD}>
                  <Phone className="h-4 w-4" /> Bel ons: {TEL_DISPLAY}
                </a>
                <button type="button" onClick={kopieer} className={KNOP_TWEEDE_DONKER}>
                  {gekopieerd
                    ? <><Check className="h-4 w-4 text-accent" /> Gekopieerd</>
                    : <><Copy className="h-4 w-4 text-accent" /> Kopieer mijn aanvraag</>}
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* -------------------------------------------------------------- */}

        <Section>
          <div className="mx-auto max-w-2xl">
            {a ? (
              <>
                <Kicker>Wat u ons stuurde</Kicker>
                <h2 className="text-2xl font-semibold sm:text-3xl">Uw aanvraag</h2>

                <dl className="mt-7 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                  <Regel term="Wat">
                    {a.soortTitel}
                    {a.keuze && <span className="text-ink/55"> · {a.keuze}</span>}
                  </Regel>
                  <Regel term="Levering">
                    {a.levering === 'bezorgen'
                      ? `Bezorgen, ${BEZORGKOSTEN} euro binnen de ${BEZORGGEBIED}, daarbuiten in overleg`
                      : 'Ophalen in de winkel, Molendijk 9-11'}
                  </Regel>
                  {a.datum && <Regel term="Wanneer">{datumInWoorden(a.datum)}</Regel>}
                  {a.budget && <Regel term="Budget">{a.budget}</Regel>}
                  <Regel term="Gegevens">
                    {a.naam}
                    <span className="block text-ink/55">{a.email}</span>
                    {a.telefoon && <span className="block text-ink/55">{a.telefoon}</span>}
                    {(a.straat || a.plaats) && (
                      <span className="block text-ink/55">
                        {[a.straat, [a.postcode, a.plaats].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </Regel>
                  {a.wensen && <Regel term="Wensen">{a.wensen}</Regel>}
                </dl>

                <p className="mt-6 text-sm leading-relaxed text-ink/55">
                  Dit overzicht staat alleen in dit tabblad. Sluit u het, dan is het weg, maar uw bericht aan ons
                  blijft gewoon staan.
                </p>
              </>
            ) : (
              <>
                <Kicker>Bedankt</Kicker>
                <h2 className="text-2xl font-semibold sm:text-3xl">Fijn dat u contact opnam</h2>
                <p className="mt-4 leading-relaxed text-ink/70">
                  We kijken naar uw aanvraag en laten u weten wat we voor u kunnen maken. Is het haast, bel ons
                  dan gerust even.
                </p>
              </>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-line pt-8">
              <a href={`tel:${TEL}`} className={KNOP_HOOFD}>
                <Phone className="h-4 w-4" /> Bel ons: {TEL_DISPLAY}
              </a>
              <a href="/" className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold transition hover:border-accent-dark hover:text-accent-dark">
                Terug naar de winkel <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Section>

        <Bezoek />
      </main>
      <Footer />
      <MobielBalk />
    </>
  );
}

function Regel({term, children}: {term: string; children: React.ReactNode}) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <dt className="w-24 shrink-0 pt-px text-xs font-semibold uppercase tracking-wider text-ink/45">{term}</dt>
      <dd className="min-w-0 flex-1 font-medium leading-snug">{children}</dd>
    </div>
  );
}
