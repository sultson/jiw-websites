import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Img = { src: string; alt: string };

type Props = {
  images: Img[];
  index: number | null;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
};

export default function Lightbox({ images, index, onClose, onNav }: Props) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onNav(-1);
      else if (e.key === 'ArrowRight') onNav(1);
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
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute right-3 top-3 sm:right-6 sm:top-6 w-11 h-11 rounded-full bg-white/10 text-pearl flex items-center justify-center hover:bg-white/20"
        aria-label="Sluiten"
      >
        <X size={22} />
      </button>

      <button
        type="button"
        onClick={e => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-6 w-11 h-11 rounded-full bg-white/10 text-pearl flex items-center justify-center hover:bg-white/20"
        aria-label="Vorige"
      >
        <ChevronLeft size={24} />
      </button>

      <figure onClick={e => e.stopPropagation()} className="flex flex-col items-center max-w-3xl max-h-full">
        <img
          src={img.src}
          alt={img.alt}
          className="max-h-[80vh] w-auto rounded-xl object-contain"
        />
        <figcaption className="mt-3 text-sm text-pearl/70">
          {index + 1} / {images.length}
        </figcaption>
      </figure>

      <button
        type="button"
        onClick={e => { e.stopPropagation(); onNav(1); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-6 w-11 h-11 rounded-full bg-white/10 text-pearl flex items-center justify-center hover:bg-white/20"
        aria-label="Volgende"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
