import { Compass, TerminalSquare, type LucideIcon } from 'lucide-react';
import type { Member, SiteContent } from '../i18n';

type Props = { c: SiteContent };

// Both founders' names start with "A", so the avatar carries a role glyph
// (execution vs technical) rather than an ambiguous initial.
const memberIcons: Record<string, LucideIcon> = {
  Armando: Compass,
  Alfred: TerminalSquare,
};

function Avatar({ name }: { name: string }) {
  const Icon = memberIcons[name] ?? Compass;
  return (
    <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full">
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 210deg, oklch(0.82 0.12 200), oklch(0.64 0.2 285), oklch(0.74 0.15 240), oklch(0.82 0.12 200))',
          opacity: 0.85,
        }}
        aria-hidden="true"
      />
      <span className="absolute inset-[2px] rounded-full bg-surface" aria-hidden="true" />
      <Icon size={22} strokeWidth={1.7} className="relative text-ink" />
    </div>
  );
}

function Card({ member, delay }: { member: Member; delay: number }) {
  return (
    <article
      className="glass glass-interactive reveal flex flex-col p-7 sm:p-8"
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      <div className="glass-scrim" />
      <div className="flex items-center gap-4">
        <Avatar name={member.name} />
        <div>
          <h3 className="text-[1.25rem] leading-tight">{member.name}</h3>
          <p className="label mt-1 normal-case tracking-[0.14em] text-accent-soft">{member.role}</p>
        </div>
      </div>
      <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-dim">{member.body}</p>
    </article>
  );
}

export default function Team({ c }: Props) {
  return (
    <section id="team" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-12 max-w-[44ch]">
          <p className="reveal label mb-4">{c.team.label}</p>
          <h2 className="reveal text-[clamp(2rem,4vw,3.1rem)]" style={{ ['--reveal-delay' as string]: '60ms' }}>
            {c.team.title}
          </h2>
          <p
            className="reveal mt-5 max-w-[46ch] text-[1.08rem] leading-relaxed text-ink-dim"
            style={{ ['--reveal-delay' as string]: '120ms' }}
          >
            {c.team.intro}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.team.members.map((m, i) => (
            <Card key={m.name} member={m} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
