export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { dayIndex: 1, nl: 'Maandag',   en: 'Monday',    open: '18:00', close: '21:00' },
  { dayIndex: 2, nl: 'Dinsdag',   en: 'Tuesday',   open: '18:00', close: '21:00' },
  { dayIndex: 3, nl: 'Woensdag',  en: 'Wednesday', open: '18:00', close: '21:00' },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday',  open: '18:00', close: '21:00' },
  { dayIndex: 5, nl: 'Vrijdag',   en: 'Friday',    open: '09:00', close: '17:00' },
  { dayIndex: 6, nl: 'Zaterdag',  en: 'Saturday',  open: '09:00', close: '17:00' },
  { dayIndex: 0, nl: 'Zondag',    en: 'Sunday',    open: null,    close: null    },
];

export function formatHoursShort(d: DayHours): string {
  if (!d.open || !d.close) return '–';
  return `${d.open} – ${d.close}`;
}
