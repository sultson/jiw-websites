import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { business, services } from '../content';

type StartTiming = 'Zo snel mogelijk' | 'Binnen 2 weken' | 'Binnen 1-2 maanden' | 'Geen haast';

const TIMINGS: StartTiming[] = [
  'Zo snel mogelijk',
  'Binnen 2 weken',
  'Binnen 1-2 maanden',
  'Geen haast',
];

export default function OfferteForm({ onSuccess }: { onSuccess?: () => void }) {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [adres, setAdres] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [timing, setTiming] = useState<StartTiming>('Zo snel mogelijk');
  const [bericht, setBericht] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<{ naam?: boolean; email?: boolean; services?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (key: string) =>
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const reset = () => {
    setNaam('');
    setEmail('');
    setTelefoon('');
    setAdres('');
    setSelectedServices([]);
    setTiming('Zo snel mogelijk');
    setBericht('');
    setCompany('');
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!naam.trim()) next.naam = true;
    if (!email.trim()) next.email = true;
    if (selectedServices.length === 0) next.services = true;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (company.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const labels = selectedServices.map((k) => services.find((s) => s.key === k)?.title ?? k).join(', ');
    const body = [
      `Naam: ${naam}`,
      `Email: ${email}`,
      `Telefoon: ${telefoon || '(niet opgegeven)'}`,
      `Adres / postcode: ${adres || '(niet opgegeven)'}`,
      `Type werk: ${labels}`,
      `Gewenste start: ${timing}`,
      '',
      'Bericht:',
      bericht || '(geen bericht)',
    ].join('\n');
    const subject = "Prijsindicatie aanvraag Color's Schildersbedrijf";
    window.location.href = `mailto:${business.email.display}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  const inputClass =
    'w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-stone/60 focus:border-ink focus:outline-none';

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <CheckCircle className="h-10 w-10 text-rood" />
        <h3 className="text-2xl font-display">Bedankt. Uw bericht staat klaar in uw mail.</h3>
        <p className="text-stone">Controleer uw mailprogramma en verstuur de aanvraag.</p>
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            type="button"
            onClick={reset}
            className="text-ink font-semibold underline underline-offset-4 decoration-rood"
          >
            Stuur nog een aanvraag
          </button>
          {onSuccess && (
            <button
              type="button"
              onClick={onSuccess}
              className="text-stone font-medium hover:text-ink"
            >
              Sluiten
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="of-naam" className="block text-sm font-medium mb-1.5">Naam</label>
        <input
          id="of-naam"
          type="text"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          className={inputClass}
          required
        />
        {errors.naam && <p className="mt-1 text-xs text-rood">Vul uw naam in.</p>}
      </div>

      <div>
        <label htmlFor="of-email" className="block text-sm font-medium mb-1.5">Email</label>
        <input
          id="of-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
        {errors.email && <p className="mt-1 text-xs text-rood">Vul uw email in.</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="of-tel" className="block text-sm font-medium mb-1.5">Telefoon</label>
          <input
            id="of-tel"
            type="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="of-adres" className="block text-sm font-medium mb-1.5">Adres / postcode</label>
          <input
            id="of-adres"
            type="text"
            value={adres}
            onChange={(e) => setAdres(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="of-company">Bedrijf</label>
        <input
          id="of-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">Type werk</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {services.map((s) => {
            const checked = selectedServices.includes(s.key);
            return (
              <label
                key={s.key}
                className={`cursor-pointer border rounded-lg p-3 text-sm transition-colors ${
                  checked ? 'bg-ink text-bone border-ink' : 'bg-paper text-ink border-line'
                }`}
              >
                <input
                  type="checkbox"
                  value={s.key}
                  checked={checked}
                  onChange={() => toggleService(s.key)}
                  className="sr-only"
                />
                {s.title}
              </label>
            );
          })}
        </div>
        {errors.services && (
          <p className="mt-1.5 text-xs text-rood">Kies minimaal 1 type werk.</p>
        )}
      </fieldset>

      <fieldset>
        <legend className="block text-sm font-medium mb-2">Wanneer wilt u starten?</legend>
        <div className="space-y-2">
          {TIMINGS.map((t) => {
            const checked = timing === t;
            return (
              <label
                key={t}
                className={`block cursor-pointer border rounded-lg p-3 text-sm transition-colors ${
                  checked ? 'bg-ink text-bone border-ink' : 'bg-paper text-ink border-line'
                }`}
              >
                <input
                  type="radio"
                  name="timing"
                  value={t}
                  checked={checked}
                  onChange={() => setTiming(t)}
                  className="sr-only"
                />
                {t}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="of-bericht" className="block text-sm font-medium mb-1.5">Bericht</label>
        <textarea
          id="of-bericht"
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          rows={4}
          placeholder="Laat ons weten wat u nodig heeft."
          className={`${inputClass} resize-y`}
        />
      </div>

      <button type="submit" className="btn btn-primary w-full justify-center">
        Verstuur aanvraag
      </button>

      <p className="text-xs text-stone text-center">
        We reageren binnen 1 dag. Liever bellen?{' '}
        <a
          href={business.phone.href}
          className="font-semibold text-ink underline underline-offset-4 decoration-rood"
        >
          {business.phone.display}
        </a>
      </p>
    </form>
  );
}
