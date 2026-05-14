import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects, sectionTitles } from '../content';

function ProjectCarousel({
  slides,
  alt = '',
  autoplayMs = 5000,
}: {
  slides: { src: string; alt: string }[];
  alt?: string;
  autoplayMs?: number;
}) {
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
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), autoplayMs);
    return () => window.clearInterval(id);
  }, [paused, total, autoplayMs]);

  useEffect(
    () => () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    },
    [],
  );

  if (total === 0) return null;

  return (
    <div className="relative overflow-hidden bg-ink/5 h-full w-full">
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt || alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ))}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => {
              prev();
              pauseTemporarily();
            }}
            aria-label="Vorige beeld"
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur-sm transition hover:bg-ink"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              next();
              pauseTemporarily();
            }}
            aria-label="Volgende beeld"
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur-sm transition hover:bg-ink"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => {
                  setIndex(i);
                  pauseTemporarily();
                }}
                aria-label={`Beeld ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-2 bg-white/55 hover:bg-white/85'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Projects() {
  if (projects.length === 0) return null;
  return (
    <section className="section bg-bone-soft">
      <div className="container-page">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow">Projecten</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
            Recent uitgevoerd, in beeld.
          </h2>
          <p className="mt-5 text-stone text-base md:text-lg leading-relaxed">
            Per project meerdere foto&apos;s, automatisch wisselend. Klik om door te bladeren.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.key}
              className="grid overflow-hidden rounded-2xl border border-line bg-bone md:grid-cols-[0.85fr_1fr]"
            >
              <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
                <ProjectCarousel slides={project.images} alt={project.title} />
              </div>
              <div className="p-6 md:p-7 flex flex-col justify-center">
                <h3 className="font-display text-2xl text-ink leading-tight">{project.title}</h3>
                <p className="mt-3 text-stone leading-relaxed text-sm md:text-base">
                  {project.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-stone text-sm">
          {sectionTitles.gallery.title}
        </p>
      </div>
    </section>
  );
}
