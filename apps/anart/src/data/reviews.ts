export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  pl: string;
  source: 'Treatwell' | 'Google';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Jolita',
    rating: 5,
    nl: 'De wimpers zijn geweldig. Anna weet haar vak en doet alles met haar hart.',
    en: 'The eyelashes are amazing. Anna knows her job very well and does everything from the heart.',
    pl: 'Rzęsy są niesamowite. Anna doskonale zna swój zawód i robi wszystko z sercem.',
    source: 'Treatwell',
  },
  {
    id: 2,
    name: 'Jamie',
    rating: 5,
    nl: 'Het was heel fijn. Ik kom zeker terug. Ik raad het aan om een afspraak te boeken.',
    en: 'It was very nice. I definitely come back. I recommend booking an appointment.',
    pl: 'Było bardzo miło. Na pewno wrócę. Polecam umówić wizytę.',
    source: 'Treatwell',
  },
  {
    id: 3,
    name: 'Michalina',
    rating: 5,
    nl: 'Geweldige meiden! Professioneel. Heel tevreden met mijn prachtige nagels.',
    en: 'Great girls! Professional. Very satisfied with my beautiful nails.',
    pl: 'Świetne dziewczyny! Profesjonalne. Bardzo zadowolona z moich pięknych paznokci.',
    source: 'Treatwell',
  },
  {
    id: 4,
    name: 'Ankie',
    rating: 5,
    nl: 'Ik heb er echt van genoten, het was erg ontspannend.',
    en: 'I did enjoy it and was very relaxing.',
    pl: 'Naprawdę mi się podobało, było bardzo relaksujące.',
    source: 'Treatwell',
  },
  {
    id: 5,
    name: 'Lisa',
    rating: 5,
    nl: 'Lieve meid, werkte zorgvuldig. Echt een aanrader!',
    en: 'Sweet girl, worked carefully. Highly recommended!',
    pl: 'Miła dziewczyna, pracowała starannie. Bardzo polecam!',
    source: 'Treatwell',
  },
];
