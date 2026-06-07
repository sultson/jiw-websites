import type { SiteContent } from '../i18n';

type Props = { c: SiteContent };

export default function Approach({ c }: Props) {
  return (
    <section id="aanpak" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-12 max-w-[44ch]">
          <p className="reveal label mb-4">{c.approach.label}</p>
          <h2 className="reveal text-[clamp(2rem,4vw,3.1rem)]" style={{ ['--reveal-delay' as string]: '60ms' }}>
            {c.approach.title}
          </h2>
          <p
            className="reveal mt-5 max-w-[46ch] text-[1.08rem] leading-relaxed text-ink-dim"
            style={{ ['--reveal-delay' as string]: '120ms' }}
          >
            {c.approach.intro}
          </p>
        </header>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {c.approach.steps.map((step, i) => (
            <li
              key={step.no}
              className="glass glass-interactive reveal flex flex-col p-7 sm:p-8"
              style={{ ['--reveal-delay' as string]: `${i * 90}ms` }}
            >
              <div className="glass-scrim" />
              <span
                className="font-semibold leading-none text-ink/22"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 3.4rem)', letterSpacing: '-0.04em' }}
              >
                {step.no}
              </span>
              <h3 className="mt-5 text-[1.3rem]">{step.title}</h3>
              <p className="mt-2.5 text-[1.02rem] leading-relaxed text-ink-dim">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
