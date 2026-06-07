import type { Content } from "../content";

type Props = { c: Content };

// Rugged photography (in colour) sits behind the vision quote. If the image is
// absent the band degrades gracefully to solid ink.
export default function StatementBand({ c }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-line-dark bg-ink text-bone on-dark">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: "url('/work-band.webp?v=20260606')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/35" aria-hidden="true" />

      <div className="shell relative py-24 sm:py-32 lg:py-40">
        <span className="label text-fog">{c.band.sub}</span>
        <blockquote className="mt-7 max-w-4xl text-balance font-display text-[clamp(1.9rem,5vw,4rem)] font-light uppercase leading-[1.04] tracking-[-0.01em]">
          {c.band.quote}
        </blockquote>
      </div>
    </section>
  );
}
