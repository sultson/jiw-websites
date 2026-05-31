import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Check, AlertCircle, ArrowRight, Phone } from 'lucide-react';
import { SITE } from '../lib/site';
import type { Lang } from '../translations';

type Props = {
  open: boolean;
  onClose: () => void;
  t: (k: string) => string;
  lang: Lang;
  presetSubject?: string;
};

type State = 'idle' | 'submitting' | 'success' | 'error';

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const subjectKeys = ['opleiding', 'behandeling', 'agenda', 'algemeen'] as const;

export default function ContactModal({ open, onClose, t, presetSubject }: Props) {
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
    setSubject(presetSubject ? t(`ct.subject.${presetSubject}`) : '');
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, presetSubject, onClose, t]);

  if (!open) return null;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (useWidget && !turnstileToken) {
      setState('error');
      setErrorMsg(t('ct.turnstileWait'));
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
      if (!response.ok || !result.ok) throw new Error(result.message || t('ct.error'));
      setState('success');
      form.reset();
      setSubject('');
      setTurnstileToken('');
      setTurnstileResetKey((v) => v + 1);
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error && err.message ? err.message : t('ct.error'));
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
            <span className="kicker">{t('ct.eyebrow')}</span>
            <h2 id="contact-modal-title" className="mt-2 font-display text-[26px] leading-tight text-ink">
              {t('ct.title')}
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
            <h3 className="font-display text-[24px] text-ink">{t('ct.successTitle')}</h3>
            <p className="mt-3 text-ink-soft max-w-sm leading-relaxed">{t('ct.successBody')}</p>
            <button type="button" onClick={onClose} className="btn-terra mt-7">
              {t('ct.successClose')}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 sm:px-7 py-6 flex flex-col gap-5">
            <p className="text-[15px] text-ink-soft leading-relaxed">{t('ct.intro')}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('ct.firstName')}>
                <input type="text" name="firstName" autoComplete="given-name" required className="field" />
              </Field>
              <Field label={t('ct.lastName')}>
                <input type="text" name="lastName" autoComplete="family-name" required className="field" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('ct.email')}>
                <input type="email" name="email" autoComplete="email" required className="field" />
              </Field>
              <Field label={t('ct.phone')} optional t={t}>
                <input type="tel" name="phone" autoComplete="tel" className="field" />
              </Field>
            </div>

            <Field label={t('ct.subject')}>
              <select
                name="subject"
                required
                className="field"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="" disabled>
                  {t('ct.subjectPick')}
                </option>
                {subjectKeys.map((k) => (
                  <option key={k} value={t(`ct.subject.${k}`)}>
                    {t(`ct.subject.${k}`)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t('ct.message')}>
              <textarea name="message" required rows={4} placeholder={t('ct.messagePh')} className="field-area" />
            </Field>

            <label className="flex items-start gap-2.5 text-[14px] text-ink-soft leading-relaxed">
              <input type="checkbox" name="consent" required className="mt-1 accent-terra w-4 h-4" />
              <span>{t('ct.consent')}</span>
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
                {state === 'submitting' ? t('ct.submitting') : t('ct.submit')}
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
  t,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
  t?: (k: string) => string;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {optional && t && (
          <span className="ml-1.5 normal-case tracking-normal text-ink-mute/70 font-normal">({t('ct.optional')})</span>
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
