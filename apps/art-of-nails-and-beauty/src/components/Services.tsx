import { Gem, Layers3, Brush, Sparkle, Leaf, Wrench, Info } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const SERVICES = [
  { icon: Gem, t: 'svc.1.t', d: 'svc.1.d' },
  { icon: Layers3, t: 'svc.2.t', d: 'svc.2.d' },
  { icon: Brush, t: 'svc.3.t', d: 'svc.3.d' },
  { icon: Sparkle, t: 'svc.4.t', d: 'svc.4.d' },
  { icon: Leaf, t: 'svc.5.t', d: 'svc.5.d' },
  { icon: Wrench, t: 'svc.6.t', d: 'svc.6.d' },
] as const;

export default function Services({ t, onBook }: Props) {
  return (
    <section id="services" className="scroll-mt-20 bg-petal/50 border-y border-wine/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="kicker">{t('svc.kicker')}</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('svc.title')}</h2>
          <p className="mt-5 text-ink-soft leading-relaxed">{t('svc.sub')}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon: Icon, t: tt, d }) => (
            <div
              key={tt}
              className="reveal card-gloss p-6 md:p-7 group hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="grid place-items-center w-12 h-12 rounded-2xl text-wine bg-gradient-to-br from-white to-blush ring-1 ring-wine/10 shadow-sm">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-serif text-2xl">{t(tt)}</h3>
              <p className="mt-2.5 text-sm text-ink-soft leading-relaxed">{t(d)}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 card-gloss px-6 py-5">
          <p className="flex items-start gap-2.5 text-sm text-ink-soft max-w-xl">
            <Info size={18} className="text-wine shrink-0 mt-0.5" />
            {t('svc.note')}
          </p>
          <button onClick={onBook} className="btn-gloss shrink-0">
            {t('nav.book')}
          </button>
        </div>
      </div>
    </section>
  );
}
