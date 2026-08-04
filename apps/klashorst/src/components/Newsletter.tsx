import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Copy } from '../translations';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function Newsletter({ t }: { t: Copy }) {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    const formData = new FormData(event.currentTarget);
    // No Turnstile widget on this concept build; the Worker is configured with
    // the matching dev bypass secret.
    formData.set('cf-turnstile-response', 'dev');

    try {
      const response = await fetch('/api/forms/newsletter', { method: 'POST', body: formData });
      const result = (await response.json()) as { ok?: boolean };
      setStatus(response.ok && result.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div id="nieuwsbrief" className="scroll-mt-24 border border-hair bg-wall p-7 md:p-10">
      <p className="eyebrow">{t.newsletter.eyebrow}</p>
      <h3 className="display mt-3 text-3xl md:text-4xl">{t.newsletter.title}</h3>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{t.newsletter.lead}</p>

      {status === 'done' ? (
        <p className="mt-8 flex items-center gap-3 text-[0.95rem] text-bone">
          <Check size={20} className="text-red-soft" />
          {t.newsletter.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* Honeypot. Real people never see it. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute h-0 w-0 opacity-0"
          />

          <div>
            <label htmlFor="nl-name" className="eyebrow text-bone/60">
              {t.newsletter.name}
            </label>
            <input
              id="nl-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={t.newsletter.namePlaceholder}
              className="field mt-2"
            />
          </div>

          <div>
            <label htmlFor="nl-email" className="eyebrow text-bone/60">
              {t.newsletter.email}
            </label>
            <input
              id="nl-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t.newsletter.emailPlaceholder}
              className="field mt-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
              {status === 'sending' ? t.newsletter.sending : t.newsletter.submit}
            </button>
            <p className="text-xs text-muted">{t.newsletter.consent}</p>
          </div>

          {status === 'error' && <p className="text-sm text-red-soft">{t.newsletter.error}</p>}
        </form>
      )}
    </div>
  );
}
