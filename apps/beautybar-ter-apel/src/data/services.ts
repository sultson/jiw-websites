export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  descNl?: string;
  descEn?: string;
};

export type ServiceCategory = {
  id: string;
  icon: 'sparkles' | 'palette' | 'heart' | 'droplet';
  titleNl: string;
  titleEn: string;
  blurbNl?: string;
  blurbEn?: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'kunstnagels',
    icon: 'sparkles',
    titleNl: 'Kunstnagels & verlenging',
    titleEn: 'Artificial nails & extensions',
    blurbNl: 'Sterke set met Power Gel van Magnetic.',
    blurbEn: 'A strong set built with Magnetic Power Gel.',
    services: [
      {
        id: 'set-new',
        nameNl: 'Nieuwe set',
        nameEn: 'New set',
        descNl: 'Volledige opbouw met builder gel of acrygel, in jouw vorm en lengte.',
        descEn: 'Full build with builder gel or acrygel, in the shape and length you want.',
      },
      {
        id: 'set-fill',
        nameNl: 'Opvullen',
        nameEn: 'Refill',
        descNl: 'Onderhoud na 3 tot 4 weken, inclusief vormcorrectie en nieuwe kleur.',
        descEn: 'Maintenance after 3 to 4 weeks, including shape correction and a new colour.',
      },
      {
        id: 'set-removal',
        nameNl: 'Verwijderen',
        nameEn: 'Removal',
        descNl: 'Veilig afhalen, gevolgd door verzorging van de natuurlijke nagel.',
        descEn: 'Safe removal followed by care for the natural nail.',
      },
    ],
  },
  {
    id: 'gellak',
    icon: 'droplet',
    titleNl: 'Gellak & natuurlijke nagels',
    titleEn: 'Gel polish & natural nails',
    blurbNl: 'Snel klaar, glanzend resultaat.',
    blurbEn: 'Quick to apply, long-lasting shine.',
    services: [
      {
        id: 'gel-color',
        nameNl: 'Gellak met kleur',
        nameEn: 'Gel polish with colour',
        descNl: 'Hoogglanzende kleur op natuurlijke nagels of bestaande set.',
        descEn: 'High-gloss colour on natural nails or your existing set.',
      },
      {
        id: 'gel-change',
        nameNl: 'Kleur wijzigen',
        nameEn: 'Polish change',
        descNl: 'Verwijderen van bestaande gellak en aanbrengen van een nieuwe kleur.',
        descEn: 'Remove existing gel polish and apply a new colour.',
      },
      {
        id: 'gel-french',
        nameNl: 'French of babyboom',
        nameEn: 'French or babyboomer',
        descNl: 'Tijdloze afwerking met getekende lanula of zachte fade.',
        descEn: 'Timeless finish with a painted lunula or soft fade.',
      },
    ],
  },
  {
    id: 'nailart',
    icon: 'palette',
    titleNl: 'Handgeschilderde nail art',
    titleEn: 'Hand-painted nail art',
    blurbNl: 'Volledig uit losse hand, in jouw stijl.',
    blurbEn: 'Entirely freehand, in your style.',
    services: [
      {
        id: 'art-freehand',
        nameNl: 'Freehand art',
        nameEn: 'Freehand art',
        descNl: 'Bloemen, lijntekeningen, abstracte vormen, geschilderd zonder stickers.',
        descEn: 'Florals, linework, abstract shapes, painted without stickers.',
      },
      {
        id: 'art-seasonal',
        nameNl: 'Seizoensthema',
        nameEn: 'Seasonal themes',
        descNl: 'Lente, zomer, herfst of feestdagen, afgestemd op jouw kleurkeuze.',
        descEn: 'Spring, summer, autumn or holidays, matched to your colour choice.',
      },
      {
        id: 'art-custom',
        nameNl: 'Custom mix',
        nameEn: 'Custom colour mix',
        descNl: 'Eigen kleur in de salon gemengd uit Magnetic gelpolish.',
        descEn: 'Your own colour mixed in-studio from Magnetic gel polish.',
      },
    ],
  },
  {
    id: 'correctie',
    icon: 'heart',
    titleNl: 'Probleem- en haviksnagels',
    titleEn: 'Problem & claw nails',
    blurbNl: 'In stappen terug naar gezond.',
    blurbEn: 'A step-by-step path back to healthy.',
    services: [
      {
        id: 'corr-claw',
        nameNl: 'Haviksnagel-correctie',
        nameEn: 'Claw nail correction',
        descNl: 'Strakke, natuurlijke vorm met Powergel en Shape its, zonder verzwaring.',
        descEn: 'Clean, natural shape with Powergel and Shape its, without weighing the nail down.',
      },
      {
        id: 'corr-weak',
        nameNl: 'Verzwakte nagels',
        nameEn: 'Weak nails',
        descNl: 'Lichte verstevigingslaag die meegroeit, ideaal voor herstel.',
        descEn: 'A light strengthening layer that grows with the nail, ideal for recovery.',
      },
      {
        id: 'corr-care',
        nameNl: 'Nagelverzorging',
        nameEn: 'Nail care',
        descNl: 'Bijwerken van nagelriemen en hydratatie als afronding.',
        descEn: 'Cuticle work and hydration as the finishing step.',
      },
    ],
  },
];
