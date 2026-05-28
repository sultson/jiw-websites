// Top-bar notices. Edit the date strings here when Wendy's schedule changes.
// Format: YYYY-MM-DD. The vakantie window is shown from `prewarnDays` before `from`
// until and including `to`. Outside that window, the klantenstop notice is shown.

export type Vakantie = {
  /** Inclusive start date — first day Wendy is away. */
  from: string;
  /** Inclusive end date — last day Wendy is away. */
  to: string;
  /** How many days before `from` to begin showing the pre-warning. */
  prewarnDays: number;
};

export const vakanties: Vakantie[] = [
  // From INFO.md: "25 tot 31 mei is in progress atm"
  { from: '2026-05-25', to: '2026-05-31', prewarnDays: 14 },
];

export const KLANTENSTOP_ACTIVE = true;

function parse(d: string): Date {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

function fmtRange(from: Date, to: Date, lang: 'nl' | 'en'): string {
  const months = lang === 'en'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const sameMonth = from.getUTCMonth() === to.getUTCMonth();
  const fd = from.getUTCDate();
  const td = to.getUTCDate();
  if (sameMonth) return `${fd}–${td} ${months[from.getUTCMonth()]}`;
  return `${fd} ${months[from.getUTCMonth()]} – ${td} ${months[to.getUTCMonth()]}`;
}

export type ActiveNotice =
  | { kind: 'vakantie-active'; range: string }
  | { kind: 'vakantie-upcoming'; range: string }
  | { kind: 'klantenstop' }
  | null;

export function pickNotice(now: Date, lang: 'nl' | 'en'): ActiveNotice {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  for (const v of vakanties) {
    const from = parse(v.from);
    const to = parse(v.to);
    const range = fmtRange(from, to, lang);
    if (today >= from && today <= to) return { kind: 'vakantie-active', range };
    const prewarn = new Date(from);
    prewarn.setUTCDate(prewarn.getUTCDate() - v.prewarnDays);
    if (today >= prewarn && today < from) return { kind: 'vakantie-upcoming', range };
  }
  if (KLANTENSTOP_ACTIVE) return { kind: 'klantenstop' };
  return null;
}
