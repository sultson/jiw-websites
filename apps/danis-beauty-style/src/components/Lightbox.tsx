import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { InstaPost } from '../data/content';

type Props = {
  items: InstaPost[];
  startIndex: number;
  onClose: () => void;
};

export default function Lightbox({ items, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  setIndex(i => (i - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % items.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [items.length, onClose]);

  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Sluit"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-ink-3/80 text-bone hover:text-gold-bright border border-line flex items-center justify-center"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIndex(i => (i - 1 + items.length) % items.length); }}
        aria-label="Vorige"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ink-3/80 text-bone hover:text-gold-bright border border-line flex items-center justify-center"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIndex(i => (i + 1) % items.length); }}
        aria-label="Volgende"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ink-3/80 text-bone hover:text-gold-bright border border-line flex items-center justify-center"
      >
        <ChevronRight size={20} />
      </button>

      <figure
        className="relative max-w-[min(92vw,720px)] max-h-[82vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.poster}
          alt={item.caption}
          className="rounded-xl object-contain max-h-[72vh] mx-auto"
        />
        <figcaption className="mt-4 flex items-center justify-between gap-4 text-bone-soft text-sm">
          <span className="truncate">{item.caption}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-gold hover:text-gold-bright"
          >
            Instagram <ExternalLink size={12} aria-hidden="true" />
          </a>
        </figcaption>
      </figure>
    </div>
  );
}
