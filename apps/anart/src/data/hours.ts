export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  pl: string;
  open: number | null;
  close: number | null;
};

export const hours: DayHours[] = [
  { dayIndex: 0, nl: 'Zondag',    en: 'Sunday',    pl: 'Niedziela',  open: null, close: null },
  { dayIndex: 1, nl: 'Maandag',   en: 'Monday',    pl: 'Poniedziałek', open: 9,  close: 20 },
  { dayIndex: 2, nl: 'Dinsdag',   en: 'Tuesday',   pl: 'Wtorek',     open: 9,    close: 20 },
  { dayIndex: 3, nl: 'Woensdag',  en: 'Wednesday', pl: 'Środa',      open: 9,    close: 20 },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday',  pl: 'Czwartek',   open: 9,    close: 19 },
  { dayIndex: 5, nl: 'Vrijdag',   en: 'Friday',    pl: 'Piątek',     open: 9,    close: 20 },
  { dayIndex: 6, nl: 'Zaterdag',  en: 'Saturday',  pl: 'Sobota',     open: 9,    close: 19 },
];

export function formatHoursShort(d: DayHours): string {
  if (d.open === null || d.close === null) return '—';
  return `${String(d.open).padStart(2, '0')}:00 – ${String(d.close).padStart(2, '0')}:00`;
}
