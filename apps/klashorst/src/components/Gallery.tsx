import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { content, ui, type GalerieWerk } from '../content';

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * The part of the museum reserved for other artists. Work here is for hire and
 * for sale, but there is no webshop: interest is a message to the museum, and
 * the museum takes it from there.
 */
export default function Gallery() {
  const t = content.teksten.galerie;
  const werken = content.galerie;
  /** null when closed, '' for a general enquiry, otherwise the work's title. */
  const [asking, setAsking] = useState<string | null>(null);

  const label = (work: GalerieWerk) =>
    [work.techniek, work.afmetingen, work.jaar].filter(Boolean).join(', ');

  return (
    <section id="galerie" className="scroll-mt-16 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-2xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="display mt-4 text-4xl md:text-6xl">{t.titel}</h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted">{t.lead}</p>
        </header>

        {werken.length === 0 ? (
          <div className="mt-10 max-w-xl border border-hair bg-wall p-7 md:p-9">
            <p className="text-[0.95rem] leading-relaxed text-bone/80">{t.leeg}</p>
            <button type="button" onClick={() => setAsking('')} className="btn mt-6">
              {ui.galerie.formTitel}
            </button>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {werken.map((work) => (
              <article key={work.id} className="flex flex-col">
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-wall">
                  <img
                    src={work.img.grid}
                    alt={`${work.titel}, ${work.kunstenaar}`}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <p
                  className={`eyebrow mt-3 ${
                    work.status === 'verkocht' ? 'text-muted' : 'text-red-soft'
                  }`}
                >
                  {ui.galerie.status[work.status]}
                </p>
                <h3 className="display mt-2 text-base leading-tight md:text-lg">{work.titel}</h3>
                {work.kunstenaar && <p className="mt-1 text-sm text-bone/80">{work.kunstenaar}</p>}
                {label(work) && <p className="mt-1 text-xs text-muted md:text-[0.8rem]">{label(work)}</p>}

                {(work.prijs || work.huurprijs) && work.status !== 'verkocht' && (
                  <dl className="mt-3 space-y-1 text-xs text-bone/75 md:text-[0.8rem]">
                    {work.prijs && (
                      <div className="flex gap-2">
                        <dt className="text-muted">{ui.galerie.prijs}</dt>
                        <dd>{work.prijs}</dd>
                      </div>
                    )}
                    {work.huurprijs && (
                      <div className="flex gap-2">
                        <dt className="text-muted">{ui.galerie.huurprijs}</dt>
                        <dd>{work.huurprijs}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {work.toelichting && (
                  <p className="mt-3 text-xs leading-relaxed text-muted md:text-[0.8rem]">{work.toelichting}</p>
                )}

                {work.status !== 'verkocht' && (
                  <button
                    type="button"
                    onClick={() => setAsking(work.titel)}
                    className="eyebrow mt-4 self-start border-b border-red pb-1 text-bone/80 transition-colors hover:text-bone"
                  >
                    {ui.galerie.interesse}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {asking !== null && <InterestDialog werk={asking} onClose={() => setAsking(null)} />}
    </section>
  );
}

function InterestDialog({ werk, onClose }: { werk: string; onClose: () => void }) {
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
      const response = await fetch('/api/forms/interesse', { method: 'POST', body: formData });
      const result = (await response.json()) as { ok?: boolean };
      setStatus(response.ok && result.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-5"
      role="dialog"
      aria-modal="true"
      aria-label={ui.galerie.formTitel}
    >
      <div className="max-h-full w-full max-w-lg overflow-y-auto border border-hair bg-wall p-7 md:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow">{ui.galerie.formTitel}</p>
            {werk && <h3 className="display mt-3 text-2xl leading-tight md:text-3xl">{werk}</h3>}
          </div>
          <button type="button" onClick={onClose} aria-label={ui.galerie.annuleren} className="p-1">
            <X size={24} />
          </button>
        </div>

        {status === 'done' ? (
          <p className="mt-8 flex items-center gap-3 text-[0.95rem] text-bone">
            <Check size={20} className="text-red-soft" />
            {ui.galerie.gelukt}
          </p>
        ) : (
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
            {/* Carries the work through to the subject line of the email. */}
            <input type="hidden" name="werk" value={werk} />

            <div>
              <label htmlFor="int-name" className="eyebrow text-bone/60">
                {ui.galerie.naam}
              </label>
              <input id="int-name" name="firstName" type="text" required autoComplete="name" className="field mt-2" />
            </div>

            <div>
              <label htmlFor="int-email" className="eyebrow text-bone/60">
                {ui.galerie.email}
              </label>
              <input id="int-email" name="email" type="email" required autoComplete="email" className="field mt-2" />
            </div>

            <div>
              <label htmlFor="int-message" className="eyebrow text-bone/60">
                {ui.galerie.bericht}
              </label>
              <textarea
                id="int-message"
                name="bericht"
                rows={4}
                placeholder={ui.galerie.berichtPlaceholder}
                className="field mt-2"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                {status === 'sending' ? ui.galerie.bezig : ui.galerie.versturen}
              </button>
              <button type="button" onClick={onClose} className="eyebrow text-muted hover:text-bone">
                {ui.galerie.annuleren}
              </button>
            </div>

            {status === 'error' && <p className="text-sm text-red-soft">{ui.galerie.mislukt}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
