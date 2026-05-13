export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  open: string | null;
  close: string | null;
};

// De Roza Nagelstudio works strictly by appointment.
// No fixed weekly hours are published, so every day uses open: null / close: null
// and `formatHoursShort` renders the by-appointment label.
export const hours: DayHours[] = [
  { dayIndex: 0, nl: 'Zondag',    en: 'Sunday',    open: null, close: null },
  { dayIndex: 1, nl: 'Maandag',   en: 'Monday',    open: null, close: null },
  { dayIndex: 2, nl: 'Dinsdag',   en: 'Tuesday',   open: null, close: null },
  { dayIndex: 3, nl: 'Woensdag',  en: 'Wednesday', open: null, close: null },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday',  open: null, close: null },
  { dayIndex: 5, nl: 'Vrijdag',   en: 'Friday',    open: null, close: null },
  { dayIndex: 6, nl: 'Zaterdag',  en: 'Saturday',  open: null, close: null },
];

export function formatHoursShort(d: DayHours, lang: 'nl' | 'en' = 'nl'): string {
  if (!d.open || !d.close) return lang === 'en' ? 'By appointment' : 'Op afspraak';
  return `${d.open} – ${d.close}`;
}
