import { Quote } from 'lucide-react';
import Reveal from './Reveal';
import { SITE } from '../lib/site';

type Props = { t: (k: string) => string };

export default function Over({ t }: Props) {
  return (
    <section id="over" className="section bg-canvas overflow-hidden">
      <div className="shell-wide grid lg:grid-cols-[0.85fr_1fr] gap-10 lg:gap-16 items-center">
        {/* Portrait */}
        <Reveal>
          <div className="relative max-w-sm mx-auto lg:mx-0">
            <div className="absolute -inset-4 sm:-inset-6 bg-sage-wash arch -z-10" aria-hidden />
            <div className="absolute -bottom-5 -right-5 w-28 h-28 rounded-full bg-rose-soft -z-10 float-soft" aria-hidden />
            <img
              src="/lydia-portrait.png"
              alt="Lydia van der Bie"
              className="w-full arch object-cover shadow-[0_30px_70px_-40px_rgba(58,33,24,0.5)]"
              loading="lazy"
            />
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <span className="kicker">{t('over.eyebrow')}</span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="mt-4 display-lg text-ink">{t('over.title')}</h2>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink-soft">
              <p>{t('over.p1')}</p>
              <p>{t('over.p2')}</p>
              <p>{t('over.p3')}</p>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <figure className="mt-7 border-l-2 border-terra pl-5">
              <Quote size={22} className="text-rose mb-1.5" />
              <blockquote className="font-display text-[20px] sm:text-[23px] text-ink leading-snug serif-italic">
                {t('over.quote')}
              </blockquote>
            </figure>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <Stat value={`${SITE.years}`} label={t('over.statYears')} />
              <Stat value={`${SITE.practiceSince}`} label={t('over.statSince')} />
              <Stat value="4–8" label={t('over.statGroup')} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-line pt-3">
      <div className="font-display text-[30px] text-terra leading-none tnum">{value}</div>
      <div className="mt-1.5 text-[12.5px] leading-snug text-ink-mute">{label}</div>
    </div>
  );
}
