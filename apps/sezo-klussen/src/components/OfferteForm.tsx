import { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { site } from '../data/site';
import { services } from '../data/services';

type StartTiming = 'Zo snel mogelijk' | 'Binnen 2 weken' | 'Binnen 1-2 maanden' | 'Geen haast';

const TIMINGS: StartTiming[] = [
  'Zo snel mogelijk',
  'Binnen 2 weken',
  'Binnen 1-2 maanden',
  'Geen haast',
];

export default function OfferteForm({ onSuccess }: { onSuccess?: () => void }) {
  const [naam, setNaam] = useState('');
  const [telefoon, setTelefoon] = useState('');
  const [postcode, setPostcode] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [timing, setTiming] = useState<StartTiming>('Zo snel mogelijk');
  const [bericht, setBericht] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<{ naam?: boolean; telefoon?: boolean; services?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (key: string) =>
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const reset = () => {
    setNaam('');
    setTelefoon('');
    setPostcode('');
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
    if (!telefoon.trim()) next.telefoon = true;
    if (selectedServices.length === 0) next.services = true;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (company.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    const labels = selectedServices
      .map((k) => services.find((s) => s.key === k)?.title ?? k)
      .join(', ');
    const lines = [
      `Hoi ${site.ownerName}, ik wil graag een offerte aanvragen via de site.`,
      '',
      `Naam: ${naam}`,
      `Telefoon: ${telefoon}`,
      `Postcode: ${postcode || '(niet opgegeven)'}`,
      `Dienst: ${labels}`,
      `Gewenste start: ${timing}`,
      '',
      'Wat moet er gebeuren:',
      bericht || '(geen bericht)',
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${site.whatsappRaw}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const inputClass =
    'w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-stone/60 focus:border-ink focus:outline-none';

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <CheckCircle className="h-10 w-10 text-gold-deep" />
        <h3 className="text-2xl font-display">Bedankt. WhatsApp is geopend met je aanvraag.</h3>
        <p className="text-stone">
          Verstuur het bericht en {site.ownerName} reageert dezelfde dag.
        </p>
        <p className="text-sm text-stone">
          Werkt het niet? Bel direct:{' '}
          <a
            href={`tel:${site.phoneRaw}`}
            className="font-semibold text-ink underline underline-offset-4 decoration-gold"
          >
            {site.phone}
          </a>
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            type="button"
            onClick={reset}
            className="text-ink font-semibold underline underline-offset-4 decoration-gold"
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
        <label htmlFor="of-naam" className="block text-sm font-medium mb-1.5">
          Naam
        </label>
        <input
          id="of-naam"
          type="text"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          className={inputClass}
          required
        />
        {errors.naam && <p className="mt-1 text-xs text-clay">Vul uw naam in.</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="of-tel" className="block text-sm font-medium mb-1.5">
            Telefoon
          </label>
          <input
            id="of-tel"
            type="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            className={inputClass}
            required
          />
          {errors.telefoon && (
            <p className="mt-1 text-xs text-clay">Vul uw telefoonnummer in.</p>
          )}
        </div>
        <div>
          <label htmlFor="of-postcode" className="block text-sm font-medium mb-1.5">
            Postcode
          </label>
          <input
            id="of-postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div
        style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
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
          <p className="mt-1.5 text-xs text-clay">Kies minimaal 1 type werk.</p>
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
        <label htmlFor="of-bericht" className="block text-sm font-medium mb-1.5">
          Wat moet er gebeuren?
        </label>
        <textarea
          id="of-bericht"
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          rows={4}
          placeholder="Bijv. 60 m² woonkamer stuken, sausklaar. Graag een prijsindicatie."
          className={`${inputClass} resize-y`}
        />
      </div>

      <button type="submit" className="btn btn-primary w-full justify-center">
        Verstuur via WhatsApp
        <Send size={16} />
      </button>

      <p className="text-xs text-stone text-center">
        WhatsApp opent met je aanvraag. Liever bellen?{' '}
        <a
          href={`tel:${site.phoneRaw}`}
          className="font-semibold text-ink underline underline-offset-4 decoration-gold"
        >
          {site.phone}
        </a>
      </p>
    </form>
  );
}
