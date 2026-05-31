import type { Lang } from '../translations';

export type Review = {
  quote: Record<Lang, string>;
  context: Record<Lang, string>;
};

/** Real cursist quotes from the existing site (bloesemtherapie & biotensor lessons). */
export const reviews: Review[] = [
  {
    quote: {
      nl: 'Wat een leuke lessen zijn dit. Je begrijpt zoveel beter en ik zie dingen van mijzelf en mijn omgeving erin terug.',
      en: 'Such lovely lessons. You understand so much better, and I recognise things about myself and the people around me.',
    },
    context: { nl: 'Cursist bloesemtherapie', en: 'Flower therapy student' },
  },
  {
    quote: {
      nl: 'Wat een inzicht heb ik gekregen, en zo toepasbaar in mijn praktijk.',
      en: 'I gained so much insight, and it is so applicable in my practice.',
    },
    context: { nl: 'Cursist bloesemtherapie', en: 'Flower therapy student' },
  },
  {
    quote: {
      nl: 'Nu begrijp ik mijn cliënten veel beter en heb ik al veel mensen kunnen helpen met de bloesems.',
      en: 'Now I understand my clients far better, and I have already helped many people with the flower remedies.',
    },
    context: { nl: 'Cursist bloesemtherapie', en: 'Flower therapy student' },
  },
  {
    quote: {
      nl: 'Een super makkelijke testmethode waar ik direct mee aan de slag kan. Een echte aanvulling voor mijn praktijk.',
      en: 'A really easy testing method I can start with right away. A genuine addition to my practice.',
    },
    context: { nl: 'Cursist biotensor', en: 'Biotensor student' },
  },
  {
    quote: {
      nl: 'Nu kan ik nog beter een keuze maken voor mijn cliënten. Wat een fijne les.',
      en: 'Now I can make even better choices for my clients. What a lovely lesson.',
    },
    context: { nl: 'Cursist biotensor', en: 'Biotensor student' },
  },
];
