import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  src: string | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeLabel: string;
  alt: string;
};

export default function Lightbox({ src, index, total, onClose, onPrev, onNext, closeLabel, alt }: Props) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [src, onClose, onPrev, onNext]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-4 right-4 p-2 text-paper/85 hover:text-paper"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <X size={24} />
      </button>

      <button
        type="button"
        className="absolute left-2 sm:left-4 p-2 text-paper/85 hover:text-paper"
        aria-label="Previous"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <ChevronLeft size={32} />
      </button>

      <button
        type="button"
        className="absolute right-2 sm:right-4 p-2 text-paper/85 hover:text-paper"
        aria-label="Next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <ChevronRight size={32} />
      </button>

      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-[88vh] object-contain shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-paper/65 text-xs font-mono tracking-[0.22em]">
        {index + 1} / {total}
      </div>
    </div>
  );
}
