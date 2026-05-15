import {
  Home,
  Sun,
  Wrench,
  Layers,
  Paintbrush,
  Droplets,
  Sparkles,
  Hammer,
  type LucideIcon,
} from 'lucide-react';
import { services, sectionTitles } from '../content';

const iconByKey: Record<string, LucideIcon> = {
  binnen: Home,
  buiten: Sun,
  houtrot: Wrench,
  behangen: Layers,
  sauzen: Paintbrush,
  lakwerk: Droplets,
  stucwerk: Sparkles,
  onderhoud: Hammer,
};

export default function Services() {
  return (
    <section id="diensten" className="section bg-bone">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">{sectionTitles.services.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-ink">
            {sectionTitles.services.title}
          </h2>
          <p className="mt-5 text-stone text-base md:text-lg leading-relaxed">
            Van plafond tot gevel, van behang tot houtrot. Wij verzorgen het hele traject.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((service) => {
            const Icon = iconByKey[service.key] ?? Paintbrush;
            return (
              <article
                key={service.key}
                className="group flex flex-col gap-4 p-6 rounded-2xl bg-bone border border-line transition-all duration-200 hover:-translate-y-1 hover:border-brick hover:shadow-[0_16px_40px_-20px_rgba(22,26,34,0.25)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-bone transition-colors duration-200 group-hover:bg-brick">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <h3 className="font-display text-xl text-ink leading-tight">
                  {service.title}
                </h3>
                <p className="text-stone text-sm leading-relaxed">{service.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
