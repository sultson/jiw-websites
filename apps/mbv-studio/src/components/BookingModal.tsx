import { useEffect, useState } from 'react';
import { X, ExternalLink, Loader2 } from 'lucide-react';

type Props = { open: boolean; onClose: () => void; t: (k: string) => string };

const WIDGET_URL = 'https://apnt.app/mbvstudio';

export default function BookingModal({ open, onClose, t }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
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
      className="fixed inset-0 z-[100] bg-ink/70 md:backdrop-blur-sm flex items-end md:items-center md:justify-center md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('booking.title')}
    >
      <div
        className="relative w-full h-[92dvh] md:h-[86vh] md:w-[460px] md:max-w-[94vw] bg-cream rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5 border-b border-ink/8 bg-cream">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display text-lg tracking-[0.08em] text-ink">MBV</span>
            <span className="text-xs text-ink-mute truncate">{t('booking.title')}</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 -mr-1 rounded-full text-ink hover:bg-ink/5 flex items-center justify-center"
            aria-label={t('booking.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Iframe + loading state */}
        <div className="relative flex-1 bg-white">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-mute">
              <Loader2 size={26} className="animate-spin text-rose" />
              <span className="text-xs tracking-wide">{t('booking.loading')}</span>
            </div>
          )}
          <iframe
            src={WIDGET_URL}
            title={t('booking.title')}
            onLoad={() => setLoaded(true)}
            className="w-full h-full border-0 bg-white"
            allow="payment; clipboard-write"
          />
        </div>

        {/* Fallback */}
        <div className="shrink-0 border-t border-ink/8 bg-cream px-5 py-2.5 safe-bottom text-center">
          <a
            href={WIDGET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-ink-mute hover:text-ink"
          >
            {t('booking.newTab')} <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
