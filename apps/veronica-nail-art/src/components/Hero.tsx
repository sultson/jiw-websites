import { Phone, MessageCircle, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-ink">
        <img
          src="/hero.webp?v=20260515"
          alt=""
          className="w-full h-full object-cover object-center opacity-60"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/55 to-ink/90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-28 md:pt-32 md:pb-44 lg:pt-40 lg:pb-52">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold-soft font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-soft" />
            Nagelstudio · Emmeloord
          </span>

          <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.04] sm:text-6xl md:text-7xl text-cream drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]">
            Verzorgde nagels,
            <br />
            met oog voor detail.
          </h1>

          <p className="mt-6 text-cream/90 text-base md:text-lg leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            Bij Veronica Nail Art in Emmeloord krijg je rustig de tijd en vakwerk dat klopt.
            Van een natuurlijke set tot handgeschilderde nail art, helemaal naar jouw wens.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="tel:+31611087951" className="btn-gold">
              <Phone size={16} />
              Bel voor een afspraak
            </a>
            <a
              href="https://wa.me/31611087951"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:bg-cream/10 transition-colors"
              style={{ minHeight: 44 }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-cream/80 text-xs tracking-[0.18em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            <span className="inline-flex items-center gap-1.5">
              <Star size={13} className="text-gold-soft" fill="currentColor" />
              5,0 · Google
            </span>
            <span className="h-px w-6 bg-cream/30" />
            <span>Handgeschilderde nail art</span>
            <span className="h-px w-6 bg-cream/30 hidden sm:block" />
            <span className="hidden sm:block">Op afspraak</span>
          </div>
        </div>
      </div>
    </section>
  );
}
