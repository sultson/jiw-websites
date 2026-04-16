export type DaySegment = { open: string; close: string };

export type DayHours = {
  dayIndex: number;
  nl: string;
  en: string;
  segments: DaySegment[];
  marked?: boolean;
};

const standard: DaySegment[] = [{ open: '09:00', close: '17:00' }];

export const hours: DayHours[] = [
  { dayIndex: 0, nl: 'Zondag', en: 'Sunday', segments: [] },
  { dayIndex: 1, nl: 'Maandag', en: 'Monday', segments: standard },
  { dayIndex: 2, nl: 'Dinsdag', en: 'Tuesday', segments: standard },
  { dayIndex: 3, nl: 'Woensdag', en: 'Wednesday', segments: standard, marked: true },
  { dayIndex: 4, nl: 'Donderdag', en: 'Thursday', segments: standard },
  { dayIndex: 5, nl: 'Vrijdag', en: 'Friday', segments: standard },
  { dayIndex: 6, nl: 'Zaterdag', en: 'Saturday', segments: [] },
];

export function formatSegments(d: DayHours, closedLabel: string): string {
  if (d.segments.length === 0) return closedLabel;
  return d.segments.map(s => `${s.open} – ${s.close}`).join(' · ');
}

function minutesFromHHMM(v: string): number {
  const [h, m] = v.split(':').map(Number);
  return h * 60 + m;
}

export function isOpenNow(now = new Date()): boolean {
  const d = hours[now.getDay()];
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return d.segments.some(
    s => nowMin >= minutesFromHHMM(s.open) && nowMin < minutesFromHHMM(s.close),
  );
}
