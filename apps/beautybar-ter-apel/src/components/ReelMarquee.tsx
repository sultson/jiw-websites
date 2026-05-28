import { Play } from 'lucide-react';
import type { Lang } from '../translations';
import { reels } from '../data/reels';

type Props = { lang: Lang; t: (k: string) => string };

const localThumb: Record<string, string> = {
  'r-pearl': '/reel-pearl.webp',
  'r-easter': '/reel-easter.webp',
  'r-correctie': '/reel-correctie.webp',
  'r-xmas': '/reel-xmas.webp',
  'r-custom': '/reel-custom.webp',
  'r-french': '/reel-french.webp',
  'r-frenchies': '/reel-frenchies.webp',
  'r-magnetic': '/reel-magnetic.webp',
};

export default function ReelMarquee({ lang, t }: Props) {
  const items = reels;
  const loop = [...items, ...items];

  return (
    <section id="reels" className="py-20 md:py-24 overflow-hidden bg-ink text-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-champagne-soft font-medium">
              {t('reel.kicker')}
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-cream leading-[1.05]">
              {t('reel.title')}
            </h2>
            <p className="mt-3 text-cream/70 text-sm">{t('reel.sub')}</p>
          </div>
          <a
            href="https://www.facebook.com/people/BeautyBar-Ter-Apel/61552088251660/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-cream/20 px-4 py-2 text-sm text-cream/85 hover:border-rose-soft hover:text-rose-soft"
          >
            <Play size={14} className="text-rose-soft" />
            {lang === 'nl' ? 'Meer op Facebook' : 'More on Facebook'}
          </a>
        </div>
      </div>

      <div
        className="marquee-viewport mt-12 w-full"
        aria-label={lang === 'nl' ? 'Doorlopende reels' : 'Continuous reel showcase'}
      >
        <div className="marquee-track gap-5 pl-5">
          {loop.map((item, i) => (
            <a
              key={`${item.id}-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={lang === 'nl' ? item.labelNl : item.labelEn}
              className="group relative w-[78vw] max-w-[300px] shrink-0 overflow-hidden rounded-2xl border border-cream/10 bg-ink-soft sm:w-[300px]"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-ink-soft">
                <img
                  src={localThumb[item.id] ?? item.thumb}
                  alt={lang === 'nl' ? item.labelNl : item.labelEn}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-cream backdrop-blur-sm">
                Reel
              </span>
              <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-rose text-cream shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)] transition-transform duration-200 group-hover:scale-110">
                <Play size={22} strokeWidth={2.5} className="ml-0.5" fill="currentColor" />
              </span>
              <span className="absolute inset-x-3 bottom-3 text-left text-sm font-medium text-cream">
                {lang === 'nl' ? item.labelNl : item.labelEn}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
