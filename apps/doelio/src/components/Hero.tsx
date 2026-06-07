import { ArrowRight } from 'lucide-react';
import type { SiteContent } from '../i18n';
import { WHATSAPP_URL, ECOSYSTEM } from '../data/site';
import WhatsappIcon from './WhatsappIcon';
import TypedTitle from './TypedTitle';
import BrandMark from './BrandMark';

type Props = { c: SiteContent };

export default function Hero({ c }: Props) {
  return (
    <section id="top" className="relative px-4 pt-36 sm:pt-44 lg:pt-52">
      {/* Prismatic thermal haze — a soft glow-on-black band running edge to edge,
          screen-blended and faded out top and bottom so it reads as a quiet,
          low-key atmosphere behind the copy. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/art/hero-haze.webp"
          alt=""
          fetchPriority="high"
          className="absolute inset-x-0 top-1/2 w-full max-w-none -translate-y-1/2 opacity-65 mix-blend-screen"
          style={{
            maskImage: 'linear-gradient(180deg, transparent 0%, #000 32%, #000 68%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 32%, #000 68%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <div className="max-w-[20ch]">
          <p className="reveal label mb-6">{c.hero.label}</p>
        </div>

        <h1
          className="reveal max-w-[16ch] leading-[1.02]"
          style={{ ['--reveal-delay' as string]: '80ms', fontSize: 'clamp(2.7rem, 6.6vw, 5.1rem)', letterSpacing: '-0.03em' }}
        >
          <TypedTitle titleA={c.hero.titleA} titleB={c.hero.titleB} />
        </h1>

        <p
          className="reveal mt-7 max-w-[38ch] text-ink-dim"
          style={{ ['--reveal-delay' as string]: '160ms', fontSize: 'clamp(1.08rem, 1.4vw, 1.3rem)', lineHeight: 1.55 }}
        >
          {c.hero.body}
        </p>

        <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ ['--reveal-delay' as string]: '240ms' }}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsappIcon className="h-[18px] w-[18px]" />
            {c.hero.ctaPrimary}
          </a>
          <a href="#diensten" className="btn btn-glass group">
            {c.hero.ctaSecondary}
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Ecosystem strip */}
        <div className="reveal mt-14 flex flex-wrap items-center gap-x-3 gap-y-3" style={{ ['--reveal-delay' as string]: '340ms' }}>
          <span className="label mr-1">{c.hero.ecosystemLabel}</span>
          {ECOSYSTEM.map((item) => (
            <span
              key={item.label}
              className="glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 text-[0.85rem] text-ink-dim"
            >
              <BrandMark brand={item.brand} className="h-3.5 w-3.5 text-ink/90" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
