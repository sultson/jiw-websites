import { Brush, PaintRoller, Grid3x3, Hammer, Check, type LucideIcon } from 'lucide-react';
import { services } from '../data/services';

const iconByKey: Record<string, LucideIcon> = {
  stukwerk: Brush,
  schilderwerk: PaintRoller,
  tegelwerk: Grid3x3,
  renovatie: Hammer,
};

export default function Services() {
  return (
    <section id="diensten" className="section bg-bone">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Wat wij doen</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-ink">
            Alles onder één dak.
          </h2>
          <p className="mt-5 text-stone text-base md:text-lg leading-relaxed">
            Van strak stucwerk tot complete renovatie. Vier specialisaties, één aanspreekpunt.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((s) => {
            const Icon = iconByKey[s.key] ?? Brush;
            return (
              <article
                key={s.key}
                className="group flex flex-col gap-4 p-6 rounded-2xl bg-bone border border-line transition-all duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_40px_-20px_rgba(20,24,29,0.25)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-bone transition-colors duration-200 group-hover:bg-gold group-hover:text-ink">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <h3 className="font-display text-xl text-ink leading-tight">{s.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{s.blurb}</p>
                <ul className="mt-1 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
