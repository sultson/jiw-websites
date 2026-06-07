import { ArrowRight } from "lucide-react";
import type { Content } from "../content";
import { Link } from "../router";

type Props = { c: Content };

export default function Hero({ c }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-line-dark bg-ink text-bone on-dark">
      {/* Rotterdam skyline along the bottom. The plate is white-on-black, so
          mix-blend-screen melts its black sky into the ink — only the lit
          wireframe glows, with no visible image seam. Rendered at natural
          aspect (w-full h-auto) so the towers are never cropped at the top;
          the black sky simply overflows upward and stays invisible. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto max-w-[1800px]"
        aria-hidden="true"
      >
        <img
          src="/rotterdam.webp"
          alt=""
          className="h-auto w-full select-none opacity-90 mix-blend-screen"
          width={1600}
          height={686}
          loading="eager"
        />
      </div>

      {/* Top-down ink wash keeps the headline crisp above the skyline. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-ink via-ink/85 to-transparent"
        aria-hidden="true"
      />

      <div className="shell relative z-10 py-20 sm:py-24 lg:py-28">
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-light uppercase leading-[1.02]">
            {c.hero.headline.pre}
            <span className="neon-cool">{c.hero.headline.emp}</span>
            {c.hero.headline.mid}
            <span className="neon-warm">{c.hero.headline.seek}</span>
            {c.hero.headline.post}
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-fog sm:text-lg">{c.hero.intro}</p>

          <div className="mt-10">
            <span className="label text-fog">{c.hero.pick}</span>
            <div className="mt-4 grid border border-bone sm:max-w-2xl sm:grid-cols-2">
              <Link
                to="/werknemer"
                className="group flex items-center justify-between gap-3 px-6 py-7 transition-colors hover:bg-bone hover:text-ink"
              >
                <span className="font-display text-xl font-medium uppercase tracking-[-0.01em] sm:text-2xl">
                  {c.hero.werknemerBtn}
                </span>
                <ArrowRight size={24} strokeWidth={2} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/werkgever"
                className="group flex items-center justify-between gap-3 border-t border-bone px-6 py-7 transition-colors hover:bg-bone hover:text-ink sm:border-l sm:border-t-0"
              >
                <span className="font-display text-xl font-medium uppercase tracking-[-0.01em] sm:text-2xl">
                  {c.hero.werkgeverBtn}
                </span>
                <ArrowRight size={24} strokeWidth={2} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
