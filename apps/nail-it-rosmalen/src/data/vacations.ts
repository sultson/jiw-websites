import type { Lang } from '../translations';

export type Vacation = {
  start: string;
  end: string;
  // Days before `start` to begin showing the notice. Defaults to 7.
  noticeDaysBefore?: number;
};

// Add new closures here. Dates are inclusive, ISO (YYYY-MM-DD).
export const vacations: Vacation[] = [
  { start: '2026-06-11', end: '2026-06-15' },
  { start: '2026-07-11', end: '2026-07-27', noticeDaysBefore: 7 },
];

const DEFAULT_NOTICE_DAYS = 7;

const MONTHS: Record<Lang, string[]> = {
  nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatRange = (v: Vacation, lang: Lang) => {
  const s = parse(v.start);
  const e = parse(v.end);
  const months = MONTHS[lang];
  const sep = lang === 'nl' ? ' t/m ' : ' – ';
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) return `${s.getDate()}${sep}${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
  return `${s.getDate()} ${months[s.getMonth()]}${sep}${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}`;
};

export function activeVacationNotice(lang: Lang, now: Date = new Date()): string | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const match = vacations
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start))
    .find(v => {
      const start = parse(v.start);
      const end = parse(v.end);
      const notice = v.noticeDaysBefore ?? DEFAULT_NOTICE_DAYS;
      const showFrom = new Date(start);
      showFrom.setDate(start.getDate() - notice);
      return today >= showFrom && today <= end;
    });
  if (!match) return null;
  const range = formatRange(match, lang);
  const onVacation = today >= parse(match.start);
  if (lang === 'nl') {
    return onVacation ? `Vakantie — gesloten ${range}` : `Vakantiesluiting ${range}`;
  }
  return onVacation ? `On holiday — closed ${range}` : `Closed for holiday ${range}`;
}
