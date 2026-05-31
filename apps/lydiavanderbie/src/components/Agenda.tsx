import { ArrowRight, CalendarDays } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { agenda, type AgendaItem } from '../data/agenda';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang; onOpen: (subject?: string) => void };

const tagStyles: Record<AgendaItem['tag'], string> = {
  opleiding: 'chip-terra',
  training: 'chip-sage',
  examen: 'chip-rose',
};

const tagLabel: Record<AgendaItem['tag'], Record<Lang, string>> = {
  opleiding: { nl: 'Opleiding', en: 'Course' },
  training: { nl: 'Training', en: 'Training' },
  examen: { nl: 'Examen', en: 'Exam' },
};

export default function Agenda({ t, lang, onOpen }: Props) {
  const locale = lang === 'nl' ? 'nl-NL' : 'en-GB';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = agenda
    .map((item) => ({ ...item, d: new Date(`${item.date}T00:00:00`) }))
    .filter((item) => item.d >= today)
    .sort((a, b) => a.d.getTime() - b.d.getTime());

  // group by year-month
  const groups: { key: string; label: string; items: typeof upcoming }[] = [];
  for (const item of upcoming) {
    const key = `${item.d.getFullYear()}-${item.d.getMonth()}`;
    const label = item.d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, label, items: [] };
      groups.push(g);
    }
    g.items.push(item);
  }

  return (
    <section id="agenda" className="section bg-sand relative overflow-hidden">
      <div className="absolute inset-0 wash-rose pointer-events-none" aria-hidden />
      <div className="shell relative">
        <SectionHeader eyebrow={t('agenda.eyebrow')} title={t('agenda.title')} intro={t('agenda.intro')} />

        {groups.length === 0 ? (
          <p className="mt-10 text-[16px] text-ink-soft max-w-xl">{t('agenda.empty')}</p>
        ) : (
          <div className="mt-12 flex flex-col gap-10">
            {groups.map((g) => (
              <Reveal key={g.key}>
                <div>
                  <h3 className="font-display text-[22px] text-terra capitalize flex items-center gap-2.5">
                    <CalendarDays size={18} className="text-sage-deep" />
                    {g.label}
                  </h3>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {g.items.map((item) => {
                      const weekday = item.d.toLocaleDateString(locale, { weekday: 'short' });
                      const day = item.d.getDate();
                      return (
                        <li
                          key={item.date + item.title.nl}
                          className="card flex items-center gap-4 p-3.5 pr-5 hover:border-terra/40 transition-colors"
                        >
                          <div className="shrink-0 w-14 h-14 rounded-xl bg-sand-deep flex flex-col items-center justify-center leading-none">
                            <span className="text-[10px] uppercase tracking-wide text-ink-mute font-bold">{weekday}</span>
                            <span className="text-[22px] font-display text-ink tnum mt-0.5">{day}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[16px] font-semibold text-ink leading-snug">{item.title[lang]}</div>
                          </div>
                          <span className={`chip ${tagStyles[item.tag]} shrink-0 hidden sm:inline-flex`}>
                            {tagLabel[item.tag][lang]}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <button type="button" onClick={() => onOpen('agenda')} className="btn-terra mt-10">
            {t('agenda.cta')}
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
