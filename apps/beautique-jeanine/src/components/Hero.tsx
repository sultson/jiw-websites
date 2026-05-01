import { Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  return (
    <section id="top" className="relative overflow-hidden bg-espresso">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-1 opacity-90">
        <img
          src="/jeanine-salon-portrait.webp"
          alt=""
          className="col-span-2 md:col-span-2 row-span-2 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <img
          src="/salon-exterior.webp"
          alt=""
          className="hidden md:block h-full w-full object-cover object-center"
        />
        <img
          src="/ik-products-event.webp"
          alt=""
          className="hidden md:block h-full w-full object-cover object-center"
        />
        <img
          src="/lash-lift-result.webp"
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <img
          src="/salon-treatment-room.webp"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(20,32,31,0.92) 0%, rgba(20,32,31,0.74) 44%, rgba(20,32,31,0.36) 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: 'linear-gradient(to bottom, rgba(20,32,31,0) 0%, rgba(20,32,31,0.86) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-56">
        <div className="max-w-2xl min-w-0">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold-soft font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-soft" />
            {t('hero.kicker')}
          </span>

          <h1 className="mt-6 font-serif text-[2.05rem] leading-[1.04] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)] max-w-[21rem] sm:max-w-none">
            {t('hero.title')}
          </h1>

          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-[21rem] sm:max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            {t('hero.sub')}
          </p>

          <div className="mt-6 grid max-w-[22rem] grid-cols-1 gap-2 text-cream/85 sm:max-w-xl sm:grid-cols-3">
            {[t('hero.proofOwner'), t('hero.proofSince'), t('hero.proofRating')].map(item => (
              <div
                key={item}
                className="rounded-lg border border-cream/15 bg-cream/10 px-3 py-2 text-xs font-medium backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://wa.me/31623669653"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ minHeight: 44 }}
            >
              <MessageCircle size={16} />
              {t('hero.ctaWa')}
            </a>
            <a
              href="tel:+31623669653"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-lg text-sm font-medium tracking-wide hover:bg-cream/10"
              style={{ minHeight: 44 }}
            >
              <Phone size={16} />
              {t('hero.ctaCall')}
            </a>
          </div>

          <div className="mt-12 flex items-center gap-5 text-cream/75 text-xs tracking-[0.16em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span>{t('hero.socialProof')}</span>
            <span className="h-px w-8 bg-cream/30" />
            <span className="script text-cream/90 text-2xl normal-case tracking-normal -my-2">
              Jeanine
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
