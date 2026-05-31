import type { Bilingual } from './opleidingen';
import type { Lang } from '../translations';

export type Training = {
  name: string;
  price: Bilingual;
  desc: Record<Lang, string>;
};

export const trainingen: Training[] = [
  {
    name: 'Reiki Usui Level 1',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'Werken met universele levensenergie via handoplegging, met de eerste inwijdingen en een volledige behandeling.',
      en: 'Working with universal life energy through hands-on healing, with the first initiations and a full treatment.',
    },
  },
  {
    name: 'Reiki Usui Level 2',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'De individuele inwijding met drie symbolen, waaronder behandelen op afstand. Minimaal drie maanden na Level 1.',
      en: 'The individual initiation with three symbols, including distance healing. At least three months after Level 1.',
    },
  },
  {
    name: 'Chakra reflexologie',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'De reflexzones van de chakra’s op de voeten, met chakra-oliën en aromatherapie. Inclusief olie-set en behandelvideo’s.',
      en: 'The reflex zones of the chakras on the feet, with chakra oils and aromatherapy. Includes an oil set and treatment videos.',
    },
  },
  {
    name: 'Chakra massage',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'Een rustige massage van benen, rug en schouders met zeven aromatherapeutische chakra-oliën.',
      en: 'A calm massage of legs, back and shoulders with seven aromatherapeutic chakra oils.',
    },
  },
  {
    name: 'Hotstone massage',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'La-stone-therapie met warme stenen op de chakra’s en meridianen. Een basismassage is vooraf gewenst.',
      en: 'La stone therapy with warm stones on the chakras and meridians. A basic massage background is recommended first.',
    },
  },
  {
    name: 'Gezichtsmassage & acupressuur',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'Gezichtsmassage, acupressuur en reflexzones in het gezicht, met hydrolaat, massageolie en een kleimasker.',
      en: 'Facial massage, acupressure and reflex zones in the face, with hydrolat, massage oil and a clay mask.',
    },
  },
  {
    name: 'Lage rug massage met Dorn',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'Een combinatie van massage, Dorn-techniek, aromatherapie en reflexologie voor de onderrug. Kleine groep.',
      en: 'A combination of massage, Dorn technique, aromatherapy and reflexology for the lower back. Small group.',
    },
  },
  {
    name: 'Acupressuur & ohm-stemvork',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'De twaalf meridianen en de orgaanklok, fonoforese met de stemvork en reflexzones van hypofyse en thymus.',
      en: 'The twelve meridians and the organ clock, phonophoresis with the tuning fork and reflex zones of pituitary and thymus.',
    },
  },
  {
    name: 'Energie in balans',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'De behandeling energie in balans op de massagetafel. Ook onderdeel van de opleiding chakra therapeut.',
      en: 'The energy-in-balance treatment on the massage table. Also part of the chakra therapist course.',
    },
  },
  {
    name: 'Meten met de biotensor',
    price: { nl: '€ 125', en: '€ 125' },
    desc: {
      nl: 'Leren testen met de biotensor: celzouten, bloesems, halfedelstenen, aardstralen en electrosmog. Eigen biotensor meenemen.',
      en: 'Learn to test with the biotensor: cell salts, flowers, semi-precious stones, earth rays and electrosmog. Bring your own biotensor.',
    },
  },
  {
    name: 'Biotensor: fases van het leven',
    price: { nl: '€ 95', en: '€ 95' },
    desc: {
      nl: 'De vervolgdag rond een consult over de levensfasen, met het loslaten en helen van blokkades.',
      en: 'The follow-up day around a consultation on life phases, with releasing and healing blockages.',
    },
  },
  {
    name: 'Munay-Ki dag 1',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'De eerste lesdag van Munay-Ki met de eerste drie rites, lesmap en koffie en thee.',
      en: 'The first Munay-Ki class day with the first three rites, study guide and coffee and tea.',
    },
  },
  {
    name: 'Vlindermassage',
    price: { nl: '€ 150', en: '€ 150' },
    desc: {
      nl: 'Een zachte massage over de ruggengraat en de blaasmeridiaan met aromatherapie. Kleine groep.',
      en: 'A gentle massage along the spine and bladder meridian with aromatherapy. Small group.',
    },
  },
  {
    name: 'Rite of the womb',
    price: { nl: '€ 45', en: '€ 45' },
    desc: {
      nl: 'De dertiende rite van Munay-Ki, voor het loslaten van energetische lading rond de baarmoeder. De rite zelf is gratis.',
      en: 'The thirteenth rite of Munay-Ki, for releasing energetic charge around the womb. The rite itself is free.',
    },
  },
];
