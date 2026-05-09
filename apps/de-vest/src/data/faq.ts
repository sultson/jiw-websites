export const faqKeys = [
  'faq.q1',
  'faq.q2',
  'faq.q3',
  'faq.q4',
  'faq.q5',
  'faq.q6',
] as const;

export type FaqKey = typeof faqKeys[number];
