export type Service = {
  id: string;
  nameNl: string;
  nameEn: string;
  descNl?: string;
  descEn?: string;
};

export type ServiceCategory = {
  id: string;
  titleNl: string;
  titleEn: string;
  icon: 'sparkles' | 'heart' | 'palette' | 'droplet';
  blurbNl?: string;
  blurbEn?: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'gelpolish',
    titleNl: 'Gelpolish en gellak',
    titleEn: 'Gel polish',
    icon: 'palette',
    blurbNl: 'Een specialisme dat Lisette zelf noemt in haar Instagram-bio.',
    blurbEn: 'A specialism Lisette lists in her own Instagram bio.',
    services: [
      {
        id: 'gelpolish-handen',
        nameNl: 'Gelpolish op handen',
        nameEn: 'Gel polish on hands',
        descNl: 'Voor wie zoekt naar gellak of gelpolish in Putten.',
        descEn: 'For clients looking for gel polish in Putten.',
      },
      {
        id: 'gelpolish-tenen',
        nameNl: 'Gelpolish op tenen',
        nameEn: 'Gel polish on toes',
        descNl: 'Voetverzorging komt terug in Google-recensies.',
        descEn: 'Foot-care context appears in Google reviews.',
      },
      {
        id: 'nabehandeling',
        nameNl: 'Nabehandeling gellak',
        nameEn: 'Gel polish aftercare',
        descNl: 'Genoemd in Facebook-posts; stem de actuele mogelijkheden af met Lisette.',
        descEn: 'Mentioned in Facebook posts; ask Lisette about current options.',
      },
    ],
  },
  {
    id: 'manicure',
    titleNl: 'Manicure handverzorging',
    titleEn: 'Manicure hand care',
    icon: 'heart',
    blurbNl: 'Ook dit noemt Lisette als eigen specialisme.',
    blurbEn: 'Another specialism Lisette names herself.',
    services: [
      {
        id: 'manicure',
        nameNl: 'Manicure',
        nameEn: 'Manicure',
        descNl: 'Verzorging van handen en nagels; vraag Lisette naar de actuele invulling.',
        descEn: 'Care for hands and nails; ask Lisette about the current options.',
      },
      {
        id: 'handverzorging',
        nameNl: 'Handverzorging',
        nameEn: 'Hand care',
        descNl: 'Voor verzorgde nagels en handen op afspraak in Putten.',
        descEn: 'For cared-for nails and hands by appointment in Putten.',
      },
      {
        id: 'verwijderen',
        nameNl: 'Verwijderen van kunstnagels',
        nameEn: 'Artificial nail removal',
        descNl: 'Een bruid liet in een Google-recensie weten hiervoor snel geholpen te zijn.',
        descEn: 'A bride mentioned fast help with this in a Google review.',
      },
    ],
  },
  {
    id: 'gelnagels',
    titleNl: 'Gelnagels met verlenging',
    titleEn: 'Gel nails with extensions',
    icon: 'sparkles',
    blurbNl: 'Een derde specialisme uit Lisettes eigen bio.',
    blurbEn: "A third specialism from Lisette's own bio.",
    services: [
      {
        id: 'gelnagels',
        nameNl: 'Gelnagels',
        nameEn: 'Gel nails',
        descNl: 'Voor een nieuwe set of verzorgde nagelverlenging.',
        descEn: 'For a new set or cared-for nail extension.',
      },
      {
        id: 'verlenging',
        nameNl: 'Gelnagels met verlenging',
        nameEn: 'Gel nails with extensions',
        descNl: 'Precies zo genoemd in de Instagram-bio van de studio.',
        descEn: "Listed exactly this way in the studio's Instagram bio.",
      },
      {
        id: 'dip-powder',
        nameNl: 'Dip powder context',
        nameEn: 'Dip powder context',
        descNl: 'Genoemd in oudere Google-servicecontext; vraag naar de actuele beschikbaarheid.',
        descEn: 'Mentioned in older Google service context; ask about current availability.',
      },
    ],
  },
  {
    id: 'nail-art',
    titleNl: 'Nail art en details',
    titleEn: 'Nail art and details',
    icon: 'droplet',
    blurbNl: 'Facebook laat handwerk en nail art op verzoek zien.',
    blurbEn: 'Facebook shows handwork and nail art on request.',
    services: [
      {
        id: 'nail-art',
        nameNl: 'Nail art op verzoek',
        nameEn: 'Nail art on request',
        descNl: 'Lisette liet zien dat klanten soms een voorbeeld meenemen en zij het probeert.',
        descEn: 'Lisette showed that clients sometimes bring a reference and she tries it.',
      },
      {
        id: 'kleur-detail',
        nameNl: 'Kleur en detailkeuze',
        nameEn: 'Colour and detail choices',
        descNl: 'Huidige kleuren en mogelijkheden bespreek je rechtstreeks met haar.',
        descEn: 'Current colours and options can be discussed with her directly.',
      },
    ],
  },
];
