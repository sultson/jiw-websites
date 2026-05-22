export type ServiceCategory = {
  id: string;
  title: { nl: string; en: string };
  intro: { nl: string; en: string };
  items: Array<{ nl: string; en: string }>;
};

export const services: ServiceCategory[] = [
  {
    id: 'nails',
    title: { nl: 'Nagels', en: 'Nails' },
    intro: {
      nl: 'Acryl, gellak en BIAB. Voor refills, een nieuwe set of een verzorgde manicure.',
      en: 'Acrylic, gel polish and BIAB. For refills, a brand-new set or a clean manicure.',
    },
    items: [
      { nl: 'Nieuwe set acryl', en: 'New acrylic set' },
      { nl: 'Acryl refill',     en: 'Acrylic refill' },
      { nl: 'BIAB nagels',      en: 'BIAB nails' },
      { nl: 'Gellak / manicure', en: 'Gel polish / manicure' },
      { nl: 'French, cat eye, glitter', en: 'French, cat eye, glitter' },
      { nl: 'Nagelreparatie',   en: 'Nail repair' },
    ],
  },
  {
    id: 'lashes-brows',
    title: { nl: 'Lashes & wenkbrauwen', en: 'Lashes & brows' },
    intro: {
      nl: 'Eyelash extensions en wenkbrauwbehandeling voor een verzorgde blik.',
      en: 'Eyelash extensions and brow treatments for a clean, defined look.',
    },
    items: [
      { nl: 'Eyelash extensions', en: 'Eyelash extensions' },
      { nl: 'Refill lashes',      en: 'Lash refill' },
      { nl: 'Wenkbrauwen epileren & vormen', en: 'Brow shaping & tweezing' },
    ],
  },
  {
    id: 'hair',
    title: { nl: 'Vlechten & haar', en: 'Braids & hair' },
    intro: {
      nl: 'Vlechten voor groot en klein, en haarverlengingen op maat.',
      en: 'Braids for kids and adults, and custom hair extensions.',
    },
    items: [
      { nl: 'Vlechten (volwassen)', en: 'Braids (adults)' },
      { nl: 'Vlechten kinderen',    en: 'Braids for kids' },
      { nl: 'Bubble braids & box braids', en: 'Bubble braids & box braids' },
      { nl: 'Haarverlengingen',     en: 'Hair extensions' },
    ],
  },
  {
    id: 'tooth-gems',
    title: { nl: 'Tandsieraden', en: 'Tooth gems' },
    intro: {
      nl: 'Gouden tandsieraden en Swarovski-kristallen. Subtiel of opvallend, jouw keuze.',
      en: 'Gold tooth gems and Swarovski crystals. Subtle or bold — your call.',
    },
    items: [
      { nl: 'Gouden tandsieraad', en: 'Gold tooth gem' },
      { nl: 'Swarovski crystal',  en: 'Swarovski crystal' },
      { nl: 'Verwijderen tandsieraad', en: 'Tooth gem removal' },
    ],
  },
];
