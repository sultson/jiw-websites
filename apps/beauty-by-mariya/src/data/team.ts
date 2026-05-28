export type TeamMember = {
  id: string;
  name: string;
  /** translation key roots e.g. team.mariya.role / team.mariya.bio */
  tKey: string;
  photo: string;
  instagram: string;
  accent: 'rose' | 'champagne';
};

export const team: TeamMember[] = [
  {
    id: 'mariya',
    name: 'Mariya',
    tKey: 'team.mariya',
    photo: '/team-mariya.webp',
    instagram: 'https://www.instagram.com/levytska.permanent/',
    accent: 'rose',
  },
  {
    id: 'maryna',
    name: 'Maryna',
    tKey: 'team.maryna',
    photo: '/team-maryna.webp',
    instagram: 'https://www.instagram.com/gel.lakkk/',
    accent: 'champagne',
  },
  {
    id: 'svitlana',
    name: 'Svitlana',
    tKey: 'team.svitlana',
    photo: '/team-svitlana.webp',
    instagram: 'https://www.instagram.com/kohut.cosmetology/',
    accent: 'rose',
  },
  {
    id: 'lyuba',
    name: 'Lyuba',
    tKey: 'team.lyuba',
    photo: '/team-lyuba.webp',
    instagram: 'https://www.instagram.com/lyubanovosad/',
    accent: 'champagne',
  },
];
