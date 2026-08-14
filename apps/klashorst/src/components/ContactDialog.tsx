import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { lang, ui } from '../content';

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * Asking the museum something.
 *
 * Nothing on the site is for sale or for hire, so this is not a price request:
 * it is the way an artist offers work for the other-artists wall and the way a
 * visitor asks anything the page does not answer. It goes to the museum as
 * e-mail, in the language the page was read in.
 */
export default function ContactDialog({ onClose }: { onClose: () => void }) {
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
      const response = await fetch('/api/forms/vraag', { method: 'POST', body: formData });
      const result = (await response.json()) as { ok?: boolean };
      setStatus(response.ok && result.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-5"
      role="dialog"
      aria-modal="true"
      aria-label={ui.vraag.formTitel}
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto border border-hair bg-ink p-7 shadow-xl md:p-9">
        <div className="flex items-start justify-between gap-6">
          <p className="eyebrow">{ui.vraag.formTitel}</p>
          <button type="button" onClick={onClose} aria-label={ui.vraag.annuleren} className="p-1">
            <X size={24} />
          </button>
        </div>

        {status === 'done' ? (
          <p className="mt-8 flex items-center gap-3 text-[0.95rem] text-bone">
            <Check size={20} className="text-red-soft" />
            {ui.vraag.gelukt}
          </p>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-muted">{ui.vraag.uitleg}</p>

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
              {/* Carries the language through to the confirmation the sender gets. */}
              <input type="hidden" name="taal" value={lang} />

              <div>
                <label htmlFor="vraag-name" className="eyebrow text-muted">
                  {ui.vraag.naam}
                </label>
                <input
                  id="vraag-name"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="name"
                  className="field mt-2"
                />
              </div>

              <div>
                <label htmlFor="vraag-email" className="eyebrow text-muted">
                  {ui.vraag.email}
                </label>
                <input
                  id="vraag-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="field mt-2"
                />
              </div>

              <div>
                <label htmlFor="vraag-message" className="eyebrow text-muted">
                  {ui.vraag.bericht}
                </label>
                <textarea
                  id="vraag-message"
                  name="bericht"
                  rows={4}
                  placeholder={ui.vraag.berichtPlaceholder}
                  className="field mt-2"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                  {status === 'sending' ? ui.vraag.bezig : ui.vraag.versturen}
                </button>
                <button type="button" onClick={onClose} className="eyebrow text-muted hover:text-bone">
                  {ui.vraag.annuleren}
                </button>
              </div>

              {status === 'error' && <p className="text-sm text-red-soft">{ui.vraag.mislukt}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
