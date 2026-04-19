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

  return (
    <div
      className="fixed inset-0 z-[100] bg-espresso/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-cream p-2 rounded-full hover:bg-cream/10"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onNav(-1); }}
        className="absolute left-2 md:left-6 text-cream p-2 rounded-full hover:bg-cream/10"
        aria-label="Previous"
      >
        <ChevronLeft size={28} />
      </button>
      <img
        src={images[index].src}
        alt={images[index].alt}
        className="max-w-full max-h-[85vh] object-contain rounded-xl"
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={e => { e.stopPropagation(); onNav(1); }}
        className="absolute right-2 md:right-6 text-cream p-2 rounded-full hover:bg-cream/10"
        aria-label="Next"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
