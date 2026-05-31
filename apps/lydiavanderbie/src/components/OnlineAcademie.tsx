import { ArrowUpRight, Laptop } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { onlinetrainingen } from '../data/onlinetrainingen';
import { SITE } from '../lib/site';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang };

export default function OnlineAcademie({ t, lang }: Props) {
  return (
    <section className="section bg-canvas">
      <div className="shell-wide">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionHeader eyebrow={t('online.eyebrow')} title={t('online.title')} intro={t('online.intro')} />
          <Reveal>
            <a
              href={SITE.onlineAcademy}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sage shrink-0"
            >
              <Laptop size={16} strokeWidth={2.2} />
              {t('online.cta')}
              <ArrowUpRight size={16} strokeWidth={2.4} />
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlinetrainingen.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) as 0 | 1 | 2}>
              <article className="card h-full flex overflow-hidden group hover:border-sage/50 transition-colors">
                <div className="relative w-28 sm:w-32 shrink-0 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-[18px] leading-tight text-ink">{c.name}</h3>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{c.desc[lang]}</p>
                  <span className="mt-3 inline-block chip chip-sage">{c.price[lang]}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-[14px] text-ink-mute">{t('online.note')}</p>
      </div>
    </section>
  );
}
