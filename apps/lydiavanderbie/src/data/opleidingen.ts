import type { Lang } from '../translations';

export type Bilingual = Record<Lang, string>;

export type Opleiding = {
  id: string;
  name: string;
  image: string;
  price: Bilingual;
  desc: Bilingual;
  facts: Record<Lang, string[]>;
};

export const opleidingen: Opleiding[] = [
  {
    id: 'voetreflextherapie',
    name: 'Voetreflextherapie',
    image: '/img/op-voetreflex.webp',
    price: { nl: '€ 695', en: '€ 695' },
    desc: {
      nl: 'De volledige beroepsopleiding voetreflexzonetherapie. Je leert de reflexzones op de voeten, drukpuntmassage en hoe je het zelfherstellend vermogen activeert. Inclusief de schriftelijke opleiding basis medische vakken.',
      en: 'The complete vocational course in foot reflexology. You learn the reflex zones on the feet, pressure-point massage and how to activate the self-healing capacity. Includes the written course in medical foundations.',
    },
    facts: {
      nl: ['6 lesdagen + examen', 'Groep van 6 cursisten', 'Inclusief basis medische vakken', 'CRKBO, optioneel CAT en NVVT'],
      en: ['6 class days + exam', 'Group of 6 students', 'Includes medical foundations', 'CRKBO, optional CAT and NVVT'],
    },
  },
  {
    id: 'complementair-therapeut',
    name: 'Complementair therapeut(e)',
    image: '/img/op-complementair.webp',
    price: { nl: 'vanaf € 695', en: 'from € 695' },
    desc: {
      nl: 'Word complementair therapeut met een brede basis. Je combineert de opleiding voetreflexologie met de modules basis medische vakken, celzouttherapie en bloesemtherapie. Alle onderdelen zijn ook los te volgen.',
      en: 'Become a complementary therapist with a broad foundation. You combine the foot reflexology course with the modules in medical foundations, cell salt therapy and flower therapy. Each part can also be followed separately.',
    },
    facts: {
      nl: ['Voetreflex + 3 modules', 'Leidt tot diploma complementair therapeut', 'Onderdelen los te volgen', 'Btw-vrij via CRKBO'],
      en: ['Reflexology + 3 modules', 'Leads to complementary therapist diploma', 'Parts followed separately', 'VAT-free via CRKBO'],
    },
  },
  {
    id: 'chakra-therapeut',
    name: 'Energetisch chakra therapeut(e)',
    image: '/img/op-chakra.webp',
    price: { nl: '€ 150 per lesdag', en: '€ 150 per class day' },
    desc: {
      nl: 'Leer werken met de aura, chakra’s, acupressuurpunten en aardebinding. In vier praktijklesdagen ervaar je chakra massage, chakra voetreflexologie, acupressuur met de ohm-stemvork en de methode energie in balans.',
      en: 'Learn to work with the aura, chakras, pressure points and grounding. Across four practice days you experience chakra massage, chakra foot reflexology, acupressure with the ohm tuning fork and the energy-in-balance method.',
    },
    facts: {
      nl: ['4 praktijklesdagen', 'Elke lesdag los te volgen', 'Inclusief lesmappen en behandelvideo’s', 'Diploma met schriftelijke modules'],
      en: ['4 practice days', 'Each day followed separately', 'Includes study guides and treatment videos', 'Diploma with written modules'],
    },
  },
  {
    id: 'stoelmassage',
    name: 'Stoelmassage',
    image: '/img/op-stoelmassage.webp',
    price: { nl: '€ 395', en: '€ 395' },
    desc: {
      nl: 'Een complete professionele stoelmassage over de kleding heen, waarbij je werkt vanuit rust en ki in plaats van spierkracht. Je leert ook een stukje Dorn-techniek voor nek en schouders.',
      en: 'A complete professional chair massage over clothing, working from calm and ki rather than muscle power. You also learn a piece of Dorn technique for the neck and shoulders.',
    },
    facts: {
      nl: ['3 lesdagen', 'Groep van 4 cursisten', 'Certificaat van deelname', 'Optioneel examen voor diploma'],
      en: ['3 class days', 'Group of 4 students', 'Certificate of attendance', 'Optional exam for diploma'],
    },
  },
  {
    id: 'biotensor',
    name: 'Meten en behandelen met de biotensor',
    image: '/img/op-biotensor.webp?v=20260601',
    price: { nl: '€ 125 per lesdag', en: '€ 125 per class day' },
    desc: {
      nl: 'De biotensor is een testinstrument waarmee je energetische trillingen meet. In drie lesdagen leer je testen en behandelen rond de levensfasen van het leven en van de ziel. Bij deelname aan alle drie de dagen krijg je een gratis biotensor.',
      en: 'The biotensor is a testing instrument for measuring energetic vibrations. Across three days you learn to test and treat around the life phases of the self and the soul. Join all three days and receive a free biotensor.',
    },
    facts: {
      nl: ['3 lesdagen', 'Gratis biotensor bij alle 3', 'Inclusief celzout- en bloesemtest', 'Uitgebreide lesmappen'],
      en: ['3 class days', 'Free biotensor with all 3', 'Includes cell salt and flower test', 'Extensive study guides'],
    },
  },
  {
    id: 'munay-ki',
    name: 'Munay-Ki',
    image: '/img/op-munayki.webp',
    price: { nl: 'vanaf € 395', en: 'from € 395' },
    desc: {
      nl: 'Het pad van groei, healing en transformatie uit de traditie van de Inca-sjamanen, samengesteld door Alberto Villoldo. Je ontvangt de negen inwijdingen, met als afsluiting je eigen Pi-steen.',
      en: 'The path of growth, healing and transformation from the tradition of the Inca shamans, composed by Alberto Villoldo. You receive the nine rites, completed with your own Pi stone.',
    },
    facts: {
      nl: ['9 rites en inwijdingen', '3 of 4 dagen in groepsverband', 'Verdieping en rite of the womb mogelijk', 'Ook individueel te volgen'],
      en: ['9 rites and initiations', '3 or 4 days in a group', 'Deepening and rite of the womb optional', 'Also available individually'],
    },
  },
  {
    id: 'specialisaties-voetreflex',
    name: 'Specialisaties voor voetreflextherapeuten',
    image: '/img/op-specialisaties.webp',
    price: { nl: '€ 65 per cursus', en: '€ 65 per course' },
    desc: {
      nl: 'Online verdieping voor bestaande voetreflextherapeuten. Kies uit specialisaties rond de overgang, neuropathie en verzuring. Je werkt met lesmap en video’s in de leeromgeving en sluit af met een certificaat.',
      en: 'Online deepening for existing foot reflexology therapists. Choose specialisations around menopause, neuropathy and acidification. You work with a study guide and videos in the learning environment and finish with a certificate.',
    },
    facts: {
      nl: ['Volledig online', 'Eigen tijd en tempo', 'GRO-erkend', 'Direct te starten'],
      en: ['Fully online', 'Your own time and pace', 'GRO accredited', 'Start right away'],
    },
  },
];
