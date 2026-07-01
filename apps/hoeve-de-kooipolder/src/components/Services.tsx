import { CalendarClock, Check, Home } from 'lucide-react';
import { services } from '../data/services';

type Props = { t: (k: string) => string; lang: 'nl' | 'en' };

type ServiceRow = (typeof services)[number];

export default function Services({ t, lang }: Props) {
  const priced = services.filter(s => s.price !== null && s.itemsNl.length > 0);
  const compact = services.filter(s => s.itemsNl.length === 0);

  const name = (s: ServiceRow) => (lang === 'en' ? s.nameEn : s.nameNl);
  const items = (s: ServiceRow) => (lang === 'en' ? s.itemsEn : s.itemsNl);
  const note = (s: ServiceRow) => (lang === 'en' ? s.noteEn : s.noteNl);

  return (
    <section id="behandelingen" className="py-20 md:py-28 bg-lilac-wash/50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="kicker">{t('services.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 text-ink-soft/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {t('services.intro')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {priced.map(s => (
            <div key={s.id} className="card p-7 md:p-8 flex flex-col">
              <h3 className="font-serif text-2xl md:text-[1.7rem]">{name(s)}</h3>
              <p className="mt-2 font-serif text-4xl md:text-5xl text-lilac-deep">{s.price}</p>
              <ul className="mt-6 space-y-3">
                {items(s).map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                    <Check size={16} className="shrink-0 mt-0.5 text-lilac-deep" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {note(s) && <p className="mt-5 text-xs text-ink-soft/70">{note(s)}</p>}
            </div>
          ))}
        </div>

        <div className="mt-5 md:mt-6 space-y-3">
          {compact.map(s => (
            <div
              key={s.id}
              className="card px-5 md:px-7 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
            >
              <div className="min-w-0">
                <p className="text-sm md:text-base font-medium text-ink">{name(s)}</p>
                {note(s) && <p className="text-xs text-ink-soft/70 mt-0.5">{note(s)}</p>}
              </div>
              <span className="shrink-0 text-sm text-lilac-deep">{s.price ?? t('services.note')}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-ink/10 bg-white/60 px-5 py-4 flex items-start gap-3 text-sm text-ink-soft/90">
          <CalendarClock size={18} className="mt-0.5 shrink-0 text-lilac-deep" aria-hidden="true" />
          <p>{t('services.cancelPolicy')}</p>
        </div>

        <div className="mt-8 md:mt-10 rounded-2xl bg-lilac-wash border border-lilac-mist p-7 md:p-8 flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center text-lilac-deep">
            <Home size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-serif text-2xl">{t('services.home.title')}</h3>
              <p className="font-serif text-3xl text-lilac-deep">{t('services.home.price')}</p>
            </div>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed max-w-2xl">
              {t('services.home.body')}
            </p>
            <a
              href="tel:+31628577711"
              className="mt-3 inline-block text-sm font-medium text-lilac-deep underline underline-offset-4 hover:text-ink"
            >
              06 28 57 77 11
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
