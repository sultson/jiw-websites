import type { Content } from "../content";

type Props = { c: Content };

export default function MissionVision({ c }: Props) {
  return (
    <section className="border-b border-ink bg-white">
      <div className="shell py-20 sm:py-28">
        <span className="label text-steel">{c.mission.label}</span>

        <div className="mt-10 grid gap-px border border-ink bg-ink md:grid-cols-2">
          <article className="bg-white p-8 sm:p-11 lg:p-14">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm font-bold text-steel">01</span>
              <h2 className="text-[clamp(1.8rem,4vw,2.75rem)]">{c.mission.missieTitle}</h2>
            </div>
            <div className="mt-7 flex flex-col gap-5">
              {c.mission.missie.map((p, i) => (
                <p key={i} className="text-pretty text-base leading-relaxed text-ink/80 sm:text-[1.05rem]">
                  {p}
                </p>
              ))}
            </div>
          </article>

          <article className="bg-white p-8 sm:p-11 lg:p-14">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm font-bold text-steel">02</span>
              <h2 className="text-[clamp(1.8rem,4vw,2.75rem)]">{c.mission.visieTitle}</h2>
            </div>
            <div className="mt-7 flex flex-col gap-5">
              {c.mission.visie.map((p, i) => (
                <p key={i} className="text-pretty text-base leading-relaxed text-ink/80 sm:text-[1.05rem]">
                  {p}
                </p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
