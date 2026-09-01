import { useState } from 'react';
import { Check } from 'lucide-react';
import { content, lang, ui } from '../content';
import Paragraphs from './Paragraphs';

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * Asking the museum something, as a band of the page rather than a button that
 * opened a box. Nothing on the site is for sale or for hire, so this is not a
 * price request: it is how a visitor asks what the page does not answer, and
 * how an artist offers work for the wall reserved for others. Both of those
 * are worth a section of their own, so the form stands open on the page and
 * the nav, the footer and the other-artists wall all point at it.
 *
 * It goes to the museum as e-mail, in the language the page was read in.
 */
export default function Ask() {
  // What the section says comes from the CMS; what the form calls its own
  // boxes does not. A label is part of how the form works, not part of what
  // the museum has to say.
  const t = ui.vraag;
  const tekst = content.teksten.contact;
  const [status, setStatus] = useState<Status>('idle');

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
    <section id="contact" className="scroll-mt-20 border-t border-hair py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-20">
          <div>
            {tekst.eyebrow && <p className="eyebrow">{tekst.eyebrow}</p>}
            {tekst.titel && (
              <h2 className={`display text-4xl md:text-6xl ${tekst.eyebrow ? 'mt-4' : ''}`}>
                {tekst.titel}
              </h2>
            )}
            <div className="mt-5 max-w-md">
              <Paragraphs value={tekst.lead} className="text-[0.98rem] leading-relaxed text-muted" />
            </div>

            {/* Who the form is for, said once, so nobody has to guess whether
                their reason counts as a reason to write. */}
            {tekst.waarvoor.length > 0 && (
              <dl className="mt-10 max-w-md border-t border-hair">
                {tekst.waarvoor.map((row) => (
                  <div key={row.label + row.wat} className="border-b border-hair py-5">
                    {row.label && <dt className="eyebrow text-muted">{row.label}</dt>}
                    <dd className={row.label ? 'mt-2' : ''}>
                      <Paragraphs value={row.wat} className="text-sm leading-relaxed text-bone" gap="mt-3" />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Deliberately not a bordered card: the newsletter one sits a band
              higher up the page, and two identical panels in a row read as one
              form asked twice. Here the fields stand on the wall itself. */}
          <div className="lg:pt-2">
            {status === 'done' ? (
              <p className="flex items-center gap-3 text-[0.95rem] text-bone">
                <Check size={20} className="text-red-soft" />
                {tekst.gelukt}
              </p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
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
                    {t.naam}
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
                    {t.email}
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
                    {t.bericht}
                  </label>
                  <textarea
                    id="vraag-message"
                    name="bericht"
                    rows={5}
                    placeholder={t.berichtPlaceholder}
                    className="field mt-2"
                  />
                </div>

                <div className="pt-1">
                  <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                    {status === 'sending' ? t.bezig : tekst.knop}
                  </button>
                </div>

                {status === 'error' && <p className="text-sm text-red-soft">{t.mislukt}</p>}
              </form>
            )}

            {/* Some people would simply rather write the mail themselves, and
                a form is a wall in front of them. Stays put after the form has
                been sent: the address is worth having either way. */}
            {tekst.mail && (
              <p className="mt-8 border-t border-hair pt-6 text-sm text-muted">
                {tekst.mailVraag && <span className="mr-1.5">{tekst.mailVraag}</span>}
                <a
                  href={`mailto:${tekst.mail}`}
                  className="text-bone underline decoration-red underline-offset-4 transition-colors hover:text-red-soft"
                >
                  {tekst.mail}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
