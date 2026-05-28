import { Instagram } from 'lucide-react';
import { marqueeItems } from '../data/marquee';

type Props = { t: (k: string) => string };

export default function Marquee({ t }: Props) {
  const loop = [...marqueeItems, ...marqueeItems];

  return (
    <section id="uit-de-studio" className="py-20 md:py-24 overflow-hidden bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.32em] text-champagne-soft font-medium">
              {t('marquee.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-paper leading-[1.05]">
              {t('marquee.title')}
            </h2>
            <p className="mt-3 text-paper/65 text-sm max-w-md">{t('marquee.sub')}</p>
          </div>
          <a
            href="https://www.instagram.com/salon_lazoa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-paper/25 px-4 py-2 text-sm text-paper/85 hover:border-champagne-soft hover:text-champagne-soft transition-colors"
          >
            <Instagram size={14} />
            {t('marquee.more')}
          </a>
        </div>
      </div>

      <div className="marquee-viewport mt-12 w-full" aria-label="Doorlopende selectie">
        <div className="marquee-track gap-5 pl-5">
          {loop.map((item, i) => (
            <a
              key={`${item.id}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.alt}
              className="group relative w-[72vw] max-w-[280px] shrink-0 overflow-hidden rounded-xl border border-paper/8 bg-ink-soft sm:w-[280px]"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-ink-soft">
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] uppercase tracking-wider text-paper backdrop-blur-sm">
                Instagram
              </span>
              <span className="absolute inset-x-3 bottom-3 text-left text-[13px] font-medium text-paper line-clamp-2">
                {item.alt}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
