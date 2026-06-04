export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { dayIndex: 0, nl: 'Zondag',    en: 'Sunday',    open: null,    close: null    },
  { dayIndex: 1, nl: 'Maandag',   en: 'Monday',    open: '10:00', close: '18:00' },
  { dayIndex: 2, nl: 'Dinsdag',   en: 'Tuesday',   open: '11:00', close: '21:00' },
  { dayIndex: 3, nl: 'Woensdag',  en: 'Wednesday', open: '09:00', close: '21:00' },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday',  open: '09:00', close: '17:00' },
  { dayIndex: 5, nl: 'Vrijdag',   en: 'Friday',    open: '11:00', close: '17:00' },
  { dayIndex: 6, nl: 'Zaterdag',  en: 'Saturday',  open: '09:00', close: '13:30' },
];

export function formatHoursShort(d: DayHours): string {
  if (!d.open || !d.close) return 'Gesloten';
  return `${d.open} – ${d.close}`;
}
