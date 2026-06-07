import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import type { Content, Profile } from "../content";
import { Link } from "../router";
import { useAanvraag } from "./AanvraagModal";

type Props = { c: Content; profile: Profile };

export default function AudiencePage({ c, profile }: Props) {
  const p = c.pages[profile];
  const other: Profile = profile === "werknemer" ? "werkgever" : "werknemer";
  const bandImage =
    profile === "werknemer" ? "/werknemer-band.webp?v=20260606" : "/werkgever-band.webp?v=20260606";
  const { open } = useAanvraag();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line-dark bg-ink text-bone on-dark">
        <div className="shell flex items-center justify-between gap-4 border-b border-line-dark py-3">
          <Link to="/" className="label-sm inline-flex items-center gap-2 text-fog transition-colors hover:text-bone">
            <ArrowLeft size={14} strokeWidth={2.5} />
            {p.back}
          </Link>
          <span className="label-sm text-fog">{p.heroLabel}</span>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="px-5 py-16 sm:px-8 sm:py-20 lg:py-28 lg:pr-14">
            <span className="label text-fog">{p.heroLabel}</span>
            <h1 className="mt-6 font-display font-light uppercase">
              <span className="block text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98]">{p.heroTitle[0]}</span>
              <span className="stroke-bone block text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98]">{p.heroTitle[1]}</span>
            </h1>
            <p className="mt-8 max-w-lg text-pretty text-base leading-relaxed text-fog sm:text-lg">{p.heroIntro}</p>
            <button type="button" onClick={() => open(profile)} className="btn btn-solid-inv mt-10">
              {c.form.submit}
              <ArrowRight size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="relative hidden border-l border-line-dark bg-coal lg:block">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90"
              style={{ backgroundImage: `url('${bandImage}')` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="label-sm text-bone">{c.slogan.join(" ")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="border-b border-ink bg-white">
        <div className="shell py-20 sm:py-28">
          <span className="label text-steel">{p.valueTitle}</span>
          <div className="mt-10 grid border-l border-t border-ink sm:grid-cols-2">
            {p.value.map((v, i) => (
              <article key={i} className="border-b border-r border-ink p-8 sm:p-11">
                <span className="font-mono text-2xl font-bold text-steel">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-[clamp(1.4rem,3vw,2rem)] leading-[1.0]">{v.title}</h3>
                <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-steel">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band — opens the aanvraag modal */}
      <section className="border-b border-line-dark bg-ink text-bone on-dark">
        <div className="shell py-20 sm:py-28">
          <span className="label text-fog">{c.contact.label}</span>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,6vw,4rem)] leading-[0.98]">{p.formTitle}</h2>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-fog sm:text-lg">{p.formIntro}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button type="button" onClick={() => open(profile)} className="btn btn-solid-inv">
              {c.form.submit}
              <ArrowRight size={18} strokeWidth={2} />
            </button>
            <Link
              to={`/${other}`}
              className="group inline-flex items-center gap-3 border border-bone px-5 py-4 text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.14em]">{p.switchText}</span>
              <span className="font-display text-sm font-medium uppercase tracking-[-0.01em]">{p.switchCta}</span>
              <ArrowUpRight size={18} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
