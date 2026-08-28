import type { LanderContent } from '../types';

/**
 * inburgeringsplichtig.nl, English. A 1:1 mirror of the Dutch page: the Dutch
 * keyword is what the domain ranks for, but a large share of the people who
 * receive an integration letter do not read Dutch comfortably.
 */
export const en: LanderContent = {
  lang: 'en',
  meta: {
    title: 'Required to integrate in the Netherlands? We help you find out',
    description:
      'Received a letter saying you must integrate, or unsure whether the civic integration obligation applies to you? We assess your situation and guide you through the right next steps.',
    imageAlt: 'Couple by the canal in a Dutch city in the evening light',
  },
  nav: {
    links: [
      { label: 'Your situation', href: '#situatie' },
      { label: 'How it works', href: '#werkwijze' },
      { label: 'Reviews', href: '#ervaringen' },
      { label: 'FAQ', href: '#vragen' },
    ],
    cta: { label: 'I need assistance', href: '#contact' },
    langSwitch: 'Nederlands',
  },
  hero: {
    eyebrow: 'Civic integration in the Netherlands',
    h1: 'Required to integrate in the Netherlands?',
    intro: [
      'Have you been informed that you must integrate, or are you unsure which requirements apply to your situation? That depends on your residence situation, when you came to the Netherlands and which integration route applies to you.',
      'We assess your situation and help you determine the appropriate next step.',
    ],
    benefits: [
      'Clarity about your own situation',
      'One personal point of contact from start to finish',
      'Examination and immigration assistance where relevant',
    ],
    cta: { label: 'I need assistance', href: '#aanvraag', situation: 'Hero' },
    photo: {
      src: '/images/living.jpg',
      alt: 'A couple walking together along a canal street in the Netherlands',
    },
    note: 'A personal answer from a specialist. No long questionnaire first.',
  },
  stats: [
    { value: '1500+', label: 'clients assisted worldwide' },
    { value: 'Since 2009', label: 'specialised in Dutch immigration procedures' },
    { value: '1 fixed', label: 'point of contact per file' },
    { value: 'EN · NL', label: 'assistance in both languages' },
  ],
  explain: {
    eyebrow: 'The term explained',
    heading: 'What does "inburgeringsplichtig" mean?',
    body: [
      'Being inburgeringsplichtig means that under Dutch rules you are required to integrate: learning the Dutch language and about Dutch society, concluded with one or more examinations within a set period.',
      'The confusion nearly always comes down to the same point. Not everyone falls under the same requirements.',
    ],
    points: [
      'Which obligations apply depends on your personal circumstances.',
      'Different routes, examinations and deadlines may apply.',
      'Exceptions and exemptions exist.',
      'The first step is establishing which requirements apply in your case.',
    ],
    cta: { label: 'Discuss my situation', href: '#contact', situation: 'Explanation of the obligation' },
    photo: {
      src: '/images/letter.jpg',
      alt: 'Woman at her kitchen table reading an official Dutch letter about civic integration',
    },
    photoNote: 'Received a letter with a deadline in it? Send us your details and we will go through it with you.',
  },
  routing: {
    eyebrow: 'Your situation',
    heading: 'Which situation applies to you?',
    intro:
      'Civic integration means something different for someone already living in the Netherlands than for someone still hoping to join a partner here. Choose whichever is closest to your situation.',
    cards: [
      {
        title: 'Do you already live in the Netherlands?',
        body: 'Have you been informed about your integration obligation and are you unsure what to do, which requirements apply or what your next step is? We review your situation and explain what is expected of you.',
        cta: { label: 'I want assistance with integration', href: '#contact', situation: 'Already living in the Netherlands' },
        photo: {
          src: '/images/street.jpg',
          alt: 'Woman cycling along a sunny Dutch residential street',
        },
      },
      {
        title: 'Are you still abroad and want to join your partner?',
        body: 'If you still live outside the Netherlands and want to join your partner, you may first need to pass the civic integration examination abroad. We offer that preparation as part of our complete partner trajectory.',
        cta: { label: 'I am joining my partner', href: '#contact', situation: 'Still abroad, joining partner' },
        photo: {
          src: '/images/exam.jpg',
          alt: 'Man practising Dutch at home on his laptop with headphones',
        },
      },
      {
        title: 'Have you already passed the examination abroad?',
        body: 'Have you already passed the civic integration examination abroad and now need help with the MVV/TEV partner application? We assist with the immigration procedure.',
        price: 'MVV/TEV partner application, €799 excl. VAT',
        cta: { label: 'I need help with my MVV', href: '#contact', situation: 'Examination passed, MVV/TEV needed' },
        photo: {
          src: '/images/papers.jpg',
          alt: 'Passport and application documents on a desk',
        },
      },
    ],
  },
  distinction: {
    eyebrow: 'An important distinction',
    heading: 'Before or after arrival in the Netherlands: do not confuse the two',
    intro:
      'Two different trajectories go by the same name in everyday speech. They have different rules, different examinations and a different order.',
    abroad: {
      badge: 'Everything in one trajectory',
      title: 'Civic integration examination abroad',
      body: 'This applies to people who still live abroad and must pass the required examination before the relevant MVV or partner procedure can continue. For clients who need both examination preparation and the partner application, we offer a single continuous trajectory.',
      packageName: 'Complete partner trajectory',
      price: '€1,199 excl. VAT',
      priceNote:
        'This fee relates to our professional services. Government fees and third-party costs are not included unless expressly agreed otherwise.',
      includes: [
        '6 hours of private 1-to-1 A1 examination preparation',
        'Preparation for Speaking, Reading and KNM',
        'Assistance with the MVV/TEV partner application',
        'A personal document checklist',
        'Document review and preparation of the application',
        'Guidance throughout the agreed procedure',
      ],
      cta: { label: 'See the complete partner trajectory', href: '#contact', situation: 'Complete partner trajectory' },
      photo: {
        src: '/images/partner.jpg',
        alt: 'Reunited couple on a bridge in a Dutch city',
      },
    },
    inNl: {
      title: 'Integrating in the Netherlands',
      body: [
        'Anyone already living in the Netherlands who is required to integrate is in a different position. Different routes, examinations and deadlines apply here than for the examination abroad.',
        'In that case we do not automatically present you with the partner package. The first step is establishing what help you actually need.',
      ],
      cta: { label: 'I need help with my situation', href: '#contact', situation: 'Integrating in the Netherlands' },
      photo: {
        src: '/images/canalside.jpg',
        alt: 'Couple walking along a canal in a Dutch city',
      },
    },
  },
  help: {
    eyebrow: 'How we help',
    heading: 'How we can help you',
    intro:
      'With more than ten years of experience in Dutch immigration procedures, we know which step is needed in which order, and what you do not need in your case.',
    items: [
      {
        title: 'Personal guidance',
        body: 'We review your situation and explain which steps are relevant to you, in plain language.',
      },
      {
        title: 'Examination and preparation',
        body: 'Where it fits, we provide preparation for the examination that applies in your situation.',
      },
      {
        title: 'Immigration assistance',
        body: 'If an MVV, family reunification or another procedure we handle is also involved, we assist with that application.',
      },
      {
        title: 'Complete partner trajectory',
        body: 'For partner clients who still need to pass the civic integration examination abroad, we offer the complete A1 and MVV/TEV trajectory.',
      },
    ],
    cta: { label: 'Tell us your situation', href: '#contact', situation: 'How we help' },
    photo: {
      src: '/images/advies.jpg',
      alt: 'Adviser talking with a client at a table in an office overlooking a canal',
    },
  },
  steps: {
    eyebrow: 'How it works',
    heading: 'Three steps',
    intro: 'Three steps, and the first one takes you two minutes.',
    items: [
      { title: 'Leave your details', body: 'Tell us briefly what we can help you with. Nothing more is needed.' },
      {
        title: 'We contact you',
        body: 'We discuss your situation and determine which help is actually relevant.',
      },
      {
        title: 'You start the right trajectory',
        body: 'If we can help you, we explain the service and the next steps clearly.',
      },
    ],
    cta: { label: 'I want to start', href: '#contact', situation: 'How it works' },
  },
  reviews: {
    eyebrow: 'Client experiences',
    heading: 'What clients say',
    intro: 'We only publish experiences we have actually received.',
    items: [
      {
        quote: 'Thanks to E & I our family reunification was a stress-free process. Everything was arranged perfectly.',
        name: 'Anna',
        context: 'Russia to the Netherlands',
      },
      {
        quote: 'Johanna was there for us 24/7 during the first days. Truly a unique service!',
        name: 'Chinedu',
        context: 'Nigeria to the Netherlands',
      },
    ],
    countriesLabel: 'Clients from among others',
    countries: ['India', 'Nigeria', 'Ghana', 'Suriname', 'Colombia', 'the Philippines', 'Turkey', 'the United States'],
  },
  band: {
    heading: 'Involved. Clear. Personal.',
    body: 'Behind every application there is a family that wants to move forward together. That is why you get one fixed point of contact who knows your file, and answers in plain language.',
    cta: { label: 'Discuss your situation', href: '#contact', situation: 'Photo band' },
    photo: {
      src: '/images/reunion.jpg',
      alt: 'Couple embracing on arrival in the airport arrivals hall',
    },
  },
  faq: {
    eyebrow: 'Frequently asked questions',
    heading: 'Questions we are often asked',
    intro: 'Not seeing your question? Ask it anyway, we answer personally.',
    items: [
      {
        q: 'Am I required to integrate in the Netherlands?',
        a: 'That depends on your personal circumstances, including your nationality, your purpose of residence and when you came to the Netherlands. Exceptions and exemptions exist. Leave your details and we will review your situation and tell you what applies in your case.',
      },
      {
        q: 'I received a letter about civic integration. What should I do now?',
        a: 'Keep the letter and note the deadline it mentions, because it usually states from when and within what period you must meet your obligation. If you do not know what the letter means for you, send us your details. We will contact you and go through it with you.',
      },
      {
        q: 'Is the civic integration examination abroad the same as integrating in the Netherlands?',
        a: 'No. The civic integration examination abroad is taken while someone is still outside the Netherlands and comes before the relevant MVV or partner procedure. Integrating in the Netherlands happens afterwards and has its own routes, examinations and deadlines.',
      },
      {
        q: 'Do I need to pass an examination before I can apply for an MVV?',
        a: 'For part of all applicants the civic integration examination abroad must be passed first. Whether that applies to you depends on your nationality, the purpose of residence and possible exemptions. We check this before any application is prepared.',
      },
      {
        q: 'Can you help with both the A1 preparation and my MVV?',
        a: 'Yes. For clients who need both, we offer the complete partner trajectory at €1,199 excl. VAT. It includes 6 hours of private 1-to-1 A1 examination preparation and full assistance with the MVV/TEV partner application.',
      },
      {
        q: 'I have already passed the examination abroad. Can you still help me?',
        a: 'Yes. If you have already passed, you do not need the complete trajectory. We then assist with the MVV/TEV partner application only, at €799 excl. VAT.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Your enquiry',
    heading: 'Need help with your civic integration?',
    body: 'Leave your details and we will contact you to discuss your situation and the possible next steps.',
    assurances: [
      'A personal reply within one business day',
      'No obligation, nothing to sign',
      'English or Dutch',
    ],
    directContact: 'Prefer to talk now?',
    cta: { label: 'Contact me', href: '#contact', situation: 'Final CTA' },
  },
  form: {
    heading: 'Tell us briefly about your situation',
    intro: 'We will contact you personally. There is no questionnaire to complete first.',
    badge: 'A reply within one business day',
    name: 'Full name',
    namePlaceholder: 'First and last name',
    email: 'Email address',
    phone: 'Telephone or WhatsApp',
    phoneHint: 'Including country code, for example +31 6 12345678',
    message: 'How can we help you?',
    messagePlaceholder: 'For example: I received a letter about civic integration and do not know what to do.',
    optional: 'optional',
    consent: 'I agree to the',
    consentLink: 'privacy policy',
    submit: 'I need assistance',
    submitting: 'Sending',
    error: 'Sending failed. Please try again or send us a WhatsApp message.',
    privacyNote: 'Your details are used only to contact you about your enquiry.',
  },
  whatsapp: {
    label: 'Ask a question via WhatsApp',
    aria: 'Contact us on WhatsApp',
    text: 'Hello, I have a question about my civic integration obligation.',
  },
  stickyCta: 'I need assistance',
  disclaimer:
    'Immigration Services NL is an independent private immigration service provider and is not affiliated with or part of the IND, DUO, the Dutch Government, any municipality, embassy or consulate. Any fees stated relate exclusively to our professional services. Government fees and third-party costs are not included unless expressly agreed otherwise. The competent authority ultimately decides on the application.',
  footer: {
    about: 'Since 2009 we have guided people through civic integration and Dutch immigration procedures.',
    contactHeading: 'Contact',
    legalHeading: 'Company details',
    privacy: 'Privacy policy',
    rights: 'All rights reserved.',
  },
  thanks: {
    metaTitle: 'Thank you for your message',
    heading: 'Thank you. We have received your details.',
    body: [
      'We will contact you personally to discuss your situation, usually within one business day.',
      'Want to help us prepare? Answer a few short questions below. This is optional, your enquiry is already with us.',
    ],
    qualifyHeading: 'Help us assess your situation faster',
    qualifyIntro: 'The more we know in advance, the more useful our first conversation will be.',
    choose: 'Please choose',
    fields: {
      location: {
        label: 'Where do you currently live?',
        options: ['In the Netherlands', 'Outside the Netherlands'],
      },
      situation: {
        label: 'Which situation fits you best?',
        options: [
          'I was informed that I have to integrate',
          'I want to join my partner in the Netherlands',
          'I have already passed the civic integration examination abroad',
          'Something else, or I am not sure yet',
        ],
      },
      exam: {
        label: 'Taken the examination abroad?',
        options: ['Yes, passed', 'No, not yet', 'I do not know'],
      },
      nationality: { label: 'What is your nationality?' },
      arrival: { label: 'Since when have you lived in the Netherlands?', hint: 'Only if you already live here' },
      notes: {
        label: 'Anything you would like to add?',
        placeholder: 'For example a deadline from your letter, or an earlier application.',
      },
    },
    submit: 'Send answers',
    submitting: 'Sending',
    done: 'Thank you.',
    doneBody: 'Your answers have been received. We will be in touch as soon as possible.',
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
          'Immigration Services NL, part of E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk, Chamber of Commerce number 65768922, is responsible for processing the data you submit through this website.',
        ],
      },
      {
        heading: 'What we process',
        body: [
          'Through the contact form we process your name, email address, telephone or WhatsApp number and the explanation you provide. If you complete the additional form on the thank-you page, we also process the answers you give there.',
          'We also record technical details belonging to your enquiry, such as the page you submitted the form from, the referring website, the time of submission and any campaign parameters in the link you arrived through.',
        ],
      },
      {
        heading: 'Purpose and legal basis',
        body: [
          'We use your data to contact you, assess your situation and make you a suitable proposal. The legal basis is your consent and, once an assignment arises, performance of the agreement.',
          'We do not use your data for unsolicited commercial messages and we do not sell it to third parties.',
        ],
      },
      {
        heading: 'Retention',
        body: [
          'Enquiries that do not lead to an assignment are kept for a maximum of two years. Data belonging to a current or completed assignment is kept for as long as the file and statutory retention periods require.',
        ],
      },
      {
        heading: 'Recipients and processors',
        body: [
          'This website and its form handling run on infrastructure provided by Cloudflare, Inc. Your enquiry is emailed to us and stored temporarily so that we can retrieve it.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You may access, correct or delete your data and withdraw your consent. Write to info@expat-relocation.nl. You also have the right to lodge a complaint with the Dutch Data Protection Authority.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'This website does not place tracking cookies without your consent. Technical storage strictly necessary for the website to function may be used to submit the form correctly.',
        ],
      },
    ],
  },
};
