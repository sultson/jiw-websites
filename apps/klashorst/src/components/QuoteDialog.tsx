import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { lang, ui } from '../content';

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * Asking the museum for a price.
 *
 * The same form for a work from the collection and for a work in the gallery,
 * because from the visitor's side it is the same question. There is no webshop
 * and no price at checkout: the museum quotes, which is what "geen webshop"
 * looks like in practice. Which work it is about rides along in the subject
 * line of the email.
 */
export default function QuoteDialog({
  werk,
  onClose,
}: {
  /** The work's title, or '' for a question that is not about one work. */
  werk: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    const formData = new FormData(event.currentTarget);
    // No Turnstile widget on this concept build; the Worker carries the
    // matching dev bypass secret.
    formData.set('cf-turnstile-response', 'dev');

    try {
      const response = await fetch('/api/forms/offerte', { method: 'POST', body: formData });
      const result = (await response.json()) as { ok?: boolean };
      setStatus(response.ok && result.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const titel = werk ? ui.offerte.formTitel : ui.offerte.algemeen;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-5"
      role="dialog"
      aria-modal="true"
      aria-label={titel}
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto border border-hair bg-ink p-7 shadow-xl md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow">{titel}</p>
            {werk && <h3 className="display mt-3 text-2xl leading-tight md:text-3xl">{werk}</h3>}
          </div>
          <button type="button" onClick={onClose} aria-label={ui.offerte.annuleren} className="p-1">
            <X size={24} />
          </button>
        </div>

        {status === 'done' ? (
          <p className="mt-8 flex items-center gap-3 text-[0.95rem] text-bone">
            <Check size={20} className="text-red-soft" />
            {ui.offerte.gelukt}
          </p>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-muted">{ui.offerte.uitleg}</p>

            <form onSubmit={onSubmit} className="mt-7 space-y-5">
              {/* Honeypot. Real people never see it. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute h-0 w-0 opacity-0"
              />
              {/* Carries the work through to the subject line of the email, and
                  the language through to the confirmation the sender gets. */}
              <input type="hidden" name="werk" value={werk} />
              <input type="hidden" name="taal" value={lang} />

              <div>
                <label htmlFor="off-name" className="eyebrow text-muted">
                  {ui.offerte.naam}
                </label>
                <input
                  id="off-name"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="name"
                  className="field mt-2"
                />
              </div>

              <div>
                <label htmlFor="off-email" className="eyebrow text-muted">
                  {ui.offerte.email}
                </label>
                <input
                  id="off-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="field mt-2"
                />
              </div>

              <div>
                <label htmlFor="off-message" className="eyebrow text-muted">
                  {ui.offerte.bericht}
                </label>
                <textarea
                  id="off-message"
                  name="bericht"
                  rows={4}
                  placeholder={ui.offerte.berichtPlaceholder}
                  className="field mt-2"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                  {status === 'sending' ? ui.offerte.bezig : ui.offerte.versturen}
                </button>
                <button type="button" onClick={onClose} className="eyebrow text-muted hover:text-bone">
                  {ui.offerte.annuleren}
                </button>
              </div>

              {status === 'error' && <p className="text-sm text-red-soft">{ui.offerte.mislukt}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
