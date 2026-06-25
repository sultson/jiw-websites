import type { LegalDoc } from './types';

// Legal and policy pages for Omnia Dental, tandartspraktijk Hoofddorp.
// Compliant with WGBO, AVG/GDPR, Wkkgz and NZa. No em dashes anywhere.

export const legalDocs: LegalDoc[] = [
  {
    key: 'privacy',
    title: {
      nl: 'Privacyverklaring',
      en: 'Privacy policy',
    },
    intro: {
      nl: 'Omnia Dental verwerkt persoonsgegevens en medische gegevens om u goede mondzorg te kunnen bieden. Wij gaan zorgvuldig en vertrouwelijk met deze gegevens om en houden ons aan de Algemene verordening gegevensbescherming (AVG) en de Wet op de geneeskundige behandelingsovereenkomst (WGBO). In deze verklaring leest u welke gegevens wij verwerken, waarom wij dat doen en welke rechten u heeft.',
      en: 'Omnia Dental processes personal data and medical data in order to provide you with good dental care. We treat this data carefully and confidentially and comply with the General Data Protection Regulation (GDPR) and the Dutch Medical Treatment Agreements Act (WGBO). This statement explains which data we process, why we do so and which rights you have.',
    },
    lastUpdated: '2026-06-01',
    sections: [
      {
        heading: {
          nl: 'Verantwoordelijke voor de verwerking',
          en: 'Controller',
        },
        body: [
          {
            nl: 'De verwerkingsverantwoordelijke voor uw gegevens is Omnia Dental, gevestigd aan de Manenburgdreef 101, Unit 2.8, 2135 GW Hoofddorp. Praktijkhouder en behandelend tandarts is Drs. N. Gangaram Panday, ingeschreven in het BIG-register onder nummer 19917414702.',
            en: 'The controller for your data is Omnia Dental, located at Manenburgdreef 101, Unit 2.8, 2135 GW Hoofddorp. The practice owner and treating dentist is Drs. N. Gangaram Panday, registered in the BIG register under number 19917414702.',
          },
          {
            nl: 'Voor vragen over privacy kunt u contact opnemen via info@omniadental.nl of telefonisch via +31 6 11437329.',
            en: 'For questions about privacy you can contact us at info@omniadental.nl or by phone at +31 6 11437329.',
          },
        ],
      },
      {
        heading: {
          nl: 'Welke gegevens wij verwerken',
          en: 'Which data we process',
        },
        body: [
          {
            nl: 'Voor een goede behandeling leggen wij de gegevens vast die wij nodig hebben. Het gaat onder meer om de volgende categorieën.',
            en: 'In order to provide proper treatment we record the data we need. This includes the following categories.',
          },
        ],
        bullets: [
          {
            nl: 'Contact- en identificatiegegevens: naam, adres, geboortedatum, telefoonnummer, e-mailadres en burgerservicenummer (BSN).',
            en: 'Contact and identification data: name, address, date of birth, telephone number, email address and citizen service number (BSN).',
          },
          {
            nl: 'Gegevens van uw zorgverzekeraar, zoals polisnummer en verzekeringsgegevens.',
            en: 'Details of your health insurer, such as policy number and insurance details.',
          },
          {
            nl: 'Medische gegevens: uw mondzorgdossier met onderzoeken, diagnoses, behandelplannen, foto’s en rontgenbeelden, medicatie en relevante medische voorgeschiedenis.',
            en: 'Medical data: your dental record with examinations, diagnoses, treatment plans, photos and X-ray images, medication and relevant medical history.',
          },
          {
            nl: 'Financiele en afspraakgegevens, zoals facturen, betalingen en afsprakenhistorie.',
            en: 'Financial and appointment data, such as invoices, payments and appointment history.',
          },
        ],
      },
      {
        heading: {
          nl: 'Doel en grondslag van de verwerking',
          en: 'Purpose and legal basis',
        },
        body: [
          {
            nl: 'Wij verwerken uw gegevens om mondzorg te verlenen, een dossier bij te houden, afspraken te plannen, declaraties en facturen te verzorgen en om te voldoen aan wettelijke verplichtingen.',
            en: 'We process your data in order to provide dental care, keep a record, schedule appointments, handle claims and invoices and to comply with legal obligations.',
          },
          {
            nl: 'De grondslag voor het verwerken van uw medische gegevens is de behandelovereenkomst en de wettelijke plicht om een dossier bij te houden op grond van de WGBO. Voor de financiele administratie geldt de wettelijke bewaarplicht en het uitvoeren van de overeenkomst als grondslag.',
            en: 'The legal basis for processing your medical data is the treatment agreement and the statutory duty to keep a record under the WGBO. For the financial administration the statutory retention obligation and the performance of the agreement apply as the basis.',
          },
        ],
      },
      {
        heading: {
          nl: 'Wie heeft toegang tot uw gegevens',
          en: 'Who has access to your data',
        },
        body: [
          {
            nl: 'Alleen medewerkers die bij uw behandeling betrokken zijn hebben toegang tot uw dossier. Iedereen die bij ons werkt heeft een beroepsgeheim of een geheimhoudingsplicht.',
            en: 'Only staff involved in your treatment have access to your record. Everyone who works with us is bound by professional secrecy or a duty of confidentiality.',
          },
          {
            nl: 'Wij delen uw gegevens niet met anderen, behalve met partijen die nodig zijn voor uw behandeling of administratie en alleen voor zover dat noodzakelijk is. Doorverwijzing naar een andere zorgverlener gebeurt alleen met uw toestemming.',
            en: 'We do not share your data with others, except with parties needed for your treatment or administration and only to the extent necessary. Referral to another care provider only takes place with your consent.',
          },
        ],
      },
      {
        heading: {
          nl: 'Verwerkers en derde partijen',
          en: 'Processors and third parties',
        },
        body: [
          {
            nl: 'Voor sommige taken schakelen wij externe partijen in. Met deze partijen sluiten wij een verwerkersovereenkomst zodat uw gegevens ook daar goed beschermd zijn. Het gaat onder meer om de volgende partijen.',
            en: 'For some tasks we engage external parties. We conclude a processing agreement with these parties so that your data is properly protected there as well. This includes the following parties.',
          },
        ],
        bullets: [
          {
            nl: 'De leverancier van ons praktijk- en patientensoftware, voor het beheer van uw dossier en de planning.',
            en: 'The supplier of our practice and patient software, for managing your record and the scheduling.',
          },
          {
            nl: 'Een tandtechnisch laboratorium, voor het vervaardigen van kronen, bruggen, protheses en andere techniekwerkstukken.',
            en: 'A dental laboratory, for producing crowns, bridges, dentures and other technical work.',
          },
          {
            nl: 'Uw zorgverzekeraar en Vecozo, voor het controleren van uw verzekering en het indienen van declaraties.',
            en: 'Your health insurer and Vecozo, for verifying your insurance and submitting claims.',
          },
          {
            nl: 'Een factoringbedrijf, dat namens ons de facturatie en betaling van uw behandeling verzorgt.',
            en: 'A factoring company, which handles the invoicing and payment of your treatment on our behalf.',
          },
        ],
      },
      {
        heading: {
          nl: 'Bewaartermijnen',
          en: 'Retention periods',
        },
        body: [
          {
            nl: 'Op grond van de WGBO bewaren wij uw medisch dossier in beginsel twintig jaar, gerekend vanaf de laatste wijziging in het dossier, of zoveel langer als redelijkerwijs nodig is voor goede zorg.',
            en: 'Under the WGBO we keep your medical record in principle for twenty years, counted from the last change in the record, or as much longer as is reasonably necessary for good care.',
          },
          {
            nl: 'Gegevens uit onze financiele administratie bewaren wij zeven jaar in verband met de wettelijke fiscale bewaarplicht. Na afloop van een bewaartermijn vernietigen of anonimiseren wij de betreffende gegevens.',
            en: 'Data from our financial administration is kept for seven years in connection with the statutory tax retention obligation. After a retention period ends we destroy or anonymise the relevant data.',
          },
        ],
      },
      {
        heading: {
          nl: 'Uw rechten',
          en: 'Your rights',
        },
        body: [
          {
            nl: 'U heeft op grond van de AVG een aantal rechten met betrekking tot uw gegevens. U kunt deze rechten uitoefenen door contact met ons op te nemen. Wij kunnen u vragen om u te legitimeren zodat wij zeker weten dat het verzoek van u afkomstig is.',
            en: 'Under the GDPR you have a number of rights regarding your data. You can exercise these rights by contacting us. We may ask you to identify yourself so that we can be sure the request comes from you.',
          },
        ],
        bullets: [
          {
            nl: 'Recht op inzage in de gegevens die wij van u verwerken.',
            en: 'The right to access the data we process about you.',
          },
          {
            nl: 'Recht op correctie van onjuiste gegevens.',
            en: 'The right to rectification of incorrect data.',
          },
          {
            nl: 'Recht op verwijdering van gegevens, voor zover er geen wettelijke bewaarplicht geldt.',
            en: 'The right to erasure of data, in so far as no statutory retention obligation applies.',
          },
          {
            nl: 'Recht op beperking van de verwerking en recht van bezwaar.',
            en: 'The right to restriction of processing and the right to object.',
          },
          {
            nl: 'Recht op dataportabiliteit, waarbij u uw gegevens in een gangbaar formaat ontvangt.',
            en: 'The right to data portability, whereby you receive your data in a common format.',
          },
        ],
      },
      {
        heading: {
          nl: 'Beveiliging',
          en: 'Security',
        },
        body: [
          {
            nl: 'Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen verlies en ongeoorloofde toegang. Denk aan toegangsbeveiliging, versleutelde verbindingen en afspraken met onze leveranciers.',
            en: 'We take appropriate technical and organisational measures to protect your data against loss and unauthorised access. This includes access controls, encrypted connections and agreements with our suppliers.',
          },
          {
            nl: 'Mocht er ondanks deze maatregelen toch sprake zijn van een datalek, dan handelen wij hier zorgvuldig naar en melden wij dit waar nodig bij de Autoriteit Persoonsgegevens en bij u.',
            en: 'If, despite these measures, a data breach should occur, we handle it carefully and report it where necessary to the Dutch Data Protection Authority and to you.',
          },
        ],
      },
      {
        heading: {
          nl: 'Vragen en klachten',
          en: 'Questions and complaints',
        },
        body: [
          {
            nl: 'Heeft u een vraag over hoe wij met uw gegevens omgaan, of wilt u een recht uitoefenen, neem dan contact op via info@omniadental.nl. Binnen de praktijk is de praktijkhouder aanspreekpunt voor privacy.',
            en: 'If you have a question about how we handle your data, or if you wish to exercise a right, please contact us at info@omniadental.nl. Within the practice the practice owner is the point of contact for privacy.',
          },
          {
            nl: 'Komt u er met ons niet uit, dan heeft u het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens, de Nederlandse toezichthouder op het gebied van privacy.',
            en: 'If we cannot resolve the matter together, you have the right to lodge a complaint with the Dutch Data Protection Authority, the national supervisory authority for privacy.',
          },
        ],
      },
    ],
    metaTitle: {
      nl: 'Privacyverklaring | Omnia Dental Hoofddorp',
      en: 'Privacy policy | Omnia Dental Hoofddorp',
    },
    metaDescription: {
      nl: 'Lees hoe tandartspraktijk Omnia Dental in Hoofddorp uw persoonsgegevens en medisch dossier verwerkt en beschermt volgens de AVG en de WGBO.',
      en: 'Read how dental practice Omnia Dental in Hoofddorp processes and protects your personal data and medical record under the GDPR and the WGBO.',
    },
  },
  {
    key: 'cookie',
    title: {
      nl: 'Cookieverklaring',
      en: 'Cookie statement',
    },
    intro: {
      nl: 'Onze website maakt alleen gebruik van strikt noodzakelijke cookies en privacyvriendelijke statistieken. Wij plaatsen geen tracking- of advertentiecookies en doen niet aan profilering door derden. In deze verklaring leest u welke cookies wij gebruiken en hoe u ze kunt beheren.',
      en: 'Our website uses only strictly necessary cookies and privacy-friendly statistics. We do not place tracking or advertising cookies and we do not engage in third-party profiling. This statement explains which cookies we use and how you can manage them.',
    },
    lastUpdated: '2026-06-01',
    sections: [
      {
        heading: {
          nl: 'Wat zijn cookies',
          en: 'What are cookies',
        },
        body: [
          {
            nl: 'Cookies zijn kleine tekstbestanden die een website op uw apparaat plaatst wanneer u de site bezoekt. Ze worden gebruikt om de website goed te laten werken en om geanonimiseerd bezoek te meten.',
            en: 'Cookies are small text files that a website places on your device when you visit the site. They are used to make the website work properly and to measure visits in an anonymised way.',
          },
        ],
      },
      {
        heading: {
          nl: 'Welke cookies wij gebruiken',
          en: 'Which cookies we use',
        },
        body: [
          {
            nl: 'Wij gebruiken uitsluitend de volgende soorten cookies.',
            en: 'We use only the following types of cookies.',
          },
        ],
        bullets: [
          {
            nl: 'Functionele cookies, die nodig zijn om de website te laten functioneren en uw voorkeuren zoals de taalkeuze te onthouden.',
            en: 'Functional cookies, which are needed to make the website work and to remember your preferences such as the language choice.',
          },
          {
            nl: 'Privacyvriendelijke statistieken, waarmee wij geanonimiseerd meten hoe de website wordt gebruikt, zonder dat individuele bezoekers worden herleid of gevolgd.',
            en: 'Privacy-friendly statistics, with which we measure in an anonymised way how the website is used, without identifying or tracking individual visitors.',
          },
        ],
      },
      {
        heading: {
          nl: 'Geen tracking en geen advertentiecookies',
          en: 'No tracking and no advertising cookies',
        },
        body: [
          {
            nl: 'Wij plaatsen geen cookies voor advertenties, sociale media of het volgen van uw gedrag over websites heen. Er worden geen profielen van u opgebouwd en wij delen geen gegevens met externe partijen voor marketingdoeleinden.',
            en: 'We do not place cookies for advertising, social media or tracking your behaviour across websites. No profiles are built about you and we do not share data with external parties for marketing purposes.',
          },
        ],
      },
      {
        heading: {
          nl: 'Cookies beheren of verwijderen',
          en: 'Managing or deleting cookies',
        },
        body: [
          {
            nl: 'U kunt cookies altijd zelf beheren via de instellingen van uw browser. Daar kunt u cookies bekijken, blokkeren of verwijderen. Houd er rekening mee dat het uitschakelen van functionele cookies ertoe kan leiden dat onderdelen van de website niet goed werken.',
            en: 'You can always manage cookies yourself through your browser settings. There you can view, block or delete cookies. Please note that disabling functional cookies may cause parts of the website to stop working properly.',
          },
          {
            nl: 'In de helpfunctie van uw browser vindt u hoe u dit per browser instelt.',
            en: 'In your browser’s help function you can find how to set this up for each browser.',
          },
        ],
      },
      {
        heading: {
          nl: 'Wijzigingen en vragen',
          en: 'Changes and questions',
        },
        body: [
          {
            nl: 'Deze cookieverklaring kan worden aangepast wanneer de website of de wetgeving daartoe aanleiding geeft. Heeft u een vraag over ons gebruik van cookies, neem dan contact op via info@omniadental.nl.',
            en: 'This cookie statement may be updated when the website or legislation gives reason to do so. If you have a question about our use of cookies, please contact us at info@omniadental.nl.',
          },
        ],
      },
    ],
    metaTitle: {
      nl: 'Cookieverklaring | Omnia Dental Hoofddorp',
      en: 'Cookie statement | Omnia Dental Hoofddorp',
    },
    metaDescription: {
      nl: 'Omnia Dental gebruikt alleen functionele cookies en privacyvriendelijke statistieken, geen tracking of advertentiecookies. Lees onze cookieverklaring.',
      en: 'Omnia Dental uses only functional cookies and privacy-friendly statistics, no tracking or advertising cookies. Read our cookie statement.',
    },
  },
  {
    key: 'terms',
    title: {
      nl: 'Algemene voorwaarden',
      en: 'Terms and conditions',
    },
    intro: {
      nl: 'Deze algemene voorwaarden zijn van toepassing op de behandelovereenkomst tussen u en Omnia Dental. Hierin leest u onze afspraken over behandeling, afspraken maken en annuleren, tarieven, betaling en aansprakelijkheid.',
      en: 'These terms and conditions apply to the treatment agreement between you and Omnia Dental. They set out our arrangements regarding treatment, making and cancelling appointments, tariffs, payment and liability.',
    },
    lastUpdated: '2026-06-01',
    sections: [
      {
        heading: {
          nl: 'Behandelovereenkomst',
          en: 'Treatment agreement',
        },
        body: [
          {
            nl: 'Zodra wij u als patient inschrijven en u behandelen, ontstaat er een behandelovereenkomst zoals bedoeld in de WGBO. Wij informeren u over uw mondgezondheid, de mogelijke behandelingen en de gevolgen daarvan, zodat u een weloverwogen keuze kunt maken.',
            en: 'As soon as we register you as a patient and treat you, a treatment agreement arises as referred to in the WGBO. We inform you about your oral health, the possible treatments and their consequences, so that you can make a well-considered choice.',
          },
          {
            nl: 'Een behandeling vindt alleen plaats met uw toestemming. U heeft het recht om informatie te ontvangen, vragen te stellen en een behandeling te weigeren.',
            en: 'Treatment only takes place with your consent. You have the right to receive information, to ask questions and to refuse treatment.',
          },
        ],
      },
      {
        heading: {
          nl: 'Afspraken en annulering',
          en: 'Appointments and cancellation',
        },
        body: [
          {
            nl: 'Wij vragen u op tijd aanwezig te zijn voor uw afspraak. Bent u verhinderd, dan kunt u uw afspraak kosteloos annuleren of verzetten tot uiterlijk 24 uur van tevoren.',
            en: 'We ask you to arrive on time for your appointment. If you are unable to attend, you can cancel or reschedule your appointment free of charge up to at least 24 hours in advance.',
          },
          {
            nl: 'Annuleert u later of verschijnt u niet op uw afspraak, dan kan de gereserveerde tijd in rekening worden gebracht. Een dergelijke nota wordt niet vergoed door uw zorgverzekeraar.',
            en: 'If you cancel later or do not show up for your appointment, the reserved time may be charged. Such an invoice is not reimbursed by your health insurer.',
          },
        ],
      },
      {
        heading: {
          nl: 'Tarieven',
          en: 'Tariffs',
        },
        body: [
          {
            nl: 'De tarieven voor mondzorg worden vastgesteld en gereguleerd door de Nederlandse Zorgautoriteit (NZa). Wij hanteren de geldende NZa-tarieven. Bij behandelingen vanaf een bepaald bedrag ontvangt u vooraf een begroting.',
            en: 'The tariffs for dental care are set and regulated by the Dutch Healthcare Authority (NZa). We apply the prevailing NZa tariffs. For treatments above a certain amount you receive an estimate in advance.',
          },
          {
            nl: 'Wat u zelf betaalt, hangt af van uw zorgverzekering. Wij raden u aan uw polisvoorwaarden te raadplegen voor de dekking van tandheelkundige zorg.',
            en: 'What you pay yourself depends on your health insurance. We advise you to consult your policy conditions for the coverage of dental care.',
          },
        ],
      },
      {
        heading: {
          nl: 'Betaling',
          en: 'Payment',
        },
        body: [
          {
            nl: 'De facturatie van uw behandeling verloopt via een extern factoringbedrijf. U ontvangt de factuur rechtstreeks van dit bedrijf en betaalt aan hen binnen de op de factuur genoemde termijn.',
            en: 'The invoicing of your treatment is handled by an external factoring company. You receive the invoice directly from this company and pay them within the term stated on the invoice.',
          },
          {
            nl: 'Op de factuur staan de betalingsvoorwaarden van het factoringbedrijf vermeld. Heeft u een vraag over uw factuur, neem dan contact op met het op de nota genoemde factoringbedrijf of met onze praktijk.',
            en: 'The payment conditions of the factoring company are stated on the invoice. If you have a question about your invoice, please contact the factoring company named on the invoice or our practice.',
          },
        ],
      },
      {
        heading: {
          nl: 'Aansprakelijkheid',
          en: 'Liability',
        },
        body: [
          {
            nl: 'Wij voeren onze behandelingen uit met de zorg die u van een tandartspraktijk mag verwachten. Mocht er onverhoopt iets misgaan, dan kunt u dit met ons bespreken. Wij beschikken over een beroepsaansprakelijkheidsverzekering.',
            en: 'We carry out our treatments with the care you may expect from a dental practice. If something should unexpectedly go wrong, you can discuss this with us. We hold professional liability insurance.',
          },
          {
            nl: 'Onze aansprakelijkheid is beperkt tot het bedrag dat in het betreffende geval door onze verzekering wordt uitgekeerd.',
            en: 'Our liability is limited to the amount paid out by our insurance in the relevant case.',
          },
        ],
      },
      {
        heading: {
          nl: 'Klachten',
          en: 'Complaints',
        },
        body: [
          {
            nl: 'Bent u niet tevreden over uw behandeling of onze dienstverlening, dan horen wij dat graag van u. Onze klachtenregeling vindt u in een aparte verklaring op deze website.',
            en: 'If you are not satisfied with your treatment or our service, we would like to hear from you. Our complaints procedure can be found in a separate statement on this website.',
          },
        ],
      },
      {
        heading: {
          nl: 'Toepasselijk recht',
          en: 'Applicable law',
        },
        body: [
          {
            nl: 'Op de behandelovereenkomst en deze algemene voorwaarden is uitsluitend Nederlands recht van toepassing.',
            en: 'Dutch law applies exclusively to the treatment agreement and these terms and conditions.',
          },
        ],
      },
    ],
    metaTitle: {
      nl: 'Algemene voorwaarden | Omnia Dental Hoofddorp',
      en: 'Terms and conditions | Omnia Dental Hoofddorp',
    },
    metaDescription: {
      nl: 'De algemene voorwaarden van Omnia Dental Hoofddorp: behandelovereenkomst, afspraken en annulering, NZa-tarieven, betaling via factoring en aansprakelijkheid.',
      en: 'The terms and conditions of Omnia Dental Hoofddorp: treatment agreement, appointments and cancellation, NZa tariffs, payment via factoring and liability.',
    },
  },
  {
    key: 'conduct',
    title: {
      nl: 'Gedragscode',
      en: 'Code of conduct',
    },
    intro: {
      nl: 'Bij Omnia Dental staan goede zorg en wederzijds respect centraal. In deze gedragscode beschrijven wij de waarden en omgangsregels die wij binnen de praktijk hanteren, voor zowel ons team als onze patienten.',
      en: 'At Omnia Dental, good care and mutual respect are central. In this code of conduct we describe the values and rules of conduct we maintain within the practice, for both our team and our patients.',
    },
    lastUpdated: '2026-06-01',
    sections: [
      {
        heading: {
          nl: 'Respect en gelijke behandeling',
          en: 'Respect and equal treatment',
        },
        body: [
          {
            nl: 'Wij behandelen iedere patient met respect en aandacht, ongeacht achtergrond, geloof, geaardheid of gezondheidssituatie. Iedereen is bij ons welkom en wordt gelijkwaardig behandeld.',
            en: 'We treat every patient with respect and attention, regardless of background, faith, orientation or health situation. Everyone is welcome with us and is treated equally.',
          },
        ],
      },
      {
        heading: {
          nl: 'Kwaliteit en deskundigheid',
          en: 'Quality and expertise',
        },
        body: [
          {
            nl: 'Wij werken volgens de actuele richtlijnen en houden onze kennis op peil door bij- en nascholing. Zo bieden wij zorg die aansluit bij de huidige stand van de tandheelkunde.',
            en: 'We work in accordance with current guidelines and keep our knowledge up to date through continuing education. This way we provide care that reflects the current state of dentistry.',
          },
        ],
      },
      {
        heading: {
          nl: 'Informatie en toestemming',
          en: 'Information and consent',
        },
        body: [
          {
            nl: 'Wij informeren u helder over uw mondgezondheid en de behandelmogelijkheden, zodat u zelf een keuze kunt maken. Een behandeling starten wij pas na uw toestemming en wij respecteren uw autonomie als patient.',
            en: 'We inform you clearly about your oral health and the treatment options, so that you can make your own choice. We only start a treatment after your consent and we respect your autonomy as a patient.',
          },
        ],
      },
      {
        heading: {
          nl: 'Privacy en beroepsgeheim',
          en: 'Privacy and professional secrecy',
        },
        body: [
          {
            nl: 'Alles wat u met ons deelt, behandelen wij vertrouwelijk. Ons team is gebonden aan het beroepsgeheim en aan onze geheimhoudingsplicht. Wij gaan zorgvuldig om met uw gegevens, zoals beschreven in onze privacyverklaring.',
            en: 'Everything you share with us is treated confidentially. Our team is bound by professional secrecy and by our duty of confidentiality. We handle your data carefully, as described in our privacy policy.',
          },
        ],
      },
      {
        heading: {
          nl: 'Hygiene en infectiepreventie',
          en: 'Hygiene and infection prevention',
        },
        body: [
          {
            nl: 'Wij werken volgens de geldende richtlijnen voor hygiene en infectiepreventie. Instrumenten worden gereinigd en gesteriliseerd en onze werkruimtes voldoen aan de eisen die aan een tandartspraktijk worden gesteld.',
            en: 'We work in accordance with the prevailing guidelines for hygiene and infection prevention. Instruments are cleaned and sterilised and our work areas meet the requirements set for a dental practice.',
          },
        ],
      },
      {
        heading: {
          nl: 'Veilige en open cultuur',
          en: 'A safe and open culture',
        },
        body: [
          {
            nl: 'Binnen ons team kunnen we fouten en bijna-fouten open bespreken om van te leren en de zorg te verbeteren. Wij hechten aan een veilige meldcultuur waarin verbeteren belangrijker is dan verwijten.',
            en: 'Within our team we can openly discuss mistakes and near-mistakes in order to learn from them and improve care. We value a safe reporting culture in which improving matters more than blaming.',
          },
        ],
      },
      {
        heading: {
          nl: 'Omgangsregels in de praktijk',
          en: 'Rules of conduct in the practice',
        },
        body: [
          {
            nl: 'Wij gaan respectvol met u om en vragen u hetzelfde te doen richting ons team en andere patienten. Agressie, bedreiging of ongewenst gedrag worden niet getolereerd. In voorkomende gevallen kunnen wij besluiten de behandelrelatie te beeindigen.',
            en: 'We treat you respectfully and ask you to do the same towards our team and other patients. Aggression, threats or undesirable behaviour are not tolerated. In such cases we may decide to end the treatment relationship.',
          },
        ],
      },
    ],
    metaTitle: {
      nl: 'Gedragscode | Omnia Dental Hoofddorp',
      en: 'Code of conduct | Omnia Dental Hoofddorp',
    },
    metaDescription: {
      nl: 'De gedragscode van Omnia Dental Hoofddorp: respect, kwaliteit, informed consent, beroepsgeheim, hygiene en duidelijke omgangsregels in de praktijk.',
      en: 'The code of conduct of Omnia Dental Hoofddorp: respect, quality, informed consent, professional secrecy, hygiene and clear rules of conduct in the practice.',
    },
  },
  {
    key: 'complaints',
    title: {
      nl: 'Klachtenregeling',
      en: 'Complaints procedure',
    },
    intro: {
      nl: 'Wij doen ons best om u goede zorg te bieden. Toch kan het gebeuren dat u ergens niet tevreden over bent. In deze klachtenregeling leest u welke stappen u kunt zetten. Onze regeling voldoet aan de Wet kwaliteit, klachten en geschillen zorg (Wkkgz).',
      en: 'We do our best to provide you with good care. Even so, it may happen that you are not satisfied about something. This complaints procedure explains which steps you can take. Our procedure complies with the Dutch Care Quality, Complaints and Disputes Act (Wkkgz).',
    },
    lastUpdated: '2026-06-01',
    sections: [
      {
        heading: {
          nl: 'Bespreek het eerst met uw tandarts',
          en: 'First discuss it with your dentist',
        },
        body: [
          {
            nl: 'De eerste stap is meestal het gesprek met uw behandelend tandarts of een medewerker van de praktijk. Vaak ontstaat een klacht door een misverstand en kan een gesprek veel verhelderen. Wij nemen uw signaal serieus en zoeken samen met u naar een oplossing.',
            en: 'The first step is usually a conversation with your treating dentist or a member of the practice staff. A complaint often arises from a misunderstanding and a conversation can clarify a great deal. We take your signal seriously and look for a solution together with you.',
          },
        ],
      },
      {
        heading: {
          nl: 'De klachtenfunctionaris',
          en: 'The complaints officer',
        },
        body: [
          {
            nl: 'Komt u er met de praktijk niet uit of vindt u het lastig om uw klacht zelf te bespreken, dan kunt u kosteloos gebruikmaken van een onafhankelijke klachtenfunctionaris. Deze luistert naar u, geeft informatie en advies en kan bemiddelen tussen u en de praktijk.',
            en: 'If you cannot resolve the matter with the practice or find it difficult to discuss your complaint yourself, you can make use of an independent complaints officer free of charge. This officer listens to you, provides information and advice and can mediate between you and the practice.',
          },
        ],
      },
      {
        heading: {
          nl: 'De klachtenregeling van de beroepsorganisatie',
          en: 'The professional organisation’s complaints scheme',
        },
        body: [
          {
            nl: 'Onze praktijk is aangesloten bij de klachtenregeling van de beroepsorganisatie KNMT. Via deze regeling is de onafhankelijke klachtenfunctionaris beschikbaar en is geregeld hoe uw klacht wordt behandeld. U kunt bij de praktijk vragen hoe u de klachtenfunctionaris kunt bereiken.',
            en: 'Our practice is affiliated with the complaints scheme of the professional organisation KNMT. Through this scheme the independent complaints officer is available and the handling of your complaint is arranged. You can ask the practice how to reach the complaints officer.',
          },
        ],
      },
      {
        heading: {
          nl: 'Termijnen',
          en: 'Time frames',
        },
        body: [
          {
            nl: 'Na ontvangst van uw klacht streven wij ernaar om binnen een redelijke termijn met u in contact te treden. Op grond van de Wkkgz ontvangt u in beginsel binnen zes weken een onderbouwd oordeel over uw klacht. Deze termijn kan zo nodig met enkele weken worden verlengd.',
            en: 'After receiving your complaint we aim to get in touch with you within a reasonable period. Under the Wkkgz you receive in principle a substantiated assessment of your complaint within six weeks. This period may, if necessary, be extended by a few weeks.',
          },
        ],
      },
      {
        heading: {
          nl: 'De geschilleninstantie',
          en: 'The disputes body',
        },
        body: [
          {
            nl: 'Leidt de klachtenbehandeling niet tot een oplossing waar u tevreden over bent, dan kunt u uw klacht als laatste stap voorleggen aan de onafhankelijke Geschilleninstantie Mondzorg. Deze instantie doet een bindende uitspraak en kan zo nodig een schadevergoeding toekennen.',
            en: 'If the handling of your complaint does not lead to a solution you are satisfied with, you can, as a final step, submit your complaint to the independent Dental Care Disputes Body (Geschilleninstantie Mondzorg). This body issues a binding ruling and can, if necessary, award compensation.',
          },
          {
            nl: 'Heeft u een vraag over deze klachtenregeling, neem dan gerust contact met ons op via info@omniadental.nl of via +31 6 11437329.',
            en: 'If you have a question about this complaints procedure, please feel free to contact us at info@omniadental.nl or at +31 6 11437329.',
          },
        ],
      },
    ],
    metaTitle: {
      nl: 'Klachtenregeling | Omnia Dental Hoofddorp',
      en: 'Complaints procedure | Omnia Dental Hoofddorp',
    },
    metaDescription: {
      nl: 'De Wkkgz-klachtenregeling van Omnia Dental Hoofddorp: van gesprek met uw tandarts via de klachtenfunctionaris tot de Geschilleninstantie Mondzorg.',
      en: 'The Wkkgz complaints procedure of Omnia Dental Hoofddorp: from a talk with your dentist via the complaints officer to the Dental Care Disputes Body.',
    },
  },
];
