import {
  Flame,
  Thermometer,
  ShowerHead,
  Droplets,
  Wind,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { sectionTitles, services } from '../content';

const iconByKey: Record<string, LucideIcon> = {
  'cv-ketel': Flame,
  verwarming: Thermometer,
  badkamer: ShowerHead,
  lekkage: Droplets,
  ventilatie: Wind,
  leidingwerk: Wrench,
};

export default function Services() {
  return (
    <section id="diensten" className="section bg-ink">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">{sectionTitles.services.eyebrow}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            Alles voor verwarming, water en{' '}
            <span className="text-gradient-gold">comfort</span>.
          </h2>
          <p className="mt-5 text-bone-soft">
            Eén installateur voor verwarming, water en comfort in en rond uw woning.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconByKey[service.key] ?? Wrench;
            return (
              <article
                key={service.key}
                className="card p-6 md:p-7 transition duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-black/30"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-bone-soft">{service.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
