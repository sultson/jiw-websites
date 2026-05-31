import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { trainingen } from '../data/trainingen';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang };

export default function Trainingen({ t, lang }: Props) {
  return (
    <section id="trainingen" className="section bg-terra-ink relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'url(/img/texture-linen.webp)', backgroundSize: 'cover' }}
        aria-hidden
      />
      <div className="shell-wide relative">
        <SectionHeader eyebrow={t('tr.eyebrow')} title={t('tr.title')} intro={t('tr.intro')} tone="light" />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingen.map((tr, i) => (
            <Reveal key={tr.name} delay={(i % 3) as 0 | 1 | 2}>
              <article className="h-full rounded-2xl border border-white/12 bg-white/[0.04] p-5 hover:bg-white/[0.07] hover:border-rose/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[19px] leading-tight text-cream">{tr.name}</h3>
                  <span className="shrink-0 text-[14px] font-bold text-rose tnum">{tr.price[lang]}</span>
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-cream/65">{tr.desc[lang]}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-[14px] text-cream/55">
          {t('tr.dateTbd')} · <a href="#agenda" className="text-rose-soft underline-offset-4 hover:underline">{t('nav.agenda')}</a>
        </p>
      </div>
    </section>
  );
}
