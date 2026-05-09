import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WorkItem } from '../data/work';

type Props = {
  open: boolean;
  items: WorkItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Lightbox({ open, items, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 h-14 sm:h-16 text-paper">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Sluiten"
          className="w-10 h-10 inline-flex items-center justify-center -mr-2 hover:opacity-80 transition-opacity"
        >
          <X size={22} />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center px-4 sm:px-12 pb-6"
        onClick={onClose}
      >
        <img
          src={item.src}
          alt={item.alt}
          className="max-w-full max-h-[88vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="px-5 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between text-paper">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Vorige"
          className="w-12 h-12 inline-flex items-center justify-center border border-paper/20 hover:border-paper transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
        <p className="hidden sm:block max-w-[60ch] text-center text-sm opacity-80 px-6">
          {item.alt}
        </p>
        <button
          type="button"
          onClick={onNext}
          aria-label="Volgende"
          className="w-12 h-12 inline-flex items-center justify-center border border-paper/20 hover:border-paper transition-colors"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
