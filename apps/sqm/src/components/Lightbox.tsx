import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  open: boolean;
  images: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ open, images, index, onClose, onPrev, onNext }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [open, onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, handleKey]);

  if (!open) return null;
  const img = images[index];
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-charcoal-ink/95 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-cream/80 hover:text-cream"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
      >
        <X size={28} />
      </button>

      <button
        type="button"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 text-cream/80 hover:text-cream"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
      >
        <ChevronLeft size={32} />
      </button>

      <img
        src={img.src}
        alt={img.alt}
        className="max-w-full max-h-[80vh] object-contain"
        onClick={(e) => e.stopPropagation()}
        loading="lazy"
        decoding="async"
      />

      <button
        type="button"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 text-cream/80 hover:text-cream"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cream/60 text-sm font-mono tracking-wider">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
