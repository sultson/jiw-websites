import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Check, AlertCircle, ArrowRight, Phone } from 'lucide-react';
import { SITE } from '../lib/site';

type Props = {
  open: boolean;
  onClose: () => void;
  presetSubject?: SubjectKey;
};

type State = 'idle' | 'submitting' | 'success' | 'error';

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export const subjects = {
  behandeling: 'Ik zoek een behandeling bij neuropathie',
  cursus: 'Ik ben therapeut en heb een vraag over de specialisatiecursus',
  netwerk: 'Ik wil me aansluiten bij het netwerk',
  algemeen: 'Een andere vraag',
} as const;

export type SubjectKey = keyof typeof subjects;

export default function ContactModal({ open, onClose, presetSubject }: Props) {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [subject, setSubject] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const isLocal =
    typeof window !== 'undefined' && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  const useWidget = Boolean(turnstileSiteKey) && !isLocal;
  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);

  useEffect(() => {
    if (!open) return;
    setState('idle');
    setErrorMsg('');
    setSubject(presetSubject ? subjects[presetSubject] : '');
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, presetSubject, onClose]);

  if (!open) return null;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (useWidget && !turnstileToken) {
      setState('error');
      setErrorMsg('De beveiligingscheck is nog bezig. Probeer het over een paar seconden opnieuw.');
      return;
    }
    setState('submitting');
    setErrorMsg('');
    const form = e.currentTarget;
    try {
      const formData = new FormData(form);
      if (turnstileToken) formData.set('cf-turnstile-response', turnstileToken);
      const response = await fetch('/api/forms/contact', { method: 'POST', body: formData });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || 'Versturen lukte niet. Probeer het opnieuw of bel ons.');
      setState('success');
      form.reset();
      setSubject('');
      setTurnstileToken('');
      setTurnstileResetKey((v) => v + 1);
    } catch (err) {
      setState('error');
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : 'Versturen lukte niet. Probeer het opnieuw of bel ons.',
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-terra-ink/55 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="bg-cream w-full sm:max-w-xl max-h-[100dvh] sm:max-h-[92vh] overflow-y-auto sm:rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm border-b border-line px-5 sm:px-7 py-4 flex items-start justify-between gap-4">
          <div>
            <span className="kicker">Contact</span>
            <h2 id="contact-modal-title" className="mt-2 font-display text-[26px] leading-tight text-ink">
              Stel uw vraag
            </h2>
          </div>
          <button
            type="button"
            className="p-2 -mr-2 rounded-full text-ink-mute hover:text-ink hover:bg-sand transition-colors"
            onClick={onClose}
            aria-label="Sluiten"
          >
            <X size={22} />
          </button>
        </div>

        {state === 'success' ? (
          <div className="px-5 sm:px-7 py-14 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-sage-wash text-sage-deep flex items-center justify-center mb-6">
              <Check size={32} strokeWidth={2.2} />
            </div>
            <h3 className="font-display text-[24px] text-ink">Uw bericht is verstuurd</h3>
            <p className="mt-3 text-ink-soft max-w-sm leading-relaxed">
              U krijgt een bevestiging in uw mailbox. Lydia leest uw bericht persoonlijk en neemt zo
              snel mogelijk contact met u op.
            </p>
            <button type="button" onClick={onClose} className="btn-terra mt-7">
              Sluiten
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 sm:px-7 py-6 flex flex-col gap-5">
            <p className="text-[15px] text-ink-soft leading-relaxed">
              Woont u ergens anders in het land? Zet uw woonplaats erbij, dan kijken we of er een
              gespecialiseerde therapeut in uw omgeving is.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Voornaam">
                <input type="text" name="firstName" autoComplete="given-name" required className="field" />
              </Field>
              <Field label="Achternaam">
                <input type="text" name="lastName" autoComplete="family-name" required className="field" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="E-mail">
                <input type="email" name="email" autoComplete="email" required className="field" />
              </Field>
              <Field label="Telefoon" optional>
                <input type="tel" name="phone" autoComplete="tel" className="field" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Woonplaats" optional>
                <input type="text" name="city" autoComplete="address-level2" className="field" />
              </Field>
              <Field label="Onderwerp">
                <select
                  name="subject"
                  required
                  className="field"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="" disabled>
                    Kies een onderwerp
                  </option>
                  {Object.entries(subjects).map(([k, label]) => (
                    <option key={k} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Bericht">
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Schrijf kort uw vraag."
                className="field-area"
              />
            </Field>

            <label className="flex items-start gap-2.5 text-[14px] text-ink-soft leading-relaxed">
              <input type="checkbox" name="consent" required className="mt-1 accent-terra w-4 h-4" />
              <span>
                Ik geef toestemming om mijn gegevens te gebruiken om deze vraag te beantwoorden.
              </span>
            </label>

            {useWidget ? (
              <TurnstileWidget siteKey={turnstileSiteKey} resetKey={turnstileResetKey} onTokenChange={handleToken} />
            ) : (
              <input type="hidden" name="cf-turnstile-response" value="dev" />
            )}

            {state === 'error' && errorMsg && (
              <div className="flex items-start gap-2 text-[14px] text-terra-deep bg-terra/8 border border-terra/25 px-3.5 py-3 rounded-xl">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="btn-terra w-full sm:w-auto disabled:opacity-60 disabled:cursor-wait"
              >
                {state === 'submitting' ? 'Versturen...' : 'Verstuur bericht'}
                {state !== 'submitting' && <ArrowRight size={16} strokeWidth={2.5} />}
              </button>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 text-[14px] font-bold text-terra hover:text-terra-deep transition-colors"
              >
                <Phone size={15} strokeWidth={2.5} />
                {SITE.phoneDisplay}
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {optional && (
          <span className="ml-1.5 normal-case tracking-normal text-ink-mute/70 font-normal">(optioneel)</span>
        )}
      </span>
      {children}
    </label>
  );
}

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

function TurnstileWidget({
  siteKey,
  resetKey,
  onTokenChange,
}: {
  siteKey: string;
  resetKey: number;
  onTokenChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tryRender = () => {
      if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile?.render) return false;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: (token: string) => onTokenChange(token),
        'expired-callback': () => onTokenChange(''),
        'error-callback': () => onTokenChange(''),
      });
      return true;
    };
    if (!tryRender()) {
      const interval = setInterval(() => {
        if (tryRender()) clearInterval(interval);
      }, 200);
      return () => {
        cancelled = true;
        clearInterval(interval);
        if (widgetIdRef.current) {
          try {
            window.turnstile?.remove?.(widgetIdRef.current);
          } catch {
            /* widget may already be gone */
          }
          widgetIdRef.current = null;
        }
      };
    }
    return () => {
      cancelled = true;
    };
  }, [siteKey, onTokenChange]);

  useEffect(() => {
    if (widgetIdRef.current) window.turnstile?.reset?.(widgetIdRef.current);
  }, [resetKey]);

  return <div ref={containerRef} className="min-h-[65px]" />;
}
