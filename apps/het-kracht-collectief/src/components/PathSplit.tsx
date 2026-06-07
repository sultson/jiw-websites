import { ArrowUpRight, Check } from "lucide-react";
import type { Content } from "../content";
import { Link } from "../router";

type Props = { c: Content };

export default function PathSplit({ c }: Props) {
  const panels = [
    { ...c.paths.werknemer, to: "/werknemer" },
    { ...c.paths.werkgever, to: "/werkgever" },
  ];

  return (
    <section className="border-b border-ink bg-white">
      <div className="shell flex flex-col gap-3 py-16 sm:flex-row sm:items-end sm:justify-between sm:py-20">
        <div>
          <span className="label text-steel">{c.paths.label}</span>
          <h2 className="mt-4 text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.0]">{c.paths.title}</h2>
        </div>
      </div>

      <div className="grid border-t border-ink md:grid-cols-2">
        {panels.map((p, i) => (
          <Link
            key={p.to}
            to={p.to}
            className={`group flex flex-col justify-between gap-12 p-8 transition-colors duration-150 hover:bg-ink hover:text-bone sm:p-12 lg:p-16 ${
              i === 0 ? "border-b border-ink md:border-b-0 md:border-r" : ""
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="label text-steel transition-colors group-hover:text-fog">{p.tag}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-ink transition-colors group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                  <ArrowUpRight size={20} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
              <h3 className="mt-6 text-[clamp(1.9rem,4.5vw,3.25rem)] leading-[1.0]">{p.title}</h3>
              <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-steel transition-colors group-hover:text-fog">
                {p.text}
              </p>
            </div>

            <ul className="flex flex-col gap-3 border-t border-ink pt-7 transition-colors group-hover:border-line-dark">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-center gap-3 font-mono text-[0.78rem] font-bold uppercase tracking-[0.1em]">
                  <Check size={16} strokeWidth={2.5} className="shrink-0" />
                  {pt}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}
