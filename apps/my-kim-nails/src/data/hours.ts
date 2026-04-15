export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  open: number | null;
  close: number | null;
};

export const hours: DayHours[] = [
  { dayIndex: 0, nl: 'Zondag', en: 'Sunday', open: null, close: null },
  { dayIndex: 1, nl: 'Maandag', en: 'Monday', open: 11, close: 17 },
  { dayIndex: 2, nl: 'Dinsdag', en: 'Tuesday', open: 10, close: 18 },
  { dayIndex: 3, nl: 'Woensdag', en: 'Wednesday', open: 10, close: 18 },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday', open: 10, close: 19 },
  { dayIndex: 5, nl: 'Vrijdag', en: 'Friday', open: 10, close: 18 },
  { dayIndex: 6, nl: 'Zaterdag', en: 'Saturday', open: 10, close: 17 },
];

export function isOpenOn(date: Date): boolean {
  const d = hours[date.getDay()];
  return d.open !== null && d.close !== null;
}

export function slotsForDay(date: Date, stepMinutes = 30): string[] {
  const d = hours[date.getDay()];
  if (d.open === null || d.close === null) return [];
  const slots: string[] = [];
  const totalMinutes = (d.close - d.open) * 60;
  for (let m = 0; m < totalMinutes; m += stepMinutes) {
    const h = d.open + Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
  }
  return slots;
}

export function formatHoursShort(d: DayHours): string {
  if (d.open === null || d.close === null) return '—';
  return `${String(d.open).padStart(2, '0')}:00 – ${String(d.close).padStart(2, '0')}:00`;
}
