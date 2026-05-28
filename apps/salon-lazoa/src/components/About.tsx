import { Sparkles, BadgeCheck } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="over" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-12 gap-10 md:gap-14 items-center">
        <div className="md:col-span-7 order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.05] max-w-xl">
            {t('about.title')}
          </h2>
          <p className="mt-7 text-ink/75 leading-relaxed max-w-prose">{t('about.body1')}</p>
          <p className="mt-4 text-ink/75 leading-relaxed max-w-prose">{t('about.body2')}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-paper-soft text-ink/80 border border-ink/8">
              <BadgeCheck size={13} className="text-champagne" />
              {t('about.badge1')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-paper-soft text-ink/80 border border-ink/8">
              <Sparkles size={13} className="text-champagne" />
              {t('about.badge2')}
            </span>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <span className="font-display text-3xl md:text-4xl text-ink leading-none">
              {t('about.signature')}
            </span>
            <span className="hidden sm:block h-px flex-1 max-w-16 bg-ink/15" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-mute">
              {t('about.signatureRole')}
            </span>
          </div>
        </div>

        <div className="md:col-span-5 order-1 md:order-2">
          <div className="relative">
            <div className="overflow-hidden rounded-sm shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)]">
              <img
                src="/portrait-zoa-dadi-oil.webp"
                alt="Zoa van Dijk van Salon LaZoa"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 w-36 h-44 overflow-hidden rounded-sm ring-8 ring-paper shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)]">
              <img
                src="/portrait-zoa-working.webp"
                alt="Zoa aan het werk in de salon"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -top-3 -right-3 bg-paper px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-ink/65 border border-ink/10">
              Beek en Donk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
