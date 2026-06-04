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
  icon: 'sparkles' | 'footprints' | 'flower' | 'leaf' | 'hand';
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'gezicht',
    titleNl: 'Gezichtsbehandelingen',
    titleEn: 'Facials',
    icon: 'sparkles',
    services: [
      {
        id: 'klassiek',
        nameNl: 'Klassieke gezichtsbehandeling',
        nameEn: 'Classic facial',
        descNl: 'Reinigen, peelen, masker en een ontspannend moment, afgestemd op jouw huid.',
        descEn: 'Cleanse, peel, mask and a relaxing moment, tailored to your skin.',
      },
      {
        id: 'seizoen',
        nameNl: 'Seizoensbehandeling',
        nameEn: 'Seasonal treatment',
        descNl: 'Een wisselende behandeling die meebeweegt met het seizoen en wat je huid op dat moment nodig heeft.',
        descEn: 'A changing treatment that follows the season and what your skin needs at that moment.',
      },
      {
        id: 'glycol',
        nameNl: 'Glycolzuurpeeling',
        nameEn: 'Glycolic acid peel',
        descNl: 'Vernieuwt de huid en zorgt voor een frisse, egale en stralende teint.',
        descEn: 'Renews the skin for a fresh, even and radiant complexion.',
      },
      {
        id: 'lifting',
        nameNl: 'Intensive lifting eye & face',
        nameEn: 'Intensive lifting eye & face',
        descNl: 'Een krachtig serum op basis van hyaluronzuur en peptiden voor een steviger, gladder gevoel.',
        descEn: 'A powerful serum with hyaluronic acid and peptides for a firmer, smoother feel.',
      },
      {
        id: 'advies',
        nameNl: 'Persoonlijk huidadvies',
        nameEn: 'Personal skin advice',
        descNl: 'Welke reiniging en verzorging passen bij jouw huid en routine? Je krijgt eerlijk advies op maat.',
        descEn: 'Which cleansing and care suit your skin and routine? You get honest, tailored advice.',
      },
    ],
  },
  {
    id: 'voeten',
    titleNl: '(Medisch) pedicure',
    titleEn: '(Medical) pedicure',
    icon: 'footprints',
    services: [
      {
        id: 'medisch-pedicure',
        nameNl: 'Medisch pedicure',
        nameEn: 'Medical pedicure',
        descNl: 'Specialistische voetzorg, ook bij eelt, likdoorns, kloven of een gevoelige of risicovoet.',
        descEn: 'Specialist foot care, also for callus, corns, cracks or a sensitive or at-risk foot.',
      },
      {
        id: 'pedicure',
        nameNl: 'Pedicure',
        nameEn: 'Pedicure',
        descNl: 'Een verzorgde, ontspannen voetbehandeling voor zachte, fijne voeten.',
        descEn: 'A neat, relaxing foot treatment for soft, comfortable feet.',
      },
      {
        id: 'gellak',
        nameNl: 'Gellak',
        nameEn: 'Gel polish',
        descNl: 'Langhoudende, mooie kleur op de teennagels. Ideaal voor de zomer.',
        descEn: 'Long-lasting, lovely colour on the toenails. Ideal for summer.',
      },
    ],
  },
  {
    id: 'massage',
    titleNl: 'Massage',
    titleEn: 'Massage',
    icon: 'flower',
    services: [
      {
        id: 'rug-nek-schouder',
        nameNl: 'Rug-, nek- en schoudermassage',
        nameEn: 'Back, neck and shoulder massage',
        descNl: 'Heerlijk ontspannen en de spanning uit je schouders laten zakken.',
        descEn: 'Wonderfully relaxing, letting the tension melt from your shoulders.',
      },
      {
        id: 'hotstone',
        nameNl: 'Hotstone massage',
        nameEn: 'Hot stone massage',
        descNl: 'Warme stenen die spieren losmaken, stress verminderen en diep laten ontspannen.',
        descEn: 'Warm stones that release muscles, reduce stress and bring deep relaxation.',
      },
    ],
  },
  {
    id: 'wenkbrauwen',
    titleNl: 'Wenkbrauwen & ontharing',
    titleEn: 'Eyebrows & waxing',
    icon: 'leaf',
    services: [
      {
        id: 'wenkbrauwen-shapen',
        nameNl: 'Wenkbrauwen epileren & shapen',
        nameEn: 'Eyebrow shaping',
        descNl: 'Een verzorgde vorm die past bij je gezicht.',
        descEn: 'A neat shape that suits your face.',
      },
      {
        id: 'wenkbrauwen-verven',
        nameNl: 'Wenkbrauwen verven',
        nameEn: 'Eyebrow tinting',
        descNl: 'Meer definitie en diepte voor een afgemaakte blik.',
        descEn: 'More definition and depth for a finished look.',
      },
      {
        id: 'harsen',
        nameNl: 'Harsen',
        nameEn: 'Waxing',
        descNl: 'Zachte ontharing, bijvoorbeeld van de benen, mooi glad voor de zomer.',
        descEn: 'Gentle hair removal, for example of the legs, smooth for summer.',
      },
    ],
  },
  {
    id: 'extra',
    titleNl: 'Manicure & cadeaubonnen',
    titleEn: 'Manicure & gift cards',
    icon: 'hand',
    services: [
      {
        id: 'manicure',
        nameNl: 'Manicure',
        nameEn: 'Manicure',
        descNl: 'Verzorgde handen en nagels, met aandacht voor detail.',
        descEn: 'Well-groomed hands and nails, with attention to detail.',
      },
      {
        id: 'cadeaubon',
        nameNl: 'Cadeaubon',
        nameEn: 'Gift card',
        descNl: 'Een behandeling of bedrag naar keuze, feestelijk ingepakt. Altijd een leuk cadeau.',
        descEn: 'A treatment or amount of your choice, beautifully wrapped. Always a lovely gift.',
      },
    ],
  },
];
