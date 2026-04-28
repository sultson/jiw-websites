import { useEffect } from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  t: (key: string) => string;
};

const widgetUrl = 'https://nxkbeautyroom.salonized.com/bookings/new?layout=embed';

export default function BookingModal({ open, onClose, t }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
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
    <div className="booking-shell" role="dialog" aria-modal="true" aria-label={t('nav.book')} onClick={onClose}>
      <div className="booking-frame" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="booking-close" onClick={onClose} aria-label={t('booking.close')}>
          <X size={20} />
        </button>
        <iframe src={widgetUrl} title="Online boeken" allow="payment" />
      </div>
    </div>
  );
}
