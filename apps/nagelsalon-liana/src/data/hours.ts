export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  hy: string;
  open: string | null;
  close: string | null;
};

// Source: Google Maps (2026-05-13).
export const hours: DayHours[] = [
  { dayIndex: 0, nl: 'Zondag',    en: 'Sunday',    hy: 'Կիրակի',     open: null,    close: null    },
  { dayIndex: 1, nl: 'Maandag',   en: 'Monday',    hy: 'Երկուշաբթի', open: '09:00', close: '18:00' },
  { dayIndex: 2, nl: 'Dinsdag',   en: 'Tuesday',   hy: 'Երեքշաբթի',  open: '09:00', close: '18:00' },
  { dayIndex: 3, nl: 'Woensdag',  en: 'Wednesday', hy: 'Չորեքշաբթի', open: '09:00', close: '18:00' },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday',  hy: 'Հինգշաբթի',  open: '09:00', close: '18:00' },
  { dayIndex: 5, nl: 'Vrijdag',   en: 'Friday',    hy: 'Ուրբաթ',     open: '09:00', close: '18:00' },
  { dayIndex: 6, nl: 'Zaterdag',  en: 'Saturday',  hy: 'Շաբաթ',      open: null,    close: null    },
];

export function formatHoursShort(d: DayHours): string {
  if (!d.open || !d.close) return '–';
  return `${d.open} – ${d.close}`;
}
