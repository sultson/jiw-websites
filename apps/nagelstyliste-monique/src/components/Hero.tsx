import { Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Hero({ t }: Props) {
  return (
    <section id="top" className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0">
        <img
          src="/hero.webp"
          alt=""
          className="w-full h-full object-cover object-right"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(251,247,245,0.97) 0%, rgba(251,247,245,0.92) 34%, rgba(251,247,245,0.55) 60%, rgba(251,247,245,0.12) 100%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-24 md:pt-28 md:pb-36 lg:pt-32 lg:pb-44">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 kicker">
            <span className="w-1.5 h-1.5 rounded-full bg-pink" />
            {t('hero.kicker')}
          </span>

          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.04] sm:text-6xl md:text-7xl text-ink whitespace-pre-line">
            {t('hero.title')}
          </h1>

          <p className="mt-6 text-ink/70 text-base md:text-lg leading-relaxed max-w-md">
            {t('hero.sub')}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:+31631674344" className="btn-pink">
              <Phone size={16} />
              {t('hero.ctaCall')}
            </a>
            <a
              href="https://wa.me/31631674344"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ink/20 text-ink px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-white transition-colors"
              style={{ minHeight: 46 }}
            >
              <MessageCircle size={16} />
              {t('hero.ctaWa')}
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4 text-ink/60 text-xs tracking-[0.18em] uppercase">
            <span>{t('hero.rating')}</span>
            <span className="h-px w-8 bg-ink/20" />
            <span className="script text-pink text-2xl normal-case tracking-normal -my-1">
              {t('hero.signoff')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
