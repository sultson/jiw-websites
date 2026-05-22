import { Phone, MessageCircle, Star } from 'lucide-react';
import { business } from '../data/contact';

type Props = { t: (k: string) => string };

function Stars({ size = 16 }: { size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="fill-[#dcb251] text-[#dcb251]" />
      ))}
    </div>
  );
}

export default function Hero({ t }: Props) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink pt-12 md:pt-20 pb-16 md:pb-28"
    >
      {/* Ambient gold glow */}
      <div
        className="pointer-events-none absolute -top-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-gold-deep/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-10">
          {/* Left */}
          <div className="md:col-span-7">
            <span className="kicker">{t('hero.kicker')}</span>

            <h1 className="mt-5 font-serif text-[2.6rem] sm:text-6xl md:text-7xl leading-[1.04] text-bone whitespace-pre-line">
              {t('hero.title')}
            </h1>

            <p className="mt-6 max-w-xl text-base md:text-lg text-bone-soft">
              {t('hero.sub')}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={business.phone.href} className="btn btn-gold">
                <Phone size={16} aria-hidden="true" />
                {t('hero.ctaCall')}
              </a>
              <a
                href={business.phone.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <MessageCircle size={16} aria-hidden="true" />
                {t('hero.ctaWa')}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-bone-soft text-xs tracking-[0.22em] uppercase">
              <span className="inline-flex items-center gap-2">
                <Stars size={14} />
                <span className="font-semibold text-bone">5,0</span> · Google
              </span>
              <span className="h-px w-6 bg-line" />
              <span>{t('hero.proof.style')}</span>
              <span className="h-px w-6 bg-line hidden sm:inline-block" />
              <span className="script text-gold-bright text-3xl normal-case tracking-normal -my-2 hidden sm:inline-block">
                Daniëlle
              </span>
            </div>
          </div>

          {/* Right — Hero video */}
          <div className="md:col-span-5">
            <div className="relative mx-auto max-w-[28rem]">
              <div
                className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-gold/25 via-transparent to-gold-deep/15 blur-2xl"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-5 -right-5 h-28 w-28 md:h-36 md:w-36 rounded-2xl gold-gradient opacity-90"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/60 bg-ink-3">
                <video
                  src="/ig-DTxLgRvDCIC.mp4"
                  poster="/ig-DTxLgRvDCIC.webp"
                  autoPlay
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
