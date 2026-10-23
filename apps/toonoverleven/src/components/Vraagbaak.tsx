import { useId, useMemo, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { InterfaceCopy } from '../next/interface';

/**
 * Een afspraak aanvragen bij de Vraagbaak Koers en Kanker (Marcel, 19-10-2026).
 *
 * Het vragenuur is iedere tweede en vierde dinsdag van 9.00 tot 10.00 uur. De
 * bezoeker kiest een voorkeursdatum; het huis bevestigt de afspraak zelf, dus
 * het formulier belooft niets.
 */

const AANTAL = 8;

/** The next second and fourth Tuesdays, from tomorrow on. */
export function vraagbaakDatums(vanaf = new Date(), aantal = AANTAL): Date[] {
  const uit: Date[] = [];
  const morgen = new Date(vanaf.getFullYear(), vanaf.getMonth(), vanaf.getDate() + 1);
  for (let m = 0; uit.length < aantal && m < 24; m++) {
    const eerste = new Date(morgen.getFullYear(), morgen.getMonth() + m, 1);
    const eersteDinsdag = 1 + ((2 - eerste.getDay() + 7) % 7);
    for (const week of [1, 3]) {
      const d = new Date(eerste.getFullYear(), eerste.getMonth(), eersteDinsdag + week * 7);
      if (d >= morgen && uit.length < aantal) uit.push(d);
    }
  }
  return uit;
}

const datumTekst = (d: Date) => d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export default function Vraagbaak({ copy }: { copy: InterfaceCopy }) {
  const sleutel = useId();
  const datums = useMemo(() => vraagbaakDatums().map(datumTekst), []);
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBezig(true);
    setFout(null);
    const data = new FormData(e.currentTarget);
    data.set('onderwerp', 'Afspraak Vraagbaak Koers en Kanker');
    // Er staat geen Turnstile-widget op deze site; de Worker draait met de
    // ontwikkelsleutel en accepteert daarom deze waarde.
    data.set('cf-turnstile-response', 'dev');
    try {
      const antwoord = await fetch('/api/forms/vraagbaak', { method: 'POST', body: data });
      if (!antwoord.ok) throw new Error(String(antwoord.status));
      setKlaar(true);
    } catch {
      setFout(copy.formError);
    } finally {
      setBezig(false);
    }
  }

  if (klaar) {
    return (
      <div role="status" className="signup-done">
        <div className="signup-done-icon">
          <Check className="h-7 w-7 text-wijn" aria-hidden="true" />
        </div>
        <h2>Je aanvraag is ontvangen</h2>
        <p>We nemen contact met je op om je afspraak te bevestigen.</p>
      </div>
    );
  }

  return (
    <form onSubmit={verstuur} aria-busy={bezig} className="contact-form signup-form">
      <div className="contact-fields">
        <div>
          <label htmlFor={`${sleutel}-naam`}>Voor- en achternaam *</label>
          <input id={`${sleutel}-naam`} name="firstName" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor={`${sleutel}-mail`}>E-mailadres *</label>
          <input id={`${sleutel}-mail`} name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor={`${sleutel}-tel`}>Telefoonnummer <span className="optional">(optioneel)</span></label>
          <input id={`${sleutel}-tel`} name="telefoon" type="tel" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor={`${sleutel}-datum`}>Voorkeursdatum *</label>
          <select id={`${sleutel}-datum`} name="voorkeursdatum" required defaultValue="">
            <option value="" disabled>Kies een dinsdag</option>
            {datums.map((d) => <option key={d} value={d}>{d}, 9.00 tot 10.00 uur</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${sleutel}-bericht`}>Waarover wil je sparren? <span className="optional">(optioneel)</span></label>
          <textarea id={`${sleutel}-bericht`} name="bericht" rows={4} />
        </div>
      </div>

      <p className="small">We nemen contact met je op om je afspraak te bevestigen.</p>
      <p className="form-privacy">{copy.privacyIntro} <a href="/privacy">{copy.privacyLink}</a>.</p>
      {/* Voor de bots. Een mens ziet dit veld nooit. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      {fout && <p role="alert" className="signup-error">{fout}</p>}

      <button type="submit" disabled={bezig} className="btn">
        <span>Afspraak aanvragen</span>
        {bezig ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
