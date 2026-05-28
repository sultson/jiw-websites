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
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 w-11 h-11 grid place-items-center rounded-full border border-ivory/20 text-ivory hover:bg-ivory/10"
        aria-label="Sluiten"
      >
        <X size={22} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-3 md:left-8 w-11 h-11 grid place-items-center rounded-full border border-ivory/20 text-ivory hover:bg-ivory/10"
        aria-label="Vorige"
      >
        <ChevronLeft size={22} />
      </button>
      <figure
        className="flex max-h-full max-w-3xl flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.alt}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl"
        />
        <figcaption className="mt-4 text-sm text-ivory/65 tracking-wider">
          {index + 1} / {images.length}
        </figcaption>
      </figure>
      <button
        onClick={e => { e.stopPropagation(); onNav(1); }}
        className="absolute right-3 md:right-8 w-11 h-11 grid place-items-center rounded-full border border-ivory/20 text-ivory hover:bg-ivory/10"
        aria-label="Volgende"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
