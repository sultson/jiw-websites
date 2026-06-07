import type { Content } from "../content";

type Props = { c: Content };

export default function Pillars({ c }: Props) {
  return (
    <section id="aanpak" className="scroll-mt-20 border-b border-line-dark bg-ink text-bone on-dark">
      <div className="shell py-20 sm:py-28">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="label text-fog">{c.pillars.label}</span>
            <h2 className="mt-4 text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.0]">{c.pillars.title}</h2>
          </div>
        </div>

        <div className="mt-12 grid border border-line-dark sm:grid-cols-2">
          {c.pillars.items.map((item, i) => (
            <article
              key={item.n}
              className={`p-8 sm:p-11 ${i % 2 === 0 ? "sm:border-r sm:border-line-dark" : ""} ${
                i < c.pillars.items.length - 2 ? "border-b border-line-dark" : ""
              } ${i === c.pillars.items.length - 2 ? "border-b border-line-dark sm:border-b-0" : ""}`}
            >
              <span className="font-mono text-3xl font-bold text-steel">{item.n}</span>
              <h3 className="mt-6 text-[clamp(1.4rem,3vw,2rem)] leading-[1.0]">{item.title}</h3>
              <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-fog">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
