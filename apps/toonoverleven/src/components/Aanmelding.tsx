import { useEffect, useId, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { InterfaceCopy } from '../next/interface';
import { useAdres } from '../router';

/**
 * Aanmelden voor een activiteit, of er eerst een vraag over stellen.
 *
 * Eén formulier met een keuze bovenaan, zoals Marcel het op 21-10-2026 vroeg.
 * Bij een vraag hoort geen activiteit of datum: wie iets wil weten hoeft nog
 * niet te kiezen. Een aanmelding bevestigt nooit zelf een plek; het huis laat
 * weten of er ruimte is.
 */

export type Moment = { id: string; titel: string; moment: string; vol: boolean };
type Soort = 'aanmelden' | 'vraag';

const PERSONEN = [1, 2, 3, 4, 5];

export default function Aanmelding({
  momenten,
  gekozen: begin,
  copy,
  contact,
}: {
  /** De momenten waarvoor je je via de site kunt aanmelden, vol of niet. */
  momenten: Moment[];
  /** Het moment waar de knop vandaan kwam, als die er was. */
  gekozen?: string;
  copy: InterfaceCopy;
  contact: { email: string; telefoon: string; mobiel?: string };
}) {
  const sleutel = useId();
  const [soort, zetSoort] = useState<Soort>('aanmelden');
  const [moment, setMoment] = useState(begin && momenten.some((m) => m.id === begin && !m.vol) ? begin : '');
  const [kiezen, setKiezen] = useState(!moment);
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  // ?vraag in het adres opent het formulier als vraag, voor een link als
  // "Stel een vraag" bij een activiteit zonder aanmelding.
  const adres = useAdres();
  useEffect(() => {
    if (adres && new URL(adres).searchParams.has('vraag')) kies('vraag');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adres]);

  function kies(nieuw: Soort) {
    zetSoort(nieuw);
    setFout(null);
  }

  const gekozen = momenten.find((m) => m.id === moment);
  const vraag = soort === 'vraag';
  const telLink = (nummer: string) => 'tel:' + nummer.replace(/[^+0-9]/g, '');
  const link = 'font-bold text-wijn no-underline hover:underline';

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBezig(true);
    setFout(null);
    const data = new FormData(e.currentTarget);
    if (vraag) {
      data.set('onderwerp', gekozen ? 'Vraag over ' + gekozen.titel : 'Vraag');
      if (gekozen) data.set('activiteit', gekozen.titel + ', ' + gekozen.moment);
    } else {
      // De Worker zoekt het moment zelf op in de agenda en zet titel en datum
      // er dan opnieuw in; wat de pagina meestuurt is alleen de verwijzing.
      data.set('activiteitId', moment);
      data.set('onderwerp', 'Aanmelden: ' + (gekozen?.titel ?? ''));
      data.set('moment', gekozen?.moment ?? '');
    }
    // Er staat geen Turnstile-widget op deze site; de Worker draait met de
    // ontwikkelsleutel en accepteert daarom deze waarde.
    data.set('cf-turnstile-response', 'dev');
    try {
      const antwoord = await fetch(vraag ? '/api/forms/vraag' : '/api/forms/activity', { method: 'POST', body: data });
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
        <h2>{vraag ? copy.questionSuccessTitle : copy.signupSuccessTitle}</h2>
        <p>{vraag ? copy.questionSuccessText : copy.signupSuccessText}</p>
        <p className="signup-closing">{copy.signupClosing}</p>
      </div>
    );
  }

  return (
    <form onSubmit={verstuur} aria-busy={bezig} className="contact-form signup-form">
      <fieldset className="route-choices signup-mode">
        <legend>{copy.modeLabel}</legend>
        {(['aanmelden', 'vraag'] as const).map((s) => (
          <label key={s}>
            <input type="radio" name="soort" value={s} checked={soort === s} onChange={() => kies(s)} />
            <span>{s === 'aanmelden' ? copy.modeSignup : copy.modeQuestion}</span>
          </label>
        ))}
      </fieldset>

      <h2>{vraag ? copy.questionTitle : copy.signupTitle}</h2>
      <p className="signup-intro">{vraag ? copy.questionIntro : copy.signupIntro}</p>

      {!vraag && (
        <div className="signup-for">
          <h3>{copy.signupFor}</h3>
          {gekozen && !kiezen ? (
            <>
              <p className="signup-for-title">{gekozen.titel}</p>
              <p>{gekozen.moment}</p>
              {momenten.length > 1 && (
                <button type="button" className="textlink" onClick={() => setKiezen(true)}>
                  {copy.signupOther}
                </button>
              )}
            </>
          ) : (
            <label htmlFor={`${sleutel}-moment`} className="signup-select">
              <span className="sr-only">{copy.signupChoose}</span>
              <select id={`${sleutel}-moment`} required value={moment} onChange={(e) => setMoment(e.target.value)}>
                <option value="">{copy.signupChoose}</option>
                {momenten.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.vol}>
                    {m.titel} · {m.moment}{m.vol ? ' (vol)' : ''}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      {vraag && gekozen && <p className="form-activity">Je vraag gaat over: <strong>{gekozen.titel}</strong></p>}

      <h3 className="signup-details">{copy.signupDetails}</h3>
      <div className="contact-fields">
        <div>
          <label htmlFor={`${sleutel}-naam`}>{copy.signupName} *</label>
          <input id={`${sleutel}-naam`} name="firstName" required autoComplete="name" placeholder={copy.signupNameHint} />
        </div>
        <div>
          <label htmlFor={`${sleutel}-mail`}>{copy.signupEmail} *</label>
          <input id={`${sleutel}-mail`} name="email" type="email" required autoComplete="email" placeholder={copy.signupEmailHint} />
        </div>
        <div>
          <label htmlFor={`${sleutel}-tel`}>{copy.signupPhone}</label>
          <input id={`${sleutel}-tel`} name="telefoon" type="tel" autoComplete="tel" aria-describedby={`${sleutel}-tel-hint`} />
          <p className="field-hint" id={`${sleutel}-tel-hint`}>{copy.signupPhoneHint}</p>
        </div>
        {!vraag && (
          <div>
            <label htmlFor={`${sleutel}-personen`}>{copy.signupPeople} *</label>
            <select id={`${sleutel}-personen`} name="personen" required defaultValue="1 persoon">
              {PERSONEN.map((n) => {
                const tekst = n === 1 ? '1 persoon' : n + ' personen';
                return <option key={n} value={tekst}>{tekst}</option>;
              })}
            </select>
          </div>
        )}
        <div>
          <label htmlFor={`${sleutel}-bericht`}>
            {vraag ? <>{copy.questionLabel} *</> : <>{copy.signupRemarks} <span className="optional">(mag ook leeg)</span></>}
          </label>
          <textarea id={`${sleutel}-bericht`} name="bericht" rows={4} required={vraag} />
        </div>
      </div>

      <p className="small">{copy.signupHealth}</p>
      <p className="form-privacy">{copy.privacyIntro} <a href="/privacy">{copy.privacyLink}</a>.</p>
      {/* Voor de bots. Een mens ziet dit veld nooit. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      {fout && <p role="alert" className="signup-error">{fout}</p>}

      <button type="submit" disabled={bezig} className="btn">
        <span>{vraag ? copy.questionSubmit : copy.signupSubmit}</span>
        {bezig ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <span aria-hidden="true">→</span>}
      </button>

      <p className="signup-alternative">
        {copy.signupAlternative}{' '}
        <a href={telLink(contact.telefoon)} className={link}>{contact.telefoon}</a>
        {contact.mobiel && <> of <a href={telLink(contact.mobiel)} className={link}>{contact.mobiel}</a></>}
        {' '}of mail naar{' '}
        <a href={'mailto:' + contact.email} className={link}>{contact.email}</a>.
      </p>
    </form>
  );
}
