import type { Bilingual } from './opleidingen';
import type { Lang } from '../translations';

export type Behandeling = {
  name: string;
  /** null = price on request */
  price: Bilingual | null;
  desc: Record<Lang, string>;
};

export type BehandelingGroup = {
  id: string;
  title: Record<Lang, string>;
  image: string;
  blurb: Record<Lang, string>;
  items: Behandeling[];
};

export const behandelingGroups: BehandelingGroup[] = [
  {
    id: 'voetreflexologie',
    title: { nl: 'Voetreflexologie', en: 'Foot reflexology' },
    image: '/img/op-voetreflex.webp',
    blurb: {
      nl: 'Drukpuntmassage op de reflexzones van de voeten die het zelfherstellend vermogen aanspreekt. Met 26 jaar ervaring, ook voor specifieke klachten.',
      en: 'Pressure-point massage on the reflex zones of the feet that calls on the self-healing capacity. With 26 years of experience, also for specific complaints.',
    },
    items: [
      {
        name: 'Voetreflexologie',
        price: { nl: 'vanaf € 25', en: 'from € 25' },
        desc: { nl: 'De basisbehandeling van 20 tot 40 minuten.', en: 'The base treatment of 20 to 40 minutes.' },
      },
      {
        name: 'Bij neuropathie',
        price: { nl: '€ 40', en: '€ 40' },
        desc: { nl: 'Zachte voetmassage en acupressuur bij zenuwpijn.', en: 'Gentle foot massage and acupressure for nerve pain.' },
      },
      {
        name: 'En verzuring',
        price: { nl: '€ 40', en: '€ 40' },
        desc: { nl: 'Reflexzones rond de zuur-base-balans, met advies.', en: 'Reflex zones around the acid-base balance, with advice.' },
      },
      {
        name: 'En de overgang',
        price: { nl: '€ 25', en: '€ 25' },
        desc: { nl: 'Een speciale behandeling bij overgangsklachten.', en: 'A dedicated treatment for menopausal complaints.' },
      },
      {
        name: 'Rond zwangerschap',
        price: { nl: '€ 40', en: '€ 40' },
        desc: { nl: 'Voor, tijdens en na de zwangerschap of zwangerschapswens.', en: 'Before, during and after pregnancy or a wish to conceive.' },
      },
      {
        name: 'Afvallen, traject van 13 weken',
        price: { nl: '€ 275', en: '€ 275' },
        desc: { nl: 'Zes behandelingen, zes consulten en een stappenplan.', en: 'Six treatments, six consultations and a step-by-step plan.' },
      },
      {
        name: 'Bij vermoeidheid',
        price: null,
        desc: { nl: 'Een traject van acht weken rond energie in balans.', en: 'An eight-week path around energy in balance.' },
      },
      {
        name: 'Chinese voetreflexologie',
        price: null,
        desc: { nl: 'Meridiaanpunten via acupressuur, stemvork en klankschalen.', en: 'Meridian points via acupressure, tuning fork and singing bowls.' },
      },
    ],
  },
  {
    id: 'energetisch',
    title: { nl: 'Energetisch & healing', en: 'Energy & healing' },
    image: '/img/beh-reiki.webp',
    blurb: {
      nl: 'Behandelingen die rust en ruimte brengen. Van Reiki en chakrawerk tot soundhealing, afgestemd op wat jij nodig hebt.',
      en: 'Treatments that bring calm and space. From Reiki and chakra work to sound healing, tuned to what you need.',
    },
    items: [
      {
        name: 'Reiki',
        price: { nl: 'vanaf € 25', en: 'from € 25' },
        desc: { nl: 'Universele levensenergie via handoplegging.', en: 'Universal life energy through hands-on healing.' },
      },
      {
        name: 'Chakra reflexologie',
        price: { nl: '€ 40', en: '€ 40' },
        desc: { nl: 'Voetreflex met chakra-oliën en chakra-stemvorken.', en: 'Foot reflexology with chakra oils and tuning forks.' },
      },
      {
        name: 'Chakra massage',
        price: { nl: '€ 35', en: '€ 35' },
        desc: { nl: 'Massage met zeven aromatherapeutische oliën.', en: 'Massage with seven aromatherapeutic oils.' },
      },
      {
        name: 'Soundhealing',
        price: { nl: '€ 25 - € 40', en: '€ 25 - € 40' },
        desc: { nl: 'Klankschalen, koshi’s en chakra-stemvorken.', en: 'Singing bowls, koshi chimes and chakra tuning forks.' },
      },
      {
        name: 'Energie in balans',
        price: { nl: '€ 45', en: '€ 45' },
        desc: { nl: 'Een traject van zeven consulten, per keer een ander chakra.', en: 'A path of seven sessions, a different chakra each time.' },
      },
      {
        name: 'Yoga, meditatie & soundhealing',
        price: { nl: '€ 20', en: '€ 20' },
        desc: { nl: 'In een kleine groep van maximaal drie personen.', en: 'In a small group of up to three people.' },
      },
      {
        name: 'Van 3D naar 5D',
        price: { nl: '€ 45', en: '€ 45' },
        desc: { nl: 'Een sessie met een passende olieroller om mee te nemen.', en: 'A session with a matching oil roller to take home.' },
      },
      {
        name: 'Levensfases van de ziel',
        price: null,
        desc: { nl: 'Een coachingsessie met de biotensor van ongeveer anderhalf uur.', en: 'A coaching session with the biotensor of about ninety minutes.' },
      },
    ],
  },
  {
    id: 'massage',
    title: { nl: 'Massage & ontspanning', en: 'Massage & relaxation' },
    image: '/img/beh-massage.webp',
    blurb: {
      nl: 'Massages die spanning losmaken en je weer in je lijf brengen. Van warme stenen tot een gerichte aanpak van de onderrug.',
      en: 'Massages that release tension and bring you back into your body. From warm stones to a focused approach for the lower back.',
    },
    items: [
      {
        name: 'Hotstone massage',
        price: { nl: '€ 45', en: '€ 45' },
        desc: { nl: 'Warme stenen op de chakra’s en reflexzones.', en: 'Warm stones on the chakras and reflex zones.' },
      },
      {
        name: 'Rug-, nek- en schoudermassage',
        price: { nl: 'vanaf € 25', en: 'from € 25' },
        desc: { nl: 'Meerdere varianten, van Dorn tot triggerpoint.', en: 'Several variants, from Dorn to trigger point.' },
      },
      {
        name: 'Lumbaal reset massage',
        price: { nl: 'vanaf € 25', en: 'from € 25' },
        desc: { nl: 'Gerichte aanpak van de onderrug met massage en Dorn.', en: 'A focused approach for the lower back with massage and Dorn.' },
      },
      {
        name: 'Magnesium behandeling',
        price: { nl: '€ 22,50', en: '€ 22.50' },
        desc: { nl: 'Massage van rug en schouders of voet en onderbeen.', en: 'Massage of back and shoulders or foot and lower leg.' },
      },
      {
        name: 'Vlindermassage',
        price: { nl: '€ 35', en: '€ 35' },
        desc: { nl: 'Zachte massage over ruggengraat en blaasmeridiaan.', en: 'Gentle massage along the spine and bladder meridian.' },
      },
      {
        name: 'Metamorfosemassage',
        price: { nl: '€ 40', en: '€ 40' },
        desc: { nl: 'Massage van hoofd, handen en voeten, in stilte.', en: 'Massage of head, hands and feet, in silence.' },
      },
    ],
  },
  {
    id: 'verzorging',
    title: { nl: 'Gezicht & verzorging', en: 'Face & care' },
    image: '/img/beh-gezichtsbehandeling.webp',
    blurb: {
      nl: 'Verzorgende behandelingen met natuurlijke producten, om even helemaal tot rust te komen.',
      en: 'Nurturing treatments with natural products, to come fully to rest for a while.',
    },
    items: [
      {
        name: 'Puur natuur gezichtsbehandeling',
        price: { nl: '€ 35 - € 40', en: '€ 35 - € 40' },
        desc: { nl: 'Natuurlijke aromatherapie met drukpuntmassage.', en: 'Natural aromatherapy with pressure-point massage.' },
      },
      {
        name: 'Vertroetel je voet',
        price: { nl: '€ 22,50', en: '€ 22.50' },
        desc: { nl: 'Voetscrub, voetmasker, warme kompressen en massage.', en: 'Foot scrub, foot mask, warm compresses and massage.' },
      },
      {
        name: 'Infraroodcabine',
        price: { nl: '€ 20 - € 35', en: '€ 20 - € 35' },
        desc: { nl: 'Infrarood met zoutwand, los of in combinatie.', en: 'Infrared with a salt wall, on its own or combined.' },
      },
    ],
  },
];
