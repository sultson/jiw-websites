import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  images: { src: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onNav: (dir: -1 | 1) => void;
};

export default function Lightbox({ images, index, onClose, onNav }: Props) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, onClose, onNav]);

  if (index === null) return null;

  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-sumi/96 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-shoji/80 hover:text-shoji p-2"
        aria-label="Close"
      >
        <X size={22} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-2 md:left-6 text-shoji/80 hover:text-shoji p-2"
        aria-label="Previous"
      >
        <ChevronLeft size={26} />
      </button>
      <figure className="flex flex-col items-center max-w-4xl" onClick={e => e.stopPropagation()}>
        <div className="paper-mount" style={{ padding: 12, background: 'oklch(0.972 0.006 78)' }}>
          <img
            src={img.src}
            alt={img.alt}
            className="max-w-full max-h-[78vh] object-contain"
          />
        </div>
        <figcaption className="mt-5 flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-shoji/70">
          <span className="block w-5 h-px bg-shoji/40" />
          <span>{img.alt}</span>
          <span className="block w-5 h-px bg-shoji/40" />
          <span>{index + 1} / {images.length}</span>
        </figcaption>
      </figure>
      <button
        onClick={e => { e.stopPropagation(); onNav(1); }}
        className="absolute right-2 md:right-6 text-shoji/80 hover:text-shoji p-2"
        aria-label="Next"
      >
        <ChevronRight size={26} />
      </button>
    </div>
  );
}
