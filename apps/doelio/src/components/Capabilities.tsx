import { Boxes, Workflow, PiggyBank, Radar, Check } from 'lucide-react';
import type { Capability, SiteContent } from '../i18n';
import { STACK } from '../data/site';
import BrandMark from './BrandMark';

type Props = { c: SiteContent };

const icons: Record<string, typeof Boxes> = {
  stack: Boxes,
  time: Workflow,
  cost: PiggyBank,
  geo: Radar,
};

// Asymmetric bento spans (desktop). Mobile stacks to a single column.
const spans: Record<string, string> = {
  stack: 'md:col-span-4 md:row-span-2',
  time: 'md:col-span-2 md:row-span-2',
  cost: 'md:col-span-3',
  geo: 'md:col-span-3',
};

function Tile({ item, delay }: { item: Capability; delay: number }) {
  const Icon = icons[item.id] ?? Boxes;
  return (
    <article
      className={`glass glass-interactive reveal flex flex-col p-6 sm:p-8 ${spans[item.id] ?? ''}`}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      <div className="glass-scrim" />
      {item.id === 'stack' && (
        <img
          src="/art/thermal-field.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute mix-blend-screen"
          style={{
            zIndex: 0,
            right: '-14%',
            bottom: '-12%',
            width: '78%',
            opacity: 0.5,
            maskImage: 'radial-gradient(80% 80% at 70% 70%, #000 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(80% 80% at 70% 70%, #000 30%, transparent 75%)',
          }}
        />
      )}
      <div className="relative z-[1] mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-ink shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
        <Icon size={21} strokeWidth={1.6} className="text-accent-soft" />
      </div>

      <h3 className="text-[1.3rem]">{item.title}</h3>
      <p className="mt-3 max-w-[42ch] text-[1.02rem] leading-relaxed text-ink-dim">{item.body}</p>

      {item.points.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2.5">
          {item.points.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-[0.95rem] text-ink-dim">
              <Check size={15} strokeWidth={2.2} className="shrink-0 text-accent-soft" />
              {p}
            </li>
          ))}
        </ul>
      )}

      {item.id === 'stack' && (
        <div className="mt-auto flex flex-wrap gap-2 pt-7">
          {STACK.map((item) => (
            <span
              key={item.label}
              className="glass-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.82rem] text-ink-dim"
            >
              <BrandMark brand={item.brand} className="h-3.5 w-3.5 text-ink/90" />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Capabilities({ c }: Props) {
  return (
    <section id="diensten" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-12 max-w-[44ch]">
          <p className="reveal label mb-4">{c.capabilities.label}</p>
          <h2 className="reveal text-[clamp(2rem,4vw,3.1rem)]" style={{ ['--reveal-delay' as string]: '60ms' }}>
            {c.capabilities.title}
          </h2>
          <p
            className="reveal mt-5 max-w-[50ch] text-[1.08rem] leading-relaxed text-ink-dim"
            style={{ ['--reveal-delay' as string]: '120ms' }}
          >
            {c.capabilities.intro}
          </p>
        </header>

        <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-6">
          {c.capabilities.items.map((item, i) => (
            <Tile key={item.id} item={item} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
