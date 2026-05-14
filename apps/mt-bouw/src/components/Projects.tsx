import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { projects, sectionTitles } from '../content';

type Project = (typeof projects)[number];

function ProjectCarousel({ project, onOpen }: { project: Project; onOpen: (i: number) => void }) {
  const [i, setI] = useState(0);
  const count = project.images.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bone-soft">
      {project.images.map((img, idx) => (
        <button
          key={img.src}
          type="button"
          onClick={() => onOpen(idx)}
          aria-label={`Bekijk foto ${idx + 1} van ${project.title}`}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === i ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </button>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Vorige"
            onClick={(e) => {
              e.stopPropagation();
              setI((v) => (v - 1 + count) % count);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-bone/85 text-ink hover:bg-bone"
          >
            <ChevronLeft size={20} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Volgende"
            onClick={(e) => {
              e.stopPropagation();
              setI((v) => (v + 1) % count);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-bone/85 text-ink hover:bg-bone"
          >
            <ChevronRight size={20} strokeWidth={1.6} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {project.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? 'w-6 bg-bone' : 'w-1.5 bg-bone/60'
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
  const [lightbox, setLightbox] = useState<{ project: number; image: number } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  if (projects.length === 0) return null;

  const active = lightbox ? projects[lightbox.project].images[lightbox.image] : null;

  return (
    <section id="projecten" className="section bg-bone-soft">
      <div className="container-page">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-3">{sectionTitles.projects.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl">{sectionTitles.projects.title}</h2>
          <p className="mt-5 text-stone text-base md:text-lg leading-relaxed">
            Een paar recente klussen uit Rijswijk en omgeving. Per project een korte indruk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, pi) => (
            <article
              key={project.key}
              className="flex flex-col gap-4 bg-bone rounded-2xl p-4 md:p-5 border border-line"
            >
              <ProjectCarousel
                project={project}
                onOpen={(imgIdx) => setLightbox({ project: pi, image: imgIdx })}
              />
              <div className="px-1 pb-1">
                <p className="text-xs uppercase tracking-[0.18em] text-saffron-deep font-semibold">
                  {project.location}
                </p>
                <h3 className="mt-1.5 font-display text-xl leading-tight">{project.title}</h3>
                <p className="mt-2 text-sm text-stone leading-relaxed">{project.scope}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {active && lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4 md:p-10"
        >
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-bone hover:text-saffron"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-full"
          >
            <img
              src={active.src}
              alt={active.alt}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
            <figcaption className="text-bone/80 text-center text-sm mt-4">
              {projects[lightbox.project].title} · {projects[lightbox.project].location}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
