import { useEffect } from 'react';
import { X, ExternalLink, Phone, MessageCircle, Calendar } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { open: boolean; onClose: () => void; t: (k: string) => string };

export default function BookingModal({ open, onClose, t }: Props) {
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

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.book')}
    >
      <div
        className="relative w-full md:w-[480px] md:max-w-[92vw] bg-pearl md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 w-10 h-10 rounded-full bg-white/90 text-ink shadow-sm flex items-center justify-center hover:bg-white"
          aria-label={t('booking.close')}
        >
          <X size={18} />
        </button>

        <div className="relative px-7 pt-10 pb-6 bg-gradient-to-b from-blush/60 to-pearl">
          <div className="w-12 h-12 rounded-full bg-rose/15 flex items-center justify-center text-rose">
            <Calendar size={20} />
          </div>
          <h3 className="mt-4 font-serif text-3xl md:text-4xl text-ink leading-tight">
            {t('nav.book')}
          </h3>
          <p className="mt-2 text-sm text-ink/65 max-w-sm">{t('visit.hoursSub')}</p>
        </div>

        <div className="px-7 pb-8 pt-2 space-y-3 safe-bottom">
          <a
            href={contact.freshaVenue}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 w-full bg-ink text-pearl rounded-2xl px-5 py-4 hover:bg-ink-soft transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-rose flex items-center justify-center">
                <Calendar size={16} className="text-pearl" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium">{t('booking.open')}</span>
                <span className="block text-xs text-pearl/60">fresha.com</span>
              </span>
            </span>
            <ExternalLink size={16} className="text-pearl/70" />
          </a>

          <a
            href={contact.phoneTel}
            className="flex items-center justify-between gap-3 w-full bg-white border border-ink/10 rounded-2xl px-5 py-4 hover:border-ink/20 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-blush flex items-center justify-center">
                <Phone size={16} className="text-rose" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-ink">{t('faq.a1.call')}</span>
                <span className="block text-xs text-ink/55">{contact.phoneDisplay}</span>
              </span>
            </span>
          </a>

          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 w-full bg-white border border-ink/10 rounded-2xl px-5 py-4 hover:border-ink/20 transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-blush flex items-center justify-center">
                <MessageCircle size={16} className="text-rose" />
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-ink">WhatsApp</span>
                <span className="block text-xs text-ink/55">{contact.phoneDisplay}</span>
              </span>
            </span>
          </a>

          <p className="text-center text-[11px] text-ink/45 pt-2">
            {t('visit.langsList')}
          </p>
        </div>
      </div>
    </div>
  );
}
