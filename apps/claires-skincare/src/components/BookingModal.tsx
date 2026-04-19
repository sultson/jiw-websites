import { useEffect } from 'react';
import { X } from 'lucide-react';

type Props = { open: boolean; onClose: () => void; t: (k: string) => string };

const WIDGET_URL = 'https://widget.treatwell.nl/salon/claire-s-skincare-studio/';

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
      className="fixed inset-0 z-[100] bg-espresso/80 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.book')}
    >
      <div
        className="relative w-full md:max-w-3xl h-[92dvh] md:h-[88vh] bg-cream rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 md:px-7 h-14 border-b border-espresso/5 shrink-0">
          <span className="font-serif text-lg md:text-xl">{t('nav.book')}</span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-espresso/70 hover:text-espresso rounded-full"
            aria-label={t('booking.close')}
          >
            <X size={22} />
          </button>
        </div>
        <iframe
          src={WIDGET_URL}
          title="Treatwell booking"
          className="flex-1 w-full border-0 bg-white"
          allow="payment"
        />
      </div>
    </div>
  );
}
