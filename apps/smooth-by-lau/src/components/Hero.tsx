import type { CSSProperties } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Hero({ t, onBook }: Props) {
  const titleParts = t('hero.title').split(/(smooth)/i);

  return (
    <section id="top" className="hero-section relative overflow-hidden">
      <div className="absolute inset-0 bg-espresso">
        <img
          src="/hero.webp"
          alt=""
          className="hero-image w-full h-full object-cover opacity-55"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/15 via-espresso/50 to-espresso/88" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] whitespace-pre-line">
            {titleParts.map((part, index) => part.toLowerCase() === 'smooth' ? (
              <em key={index} className="hero-smooth font-normal">
                <span className="sr-only">{part}</span>
                <span aria-hidden="true">
                  {Array.from(part).map((letter, letterIndex) => (
                    <span key={letterIndex} className="hero-smooth-letter" style={{ '--letter-index': letterIndex } as CSSProperties}>
                      <span className="hero-smooth-upright">{letter}</span>
                      <span className="hero-smooth-italic">{letter}</span>
                    </span>
                  ))}
                </span>
              </em>
            ) : part)}
          </h1>
          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-[30ch] sm:max-w-xl text-pretty mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {t('hero.sub')}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button onClick={onBook} className="btn-gold !px-8 !py-4 !text-base !min-h-14">
              {t('hero.ctaBook')}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>

          <a href="#bezoek" className="mt-3 inline-flex min-h-11 items-center gap-2 px-3.5 py-2 text-sm text-cream hover:text-gold-soft transition-colors">
            <MapPin size={15} aria-hidden="true" />
            Berkendreef 11B, Waspik
          </a>
        </div>
      </div>
    </section>
  );
}
