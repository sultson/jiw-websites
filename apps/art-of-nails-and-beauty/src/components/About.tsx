import { Award } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Portrait */}
          <div className="reveal relative order-1 lg:order-none">
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="rounded-[1.75rem] overflow-hidden shadow-[0_36px_70px_-38px_rgba(83,45,53,0.5)] ring-1 ring-white/60 -rotate-[1.5deg]">
                <img
                  src="/about-miriam.webp"
                  alt="Miriam Jenis, eigenaar van Art of Nails & Beauty"
                  className="w-full h-full object-cover aspect-[4/5]"
                  loading="lazy"
                  width={720}
                  height={880}
                />
              </div>
              <div className="absolute -bottom-5 -right-2 sm:right-4 card-gloss px-4 py-3 flex items-center gap-2.5 rotate-2">
                <Award size={18} className="text-wine shrink-0" />
                <span className="text-sm font-medium text-ink leading-tight">{t('about.badge')}</span>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="reveal">
            <span className="kicker">{t('about.kicker')}</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t('about.title')}</h2>
            <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>
            <p className="mt-7 font-serif italic text-2xl text-wine">{t('about.sig')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
