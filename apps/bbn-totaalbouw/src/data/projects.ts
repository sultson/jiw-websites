export type Category = 'badkamers' | 'afwerking' | 'renovatie';
export type FilterId = Category | 'alles';

export type Project = {
  src: string;
  label: string;
  category: Category;
};

export const categories: { id: FilterId; label: string }[] = [
  { id: 'alles', label: 'Alles' },
  { id: 'badkamers', label: 'Badkamers' },
  { id: 'afwerking', label: 'Strakke afwerking' },
  { id: 'renovatie', label: 'Renovatie & nieuwbouw' },
];

export const projects: Project[] = [
  { src: '/work-badkamer.webp', label: 'Badkamer', category: 'badkamers' },
  { src: '/work-3.webp', label: 'Badkamer', category: 'badkamers' },
  { src: '/work-4.webp', label: 'Badkamer', category: 'badkamers' },
  { src: '/work-5.webp', label: 'Badkamer', category: 'badkamers' },
  { src: '/work-6.webp', label: 'Badkamer', category: 'badkamers' },
  { src: '/work-stukwerk.webp', label: 'Strakke wanden', category: 'afwerking' },
  { src: '/work-2.webp', label: 'Strakke wanden', category: 'afwerking' },
  { src: '/work-1.webp', label: 'Strakke plafonds', category: 'afwerking' },
  { src: '/work-vloer.webp', label: 'Strakke vloeren', category: 'afwerking' },
  { src: '/work-totaal.webp', label: 'Complete renovatie', category: 'renovatie' },
  { src: '/work-spacspuite.webp', label: 'Nieuwbouw', category: 'renovatie' },
];
