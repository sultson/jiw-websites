import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  items: { src: string; alt: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ items, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
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
  }, [onClose, onPrev, onNext]);

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/90 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-cream p-2 rounded-full hover:bg-cream/10"
        aria-label="Sluiten"
      >
        <X size={24} />
      </button>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-2 md:left-6 text-cream p-2 rounded-full hover:bg-cream/10"
        aria-label="Vorige foto"
      >
        <ChevronLeft size={28} />
      </button>
      <img
        src={item.src}
        alt={item.alt}
        className="max-w-full max-h-[85dvh] object-contain rounded-xl"
        onClick={e => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-2 md:right-6 text-cream p-2 rounded-full hover:bg-cream/10"
        aria-label="Volgende foto"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
