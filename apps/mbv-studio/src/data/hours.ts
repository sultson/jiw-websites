import type { Lang } from '../translations';

export type DayHours = {
  dayIndex: number;
  en: string;
  nl: string;
  ua: string;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { dayIndex: 1, en: 'Monday',    nl: 'Maandag',   ua: 'Понеділок', open: null,    close: null    },
  { dayIndex: 2, en: 'Tuesday',   nl: 'Dinsdag',   ua: 'Вівторок',  open: '10:00', close: '18:00' },
  { dayIndex: 3, en: 'Wednesday', nl: 'Woensdag',  ua: 'Середа',    open: '10:00', close: '18:00' },
  { dayIndex: 4, en: 'Thursday',  nl: 'Donderdag', ua: 'Четвер',    open: '10:00', close: '18:00' },
  { dayIndex: 5, en: 'Friday',    nl: 'Vrijdag',   ua: 'П’ятниця',  open: '10:00', close: '18:00' },
  { dayIndex: 6, en: 'Saturday',  nl: 'Zaterdag',  ua: 'Субота',    open: '12:00', close: '18:00' },
  { dayIndex: 0, en: 'Sunday',    nl: 'Zondag',    ua: 'Неділя',    open: null,    close: null    },
];

export function dayName(h: DayHours, lang: Lang): string {
  return h[lang];
}

export function formatHoursShort(d: DayHours, closedLabel: string): string {
  if (!d.open || !d.close) return closedLabel;
  return `${d.open} – ${d.close}`;
}
