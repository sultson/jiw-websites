import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { teamPhotos } from '../data/projects';
import type { Lang } from '../translations';

type Props = {
  t: (k: string) => string;
  lang: Lang;
};

export default function Team({ t, lang }: Props) {
  const alt = (i: number) =>
    lang === 'en' ? teamPhotos[i]?.altEn : teamPhotos[i]?.altNl;

  const stats = [
    { num: t('tm.stat1'), sub: t('tm.stat1sub') },
    { num: t('tm.stat2'), sub: t('tm.stat2sub') },
    { num: t('tm.stat3'), sub: t('tm.stat3sub') },
  ];

  return (
    <section id="over" className="section bg-bone">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={t('tm.eyebrow')}
              title={t('tm.title')}
              dot="cobalt"
            />
            <Reveal delay={2}>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
                {t('tm.body')}
              </p>
            </Reveal>

            {/* Stat row */}
            <Reveal delay={3}>
              <div className="mt-9 grid grid-cols-3 gap-4 border-t border-line pt-7">
                {stats.map((s) => (
                  <div key={s.sub}>
                    <div className="display-md text-cobalt tnum leading-none">
                      {s.num}
                    </div>
                    <div className="mt-2 text-[13px] leading-snug text-ink-mute font-medium">
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Photo collage — asymmetric */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Large lead photo spans both columns */}
              <Reveal delay={1} className="col-span-2">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl">
                  <img
                    src={teamPhotos[0].src}
                    alt={alt(0)}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={2}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src={teamPhotos[1].src}
                    alt={alt(1)}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={3}>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src={teamPhotos[2].src}
                    alt={alt(2)}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
