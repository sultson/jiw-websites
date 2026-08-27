import { useId, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { MAIL, TEL, TEL_LINK } from '../ui';

/**
 * Zo laagdrempelig mogelijk gehouden. Wie hier komt heeft vaak net slecht
 * nieuws gehad of zorgt voor iemand die dat heeft, en moet niet eerst een
 * formulier van vijftien velden door. Een naam, een adres om op te antwoorden
 * en waar het over gaat; de rest mag leeg blijven.
 */

const ENDPOINT = '/api/forms/contact';

/**
 * De waarde gaat mee in de onderwerpregel van de mail die het huis krijgt, het
 * label staat op het scherm. Ze verschillen omdat een onderwerpregel kort hoort
 * te zijn en een knop in hele zinnen leest.
 */
const ONDERWERPEN = [
  { waarde: 'Ik wil een keer binnenlopen', label: 'Ik wil een keer binnenlopen' },
  { waarde: 'Vraag over een activiteit', label: 'Ik heb een vraag over een activiteit' },
  { waarde: 'Vrijwilliger worden', label: 'Ik wil vrijwilliger worden' },
  { waarde: 'Iets anders', label: 'Iets anders' },
];

const VELD =
  'mt-2 block w-full rounded-[1.25rem] border border-lijn bg-room-diep px-[1.05rem] py-3 text-[1rem] leading-relaxed text-inkt outline-none transition placeholder:text-grijs/75 focus:border-wijn focus:bg-white';

export default function Formulier({
  /** Waar het bericht over gaat, al ingevuld. Voor de pagina over vrijwilligerswerk. */
  onderwerp,
  compact = false,
}: {
  onderwerp?: string;
  compact?: boolean;
}) {
  const sleutel = useId();
  // Een onderwerp dat de pagina meegeeft en niet in de lijst staat, komt er
  // vooraan bij: anders zou de keuze op het scherm iets anders zeggen dan wat
  // er verstuurd wordt.
  const keuzes =
    onderwerp && !ONDERWERPEN.some((o) => o.waarde === onderwerp)
      ? [{ waarde: onderwerp, label: onderwerp }, ...ONDERWERPEN]
      : ONDERWERPEN;

  const [gekozen, setGekozen] = useState(onderwerp ?? ONDERWERPEN[0].waarde);
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBezig(true);
    setFout(null);

    const data = new FormData(e.currentTarget);
    data.set('onderwerp', gekozen);
    // Er staat geen Turnstile-widget op deze site; de Worker draait met de
    // ontwikkelsleutel en accepteert daarom deze waarde.
    data.set('cf-turnstile-response', 'dev');

    try {
      const antwoord = await fetch(ENDPOINT, { method: 'POST', body: data });
      if (!antwoord.ok) throw new Error(String(antwoord.status));
      setKlaar(true);
    } catch {
      setFout(
        'Het versturen lukte niet. Probeer het zo nog eens, of bel ons gerust, dan regelen we het meteen.',
      );
    } finally {
      setBezig(false);
    }
  }

  if (klaar) {
    return (
      <div
        role="status"
        className="rounded-[1.25rem] border border-lijn bg-white p-7 text-center shadow-[var(--shadow-kaart)] md:p-9"
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-blos">
          <Check className="h-7 w-7 text-wijn" aria-hidden="true" />
        </div>
        <h3 className="text-[1.35rem]">Dank je wel, je bericht is verstuurd</h3>
        <p className="mx-auto mt-3 max-w-[46ch] leading-relaxed text-inkt-zacht">
          Een van onze vrijwilligers neemt contact met je op. Heb je liever nu meteen iemand aan de
          lijn, bel dan gerust naar{' '}
          <a href={TEL_LINK} className="font-bold text-wijn no-underline hover:underline">
            {TEL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={verstuur}
      aria-busy={bezig}
      className={
        compact
          ? ''
          : 'rounded-[1.25rem] border border-lijn bg-white p-6 shadow-[var(--shadow-kaart)] md:p-8'
      }
    >
      <fieldset className="border-0 p-0">
        <legend className="text-[0.9rem] font-bold text-inkt-zacht">Waar gaat het over?</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {keuzes.map((keuze, i) => {
            // Het nummer en niet de waarde: een id met spaties erin is geen
            // geldig id, en dan wijst het label nergens meer heen.
            const id = `${sleutel}-onderwerp-${i}`;
            return (
              <div key={keuze.waarde} className="relative">
                <input
                  type="radio"
                  id={id}
                  name="onderwerp"
                  value={keuze.waarde}
                  checked={gekozen === keuze.waarde}
                  onChange={() => setGekozen(keuze.waarde)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className="flex min-h-[3.4rem] cursor-pointer items-center rounded-[1.25rem] border border-lijn bg-room-diep px-[1.05rem] py-3 text-[0.95rem] font-semibold leading-snug text-inkt-zacht transition hover:border-blos-diep peer-checked:border-wijn peer-checked:bg-blos peer-checked:text-wijn-diep peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wijn"
                >
                  {keuze.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Veld id={`${sleutel}-naam`} naam="firstName" label="Je naam" verplicht autoComplete="given-name" />
        <Veld id={`${sleutel}-mail`} naam="email" label="Je e-mailadres" type="email" verplicht autoComplete="email" />
        <div className="sm:col-span-2">
          <Veld id={`${sleutel}-tel`} naam="telefoon" label="Je telefoonnummer" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`${sleutel}-bericht`} className="block text-[0.9rem] font-bold text-inkt-zacht">
          Wil je iets kwijt? <span className="font-normal text-grijs">(mag ook leeg)</span>
        </label>
        <textarea
          id={`${sleutel}-bericht`}
          name="bericht"
          rows={4}
          className={VELD}
          placeholder="Vind je het fijn om vast iets te vertellen, dan kan dat hier."
        />
      </div>

      {/* Voor de bots. Wie dit invult krijgt netjes antwoord en verder gebeurt
          er niets, en een mens ziet het veld nooit. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {fout && (
        <p
          role="alert"
          className="mt-5 rounded-[1.25rem] border border-blos-diep bg-blos px-[1.05rem] py-3.5 leading-relaxed text-inkt"
        >
          {fout}
        </p>
      )}

      <button
        type="submit"
        disabled={bezig}
        className="mt-6 inline-flex min-h-[3.1rem] items-center justify-between gap-3 rounded-full border border-wijn bg-wijn px-[1.4rem] py-3 text-[0.95rem] font-extrabold leading-tight text-white transition hover:-translate-y-0.5 hover:border-wijn-diep hover:bg-wijn-diep disabled:opacity-60 disabled:hover:translate-y-0 max-sm:w-full"
      >
        <span>Versturen</span>
        {bezig ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <span aria-hidden="true">→</span>
        )}
      </button>

      <p className="mt-5 text-[0.88rem] leading-relaxed text-grijs">
        Liever bellen of mailen? Dat kan ook:{' '}
        <a href={TEL_LINK} className="font-bold text-wijn no-underline hover:underline">
          {TEL}
        </a>{' '}
        of{' '}
        <a href={`mailto:${MAIL}`} className="font-bold text-wijn no-underline hover:underline">
          {MAIL}
        </a>
        .
      </p>
    </form>
  );
}

function Veld({
  id,
  naam,
  label,
  type = 'text',
  verplicht = false,
  autoComplete,
}: {
  id: string;
  naam: string;
  label: string;
  type?: string;
  verplicht?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.9rem] font-bold text-inkt-zacht">
        {label} {!verplicht && <span className="font-normal text-grijs">(optioneel)</span>}
      </label>
      <input
        id={id}
        name={naam}
        type={type}
        required={verplicht}
        autoComplete={autoComplete}
        className={`${VELD} min-h-[3.4rem]`}
      />
    </div>
  );
}
