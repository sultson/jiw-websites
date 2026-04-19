export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: string;
};

// TODO: voeg echte Google reviews toe
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Sophie van den Berg',
    rating: 5,
    nl: 'Claire is geweldig! Mijn huid ziet er na elke behandeling stralender uit. De Supreme Glow Facial is mijn favoriet — aanrader!',
    en: 'Claire is amazing! My skin looks more radiant after every treatment. The Supreme Glow Facial is my favourite — highly recommended!',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Emma Bakker',
    rating: 5,
    nl: 'Professionele studio, fijne sfeer en Claire weet precies wat jouw huid nodig heeft. Ik kom hier al twee jaar en ben altijd tevreden.',
    en: 'Professional studio, great atmosphere and Claire knows exactly what your skin needs. I have been coming here for two years and am always satisfied.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Lisa Smits',
    rating: 5,
    nl: 'Fantastische microneedling behandeling. Claire is heel zorgvuldig en neemt de tijd voor een grondige huidanalyse. Resultaat is verbluffend.',
    en: 'Fantastic microneedling treatment. Claire is very thorough and takes time for a proper skin analysis. The result is stunning.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Anna de Vries',
    rating: 5,
    nl: 'Rustige, serene studio in Amsterdam-West. Claire is deskundig, vriendelijk en gebruikt topkwaliteit producten. Mijn go-to voor huidverzorging!',
    en: 'Calm, serene studio in Amsterdam-West. Claire is knowledgeable, friendly and uses top-quality products. My go-to for skincare!',
    source: 'Google',
  },
];
