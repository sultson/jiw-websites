import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Images } from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import { sectionTitles, projects, ui, type Project } from '../content';

/* ------------------------------------------------------------------ */
/* Project lightbox                                                    */
/* ------------------------------------------------------------------ */

function ProjectLightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t } = useSite();
  const [index, setIndex] = useState(0);
  const count = project.images.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, prev, next]);

  const img = project.images[index];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t(project.title)}
    >
      <button
        type="button"
        className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border border-line bg-ink-2/80 text-bone-soft transition-colors hover:border-orange hover:text-orange sm:right-6 sm:top-6"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Sluiten"
      >
        <X size={22} />
      </button>

      {count > 1 && (
        <button
          type="button"
          className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink-2/80 text-bone-soft transition-colors hover:border-orange hover:text-orange sm:left-6"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Vorige"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <figure
        className="flex max-h-full max-w-4xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={t(img.alt)}
          loading="eager"
          decoding="async"
          className="max-h-[74vh] w-auto rounded-xl object-contain"
        />
        <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm">
          <span className="font-bold text-bone">{t(project.title)}</span>
          <span className="text-mute">{t(img.alt)}</span>
          <span className="text-mute">
            {index + 1} / {count}
          </span>
        </figcaption>
      </figure>

      {count > 1 && (
        <button
          type="button"
          className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink-2/80 text-bone-soft transition-colors hover:border-orange hover:text-orange sm:right-6"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Volgende"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project tile                                                        */
/* ------------------------------------------------------------------ */

const tileSpans = [
  'lg:col-span-7 lg:row-span-2',
  'lg:col-span-5 lg:row-span-1',
  'lg:col-span-5 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
  'lg:col-span-4 lg:row-span-1',
];

function ProjectTile({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (i: number) => void;
}) {
  const { t } = useSite();
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`group relative overflow-hidden rounded-xl border border-line bg-ink-3 text-left ${tileSpans[index] ?? ''}`}
      aria-label={`${t(ui.viewProject)}: ${t(project.title)}`}
    >
      <img
        src={project.images[0].src}
        alt={t(project.images[0].alt)}
        loading="lazy"
        decoding="async"
        className="h-full min-h-[15rem] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

      <span className="absolute left-4 top-4 inline-flex items-center rounded-md bg-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-bone">
        {t(project.tag)}
      </span>
      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-bone-soft backdrop-blur-sm">
        <Images size={13} aria-hidden="true" />
        {project.images.length} {t(ui.projectPhotos)}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-extrabold text-bone md:text-2xl">{t(project.title)}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
          <MapPin size={14} aria-hidden="true" />
          {project.place}
        </p>
        <p className="mt-2 max-w-md text-sm text-bone-soft">{t(project.blurb)}</p>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Projecten() {
  const { t } = useSite();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="projecten" className="section bg-ink-2">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">{t(sectionTitles.projecten.eyebrow)}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            {t(sectionTitles.projecten.titleStart)}
            <span className="text-orange">{t(sectionTitles.projecten.titleEm)}</span>
            {t(sectionTitles.projecten.titleEnd)}
          </h2>
          <p className="mt-5 text-bone-soft">{t(sectionTitles.projecten.intro)}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-12">
          {projects.map((project, i) => (
            <ProjectTile key={project.title.nl} project={project} index={i} onOpen={setOpenIdx} />
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <ProjectLightbox project={projects[openIdx]} onClose={() => setOpenIdx(null)} />
      )}
    </section>
  );
}
