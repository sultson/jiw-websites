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
    name: 'Sophie V.',
    rating: 5,
    nl: 'Bij Lau voel je je direct op je gemak. Ze neemt de tijd, legt alles rustig uit en het resultaat is heerlijk. Bijna geen irritatie en mijn huid zo zacht!',
    en: 'You immediately feel at ease with Lau. She takes her time, explains everything calmly and the result is wonderful. Barely any irritation and my skin so soft!',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Manon de G.',
    rating: 5,
    nl: 'Eindelijk een plek waar je je nergens voor hoeft te schamen. Ik was een beetje zenuwachtig voor mijn eerste suikerwax maar Lau zette me direct op mijn gemak.',
    en: "Finally a place where you don't have to feel ashamed of anything. I was a little nervous for my first sugar wax but Lau immediately put me at ease.",
    source: 'Google',
  },
  {
    id: 3,
    name: 'Nina K.',
    rating: 5,
    nl: 'Super blij met mijn wenkbrauwbehandeling! Lau luistert goed naar wat je wil en het resultaat is precies zoals ik het voor ogen had. Kom zeker terug!',
    en: 'Super happy with my eyebrow treatment! Lau listens carefully to what you want and the result is exactly as I had in mind. Definitely coming back!',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Emma R.',
    rating: 5,
    nl: 'Veel minder pijnlijk dan ik verwacht had! Lau is super professioneel en gezellig tegelijk. Mijn huid voelt heerlijk zacht en er is nauwelijks roodheid.',
    en: 'Much less painful than I expected! Lau is super professional and pleasant at the same time. My skin feels wonderfully soft and there is barely any redness.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Laura P.',
    rating: 5,
    nl: 'Ik was nog nooit bij een ontharing geweest. Lau heeft me zo goed geholpen en alles helder uitgelegd. Je voelt je écht welkom, zonder oordeel.',
    en: "I had never had hair removal before. Lau helped me so well and explained everything clearly. You truly feel welcome, without judgement.",
    source: 'Google',
  },
  {
    id: 6,
    name: 'Roos T.',
    rating: 5,
    nl: 'Geweldige behandeling en een super fijn gesprek erbij. Lau heeft hart voor haar vak en dat merk je aan alles. Zo blij dat ik haar gevonden heb!',
    en: 'Great treatment and a wonderful conversation too. Lau has a real passion for her craft and you can feel it in everything. So glad I found her!',
    source: 'Google',
  },
];
