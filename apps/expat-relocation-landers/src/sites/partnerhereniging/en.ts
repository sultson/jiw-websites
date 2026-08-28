import type { LanderContent } from '../types';

/**
 * partnerhereniging.nl, English. A 1:1 mirror of nl.ts: the domain ranks for
 * the Dutch query it spells, but a large share of these visitors is the foreign
 * partner, who reads the page in English.
 */
export const en: LanderContent = {
  lang: 'en',
  meta: {
    title: 'Partner Reunification Netherlands: MVV/TEV Application Assistance',
    description:
      'Would you like your foreign partner to come and live with you in the Netherlands? We professionally prepare your MVV/TEV partner application, documents included. From €799 excl. VAT.',
    imageAlt: 'A couple laughing together in the arrivals hall of a Dutch airport',
  },
  nav: {
    links: [
      { label: 'Your situation', href: '#situatie' },
      { label: 'Assistance', href: '#begeleiding' },
      { label: 'The trajectory', href: '#traject' },
      { label: 'Reviews', href: '#ervaringen' },
      { label: 'FAQ', href: '#vragen' },
    ],
    cta: { label: 'Start my application', href: '#contact' },
    langSwitch: 'Nederlands',
  },
  hero: {
    eyebrow: 'Partner reunification in the Netherlands',
    h1: 'Want to bring your partner to the Netherlands?',
    intro: [
      'Does your partner still live abroad, and would you like to build a life together in the Netherlands? Depending on your situation, requirements may apply regarding your income, your relationship, the documents you submit, the civic integration examination abroad and the MVV/TEV procedure.',
      'We professionally prepare your partner application and, where required, provide the A1 examination preparation as well, so the whole trajectory sits with one provider.',
    ],
    benefits: [
      'Personal guidance',
      'Tailored document checklist',
      'Professional application preparation',
      'Complete trajectory including A1 preparation available',
    ],
    offer: {
      name: 'MVV/TEV partner application',
      price: 'from €799 excl. VAT',
      note: 'This fee relates to our professional services. Government fees and third-party costs are not included unless expressly agreed otherwise.',
    },
    cta: { label: 'Start my partner application', href: '#aanvraag', situation: 'Hero' },
    note: 'We contact you personally, usually within one business day.',
    photo: {
      src: '/images/ph-hero.jpg',
      alt: 'A couple laughing together in the arrivals hall of a Dutch airport',
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
      'What exactly has to be demonstrated depends on the form of your relationship, your income and your partner’s nationality. That is where it most often goes wrong in practice. A file that is incomplete on a single point leads to questions and delay.',
    ],
    points: [
      'Your partner currently lives outside the Netherlands.',
      'You want to live together permanently in the Netherlands.',
      'You are married, registered partners or unmarried partners.',
      'You are unsure whether you meet the income requirement.',
      'Your partner may require an MVV.',
      'Your partner may first need to pass the civic integration examination abroad.',
    ],
    cta: { label: 'Discuss my situation', href: '#contact', situation: 'Your situation' },
    photo: {
      src: '/images/ph-keukentafel.jpg',
      alt: 'A couple going through the documents for their application at the kitchen table',
    },
    photoNote:
      'Unsure about the income requirement or your supporting documents? Leave your details and we will go through your situation with you.',
  },
  packages: {
    eyebrow: 'Assistance',
    heading: 'Choose the right level of assistance',
    intro:
      'Two options. Which one fits you depends on a single question: does your partner still need to sit the civic integration examination abroad?',
    cards: [
      {
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
        badge: 'Complete service',
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
  journey: {
    eyebrow: 'The trajectory',
    heading: 'From examination preparation to the partner application',
    intro:
      'We do not treat the examination and the application as two unrelated steps. This is the order we follow for clients who need both.',
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
        body: 'Guidance throughout the agreed procedure, up to the decision.',
      },
    ],
    outcome: 'One coordinated trajectory, one file strategy, one point of contact.',
    cta: { label: 'I want the complete trajectory', href: '#contact', situation: 'The trajectory' },
  },
  help: {
    eyebrow: 'Why us',
    heading: 'Why clients place their partner application with us',
    intro:
      'We have specialised in Dutch immigration procedures since 2009 and assist clients from all over the world. You get answers in plain language, from someone who knows your file.',
    items: [
      {
        title: 'Specialised immigration assistance',
        body: 'Partner reunification, MVV and TEV are our daily work, not a sideline.',
      },
      {
        title: 'One personal point of contact',
        body: 'The same person from your first question to the decision on the application.',
      },
      {
        title: 'Clear communication',
        body: 'You know what is needed, what it costs and what to expect when.',
      },
      {
        title: 'Professional file preparation',
        body: 'We review your supporting documents and build the file the way it will be assessed.',
      },
    ],
    cta: { label: 'Discuss your situation', href: '#contact', situation: 'Why us' },
    photo: {
      src: '/images/ph-advies.jpg',
      alt: 'An adviser going through the application with a couple at a table',
    },
  },
  reviews: {
    eyebrow: 'Reviews',
    heading: 'What our clients say',
    intro: 'We only publish reviews we have actually received.',
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
    countriesLabel: 'Clients from countries including',
    countries: ['India', 'Nigeria', 'Ghana', 'Suriname', 'Colombia', 'the Philippines', 'Turkey', 'the United States'],
  },
  band: {
    heading: 'Living together in the Netherlands',
    body: 'Behind every application there is a couple who simply want to be together. That is why you get one point of contact who knows your file and whom you can call when something changes.',
    cta: { label: 'Start my partner application', href: '#contact', situation: 'Photo band' },
    photo: {
      src: '/images/ph-samen.jpg',
      alt: 'A couple walking hand in hand down a Dutch residential street',
    },
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
    intro: 'Is your question not listed? Ask it, we will answer you personally.',
    items: [
      {
        q: 'Does my partner need an MVV?',
        a: 'That depends on your partner’s nationality. Some nationalities are exempt from the MVV requirement; for the rest, the MVV must be collected abroad before your partner travels to the Netherlands. In the TEV procedure the MVV and the residence permit are assessed in a single application. We establish which route applies in your situation.',
      },
      {
        q: 'Does my partner need to pass the civic integration examination abroad?',
        a: 'That requirement applies to a portion of applicants, depending on nationality, purpose of residence and possible exemptions. Where it applies, the examination must be passed before the MVV can be issued. We establish this before we start on the application, and we provide the preparation within the complete partner trajectory.',
      },
      {
        q: 'What income requirement applies to me?',
        a: 'As the sponsor you must in principle have independent and sustainable income at least equal to the minimum wage that applies to your situation. What counts as sustainable differs per type of contract, and separate rules apply to the self-employed. The amounts are adjusted twice a year. We assess your situation against the requirement in force at the moment of submission.',
      },
      {
        q: 'Can unmarried partners apply?',
        a: 'Yes. Besides married couples and registered partners, unmarried partners can apply as well. You then have to demonstrate a durable and exclusive relationship. That calls for substantiation with supporting evidence, and this is where the most can be gained in practice.',
      },
      {
        q: 'What is included in the €799 MVV/TEV partner application?',
        a: 'Assessment of your trajectory, a personalised document checklist, review of your supporting documents, preparation of the application and professional file preparation, plus guidance during the agreed procedure with one personal point of contact. This service is intended for clients who do not need A1 preparation from us.',
      },
      {
        q: 'What is included in the €1,199 complete partner trajectory?',
        a: 'Everything in the MVV/TEV partner application, plus 6 hours of private 1-to-1 A1 examination preparation, preparation for Speaking, Reading and KNS and assistance with the examination process. One point of contact for the examination and the application together.',
      },
    ],
  },
  finalCta: {
    eyebrow: 'Your application',
    heading: 'Ready to start your partner reunification?',
    body: 'Whether you have already completed the examination requirements or need the complete A1 and MVV/TEV trajectory, leave your details and we will contact you about the appropriate next step.',
    assurances: [
      'A personal answer within one business day',
      'No obligation whatsoever',
      'English or Dutch',
    ],
    directContact: 'Prefer to reach us directly?',
    photo: { src: '/images/ph-thuis.jpg', alt: 'A couple standing with the keys in the doorway of their Dutch home' },
    cta: { label: 'Contact me', href: '#contact', situation: 'Final CTA' },
  },
  form: {
    heading: 'Start your partner application',
    intro: 'We will contact you personally. There is no questionnaire to fill in first.',
    badge: 'A reply within one business day',
    name: 'Full name',
    namePlaceholder: 'First and last name',
    email: 'Email address',
    phone: 'Telephone or WhatsApp',
    phoneHint: 'Including country code, for example +31 6 12345678',
    message: 'How can we help you?',
    messagePlaceholder: 'For example: my partner lives in the Philippines, we are married and want to start the application.',
    optional: 'optional',
    consent: 'I agree to the',
    consentLink: 'privacy policy',
    submit: 'Start my partner application',
    submitting: 'Sending',
    error: 'Sending failed. Please try again or send us a WhatsApp message.',
    privacyNote: 'Your details are used only to contact you about your application.',
  },
  whatsapp: {
    label: 'Ask your question via WhatsApp',
    aria: 'Contact us via WhatsApp',
    text: 'Hello, I have a question about partner reunification and the MVV/TEV application.',
  },
  stickyCta: 'Start my application',
  disclaimer:
    'Immigration Services NL is an independent private immigration service provider and is not affiliated with or part of the IND, DUO, the Dutch Government, any municipality, embassy or consulate. Any fees stated relate exclusively to our professional services. Government fees and third-party costs are not included unless expressly agreed otherwise. The competent authority ultimately decides on the application.',
  footer: {
    about: 'Since 2009 we have assisted couples with partner reunification and Dutch immigration procedures.',
    contactHeading: 'Contact',
    legalHeading: 'Company details',
    privacy: 'Privacy policy',
    rights: 'All rights reserved.',
  },
  thanks: {
    metaTitle: 'Thank you for your application',
    heading: 'Thank you. We have received your details.',
    body: [
      'We will contact you personally to discuss your situation, usually within one business day.',
      'Would you like to help us prepare? Answer a few short questions below. This is optional, your request is already with us.',
    ],
    qualifyHeading: 'Help us assess your situation faster',
    qualifyIntro: 'The more we know in advance, the more targeted our first conversation is.',
    choose: 'Make a choice',
    fields: {
      location: {
        label: 'Where does your partner currently live?',
        options: ['Abroad', 'In the Netherlands'],
      },
      situation: {
        label: 'What is the form of your relationship?',
        options: ['Married', 'Registered partnership', 'Unmarried partners', 'We want to marry first'],
      },
      exam: {
        label: 'Civic integration examination abroad already taken?',
        options: ['Yes, passed', 'No, not yet', 'Exempt', 'I do not know'],
      },
      nationality: { label: 'What is your partner’s nationality?' },
      arrival: {
        label: 'When would you like to submit the application?',
        hint: 'A month or a rough period is enough',
      },
      notes: {
        label: 'Anything you would like to add?',
        placeholder: 'For example your income situation, children, or a previous application.',
      },
    },
    submit: 'Send my answers',
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
          'Immigration Services NL, part of E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk, Chamber of Commerce 65768922, is responsible for processing the data you leave through this website.',
        ],
      },
      {
        heading: 'What data we process',
        body: [
          'Through the contact form we process your name, email address, telephone or WhatsApp number and the explanation you provide. If you complete the additional form on the thank-you page, we also process the answers you give there.',
          'We also record technical data belonging to your request, such as the page from which you submitted the form, the referring website, the time of submission and any campaign parameters in the link you arrived through.',
        ],
      },
      {
        heading: 'Purpose and legal basis',
        body: [
          'We use your data to contact you, assess your situation and make you a suitable proposal. The legal basis is your consent and, once an engagement arises, the performance of the agreement.',
          'We do not use your data for unsolicited commercial messages and we do not sell it to third parties.',
        ],
      },
      {
        heading: 'Retention',
        body: [
          'Requests that do not lead to an engagement are kept for a maximum of two years. Data belonging to a current or completed engagement is kept for as long as needed for the file and the statutory retention periods.',
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
          'You can access, correct or delete your data, and withdraw your consent. Send a message to info@expat-relocation.nl. You also have the right to lodge a complaint with the Dutch Data Protection Authority.',
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
