import { useEffect } from 'react';
import { X } from 'lucide-react';

type Props = { open: boolean; onClose: () => void; t: (k: string) => string };

const WIDGET_URL = 'https://smooth-by-lau.salonized.com/bookings/new?layout=embed';

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
      className="fixed inset-0 z-[100] md:bg-espresso/70 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.book')}
    >
      <div
        className="relative w-full h-[100dvh] md:h-[88vh] md:w-[520px] md:max-w-[92vw]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 z-10 w-10 h-10 rounded-full bg-white text-espresso shadow-lg flex items-center justify-center hover:bg-cream"
          style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
          aria-label={t('booking.close')}
        >
          <X size={20} />
        </button>
        <iframe
          src={WIDGET_URL}
          title="Salonized booking"
          className="w-full h-full border-0 bg-white md:rounded-2xl md:shadow-2xl"
          allow="payment"
        />
      </div>
    </div>
  );
}
