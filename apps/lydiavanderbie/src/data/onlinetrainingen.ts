import type { Bilingual } from './opleidingen';
import type { Lang } from '../translations';

export type OnlineTraining = {
  id: string;
  name: string;
  image: string;
  price: Bilingual;
  desc: Record<Lang, string>;
};

export const onlinetrainingen: OnlineTraining[] = [
  {
    id: 'basis-medische-vakken',
    name: 'Basis medische vakken holistisch bekeken',
    image: '/img/op-medische-basisvakken.webp',
    price: { nl: '€ 95', en: '€ 95' },
    desc: {
      nl: 'Anatomie, fysiologie en pathologie, steeds met de holistische kant erbij. Een stevige basis voor iedere therapeut. Je sluit af met een certificaat.',
      en: 'Anatomy, physiology and pathology, always with the holistic side included. A solid base for any therapist. You finish with a certificate.',
    },
  },
  {
    id: 'bloesemtherapie',
    name: 'De kracht van bloesemtherapie',
    image: '/img/op-bloesemtherapie.webp',
    price: { nl: '€ 95', en: '€ 95' },
    desc: {
      nl: 'Werk met de 38 Bach-bloesemremedies, verdeeld over zeven groepen. Je leert eigen mixen samenstellen voor jezelf en je cliënten.',
      en: 'Work with the 38 Bach flower remedies, grouped into seven families. You learn to compose your own mixes for yourself and your clients.',
    },
  },
  {
    id: 'edelsteentherapie',
    name: 'De kracht van edelsteentherapie',
    image: '/img/op-edelsteentherapie.webp',
    price: { nl: '€ 135', en: '€ 135' },
    desc: {
      nl: 'Leer twaalf edelstenen kennen en inzetten, van amethist en rozenkwarts tot labradoriet. Met een introductielesmap, modules en huiswerkbegeleiding.',
      en: 'Get to know and apply twelve gemstones, from amethyst and rose quartz to labradorite. With an introductory guide, modules and homework support.',
    },
  },
  {
    id: 'celzouttherapie',
    name: 'Module celzouttherapie',
    image: '/img/op-celzouttherapie.webp',
    price: { nl: '€ 35', en: '€ 35' },
    desc: {
      nl: 'De twaalf celzouten van Dr. Schüssler, helder uitgelegd. Na betaling staat de lesmap direct in je mailbox, zodat je meteen kunt beginnen.',
      en: 'The twelve cell salts of Dr Schüssler, clearly explained. After payment the study guide lands in your inbox so you can start straight away.',
    },
  },
  {
    id: 'energetische-bewustwording',
    name: 'Energetische bewustwording & intuïtieve ontwikkeling',
    image: '/img/op-energetische-bewustwording.webp',
    price: { nl: 'vanaf € 95', en: 'from € 95' },
    desc: {
      nl: 'Positieve psychologie, cognitieve gedragstherapie, chakrapsychologie en aurawerk komen samen. Te volgen als thuisstudie of met een praktijklesdag erbij.',
      en: 'Positive psychology, cognitive behavioural therapy, chakra psychology and aura work come together. Available as home study or with a practice day added.',
    },
  },
];
