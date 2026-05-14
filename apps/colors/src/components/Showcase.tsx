import { useState } from 'react';
import { beforeAfterStages, sectionTitles, type Stage } from '../content';

function StageSlider({ stages, ariaLabel }: { stages: readonly Stage[]; ariaLabel: string }) {
  const max = (stages.length - 1) * 100;
  const [pos, setPos] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const active = Math.min(stages.length - 1, Math.round(pos / 100));

  const release = () => {
    setScrubbing(false);
    setPos((value) => Math.round(value / 100) * 100);
  };

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-ink-soft ring-1 ring-white/10">
      <div className="relative aspect-[4/5] w-full bg-ink">
        {stages.map((stage, i) => {
          const opacity = Math.max(0, 1 - Math.abs(pos / 100 - i));
          return (
            <img
              key={stage.src}
              src={stage.src}
              alt={stage.alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity, transition: scrubbing ? 'none' : 'opacity 240ms ease-out' }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          );
        })}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4">
          <span className="rounded-md bg-ink/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-rood backdrop-blur-sm">
            {stages[active].label}
          </span>
          <span className="rounded-md bg-ink/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            {active + 1} / {stages.length}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 via-ink/55 to-transparent px-5 pb-5 pt-14">
          <p className="text-sm md:text-base font-semibold leading-snug text-white">
            {stages[active].sub}
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-5">
        <div className="flex gap-2">
          {stages.map((stage, i) => (
            <button
              key={stage.label}
              type="button"
              onClick={() => setPos(i * 100)}
              aria-pressed={active === i}
              className={`flex-1 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                active === i
                  ? 'bg-rood text-white shadow-[0_8px_18px_-8px_rgba(232,40,30,0.9)]'
                  : 'bg-white/10 text-white/70 hover:bg-white/18 hover:text-white'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.currentTarget.value))}
          onPointerDown={() => setScrubbing(true)}
          onPointerUp={release}
          onPointerCancel={release}
          onTouchStart={() => setScrubbing(true)}
          onTouchEnd={release}
          onBlur={release}
          aria-label={ariaLabel}
          aria-valuetext={`${stages[active].label}: ${stages[active].sub}`}
          className="stage-slider mt-4"
        />
      </div>
    </div>
  );
}

export default function Showcase() {
  if (beforeAfterStages.length < 2) return null;
  return (
    <section className="section bg-ink text-bone">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow text-rood">{sectionTitles.showcase.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight text-bone">
              {sectionTitles.showcase.title}
            </h2>
            <p className="mt-5 text-bone/80 text-base md:text-lg leading-relaxed max-w-prose">
              Sleep door de stappen om te zien hoe het werk gaat. Voor en na, naast
              elkaar, zonder filters.
            </p>
            <ul className="mt-8 space-y-3 text-bone/80 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-rood shrink-0" />
                <span>Voorbereiden: schuren, plamuren, gronden.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-oranje shrink-0" />
                <span>Aanbrengen: eerste laag, drogen, dekkende tweede laag.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-groen shrink-0" />
                <span>Opleveren: schoon, kit netjes, foto&apos;s voor controle.</span>
              </li>
            </ul>
          </div>

          <StageSlider stages={beforeAfterStages} ariaLabel="Sleep om voor en na te vergelijken" />
        </div>
      </div>
    </section>
  );
}
