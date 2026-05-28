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
      className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-paper p-2 rounded-full hover:bg-paper/10"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-2 md:left-6 text-paper p-2 rounded-full hover:bg-paper/10"
        aria-label="Previous"
      >
        <ChevronLeft size={28} />
      </button>
      <figure className="flex flex-col items-center max-w-4xl" onClick={e => e.stopPropagation()}>
        <img
          src={img.src}
          alt={img.alt}
          className="max-w-full max-h-[82vh] object-contain rounded-md"
        />
        <figcaption className="mt-4 text-sm text-paper/70 text-center">
          {img.alt} · {index + 1} / {images.length}
        </figcaption>
      </figure>
      <button
        onClick={e => { e.stopPropagation(); onNav(1); }}
        className="absolute right-2 md:right-6 text-paper p-2 rounded-full hover:bg-paper/10"
        aria-label="Next"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
