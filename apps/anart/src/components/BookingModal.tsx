import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  t: (k: string) => string;
};

const TOP_CLIP   = 75;   // Salonized nav hoogte
const BOT_CLIP   = 170;  // Salonized footer + "Book appointment" knop

export default function BookingModal({ open, onClose, t }: Props) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Open-animatie
  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    } else {
      setAnimate(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape-toets + scroll lock
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

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center"
      onClick={onClose}
      style={{ transition: 'background 300ms', background: animate ? 'rgba(30,20,15,0.55)' : 'transparent' }}
    >
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ opacity: animate ? 1 : 0, transition: 'opacity 300ms' }}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full md:max-w-lg md:mx-4 bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden"
        style={{
          height: '95dvh',
          maxHeight: 740,
          // Mobiel: slide omhoog; desktop: fade + scale
          transform: animate
            ? 'translateY(0) scale(1)'
            : 'translateY(40px) scale(0.97)',
          opacity: animate ? 1 : 0,
          transition: 'transform 300ms cubic-bezier(0.32,0.72,0,1), opacity 280ms ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Zwevende sluitknop */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-espresso text-cream shadow-lg hover:bg-espresso/80 transition-colors"
          aria-label="Sluiten"
        >
          <X size={18} />
        </button>

        {/* Salonized iframe — nav bovenaan verborgen, footer onderaan verborgen */}
        <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
          <iframe
            src="https://anart-studio.salonized.com/bookings/new"
            title="Online boeken — AnArt Studio"
            style={{
              border: 0,
              position: 'absolute',
              top: -TOP_CLIP,
              left: 0,
              width: '100%',
              height: `calc(100% + ${TOP_CLIP}px)`,
            }}
            allow="payment"
          />
          {/* Witte overlay bedekt Salonized footer */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: BOT_CLIP,
            background: 'white',
            pointerEvents: 'none',
          }} />
        </div>
      </div>
    </div>
  );
}
