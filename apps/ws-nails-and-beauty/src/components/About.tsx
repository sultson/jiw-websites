import { Quote } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  const tags = [t('about.tag1'), t('about.tag2'), t('about.tag3'), t('about.tag4')];

  return (
    <section id="wendy" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-12 gap-10 md:gap-14 items-center">
        <div className="md:col-span-7 order-2 md:order-1">
          <span className="kicker">{t('about.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">{t('about.title')}</h2>
          <p className="mt-6 text-plum/75 leading-relaxed max-w-prose">{t('about.p1')}</p>
          <p className="mt-4 text-plum/75 leading-relaxed max-w-prose">{t('about.p2')}</p>

          <figure className="mt-7 rounded-2xl bg-blush-soft/70 border border-plum/5 p-5 md:p-6">
            <Quote size={18} className="text-rose mb-2" />
            <blockquote className="font-serif italic text-lg md:text-xl text-plum leading-snug">
              {t('about.quote')}
            </blockquote>
            <figcaption className="mt-3 text-xs text-plum/55 tracking-widest uppercase">
              — {t('about.quoteFor')}
            </figcaption>
          </figure>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blush text-plum/80 border border-plum/8"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 order-1 md:order-2">
          <div className="relative">
            <div className="rounded-2xl w-full aspect-[4/5] bg-blush overflow-hidden shadow-[0_20px_60px_-30px_rgba(42,24,32,0.4)]">
              <img
                src="/owner/wendy-portret.webp"
                alt="Wendy Slabbekoorn, eigenaresse en gecertificeerde nagelstyliste"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Small floating card */}
            <div className="hidden md:flex absolute -bottom-6 -left-6 items-center gap-3 bg-porcelain rounded-2xl px-4 py-3 shadow-[0_18px_40px_-20px_rgba(42,24,32,0.35)] border border-plum/5">
              <div className="w-10 h-10 rounded-full bg-rose/15 text-rose flex items-center justify-center text-sm font-medium">W</div>
              <div className="leading-tight">
                <p className="font-serif text-base text-plum">Wendy Slabbekoorn</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-plum/55">Nagelstyliste</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
