import { ArrowRight } from 'lucide-react';
import { projects, sectionTitles } from '../content';
import { useOfferte } from '../contexts/OfferteContext';
import ProjectCarousel from './ProjectCarousel';

export default function Projects() {
  const { open: openOfferte } = useOfferte();

  return (
    <section id="projecten" className="section bg-ink text-bone">
      <div className="container-page">
        <div className="grid md:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          <div className="md:col-span-6">
            <p className="eyebrow text-brick">{sectionTitles.projects.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-bone">
              {sectionTitles.projects.title}
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="text-bone/75 text-base md:text-lg leading-relaxed">
              Een paar voorbeelden van onze recente projecten in Rotterdam en omstreken. Van complete
              buitenrenovaties tot strakke badkamers.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.key}
              className="overflow-hidden rounded-2xl bg-ink-soft border border-bone/10 flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-ink">
                <ProjectCarousel slides={p.slides} alt={p.title} />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-2xl leading-tight text-bone">{p.title}</h3>
                <p className="mt-3 text-bone/75 leading-relaxed flex-1">{p.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button type="button" onClick={openOfferte} className="btn btn-primary">
            Bespreek uw project
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
