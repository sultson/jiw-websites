import { GraduationCap } from 'lucide-react';

type Props = { t: (k: string) => string };

const certs = [
  { src: '/cert-kwiaty.webp', titleKey: 'training.cert1', dateKey: 'training.cert1.date' },
  { src: '/cert-flowers.webp', titleKey: 'training.cert2', dateKey: 'training.cert2.date' },
] as const;

export default function Training({ t }: Props) {
  return (
    <section id="opleiding" className="py-16 md:py-20 border-t border-espresso/5">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <span className="kicker inline-flex items-center gap-2">
              <GraduationCap size={14} />
              {t('training.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl leading-[1.1]">{t('training.title')}</h2>
            <p className="mt-3 text-sm text-espresso/65 leading-relaxed">{t('training.body')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {certs.map(c => (
            <figure
              key={c.src}
              className="card overflow-hidden"
            >
              <div className="aspect-square overflow-hidden bg-blush-soft">
                <img
                  src={c.src}
                  alt={t(c.titleKey)}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="px-4 py-3 md:px-5 md:py-4">
                <p className="text-sm font-medium text-espresso">{t(c.titleKey)}</p>
                <p className="text-xs text-espresso/55 mt-0.5">{t(c.dateKey)}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
