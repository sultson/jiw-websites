export type DayHours = {
  dayIndex: number;
  nl: string;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { dayIndex: 1, nl: 'Maandag',   open: '08:30', close: '17:00' },
  { dayIndex: 2, nl: 'Dinsdag',   open: '08:30', close: '17:00' },
  { dayIndex: 3, nl: 'Woensdag',  open: null,    close: null    },
  { dayIndex: 4, nl: 'Donderdag', open: null,    close: null    },
  { dayIndex: 5, nl: 'Vrijdag',   open: '08:30', close: '17:00' },
  { dayIndex: 6, nl: 'Zaterdag',  open: null,    close: null    },
  { dayIndex: 0, nl: 'Zondag',    open: null,    close: null    },
];

export function formatHoursShort(d: DayHours): string {
  if (!d.open || !d.close) return 'Gesloten';
  return `${d.open} – ${d.close}`;
}
