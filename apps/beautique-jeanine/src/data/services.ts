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
    id: 'skin',
    titleNl: 'Huidverzorging',
    titleEn: 'Skincare',
    icon: 'droplet',
    blurbNl: 'Gezichtsbehandelingen en huidverbetering.',
    blurbEn: 'Facials and skin improvement.',
    services: [
      {
        id: 'facials',
        nameNl: 'Gezichtsbehandelingen',
        nameEn: 'Facials',
        descNl: 'Verzorgende behandeling voor wie zoekt naar huidverzorging in Rotsterhaule.',
        descEn: 'Care-focused treatment for people searching for skincare in Rotsterhaule.',
      },
      {
        id: 'microdermabrasie',
        nameNl: 'Microdermabrasie',
        nameEn: 'Microdermabrasion',
        descNl: 'Huidverbeterende behandeling die in de research bij Beautique Jeanine is genoemd.',
        descEn: 'Skin-improving treatment found in the Beautique Jeanine research.',
      },
      {
        id: 'peeling',
        nameNl: 'Peeling',
        nameEn: 'Peeling',
        descNl: 'Behandeling binnen huidverzorging en huidverbetering. Vraag Jeanine naar de actuele mogelijkheden.',
        descEn: 'Treatment within skincare and skin improvement. Ask Jeanine about current options.',
      },
    ],
  },
  {
    id: 'massage',
    titleNl: 'Bindweefselmassage',
    titleEn: 'Connective tissue massage',
    icon: 'heart',
    blurbNl: 'Door Jeanine omschreven als huidconditie-verbeterende massage.',
    blurbEn: 'Described by Jeanine as a massage that improves skin condition.',
    services: [
      {
        id: 'bindweefsel',
        nameNl: 'Bindweefselmassage',
        nameEn: 'Connective tissue massage',
        descNl: 'Voor doorbloeding, stevigheid, huidteint en betere opname van werkstoffen.',
        descEn: 'For circulation, firmness, skin tone and better absorption of active ingredients.',
      },
    ],
  },
  {
    id: 'lashes',
    titleNl: 'Wimpers',
    titleEn: 'Lashes',
    icon: 'sparkles',
    blurbNl: 'Wimperbehandelingen uit de clientnotities.',
    blurbEn: 'Lash treatments from the client notes.',
    services: [
      {
        id: 'extensions',
        nameNl: 'Wimperextensions',
        nameEn: 'Lash extensions',
        descNl: 'Voor klanten die zoeken naar wimperextensions in de omgeving Rotsterhaule en Friesland.',
        descEn: 'For clients searching for lash extensions near Rotsterhaule and Friesland.',
      },
      {
        id: 'lvl',
        nameNl: 'Lash volume lifting',
        nameEn: 'Lash volume lifting',
        descNl: 'Wimperlifting voor een gelifte uitstraling van de eigen wimpers.',
        descEn: 'Lash lifting for a lifted look of the natural lashes.',
      },
    ],
  },
  {
    id: 'beauty',
    titleNl: 'Beauty & producten',
    titleEn: 'Beauty & products',
    icon: 'palette',
    blurbNl: 'Gellak, make-up advies en salonproducten.',
    blurbEn: 'Gel polish, make-up advice and salon products.',
    services: [
      {
        id: 'gellak',
        nameNl: 'Gellak',
        nameEn: 'Gel polish',
        descNl: 'Gellak staat in de clientnotities als beautybehandeling bij Beautique Jeanine.',
        descEn: 'Gel polish is listed in the client notes as a beauty treatment at Beautique Jeanine.',
      },
      {
        id: 'makeup',
        nameNl: 'PUNE make-up advies',
        nameEn: 'PUNE make-up advice',
        descNl: 'Make-up advies met PUNE, genoemd op Instagram bij Beautique Jeanine.',
        descEn: 'Make-up advice with PUNE, mentioned on Beautique Jeanine Instagram.',
      },
      {
        id: 'products',
        nameNl: 'IK Skin Perfection producten',
        nameEn: 'IK Skin Perfection products',
        descNl: 'Salonproducten van IK Skin Perfection worden op Instagram bij Beautique Jeanine genoemd.',
        descEn: 'IK Skin Perfection salon products are mentioned on Beautique Jeanine Instagram.',
      },
    ],
  },
];
