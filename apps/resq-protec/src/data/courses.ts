import type { Lang } from './content';

type CourseSection = { title: string; paragraphs?: string[]; items?: string[] };
export type Course = {
  title: string;
  category: string;
  duration: string;
  audience: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  summary: string;
  sections: CourseSection[];
};

// Client-supplied course descriptions replace the previous Resqprotec catalogue.
const courses: Record<Lang, Course[]> = {
  nl: [
    {
      title: 'Rescue watercraft operator',
      category: 'Operator',
      duration: '3 dagen',
      audience: 'Hulpverleners met een diploma Lifeguard Reddingsbrigade of Oppervlakteredder Brandweer.',
      image: '/images/rwc-operator.webp',
      imageAlt: 'Reddingswaterscooter met reddingsslee vervoert een drenkeling onder begeleiding van twee hulpverleners',
      imageWidth: 1600,
      imageHeight: 940,
      summary: 'Leer professioneel en veilig redden op het water met een speciaal aangepaste waterscooter en reddingsslee. De driedaagse opleiding combineert theorie met intensieve praktijktraining.',
      sections: [
        {
          title: 'Professioneel en veilig redden op het water',
          paragraphs: [
            'Een speciaal aangepaste waterscooter in combinatie met een reddingsslee noemen we een Rescue Watercraft. Tijdens deze opleiding leert u dit systeem veilig en effectief in te zetten bij reddings- en hulpverleningsacties, zodat u drenkelingen gecontroleerd kunt benaderen en uit het water kunt redden.',
            'Veilig varen, manoeuvreren, reddingstechnieken, communicatie en samenwerking met andere hulpdiensten staan centraal. Er is specifieke aandacht voor uitdagende omstandigheden en inzet op rivieren.',
          ],
        },
        {
          title: 'Toelatingseisen',
          items: [
            'Minimaal 18 jaar.',
            'Diploma Lifeguard Reddingsbrigade of Oppervlakteredder Brandweer.',
            'Geldig EHBO-diploma.',
            'Geldig Klein Vaarbewijs 1.',
          ],
        },
        {
          title: 'Inhoud van de opleiding',
          items: [
            'Veiligheidsprocedures, regelgeving en controles vóór gebruik.',
            'Vaar- en manoeuvreertechnieken bij stroming, golven en ondiep water.',
            'Het veilig benaderen en redden van drenkelingen met de Rescue Watercraft.',
            'Communicatie en samenwerking met onder andere reddingsbrigades, brandweer, politie en Rijkswaterstaat.',
            'Capsize-training: handelen wanneer de waterscooter omslaat.',
          ],
        },
        {
          title: 'Examinering en certificering',
          paragraphs: [
            'De opleiding wordt afgesloten met een Proeve van Bekwaamheid (PvB), waarin u aantoont te beschikken over de vereiste theoretische kennis en praktische vaardigheden.',
            'Bij succesvolle afronding van de opleiding en het behalen van de Proeve van Bekwaamheid wordt in samenwerking met de reddingsbrigade een internationaal erkend certificaat uitgereikt. Dit certificaat wordt uitgegeven door de International Life Saving Federation of Europe (ILSE) en bevestigt dat u voldoet aan de gestelde eisen op het gebied van kennis en vaardigheden binnen de reddings- en veiligheidssector.',
          ],
        },
        {
          title: 'Meer informatie',
          paragraphs: ['Wilt u meer weten over de opleiding Rescue Watercraft Operator of de mogelijkheden voor uw organisatie? Neem contact met ons op voor meer informatie.'],
        },
      ],
    },
    {
      title: 'Instructeur Rescue watercraft operator',
      category: 'Instructeur',
      duration: '2 dagen',
      audience: 'Ervaren RWC-operators van reddingsbrigades, hulpdiensten en overheidsorganisaties.',
      image: '/images/rwc-instructor.webp',
      imageAlt: 'Hulpverlener oefent het uit het water halen van een drenkeling met een reddingsslee',
      imageWidth: 1600,
      imageHeight: 1067,
      summary: 'Ontwikkel u als ervaren RWC-operator tot instructeur. In deze tweedaagse praktijkgerichte opleiding leert u collega’s, hulpverleners en medewerkers van overheidsdiensten opleiden tot zelfstandig en veilig inzetbare RWC-operators.',
      sections: [
        {
          title: 'Word RWC-instructeur',
          paragraphs: [
            'De opleiding combineert theoretische kennis met intensieve praktijktraining op het water. U ontwikkelt de vaardigheden om trainingen voor te bereiden, instructies helder over te brengen en cursisten op een professionele en veilige manier te begeleiden.',
            'Na afronding kunt u kennis en vaardigheden overdragen op het gebied van bediening, veiligheid en operationele inzet van reddingswaterscooters, volgens de geldende opleidingsrichtlijnen van de International Life Saving Federation (ILS).',
          ],
        },
        {
          title: 'Toelatingseisen',
          items: [
            'Een geldig RWC-operatorcertificaat.',
            'Minimaal één volledig seizoen ervaring met het varen op een reddingswaterscooter, of aantoonbare gelijkwaardige ervaring.',
            'Een geldig EHBO-certificaat.',
            'Minimaal Klein Vaarbewijs I.',
          ],
        },
        {
          title: 'Opleidingsprogramma',
          paragraphs: ['De opleiding duurt twee dagen en bestaat uit theorie, praktijktraining en een afsluitende beoordeling.'],
          items: [
            'Lesvoorbereiding en lesopbouw: effectieve trainingssessies plannen, voorbereiden en uitvoeren.',
            'Instructie- en demonstratievaardigheden: vaartechnieken, reddingshandelingen en bedieningsprocedures duidelijk uitleggen en voordoen.',
            'Veiligheid en risicobeheersing: risico’s herkennen, veiligheidsmaatregelen toepassen en toezicht houden tijdens oefeningen.',
            'Opleidingsrichtlijnen en beoordelingscriteria: inzicht in de richtlijnen en eisen van de International Life Saving Federation (ILS) voor het opleiden en beoordelen van RWC-operators.',
            'Praktijkinstructie op het water: cursisten begeleiden en beoordelen tijdens realistische oefeningen met de reddingswaterscooter.',
          ],
        },
        {
          title: 'Afsluitende beoordeling',
          paragraphs: ['De opleiding wordt afgesloten met een beoordeling van de theoretische kennis, praktische vaardigheden en instructievaardigheden. De beoordeling vindt plaats onder verantwoordelijkheid van een bevoegde instructeur van de reddingsbrigade, volgens de geldende opleidingsrichtlijnen.'],
        },
        {
          title: 'Voor wie is deze opleiding bedoeld?',
          paragraphs: [
            'Deze opleiding is bedoeld voor ervaren RWC-operators van reddingsbrigades, hulpdiensten en overheidsorganisaties die hun kennis en praktijkervaring willen overdragen aan collega’s en nieuwe operators.',
            'Na afronding beschikt u over de benodigde instructievaardigheden om RWC-trainingen op een gestructureerde, professionele en veiligheidsgerichte manier te verzorgen.',
          ],
        },
      ],
    },
  ],
  en: [
    {
      title: 'Rescue Watercraft Operator',
      category: 'Operator',
      duration: '3 days',
      audience: 'Rescuers holding a Reddingsbrigade Lifeguard or Fire Service Surface Water Rescuer qualification.',
      image: '/images/rwc-operator.webp',
      imageAlt: 'Rescue watercraft and rescue sled transporting a casualty with two rescuers',
      imageWidth: 1600,
      imageHeight: 940,
      summary: 'Learn to carry out professional, safe water rescues using a specially adapted personal watercraft and rescue sled. This three-day course combines theory with intensive practical training.',
      sections: [
        {
          title: 'Professional and safe water rescue',
          paragraphs: [
            'A specially adapted personal watercraft combined with a rescue sled is known as a Rescue Watercraft. This course teaches you to deploy this system safely and effectively during rescue and assistance operations, approaching casualties in a controlled manner and recovering them from the water.',
            'Safe boat handling, manoeuvring, rescue techniques, communication and cooperation with other emergency services are central to the course, with particular attention to challenging conditions and river operations.',
          ],
        },
        {
          title: 'Entry requirements',
          items: [
            'At least 18 years old.',
            'Reddingsbrigade Lifeguard or Fire Service Surface Water Rescuer qualification.',
            'Valid first-aid qualification.',
            'Valid Dutch Klein Vaarbewijs 1 boating licence.',
          ],
        },
        {
          title: 'Course content',
          items: [
            'Safety procedures, regulations and pre-use checks.',
            'Boat-handling and manoeuvring techniques in currents, waves and shallow water.',
            'Safely approaching and rescuing casualties with the Rescue Watercraft.',
            'Communication and cooperation with lifesaving organisations, the fire service, police and Rijkswaterstaat.',
            'Capsize training: responding when the watercraft overturns.',
          ],
        },
        {
          title: 'Assessment and certification',
          paragraphs: [
            'The course concludes with a competency assessment (Proeve van Bekwaamheid, PvB), in which you demonstrate the required theoretical knowledge and practical skills.',
            'After successfully completing the course and passing the assessment, an internationally recognised certificate is awarded in cooperation with the lifesaving organisation. The certificate is issued by the International Life Saving Federation of Europe (ILSE) and confirms that you meet the required standards for knowledge and skills in the rescue and safety sector.',
          ],
        },
        {
          title: 'More information',
          paragraphs: ['Contact us to learn more about the Rescue Watercraft Operator course and the options for your organisation.'],
        },
      ],
    },
    {
      title: 'Rescue Watercraft Operator Instructor',
      category: 'Instructor',
      duration: '2 days',
      audience: 'Experienced RWC operators from lifesaving organisations, emergency services and government organisations.',
      image: '/images/rwc-instructor.webp',
      imageAlt: 'Rescuer practising casualty recovery from the water using a rescue sled',
      imageWidth: 1600,
      imageHeight: 1067,
      summary: 'Develop from an experienced RWC operator into an instructor. This practical two-day course teaches you to train colleagues, rescuers and government personnel to become independent, safe RWC operators.',
      sections: [
        {
          title: 'Become an RWC instructor',
          paragraphs: [
            'The course combines theoretical knowledge with intensive practical training on the water. You develop the skills to prepare training sessions, give clear instructions and guide participants professionally and safely.',
            'On completion, you can teach watercraft operation, safety and operational deployment in accordance with the training guidelines of the International Life Saving Federation (ILS).',
          ],
        },
        {
          title: 'Entry requirements',
          items: [
            'A valid RWC operator certificate.',
            'At least one full season of experience operating a rescue watercraft, or demonstrable equivalent experience.',
            'A valid first-aid qualification.',
            'At least a Dutch Klein Vaarbewijs I boating licence.',
          ],
        },
        {
          title: 'Training programme',
          paragraphs: ['The course lasts two days and includes theory, practical training and a final assessment.'],
          items: [
            'Lesson preparation and structure: planning, preparing and delivering effective training sessions.',
            'Instruction and demonstration skills: clearly explaining and demonstrating boat-handling techniques, rescue actions and operating procedures.',
            'Safety and risk management: recognising risks, applying safety measures and supervising exercises.',
            'Training guidelines and assessment criteria: understanding the International Life Saving Federation (ILS) requirements for training and assessing RWC operators.',
            'Practical instruction on the water: guiding and assessing participants during realistic rescue watercraft exercises.',
          ],
        },
        {
          title: 'Final assessment',
          paragraphs: ['The course concludes with an assessment of theoretical knowledge, practical skills and instructional skills. Assessment takes place under the responsibility of an authorised instructor from the lifesaving organisation, in accordance with the applicable training guidelines.'],
        },
        {
          title: 'Who is this course for?',
          paragraphs: [
            'This course is intended for experienced RWC operators from lifesaving organisations, emergency services and government organisations who want to pass on their knowledge and practical experience to colleagues and new operators.',
            'On completion, you have the instructional skills needed to deliver structured, professional and safety-focused RWC training.',
          ],
        },
      ],
    },
  ],
};

export function getCourses(lang: Lang = 'nl'): Course[] {
  return courses[lang];
}
