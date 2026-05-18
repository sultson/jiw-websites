import { Sparkles, Brush, Layers, Gem, Footprints, RefreshCw, Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

const items = [
  { icon: Layers,     key: 's1' },
  { icon: Brush,      key: 's2' },
  { icon: Gem,        key: 's3' },
  { icon: Sparkles,   key: 's4' },
  { icon: Footprints, key: 's5' },
  { icon: RefreshCw,  key: 's6' },
];

export default function Services({ t }: Props) {
  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-blush-soft/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 max-w-xl mx-auto">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink/65 text-sm leading-relaxed">{t('services.sub')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map(({ icon: Icon, key }) => (
            <article
              key={key}
              className="card p-6 md:p-7 flex flex-col hover:shadow-[0_18px_44px_-26px_rgba(12,61,82,0.4)] transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center text-pink mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-ink">{t(`services.${key}.t`)}</h3>
              <p className="mt-2.5 text-sm text-ink/65 leading-relaxed">{t(`services.${key}.b`)}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 card px-6 py-6 md:px-8 md:py-7 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <p className="text-sm text-ink/70 leading-relaxed max-w-md">{t('services.note')}</p>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href="tel:+31631674344" className="btn-pink">
              <Phone size={16} />
              {t('visit.ctaCall')}
            </a>
            <a
              href="https://wa.me/31631674344"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
