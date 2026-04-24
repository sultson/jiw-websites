export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: 'Google';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Marian R.',
    rating: 5,
    nl: 'Smooth by Lau is een hele fijne salon. De eerste keer was even spannend, maar bij Laura voel je je meteen op je gemak! Vakkundig helpt ze je gladjes de deur uit.',
    en: 'Smooth by Lau is a really lovely salon. The first visit was a little exciting, but with Laura you feel at ease right away! She expertly helps you leave smooth and happy.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Wilma K.',
    rating: 5,
    nl: 'Ik heb onlangs mijn bikinilijn laten sugar waxen en ik ben supertevreden over het resultaat! In tegenstelling tot normaal waxen had ik helemaal geen uitslag of irritatie. De behandeling voelde een stuk prettiger en zachter aan.',
    en: "I recently had my bikini line sugar waxed and I'm super happy with the result! Unlike regular waxing I had no rash or irritation at all. The treatment felt much gentler and more pleasant.",
    source: 'Google',
  },
  {
    id: 3,
    name: 'Iris van D.',
    rating: 5,
    nl: 'Ik heb bij Laura mijn wenkbrauwen laten doen en het is echt prachtig! Ze neemt alle tijd voor je en ze kijkt goed bij wat er past bij je.',
    en: "I had my eyebrows done by Laura and it's truly beautiful! She takes all the time for you and carefully considers what suits you.",
    source: 'Google',
  },
  {
    id: 4,
    name: 'Sarah P.',
    rating: 5,
    nl: 'Voor het eerst bij Lau laten waxen & super tevreden. Ik was best nerveus maar Lau heeft mij heel erg op mijn gemak gesteld. Super fijne behandelaar en echt een hele lieve vrouw.',
    en: 'First time getting waxed at Lau and super satisfied. I was quite nervous but Lau really put me at ease. A wonderful therapist and such a sweet woman.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Nathalie',
    rating: 5,
    nl: 'Eerste keer volledige sugarwax gehad bij Laura en ik ben zeer tevreden. Geen plekken of bultjes na de behandeling en mijn huid voelt "smooth". Laura stelt je enorm op je gemak. Lieve meid die weet wat ze doet.',
    en: "First time having a full sugar wax with Laura and I'm very satisfied. No spots or bumps after the treatment and my skin feels 'smooth'. Laura really puts you at ease. A lovely woman who knows what she does.",
    source: 'Google',
  },
  {
    id: 6,
    name: 'Meike',
    rating: 5,
    nl: 'Nu al een aantal keren bij Laura geweest, wat een top vrouw! Ze laat je super op je gemak voelen, zorgt ervoor dat JIJ je prettig voelt en dat is MEGA fijn. Ze is super professioneel in haar werk en echt een topper.',
    en: "I've been to Laura several times now, what a great woman! She makes you feel super comfortable, makes sure YOU feel good and that's really wonderful. She's super professional in her work and a real star.",
    source: 'Google',
  },
];
