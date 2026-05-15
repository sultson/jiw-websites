import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  slides: string[];
  alt?: string;
  className?: string;
  autoplayMs?: number;
  loadingFirst?: 'eager' | 'lazy';
};

export default function ProjectCarousel({
  slides,
  alt = '',
  className = 'absolute inset-0',
  autoplayMs = 5500,
  loadingFirst = 'lazy',
}: Props) {
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  const pauseTemporarily = useCallback(() => {
    setPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setPaused(false), 10000);
  }, []);

  useEffect(() => {
    if (paused || total < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [paused, total, autoplayMs]);

  useEffect(
    () => () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    },
    [],
  );

  if (total === 0) return null;

  const stop = (event: ReactMouseEvent | ReactKeyboardEvent) => event.stopPropagation();

  return (
    <div className={`overflow-hidden ${className}`}>
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? loadingFirst : 'lazy'}
          decoding="async"
          draggable={false}
        />
      ))}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              stop(event);
              prev();
              pauseTemporarily();
            }}
            onKeyDown={stop}
            aria-label="Vorige beeld"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/65 text-bone backdrop-blur-sm transition hover:bg-ink/90 focus-visible:bg-ink/90"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              stop(event);
              next();
              pauseTemporarily();
            }}
            onKeyDown={stop}
            aria-label="Volgende beeld"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/65 text-bone backdrop-blur-sm transition hover:bg-ink/90 focus-visible:bg-ink/90"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={(event) => {
                  stop(event);
                  setIndex(i);
                  pauseTemporarily();
                }}
                onKeyDown={stop}
                aria-label={`Beeld ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-bone' : 'w-2 bg-bone/55 hover:bg-bone/85'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
