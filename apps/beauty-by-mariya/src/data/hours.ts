export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  ua: string;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { dayIndex: 0, nl: 'Zondag',    en: 'Sunday',    ua: 'Неділя',      open: null,    close: null    },
  { dayIndex: 1, nl: 'Maandag',   en: 'Monday',    ua: 'Понеділок',   open: '10:00', close: '19:00' },
  { dayIndex: 2, nl: 'Dinsdag',   en: 'Tuesday',   ua: 'Вівторок',    open: '10:00', close: '19:00' },
  { dayIndex: 3, nl: 'Woensdag',  en: 'Wednesday', ua: 'Середа',      open: null,    close: null    },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday',  ua: 'Четвер',      open: '10:00', close: '19:00' },
  { dayIndex: 5, nl: 'Vrijdag',   en: 'Friday',    ua: "П'ятниця",    open: '10:00', close: '19:00' },
  { dayIndex: 6, nl: 'Zaterdag',  en: 'Saturday',  ua: 'Субота',      open: '10:00', close: '15:00' },
];

export function formatHoursShort(d: DayHours, langClosed: string): string {
  if (!d.open || !d.close) return langClosed;
  return `${d.open} – ${d.close}`;
}
