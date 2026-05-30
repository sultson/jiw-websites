import { ArrowUpRight } from 'lucide-react';
import { marqueeItems } from '../data/marquee';
import { BrushUnderline, SectionNumber } from './Marks';

type Props = { t: (k: string) => string };

export default function Marquee({ t }: Props) {
  const loop = [...marqueeItems, ...marqueeItems];

  return (
    <section id="uit-de-studio" className="py-24 md:py-32 overflow-hidden bg-washi">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft">
              <SectionNumber n={2} />
              <span className="block w-8 h-px bg-sumi/30" />
              <span>{t('marquee.kicker')}</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-sumi leading-[1.06]">
              {t('marquee.title')}
            </h2>
            <BrushUnderline className="brush mt-5" />
            <p className="mt-5 text-sumi/65 text-[14.5px] leading-relaxed max-w-md">{t('marquee.sub')}</p>
          </div>
          <a
            href="https://www.instagram.com/salon_lazoa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 self-start md:self-auto text-[11px] uppercase tracking-[0.24em] text-sumi/75 hover:text-hinoki transition-colors group"
          >
            <span className="block w-8 h-px bg-sumi/40 group-hover:bg-hinoki transition-colors" />
            {t('marquee.more')}
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <div className="marquee-viewport mt-14 w-full" aria-label="Doorlopende selectie">
        <div className="marquee-track gap-7 pl-5 sm:pl-8">
          {loop.map((item, i) => (
            <a
              key={`${item.id}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.alt}
              className="group relative w-[64vw] max-w-[260px] shrink-0 sm:w-[260px]"
            >
              <div className="paper-mount transition-transform duration-700 ease-out group-hover:-translate-y-1">
                <div className="aspect-[3/4] w-full overflow-hidden bg-stone">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
