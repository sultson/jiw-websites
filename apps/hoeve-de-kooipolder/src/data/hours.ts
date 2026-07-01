export type DayRow = {
  dayNl: string;
  dayEn: string;
  hours: string | null;
};

export const hours: DayRow[] = [
  { dayNl: 'Maandag',   dayEn: 'Monday',    hours: null },
  { dayNl: 'Dinsdag',   dayEn: 'Tuesday',   hours: '09:00 - 21:00' },
  { dayNl: 'Woensdag',  dayEn: 'Wednesday', hours: '09:00 - 17:00' },
  { dayNl: 'Donderdag', dayEn: 'Thursday',  hours: null },
  { dayNl: 'Vrijdag',   dayEn: 'Friday',    hours: '09:00 - 17:00' },
  { dayNl: 'Zaterdag',  dayEn: 'Saturday',  hours: '09:00 - 14:00' },
  { dayNl: 'Zondag',    dayEn: 'Sunday',    hours: null },
];
