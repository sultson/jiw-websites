import { useEffect } from 'react';
import { X, Phone, MessageCircle, Mail, ChevronRight } from 'lucide-react';
import { hours, formatHoursShort } from '../data/hours';
import { site } from '../data/site';
import type { Lang } from '../translations';

type Props = { open: boolean; onClose: () => void; t: (k: string) => string; lang: Lang };

export default function ContactModal({ open, onClose, t, lang }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const dayName = (h: { nl: string; en: string }) => (lang === 'en' ? h.en : h.nl);
  const today = new Date().getDay();
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('wa.text'))}`;

  const options = [
    { href: `tel:${site.phoneE164}`, Icon: Phone, label: t('contact.call'), external: false, accent: false },
    { href: waHref, Icon: MessageCircle, label: t('contact.whatsapp'), external: true, accent: true },
    { href: `mailto:${site.email}`, Icon: Mail, label: t('contact.email'), external: false, accent: false },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('contact.title')}
    >
      <div
        className="relative w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl safe-bottom"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-ink shadow flex items-center justify-center hover:bg-blush"
          aria-label={t('contact.close')}
        >
          <X size={18} />
        </button>

        <div className="px-6 sm:px-8 pt-8 pb-7">
          <h3 className="font-serif text-3xl text-ink">{t('contact.title')}</h3>
          <p className="mt-2 text-sm text-ink/60 leading-relaxed">{t('contact.sub')}</p>

          <div className="mt-6 space-y-3">
            {options.map(({ href, Icon, label, external, accent }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-colors ${
                  accent
                    ? 'bg-plum text-cream border-transparent hover:opacity-90'
                    : 'bg-white text-ink border-ink/10 hover:border-plum/40'
                }`}
              >
                <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  accent ? 'bg-white/15 text-cream' : 'bg-blush text-plum'
                }`}>
                  <Icon size={18} />
                </span>
                <span className="flex-1 font-medium text-sm">{label}</span>
                <ChevronRight size={18} className={accent ? 'text-cream/70' : 'text-ink/30'} />
              </a>
            ))}
          </div>

          <div className="mt-7 pt-6 border-t border-ink/10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-plum mb-3">{t('contact.hoursTitle')}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {hours.map(h => (
                <li
                  key={h.dayIndex}
                  className={`flex justify-between gap-3 ${
                    h.dayIndex === today ? 'font-semibold text-ink' : 'text-ink/65'
                  }`}
                >
                  <span>{dayName(h)}</span>
                  <span className="tabular-nums">{formatHoursShort(h)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
