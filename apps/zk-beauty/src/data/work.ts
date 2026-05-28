export type WorkImage = {
  src: string;
  alt: string;
  category: 'lashes' | 'brows' | 'hair';
};

export const workImages: WorkImage[] = [
  { src: '/brows-1.webp',  alt: 'Hybrid brows close-up met heldere groene ogen — ZK Beauty Borne', category: 'brows' },
  { src: '/lashes-1.webp', alt: 'Extreme close-up van een lashlift behandeling — ZK Beauty Borne', category: 'lashes' },
  { src: '/brows-3.webp',  alt: 'Verfijnde brow lamination resultaat — blonde klant ZK Beauty',  category: 'brows' },
  { src: '/hair-1.webp',   alt: 'Highlights in folies tijdens haarkleuring — ZK Beauty',         category: 'hair' },
  { src: '/lashes-2.webp', alt: 'Lashlift met klassieke krul — ZK Beauty',                       category: 'lashes' },
  { src: '/brows-2.webp',  alt: 'Brow shaping en lashlift, dichtbij geportretteerd — ZK Beauty', category: 'brows' },
  { src: '/hair-2.webp',   alt: 'Honey blond highlights resultaat — ZK Beauty',                  category: 'hair' },
  { src: '/lashes-3.webp', alt: 'Lashlift + tinting resultaat — ZK Beauty',                      category: 'lashes' },
  { src: '/hair-3.webp',   alt: 'Lang dameshaar met warm blonde highlights — ZK Beauty',         category: 'hair' },
];
