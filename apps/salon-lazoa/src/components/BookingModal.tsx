import { useEffect } from 'react';
import { X, ExternalLink, Phone, MessageCircle, Calendar } from 'lucide-react';

type Props = { open: boolean; onClose: () => void; t: (k: string) => string };

const WIDGET_URL = 'https://salonlazoa.salonized.com/widget_bookings/new';

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
      className="fixed inset-0 z-[100] bg-ink/75 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.book')}
    >
      <div
        className="relative w-full max-w-md bg-paper rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-paper-soft text-ink hover:bg-paper-soft/70 flex items-center justify-center"
          aria-label={t('booking.close')}
        >
          <X size={18} />
        </button>

        <div className="px-7 pt-9 pb-7 md:px-9 md:pt-10 md:pb-9">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-champagne">
            <Calendar size={12} />
            Salonized
          </div>

          <h3 className="mt-3 font-serif text-3xl md:text-4xl text-ink leading-tight">
            {t('nav.book')}
          </h3>

          <p className="mt-3 text-sm text-mute leading-relaxed">
            {t('booking.body')}
          </p>

          <a
            href={WIDGET_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setTimeout(onClose, 400)}
            className="mt-6 btn-primary w-full"
          >
            <ExternalLink size={16} />
            {t('booking.cta')}
          </a>

          <div className="mt-7 pt-6 border-t border-ink/8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-mute mb-3">
              {t('booking.alt')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+31683434002"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-3 py-2.5 text-sm text-ink hover:bg-paper-soft"
              >
                <Phone size={14} />
                06 83434002
              </a>
              <a
                href="https://wa.me/31683434002"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-3 py-2.5 text-sm text-ink hover:bg-paper-soft"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="safe-bottom md:safe-bottom-0" />
      </div>
    </div>
  );
}
