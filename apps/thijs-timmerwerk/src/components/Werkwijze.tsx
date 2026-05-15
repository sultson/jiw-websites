import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

type Props = { t: (k: string) => string; lang: 'nl' | 'en' };

const steps = [
  { label: 'wk.s1.label', title: 'wk.s1.title', body: 'wk.s1.body' },
  { label: 'wk.s2.label', title: 'wk.s2.title', body: 'wk.s2.body' },
  { label: 'wk.s3.label', title: 'wk.s3.title', body: 'wk.s3.body' },
  { label: 'wk.s4.label', title: 'wk.s4.title', body: 'wk.s4.body' },
];

/** Werkwijze — dark cobalt-ink section, 4-step connected stepper. */
export default function Werkwijze({ t }: Props) {
  return (
    <section id="werkwijze" className="section relative overflow-hidden bg-cobalt-ink">
      <div className="bg-grid-light absolute inset-0 opacity-60" aria-hidden />
      <div className="shell relative">
        <SectionHeader
          eyebrow={t('wk.eyebrow')}
          title={t('wk.title')}
          dot="spark"
          intro={t('wk.intro')}
          align="center"
          tone="light"
        />

        <div className="relative mt-16">
          {/* connector line — desktop only */}
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-white/15 lg:block"
            aria-hidden
          />

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.label} delay={(i % 4) as 0 | 1 | 2 | 3} className="relative">
                {/* numbered marker */}
                <div className="flex items-center gap-3">
                  <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/20 bg-cobalt-ink-soft font-display text-[20px] font-extrabold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="kicker kicker-light !text-white/55">{t(s.label)}</span>
                </div>

                <h3 className="mt-6 display-md text-white">{t(s.title)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/65">{t(s.body)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
