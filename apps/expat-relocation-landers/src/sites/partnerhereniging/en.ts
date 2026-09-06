import type { LanderContent } from '../types';

/**
 * partnerhereniging.nl, English. A 1:1 mirror of nl.ts: the domain ranks for
 * the Dutch query it spells, but a large share of these visitors is the foreign
 * partner, who reads the page in English.
 *
 * Mirror means mirror. Every section, CTA and photograph in nl.ts exists here,
 * in the same order, with the same claims. Note that `checker.results` is keyed
 * on the option labels in *this* file, because the script matches the value the
 * visitor actually clicked.
 */
export const en: LanderContent = {
  lang: 'en',
  meta: {
    title: 'Partner Reunification Netherlands: MVV/TEV Application Assistance',
    description:
      'Would you like your foreign partner to come and live with you in the Netherlands? We professionally prepare your MVV/TEV partner application, documents included. From €799 excl. VAT.',
    imageAlt: 'A couple laughing together on a bridge over an Amsterdam canal',
  },
  nav: {
    links: [
      { label: 'Your situation', href: '#situatie' },
      { label: 'Check your route', href: '#check' },
      { label: 'Assistance', href: '#begeleiding' },
      { label: 'Reviews', href: '#ervaringen' },
      { label: 'FAQ', href: '#vragen' },
    ],
    cta: { label: 'Start my application', href: '#contact' },
    langSwitch: 'Nederlands',
    tagline: 'Specialists in partner reunification and Dutch immigration procedures since 2009',
  },
  hero: {
    eyebrow: 'Partner reunification · specialists since 2009',
    route: { from: 'Your partner abroad', to: 'Together in the Netherlands' },
    h1: 'Want to bring your partner <span class="hl">to the Netherlands</span>?',
    intro: [
      'Does your partner still live abroad, and would you like to build a life together in the Netherlands? We professionally prepare your MVV/TEV partner application, from document check to submission, and provide the A1 examination preparation where required. One point of contact, until your partner is home with you.',
    ],
    benefits: [
      'Personal guidance',
      'Tailored document checklist',
      'Professional file preparation',
      'Complete trajectory with A1 preparation',
    ],
    offer: {
      name: 'MVV/TEV partner application',
      price: 'from €799 excl. VAT',
      note: 'This fee relates to our professional services. Government fees and third-party costs are not included unless expressly agreed otherwise.',
    },
    cta: { label: 'Start my partner application', href: '#aanvraag', situation: 'Hero' },
    whatsappCta: 'WhatsApp us',
    note: 'We contact you personally, usually within one business day.',
    proof: {
      quote: 'Thanks to Immigration Services NL we could finally be together. They did not see us as a file, but as a family.',
      name: 'Emily',
      context: 'Canada to the Netherlands',
    },
    photo: {
      src: '/images/ph-hero.jpg',
      alt: 'A couple laughing together on a bridge over an Amsterdam canal, with canal houses and bicycles behind them',
    },
  },
  stats: [
    { value: 'Since 2009', label: 'specialised in Dutch immigration procedures' },
    { value: '1500+', label: 'clients assisted worldwide' },
    { value: '1 fixed', label: 'point of contact for your entire file' },
    { value: 'EN · NL', label: 'assistance in both languages' },
  ],
  explain: {
    eyebrow: 'Your situation',
    heading: 'Is this your situation?',
    body: [
      'In a partner reunification you apply, as the sponsor in the Netherlands, for residence for your partner who still lives abroad. This usually runs through the TEV procedure, in which the provisional residence permit (MVV) and the residence permit are assessed in a single application.',
      'What exactly has to be demonstrated depends on your income, your partner’s nationality and the form of your relationship: married, registered partners or unmarried partners living together. That is where it most often goes wrong in practice. A file that is incomplete on a single point leads to questions and delay.',
    ],
    pointsStyle: 'quotes',
    points: [
      'My partner still lives abroad.',
      'We want to build a life together, here in the Netherlands.',
      'We are not married, but we have been together for years.',
      'I do not know whether my income is enough.',
      'Does my partner need an MVV?',
      'Does my partner have to pass the examination first?',
    ],
    cta: { label: 'Discuss my situation', href: '#contact', situation: 'Your situation' },
    photo: {
      src: '/images/ph-afstand.jpg',
      alt: 'A woman on a video call in the evening from her Dutch living room with her partner abroad',
    },
    photoNote:
      'The distance is the real problem, not the form. The sooner we know what applies in your situation, the shorter that distance lasts.',
  },
  checker: {
    eyebrow: 'Check your route',
    heading: 'Which route applies to you?',
    intro:
      'Three questions, and you will see which of our two trajectories fits. This is a first pointer and not an assessment of your application; we make that once we have seen your documents.',
    questions: [
      {
        id: 'partner',
        label: 'Where does your partner live now?',
        options: ['Abroad', 'Already in the Netherlands'],
      },
      {
        id: 'relatie',
        label: 'What is the form of your relationship?',
        options: ['Married', 'Registered partnership', 'Unmarried, living together', 'We still plan to marry'],
      },
      {
        id: 'examen',
        label: 'Civic integration examination abroad already passed?',
        options: ['Yes, passed', 'Not yet', 'Exempt', 'I do not know'],
      },
    ],
    resultKey: 'examen',
    resultDefault: {
      title: 'Answer the three questions',
      body: 'You will then see which trajectory fits your situation and what it costs with us. Your answers travel with you to the form, so our first conversation starts with something real.',
    },
    results: {
      'Yes, passed': {
        title: 'The MVV/TEV partner application fits you',
        body: 'The examination is no longer in your way. We assess your route, draw up the document checklist, review your supporting documents and prepare the application. That is our €799 excl. VAT service.',
      },
      Exempt: {
        title: 'The MVV/TEV partner application fits you',
        body: 'If your partner is exempt from the examination requirement, you go straight to the application. We verify the exemption before we start and then build the file. €799 excl. VAT.',
      },
      'Not yet': {
        title: 'The complete partner trajectory fits you',
        body: 'If the examination requirement applies to your partner, it has to be passed before the MVV can be issued. In the complete trajectory of €1,199 excl. VAT we handle the A1 preparation and the application together, with one point of contact.',
      },
      'I do not know': {
        title: 'We find this out for you first',
        body: 'Whether the examination requirement applies depends on your partner’s nationality, the purpose of residence and possible exemptions. We establish that before anything is submitted. Only then do you know which trajectory you need.',
      },
    },
    note: 'What this means',
    cta: { label: 'Discuss this outcome', href: '#contact', situation: 'Situation check' },
    photo: {
      src: '/images/ph-station.jpg',
      alt: 'A couple with a suitcase on a Dutch railway platform',
    },
  },
  packages: {
    eyebrow: 'Assistance',
    heading: 'Choose the assistance that fits you',
    intro:
      'Two options. Which one fits you depends on a single question: does your partner still need to sit the civic integration examination abroad?',
    cards: [
      {
        badge: 'Examination already passed or exempt',
        title: 'MVV/TEV partner application',
        price: '€799 excl. VAT',
        body: 'For clients who have already passed the required examination, are exempt, or do not need A1 preparation from us.',
        includesHeading: 'Included',
        includes: [
          'Assessment of the immigration trajectory',
          'Personalised document checklist',
          'Review of your supporting documents',
          'Preparation of the MVV/TEV application',
          'Professional file preparation',
          'Guidance during the agreed procedure',
          'One personal point of contact',
        ],
        cta: { label: 'Start my application', href: '#contact', situation: 'MVV/TEV partner application €799' },
      },
      {
        badge: 'Most chosen · complete service',
        featured: true,
        title: 'Complete partner trajectory',
        price: '€1,199 excl. VAT',
        body: 'For clients who still need to prepare for the civic integration examination abroad and subsequently require the MVV/TEV partner application.',
        includesHeading: 'Included',
        includes: [
          '6 hours of private 1-to-1 A1 examination preparation',
          'Preparation for Speaking, Reading and KNS',
          'Assistance with the examination process and registration, where included in the service',
          'Everything in the MVV/TEV partner application',
          'Personalised document checklist and review of supporting documents',
          'Application preparation and professional file preparation',
          'One point of contact for the complete trajectory',
        ],
        cta: { label: 'Start my complete trajectory', href: '#contact', situation: 'Complete partner trajectory €1,199' },
      },
    ],
    note: 'These fees relate to our professional services. Government fees and third-party costs, such as legalisation, translations and the examination itself, are not included unless expressly agreed otherwise. The competent authority decides on the application.',
  },
  compare: {
    eyebrow: 'Why us',
    heading: 'Work it out yourself, or have us prepare it',
    intro:
      'You are free to submit the application yourself. The only question is what it costs you if something is missing. This is the difference, point by point.',
    selfLabel: 'On your own',
    usLabel: 'With us',
    rows: [
      {
        topic: 'Determining the route',
        self: 'You work out yourself whether the TEV procedure applies, whether your partner needs an MVV and whether the examination requirement is relevant.',
        us: 'We establish in advance which route and which requirements apply in your situation, before anything is submitted.',
      },
      {
        topic: 'The documents',
        self: 'You collect the supporting documents and often only discover after submitting that something is missing, wrongly translated or not legalised.',
        us: 'You get a tailored document checklist and we review every item before it goes into the file.',
      },
      {
        topic: 'The income requirement',
        self: 'The amounts are adjusted twice a year and what counts as sustainable income differs per type of contract.',
        us: 'We test your income against the requirement that applies on the date of submission, and tell you honestly if it is not yet achievable.',
      },
      {
        topic: 'The substantiation',
        self: 'If you are not married, you have to demonstrate yourself that your relationship is durable and exclusive.',
        us: 'We build that substantiation the way an assessor reads it, with the evidence that actually carries weight in practice.',
      },
      {
        topic: 'When something changes',
        self: 'You work out yourself what an additional question or a change in your situation means for the pending application.',
        us: 'You call one point of contact who knows your file and who can tell you the same day where you stand.',
      },
      {
        topic: 'What it costs',
        self: 'Nothing upfront. A refusal does mean a new application, government fees again and waiting again.',
        us: 'A fixed fee from €799 excl. VAT for our services, agreed with you in advance.',
      },
    ],
    note: 'We can never guarantee the outcome of a procedure. The competent authority decides on the application. What we do is make sure your file is submitted complete and substantiated.',
    cta: { label: 'Have us prepare your file', href: '#contact', situation: 'On your own or with us' },
  },
  journey: {
    eyebrow: 'The trajectory',
    heading: 'From examination preparation to arrival in the Netherlands',
    intro:
      'We do not treat the examination and the application as two separate matters. This is the order we follow for clients who need both, up to and including the first weeks in the Netherlands.',
    items: [
      {
        title: 'A1 preparation if required',
        body: '6 hours of private 1-to-1 preparation for the civic integration examination abroad.',
      },
      {
        title: 'The examination',
        body: 'Preparation for Speaking, Reading and KNS, and assistance with the examination process.',
      },
      {
        title: 'MVV/TEV application',
        body: 'Professional preparation of the partner application and the substantiation of your file.',
      },
      {
        title: 'The procedure',
        body: 'Guidance during the agreed procedure, up to the decision.',
      },
      {
        title: 'Arrival in the Netherlands',
        body: 'Collecting the MVV at the embassy, the residence card at the IND, registering with the municipality. We can assist with those steps too.',
      },
    ],
    photos: [
      { src: '/images/ph-keukentafel.jpg', alt: 'A couple preparing for the examination together on a laptop at their kitchen table' },
      { src: '/images/ph-examen.jpg', alt: 'A man taking the examination at a computer wearing headphones' },
      { src: '/images/ph-dossier.jpg', alt: 'Two pairs of hands sorting the application documents into a folder' },
      { src: '/images/ph-gemeente.jpg', alt: 'A couple walking down the steps of a Dutch municipal building, laughing' },
      { src: '/images/ph-aankomst.jpg', alt: 'An embrace in the arrivals hall of a Dutch airport' },
    ],
    outcome: 'One continuous trajectory, one file strategy, one point of contact.',
    cta: { label: 'I want the complete trajectory', href: '#contact', situation: 'The trajectory' },
  },
  relationship: {
    eyebrow: 'Your relationship',
    heading: 'Married, registered or living together?',
    intro:
      'All three forms qualify for partner reunification. What differs is what you have to demonstrate. Choose your situation.',
    tabs: [
      {
        label: 'Married',
        title: 'You are married',
        body: 'A marriage concluded abroad has to be capable of recognition in the Netherlands. In most cases that means the marriage certificate has to be legalised or carry an apostille, and be translated by a sworn translator.',
        points: [
          'A legalised or apostilled marriage certificate',
          'A sworn translation where that is required',
          'Evidence that you were both unmarried on the date of the marriage',
          'The usual requirements regarding the sponsor’s income and residence',
        ],
      },
      {
        label: 'Registered partnership',
        title: 'You have a registered partnership',
        body: 'For this procedure a registered partnership is in principle treated in the same way as a marriage, provided it can be recognised as such under Dutch law. Not every foreign form of cohabitation qualifies.',
        points: [
          'Proof of registration, legalised where that is required',
          'A check on whether the registration can be recognised in the Netherlands',
          'A sworn translation where that is required',
          'The usual requirements regarding the sponsor’s income and residence',
        ],
      },
      {
        label: 'Living together',
        title: 'You live together unmarried',
        body: 'You can apply without being married. You then have to demonstrate that the relationship is durable and exclusive. That is the part where the most can be gained in practice, because the substantiation is yours to build.',
        points: [
          'A relationship statement from both of you',
          'Evidence of contact and of visits over a longer period',
          'Evidence that you are both unmarried',
          'Substantiation showing that the relationship is durable and exclusive',
        ],
      },
    ],
    note: 'Unsure whether marrying is the fastest route in your situation? That depends on your country, your documents and your timing. Put it to us before you commit to anything.',
    cta: { label: 'Ask us', href: '#contact', situation: 'Relationship form' },
    photo: {
      src: '/images/ph-park.jpg',
      alt: 'A couple sitting together on a bench in a Dutch city park in autumn',
    },
  },
  help: {
    eyebrow: 'How we work',
    heading: 'How we handle your file',
    intro:
      'We have specialised in Dutch immigration procedures since 2009 and assist clients from all over the world. You get answers in plain language, from someone who knows your file.',
    items: [
      {
        title: 'Assess first, submit second',
        body: 'We establish which route applies and whether you meet the requirements before any application goes out.',
      },
      {
        title: 'Every supporting document checked',
        body: 'Legalisation, translation, validity and content, before a document ends up in the file.',
      },
      {
        title: 'A file that reads the way it is assessed',
        body: 'We build the substantiation in the order it is looked at, not in the order you happen to send it.',
      },
      {
        title: 'Reachable for as long as the procedure runs',
        body: 'If something changes in your job, your address or your relationship, you know the same day what it means.',
      },
    ],
    cta: { label: 'Discuss your situation', href: '#contact', situation: 'How we work' },
    photo: {
      src: '/images/ph-advies.jpg',
      alt: 'An adviser going through the application with a couple at a table',
    },
    contact: {
      heading: 'Who picks up the phone',
      body: 'No call centre and no rotating advisers. You speak to Johanna, founder of Immigration Services NL, or to a colleague who knows your file. Call, email or WhatsApp: your choice.',
      name: 'Johanna',
      role: 'Founder, Immigration Services NL',
    },
  },
  reviews: {
    eyebrow: 'Reviews',
    heading: 'What clients say',
    intro: 'We only publish reviews we have actually received.',
    items: [
      {
        quote: 'Thanks to Immigration Services NL we could finally be together. They did not see us as a file, but as a family.',
        name: 'Emily',
        context: 'Canada to the Netherlands',
      },
      {
        quote: 'Thanks to E & I our family reunification was a stress-free process. Everything was arranged perfectly.',
        name: 'Anna',
        context: 'Russia to the Netherlands',
      },
      {
        quote: 'They helped me with every step and gave useful advice that made me feel welcome in the Netherlands straight away.',
        name: 'Liam',
        context: 'Mexico to the Netherlands',
      },
      {
        quote: 'Johanna was there for us 24/7 in the first few days. Truly a unique service!',
        name: 'Chinedu',
        context: 'Nigeria to the Netherlands',
      },
    ],
    panel: {
      heading: 'Would you rather speak to a client?',
      body: 'We do not invent reviews and we do not publish success rates. If you would like to know how the trajectory works in practice, we are happy to put you in touch with a client who has already travelled your route.',
      cta: { label: 'Ask for a reference', href: '#contact', situation: 'Reference requested' },
    },
    countriesLabel: 'Clients from, among others',
    countries: ['India', 'Nigeria', 'Ghana', 'Suriname', 'Colombia', 'the Philippines', 'Türkiye', 'the United States'],
    countriesNote: 'Including couples you may know from the Dutch television programme All You Need Is Love.',
    cta: { label: 'Start my partner application', href: '#contact', situation: 'Reviews' },
  },
  gallery: {
    eyebrow: 'Together in the Netherlands',
    heading: 'This is what the procedure is really about',
    intro:
      'Not about forms, but about doing the shopping on a Saturday, a key that fits and a table with too many people around it.',
    photos: [
      { src: '/images/ph-fietsen.jpg', alt: 'A couple cycling side by side down a Dutch street lined with brick houses' },
      { src: '/images/ph-markt.jpg', alt: 'A couple buying tulips at a Dutch street market on a Saturday morning' },
      { src: '/images/ph-sleutel.jpg', alt: 'A couple holding the keys in the doorway of their Dutch home' },
      { src: '/images/ph-tuin.jpg', alt: 'A couple eating with Dutch family and friends at a long table in the garden' },
      { src: '/images/ph-strand.jpg', alt: 'A couple walking along an empty Dutch beach in autumn' },
      { src: '/images/ph-aankomst.jpg', alt: 'An embrace in the arrivals hall of a Dutch airport' },
    ],
    cta: { label: 'Start your application', href: '#contact', situation: 'Together in the Netherlands' },
  },
  band: {
    heading: 'Living together in the Netherlands',
    body: 'Behind every application there is a couple who want to move forward together. That is why you get one point of contact who knows your file and whom you can call whenever something changes.',
    cta: { label: 'Start my partner application', href: '#contact', situation: 'Photo band' },
    photo: {
      src: '/images/ph-band.jpg',
      alt: 'A couple at dusk beside an Amsterdam canal with lit canal houses behind them',
    },
  },
  steps: {
    eyebrow: 'How it starts',
    heading: 'At the table in three steps',
    intro: 'No questionnaire first. You leave your details, and we discuss the rest personally.',
    items: [
      {
        title: 'Leave your details',
        body: 'Your name, email and a number where we can reach you. Nothing more for now.',
      },
      {
        title: 'We call you personally',
        body: 'We go through your situation and tell you which route and which fee go with it.',
      },
      {
        title: 'We start your trajectory',
        body: 'If you agree, we begin with the document check and the preparation of your file.',
      },
    ],
    cta: { label: 'Take the first step', href: '#contact', situation: 'How it starts' },
  },
  aside: {
    heading: 'Would you like your partner to visit first?',
    body: 'For a temporary visit to the Netherlands a Schengen visa is the appropriate route, not the partner procedure. We handle that application separately.',
    linkLabel: 'Ask us about the Schengen visa',
    href: '#contact',
  },
  faq: {
    eyebrow: 'Frequently asked questions',
    heading: 'Questions we are often asked',
    intro: 'Not seeing your question? Ask it, and we will answer it personally.',
    items: [
      {
        q: 'Does my partner need an MVV?',
        a: 'That depends on your partner’s nationality. Some nationalities are exempt from the MVV requirement; for the others, the MVV has to be collected abroad before your partner travels to the Netherlands. In the TEV procedure the MVV and the residence permit are assessed in a single application. We establish which route applies in your situation.',
      },
      {
        q: 'Does my partner have to pass the civic integration examination abroad?',
        a: 'That requirement applies to some applicants, depending on nationality, the purpose of residence and possible exemptions. Where it applies, the examination has to be passed before the MVV can be issued. We check this before we start on the application, and we provide the preparation within the complete partner trajectory.',
      },
      {
        q: 'Which income requirement applies to me?',
        a: 'As the sponsor you must in principle have independent and sustainable income at least equal to the minimum wage that applies to your situation. What counts as sustainable differs per type of contract, and separate rules apply to the self-employed. The amounts are adjusted twice a year. We test your situation against the requirement that applies on the date of submission.',
      },
      {
        q: 'Can unmarried partners apply as well?',
        a: 'Yes. Besides married couples and registered partners, unmarried partners can apply too. You then have to demonstrate that the relationship is durable and exclusive. That calls for substantiation with supporting evidence, and it is precisely there that the most can be gained in practice.',
      },
      {
        q: 'How long does the procedure take?',
        a: 'The decision period is set by the competent authority and can be extended, for instance if additional questions arise. What you do control is the time before submission: legalising and translating documents abroad often takes more weeks than people expect. That is why we start there.',
      },
      {
        q: 'What is included in the €799 MVV/TEV partner application?',
        a: 'The assessment of your trajectory, a personalised document checklist, a review of your supporting documents, preparation of the application and professional file preparation, plus guidance during the agreed procedure with one personal point of contact. This service is intended for clients who do not need A1 preparation from us.',
      },
      {
        q: 'What is included in the €1,199 complete partner trajectory?',
        a: 'Everything in the MVV/TEV partner application, plus 6 hours of private 1-to-1 A1 examination preparation, preparation for Speaking, Reading and KNS and assistance with the examination process. One point of contact for the examination and the application together.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Your application',
    heading: 'Ready to start your partner application?',
    body: 'Whether you have already completed the examination requirements or need the complete A1 and MVV/TEV trajectory: leave your details and we will contact you about the appropriate next step.',
    assurances: [
      'You speak to someone who handles files like yours every day',
      'We discuss your situation first, and only then a proposal',
      'English or Dutch, whichever you prefer',
    ],
    directContact: 'Prefer to get in touch directly?',
    photo: {
      src: '/images/ph-avond.jpg',
      alt: 'A couple walking home together in the evening along a Dutch street with lit houses',
    },
    cta: { label: 'Contact me', href: '#contact', situation: 'Closing CTA' },
  },
  form: {
    heading: 'Start your partner application',
    intro: 'We contact you personally. You do not need to fill in a questionnaire first.',
    badge: 'Reply within one business day',
    name: 'Full name',
    namePlaceholder: 'First and last name',
    email: 'Email address',
    phone: 'Phone or WhatsApp',
    phoneHint: 'Including country code, for example +31 6 12345678',
    message: 'How can we help you?',
    messagePlaceholder:
      'For example: my partner lives in the Philippines, we are married and would like to start the application.',
    optional: 'optional',
    consent: 'I agree to the',
    consentLink: 'privacy policy',
    submit: 'Start my partner application',
    submitting: 'Sending',
    error: 'Sending failed. Please try again or send us a WhatsApp message.',
    privacyNote: 'Your details are only used to contact you about your application.',
  },
  whatsapp: {
    label: 'Ask your question via WhatsApp',
    aria: 'Contact us on WhatsApp',
    text: 'Hello, I have a question about partner reunification and the MVV/TEV application.',
  },
  exitIntent: {
    heading: 'No time to read it all now?',
    body: 'Leave your name and number and we will call you and go through your situation in ten minutes. No obligation.',
    cta: { label: 'Call me back', href: '#contact', situation: 'Exit intent' },
    dismiss: 'No, I will keep reading',
    ariaClose: 'Close',
  },
  stickyCta: 'Start my application',
  disclaimer:
    'Immigration Services NL is an independent private immigration service provider and is not affiliated with or part of the IND, DUO, the Dutch Government, any municipality, embassy or consulate. Any fees stated relate exclusively to our professional services. Government fees and third-party costs are not included unless expressly agreed otherwise. The competent authority ultimately decides on the application.',
  footer: {
    about: 'Since 2009 we have been assisting couples with partner reunification and Dutch immigration procedures.',
    contactHeading: 'Contact',
    legalHeading: 'Company details',
    privacy: 'Privacy policy',
    rights: 'All rights reserved.',
  },
  thanks: {
    metaTitle: 'Thank you for your request',
    heading: 'Thank you. We have received your details.',
    body: [
      'We will contact you personally to discuss your situation, usually within one business day.',
      'Would you like to help us along? Answer a few short questions below. This is not required; your request is already with us.',
    ],
    qualifyHeading: 'Help us assess your situation faster',
    qualifyIntro: 'The more we know in advance, the more focused our first conversation is.',
    choose: 'Make a choice',
    fields: {
      location: {
        label: 'Where does your partner live at the moment?',
        options: ['Abroad', 'In the Netherlands'],
      },
      situation: {
        label: 'What is the form of your relationship?',
        options: ['Married', 'Registered partnership', 'Unmarried partner', 'We want to marry first'],
      },
      exam: {
        label: 'Civic integration examination abroad already taken?',
        options: ['Yes, passed', 'Not yet', 'Exempt', 'I do not know'],
      },
      nationality: { label: 'What is your partner’s nationality?' },
      arrival: {
        label: 'When would you like to submit the application?',
        hint: 'A month or a period is enough',
      },
      notes: {
        label: 'Anything you would like to add?',
        placeholder: 'For example your income situation, children, or an earlier application.',
      },
    },
    submit: 'Send answers',
    submitting: 'Sending',
    done: 'Thank you.',
    doneBody: 'Your additions have been received. We will contact you as soon as possible.',
    skip: 'Back to the website',
    error: 'Sending failed. Please try again.',
  },
  privacy: {
    metaTitle: 'Privacy policy',
    heading: 'Privacy policy',
    updated: 'Last updated: August 2026',
    sections: [
      {
        heading: 'Who processes your data',
        body: [
          'Immigration Services NL, part of E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk, Chamber of Commerce 65768922, is responsible for processing the data you leave through this website.',
        ],
      },
      {
        heading: 'Which data we process',
        body: [
          'Through the contact form we process your name, email address, phone or WhatsApp number and the explanation you enter yourself. If you complete the additional form on the thank-you page, we also process the answers you give there.',
          'We also record technical data belonging to your request, such as the page from which you submitted the form, the referring website, the time of submission and any campaign data from the link you arrived through.',
        ],
      },
      {
        heading: 'Purpose and legal basis',
        body: [
          'We use your data to contact you, assess your situation and make you a suitable proposal. The basis for this is your consent and, once an assignment arises, the performance of the agreement.',
          'We do not use your data for unsolicited commercial messages and we do not sell it to third parties.',
        ],
      },
      {
        heading: 'Retention period',
        body: [
          'Requests that do not lead to an assignment are kept for a maximum of two years. Data belonging to a current or completed assignment is kept for as long as necessary for the file and the statutory retention periods.',
        ],
      },
      {
        heading: 'Recipients and processors',
        body: [
          'This website and the processing of forms run on the infrastructure of Cloudflare, Inc. Your request is sent to us by email and stored temporarily so that we can retrieve it.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can access, correct or delete your data and withdraw your consent. To do so, send a message to info@expat-relocation.nl. You also have the right to lodge a complaint with the Dutch Data Protection Authority.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'This website does not place tracking cookies without your consent. Technical storage necessary for the website to function may be required to submit the form correctly.',
        ],
      },
    ],
  },
};
