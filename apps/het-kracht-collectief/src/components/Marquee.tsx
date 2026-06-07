type Props = {
  items: string[];
  tone?: "ink" | "bone";
};

export default function Marquee({ items, tone = "ink" }: Props) {
  const dark = tone === "ink";
  // Repeat enough to fill very wide screens, then animate by -50%.
  const sequence = Array.from({ length: 4 }).flatMap(() => items);

  return (
    <div
      className={`overflow-hidden border-y py-5 sm:py-6 ${
        dark ? "border-line-dark bg-ink text-bone" : "border-ink bg-white text-ink"
      }`}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee">
        {sequence.concat(sequence).map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-8 font-display text-2xl font-light uppercase tracking-[0.01em] sm:text-3xl">
              {item}
            </span>
            <span className={`text-lg ${dark ? "text-steel" : "text-ash"}`}>✕</span>
          </span>
        ))}
      </div>
    </div>
  );
}
