import type { Content } from "../content";

type Props = { c: Content };

export default function Sectors({ c }: Props) {
  return (
    <section id="sectoren" className="scroll-mt-20 border-b border-ink bg-white">
      <div className="shell py-20 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <span className="label text-steel">{c.sectors.label}</span>
            <h2 className="mt-4 text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.0]">{c.sectors.title}</h2>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-steel sm:text-[1.05rem]">
              {c.sectors.intro}
            </p>
            <p className="mt-7 font-mono text-[0.78rem] font-bold uppercase tracking-[0.12em] text-ink">
              {c.sectors.note}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 border-l border-t border-ink sm:grid-cols-2">
              {c.sectors.groups.map((g) => (
                <div
                  key={g.title}
                  className="group border-b border-r border-ink p-6 transition-colors hover:bg-ink hover:text-bone sm:p-7"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-bold text-steel transition-colors group-hover:text-fog">
                      {g.n}
                    </span>
                    <h3 className="font-display text-base font-medium uppercase tracking-[-0.01em] sm:text-lg">
                      {g.title}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-1.5">
                    {g.items.map((s) => (
                      <li
                        key={s}
                        className="text-[0.95rem] leading-snug text-steel transition-colors group-hover:text-fog"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
