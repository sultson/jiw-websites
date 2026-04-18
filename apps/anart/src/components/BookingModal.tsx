import { useEffect } from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  t: (k: string) => string;
};

export default function BookingModal({ open, onClose, t }: Props) {
  // Sluit met Escape-toets
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Achtergrond overlay */}
      <div className="absolute inset-0 bg-espresso/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full md:max-w-2xl md:mx-4 bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden"
        style={{ height: '90dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-espresso/8">
          <span className="font-serif text-lg text-espresso">{t('nav.book')}</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-espresso/5 text-espresso/60"
            aria-label="Sluiten"
          >
            <X size={20} />
          </button>
        </div>

        {/* Salonized iframe */}
        <iframe
          src="https://anart-studio.salonized.com/"
          title="Online boeken — AnArt Studio"
          className="w-full"
          style={{ height: 'calc(90dvh - 57px)', border: 0 }}
          allow="payment"
        />
      </div>
    </div>
  );
}
