import { useEffect } from 'react';
import { X, ExternalLink, Phone, MessageCircle } from 'lucide-react';
import { BrushUnderline } from './Marks';

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
      className="fixed inset-0 z-[100] bg-sumi/80 flex items-end md:items-center justify-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.book')}
    >
      <div
        className="relative w-full max-w-md bg-shoji shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ borderRadius: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 text-sumi/70 hover:text-sumi flex items-center justify-center border border-sumi/15"
          aria-label={t('booking.close')}
          style={{ borderRadius: 1 }}
        >
          <X size={16} />
        </button>

        <div className="px-7 pt-10 pb-8 md:px-10 md:pt-12 md:pb-10">
          <p className="text-[10.5px] uppercase tracking-[0.32em] text-sumi-soft">
            Salonized
          </p>

          <h3 className="mt-3 font-display text-3xl md:text-[2.3rem] text-sumi leading-[1.08]">
            {t('nav.book')}
          </h3>
          <BrushUnderline className="brush mt-4" />

          <p className="mt-6 text-[14.5px] text-sumi/70 leading-[1.7]">
            {t('booking.body')}
          </p>

          <a
            href={WIDGET_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setTimeout(onClose, 400)}
            className="mt-8 btn-sumi w-full"
          >
            <ExternalLink size={14} />
            {t('booking.cta')}
          </a>

          <div className="mt-8 pt-6 border-t border-sumi/10">
            <p className="text-[10.5px] uppercase tracking-[0.28em] text-sumi-soft mb-3">
              {t('booking.alt')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+31683434002"
                className="inline-flex items-center justify-center gap-2 border border-sumi/15 px-3 py-3 text-[12px] uppercase tracking-[0.18em] text-sumi hover:bg-washi"
                style={{ borderRadius: 1 }}
              >
                <Phone size={12} />
                Bel
              </a>
              <a
                href="https://wa.me/31683434002"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-sumi/15 px-3 py-3 text-[12px] uppercase tracking-[0.18em] text-sumi hover:bg-washi"
                style={{ borderRadius: 1 }}
              >
                <MessageCircle size={12} />
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
