export type Category = 'badkamers' | 'keukens' | 'wanden' | 'maatwerk' | 'uitvoering';
export type FilterId = Category | 'alles';

export type Project = {
  src: string;
  label: string;
  category: Category;
};

export const categories: { id: FilterId; label: string }[] = [
  { id: 'alles', label: 'Alles' },
  { id: 'badkamers', label: 'Badkamers' },
  { id: 'keukens', label: 'Keukens' },
  { id: 'wanden', label: 'Wanden & plafonds' },
  { id: 'maatwerk', label: 'Maatwerk' },
  { id: 'uitvoering', label: 'In uitvoering' },
];

export const projects: Project[] = [
  { src: '/work-08.webp', label: 'Badkamer', category: 'badkamers' },
  { src: '/work-11.webp', label: 'Wastafel op maat', category: 'badkamers' },
  { src: '/work-15.webp', label: 'Toilet', category: 'badkamers' },
  { src: '/work-05.webp', label: 'Nieuwe keuken', category: 'keukens' },
  { src: '/work-14.webp', label: 'Keuken backsplash', category: 'keukens' },
  { src: '/work-10.webp', label: 'Strakke wanden', category: 'wanden' },
  { src: '/work-19.webp', label: 'Strakke wanden', category: 'wanden' },
  { src: '/work-09.webp', label: 'Strakke plafonds', category: 'wanden' },
  { src: '/work-16.webp', label: 'Sfeerverlichting', category: 'wanden' },
  { src: '/work-17.webp', label: 'Sfeerverlichting', category: 'wanden' },
  { src: '/work-12.webp', label: 'Sfeerverlichting', category: 'wanden' },
  { src: '/work-20.webp', label: 'Verlaagd plafond', category: 'wanden' },
  { src: '/work-18.webp', label: 'Maatwerk TV-wand', category: 'maatwerk' },
  { src: '/work-07.webp', label: 'Inbouwwand in aanbouw', category: 'maatwerk' },
  { src: '/work-06.webp', label: 'Strakke trap', category: 'maatwerk' },
  { src: '/work-03.webp', label: 'Strakke trap', category: 'maatwerk' },
  { src: '/work-13.webp', label: 'Nieuwe vloer', category: 'uitvoering' },
  { src: '/work-02.webp', label: 'Voor de renovatie', category: 'uitvoering' },
  { src: '/work-04.webp', label: 'Voor de renovatie', category: 'uitvoering' },
  { src: '/work-01.webp', label: 'Op locatie', category: 'uitvoering' },
];
