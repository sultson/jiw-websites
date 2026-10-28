import type { CoreContent } from '../types';

export const core: CoreContent = {
  ui: {
    skipToContent: 'Skip to content',
    nav: {
      home: 'Home',
      immigration: 'Immigration',
      housing: 'Housing',
      relocation: 'Relocation',
      business: 'Starting a business',
      vip: 'VIP services',
      guides: 'Guides',
      about: 'About',
      contact: 'Contact',
    },
    cta: {
      whatsapp: 'WhatsApp',
      whatsappLong: 'WhatsApp us directly',
      consultation: 'Book a relocation consultation',
      startRelocation: 'Start your relocation',
      readMore: 'Read more',
      allServices: 'All services',
      backTo: 'Back to',
      send: 'Send inquiry',
      sending: 'Sending…',
      explore: 'Explore',
      enquire: 'Ask about this service',
      quote: 'Request a quote',
    },
    ctaStrip: {
      heading: 'Discuss your situation personally',
      text: 'A few lines are enough. Johanna reviews every enquiry herself and replies within one business day.',
    },
    whatsappPrefill: {
      general: 'Hi Johanna, I am planning a move to the Netherlands and have a question.',
      topic: 'Hi Johanna, I have a question about: {topic}',
    },
    langBanner: {
      prompt: 'Would you prefer to read this site in {lang}?',
      switch: 'Switch',
      dismiss: 'No, thank you',
    },
    form: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      phone: 'Phone / WhatsApp',
      optional: 'optional',
      successTitle: 'Thank you, your inquiry has been sent',
      successBody:
        'Johanna will personally review your situation and reply within one business day, usually much sooner. For anything urgent, message us on WhatsApp.',
      errorTitle: 'Something went wrong',
      errorBody: 'Your inquiry could not be sent. Please try again, or message us on WhatsApp.',
      consent: 'By sending this form you agree to our privacy policy.',
      nextSteps:
        'After you send this form, Johanna personally reviews your situation and replies within one business day with an honest assessment of whether and how we can help. If your request falls outside our services or region, we tell you straight away.',
    },
    footer: {
      tagline: 'A boutique relocation consultancy for international professionals and families settling in Rotterdam, Europoort and the wider port region.',
      services: 'Services',
      company: 'Company',
      contactHeading: 'Contact',
      legalHeading: 'Legal',
      kvkLabel: 'KvK',
      rightsReserved: 'All rights reserved.',
      builtBy: 'Website by',
      disclaimer:
        'E & I is an independent relocation and immigration consultancy. We are not a government body and we are not affiliated with the IND, the Dutch government or any embassy or consulate. Decisions on visas, residence permits and naturalisation are made solely by the competent authorities.',
    },
    misc: {
      from: 'Investment from',
      whatsIncluded: 'What is included',
      otherServices: 'Other services',
      relatedGuides: 'Related guides',
      conditions: 'Conditions',
      investment: 'Investment',
      feesDisclaimer:
        'Investment figures represent our professional service fees only and are intended as a guideline. Government fees (including IND filing fees), VAT, legalisation and apostille costs, sworn translations, consular charges and any third-party expenses are not included unless explicitly stated in the proposal.',
    },
  },

  home: {
    metaTitle: 'Relocation & Immigration Services Netherlands, Rotterdam | E & I',
    metaDescription:
      'Immigration and relocation for non-EU professionals, families and employers moving to the Netherlands. Personal guidance in Rotterdam and the port region.',
    hero: {
      h1: 'Boutique Relocation & Immigration Services in the Netherlands',
      sub: 'For non-EU professionals, families and the employers who bring them here. Permits, housing and settling in, handled as one plan across Rotterdam, The Hague and the port region.',
      ctaPrimary: 'View our packages',
      ctaWhatsapp: 'WhatsApp us directly',
      ctaSecondary: 'Start your relocation',
      trust: 'Personally guided by Johanna, from first question to settled',
      points: ['Personal guidance', 'Immigration and relocation in one plan', 'Port region specialist'],
    },
    featured: {
      packages: {
        title: 'Immigration & Relocation Packages',
        text: 'Complete support for international professionals, non-EU families and employers in Rotterdam and the surrounding area: the permit, the home, the school and the paperwork in one plan.',
        label: 'View our packages',
        imageAlt: 'The Erasmus Bridge and the Rotterdam skyline across the Maas',
      },
      port: {
        title: 'Port Services',
        subtitle: 'Europoort, Botlek & Maasvlakte',
        text: 'Immigration and relocation for the international engineers and specialists who work in the Rotterdam port, and for the companies that hire them.',
        label: 'Learn more',
        imageAlt: 'Container cranes in the port of Rotterdam',
      },
    },
    audience: {
      heading: 'Who we work for',
      items: [
        {
          title: 'International professionals & families',
          text: 'Non-EU nationals and their families: permits, housing, schools and the practical side of settling in.',
          path: '/vip-services/family-relocation-immigration-services-netherlands',
        },
        {
          title: 'Employers',
          text: 'Work permits, IND sponsorship and relocation for the international staff you hire.',
          path: '/starting-a-business/employer-immigration-services-netherlands',
        },
        {
          title: 'Local expertise',
          text: 'Based between Rotterdam and The Hague, and at home in the port from the Botlek to the Maasvlakte.',
          path: '/industrial-expat-services',
        },
        {
          title: 'Complete support',
          text: 'From the first permit to the day you feel at home, with one person who knows your whole file.',
          path: '/about',
        },
      ],
    },
    contactBar: {
      heading: 'Get in touch',
      text: 'A question about a permit, a package or relocating your staff? We are happy to help.',
      whatsappLabel: 'Chat on WhatsApp',
      formLabel: 'Send us a message',
    },
    intro: {
      eyebrow: 'A personal perspective on international living',
      heading: 'Hello, I’m Johanna.',
      text: [
        'Having grown up in an internationally mobile family, I understand that relocating abroad is about far more than crossing borders. It is about embracing new opportunities, navigating unfamiliar surroundings and creating a sense of belonging in a new country.',
        'These experiences have shaped not only my perspective, but also my professional journey.',
        'Since 2009, I have dedicated my career to Dutch immigration, combining specialist expertise with a personal understanding of international mobility.',
        'Today, as the founder of E & I Expat Relocation & Immigration Services the Netherlands, I assist international professionals, families and employers with immigration and relocation, with a particular focus on Rotterdam and the surrounding region.',
        'My philosophy is simple: exceptional service begins with understanding the people behind every international move.',
      ],
      label: 'Discover my story',
    },
    paths: {
      heading: 'How can we help you arrive?',
      sub: 'Relocation, housing, VIP support and immigration, handled by one consultancy. Choose your way in and one person knows your name from the first message to the day you feel at home.',
      items: [
        {
          key: 'immigration',
          title: 'Immigration services',
          text: 'Visas and permits for professionals, partners, families and founders. Prepared precisely, guided personally, from eligibility to approval.',
          label: 'Explore immigration',
          path: '/immigration',
          image: '/images/path-immigration.jpg?v=20260731',
          imageAlt: 'Advisor in conversation with an international client',
        },
        {
          key: 'relocation',
          title: 'Relocation & single services',
          text: 'One part of the move on its own, such as housing, schools or registration, or added to a package. Available on request.',
          label: 'Explore relocation',
          path: '/relocation',
          image: '/images/path-relocation.jpg?v=20260731',
          imageAlt: 'Family arriving at a Dutch canal-side home',
        },
        {
          key: 'vip',
          title: 'Packages & VIP relocation',
          text: 'Couple, family and business packages that cover the whole move, immigration included, plus a concierge service for executives, artists and athletes.',
          label: 'View our packages',
          path: '/vip-services',
          image: '/images/path-vip.jpg?v=20260731',
          imageAlt: 'Chauffeur opening a car door against the Rotterdam skyline',
        },
      ],
    },
    mostRequested: {
      heading: 'Most requested services',
      sub: 'The eight things expats ask us for first.',
      items: [
        { label: 'Highly skilled migrant visa', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Family relocation package', path: '/vip-services/family-relocation-immigration-services-netherlands' },
        { label: 'Partner visa Netherlands', path: '/immigration/partner-visa-netherlands' },
        { label: 'BSN registration', path: '/relocation/bsn-registration-netherlands' },
        { label: 'Startup visa Netherlands', path: '/immigration/startup-visa-netherlands' },
        { label: 'School search', path: '/relocation/school-search-netherlands' },
        { label: 'Complete relocation package', path: '/vip-services' },
        { label: 'Relocation services Rotterdam', path: '/relocation/relocation-services-rotterdam' },
      ],
    },
    vipBlock: {
      eyebrow: 'VIP relocation services',
      heading: 'Arrive the way you are used to arriving',
      text: [
        'Some clients cannot spend six weeks on paperwork. They fly in for a weekend, sign, register and fly out while we finish the rest. Our VIP packages compress an entire relocation into a schedule built around you: appointments aligned in a single visit, housing shortlisted before you land, a car waiting at Schiphol.',
        'Couples, families and businesses each have their own package, and the concierge tier is written around whatever your life requires.',
      ],
      label: 'Discover VIP relocation',
    },
    immigrationBlock: {
      eyebrow: 'Immigration for expats',
      heading: 'The right permit, prepared the right way',
      text: [
        'Dutch immigration rewards preparation. We assess which route actually fits your situation, prepare the application the way the IND wants to see it, and go with you to the appointments that matter.',
      ],
      label: 'All immigration services',
      links: [
        { label: 'Highly skilled migrant', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'EU Blue Card', path: '/immigration/eu-blue-card-netherlands' },
        { label: 'Partner visa', path: '/immigration/partner-visa-netherlands' },
        { label: 'Startup visa', path: '/immigration/startup-visa-netherlands' },
        { label: 'DAFT visa', path: '/immigration/daft-visa-netherlands' },
        { label: 'Residence permits', path: '/immigration/residence-permit-netherlands' },
      ],
    },
    housingBlock: {
      eyebrow: 'Housing & settling in',
      heading: 'A home, not just an address',
      text: [
        'The Dutch rental market moves in days, not weeks. We search, attend viewings with you or for you, review every contract clause before you sign, and stay the point of contact for your landlord long after the keys are yours.',
      ],
      label: 'All housing services',
      links: [
        { label: 'Housing search', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Expat housing Rotterdam', path: '/housing/housing-for-expats-rotterdam' },
        { label: 'Viewing assistance', path: '/housing/viewing-assistance-netherlands' },
        { label: 'Temporary housing', path: '/housing/temporary-housing-for-expats-netherlands' },
      ],
    },
    businessBlock: {
      eyebrow: 'Starting a business',
      heading: 'Found your company where the world docks',
      text: [
        'Startup visa, DAFT treaty, KvK registration, an address, a home, a school for your children. Most firms handle one of those. We handle the sequence, because a founder does not move in stages, a founder moves a life.',
      ],
      label: 'Business services',
    },
    portBlock: {
      eyebrow: 'Ports, harbours & offshore',
      heading: 'The specialist for the port of Rotterdam',
      text: [
        'Europe’s largest port does not appear in relocation brochures, yet tens of thousands of international professionals build their careers there. We are the only boutique consultancy specialised in Rotterdam, the region south of it, Europoort, the Botlek and the Maasvlakte, working daily with the port, offshore, shipping and engineering companies that bring people here.',
      ],
      label: 'Industrial expat services',
      areas: [
        { title: 'Rotterdam', text: 'Skyline living, international schools and the fastest-changing city in the Netherlands.' },
        { title: 'Europoort, Botlek & Maasvlakte', text: 'Practical relocation for port, offshore and refinery professionals and their families.' },
        { title: 'South of Rotterdam', text: 'Quiet towns like Brielle, Rozenburg and Hellevoetsluis, minutes from the terminals and a world away from them.' },
      ],
      advantages: [
        { title: 'Local knowledge', text: 'We know the neighbourhoods, schools, landlords and commutes of this region street by street.' },
        { title: 'Fast personal assistance', text: 'We are nearby, so we can be at a viewing, a municipality desk or an emergency on short notice.' },
        { title: 'An established network', text: 'Agents, municipalities, schools and international employers in the region already know us.' },
        { title: 'Support after arrival', text: 'The relationship does not end at the keys. We stay the point of contact long after you settle in.' },
      ],
      links: [
        { label: 'Europoort expats', path: '/industrial-expat-services/europoort-relocation-services-netherlands' },
        { label: 'Maasvlakte expats', path: '/industrial-expat-services/maasvlakte-expat-relocation-netherlands' },
        { label: 'Offshore professionals', path: '/industrial-expat-services/offshore-expat-services-netherlands' },
        { label: 'Logistics professionals', path: '/industrial-expat-services/relocation-for-logistics-professionals-netherlands' },
      ],
    },
    familyBlock: {
      eyebrow: 'Family relocation',
      heading: 'Moving a family is a different discipline',
      text: [
        'School years that start on fixed dates, several IND files instead of one, and a home that has to work for everyone. We coordinate the whole family arrival, immigration included, in one plan and one pair of hands.',
      ],
      label: 'Family relocation services',
      path: '/relocation/family-relocation-netherlands',
      image: '/images/family-unpacking.jpg?v=20260731',
      imageAlt: 'Family settled into their new Dutch living room',
      links: [
        { label: 'Family VIP Package', path: '/vip-services/family-relocation-immigration-services-netherlands' },
        { label: 'School search', path: '/relocation/school-search-netherlands' },
        { label: 'Family reunification', path: '/immigration/family-reunification-netherlands' },
      ],
    },
    whyBoutique: {
      eyebrow: 'Why boutique',
      heading: 'One consultancy. One person. Your name.',
      text: [
        'Large relocation firms assign you a ticket number. A boutique consultancy assigns you a person. Johanna built her reputation in the embassy world, where discretion and precision are not qualities, they are the job description.',
        'We are not a volume relocation firm offering every possible service. We do relocation, housing, VIP support and immigration for one region, through one company, and we do those completely.',
      ],
      points: [
        {
          title: 'We go with you',
          text: 'To the municipality, the IND, the bank and the viewing. You are never handed a checklist and wished good luck.',
        },
        {
          title: 'Personally, start to finish',
          text: 'One WhatsApp line, answered by the person managing your file. First week or first year.',
        },
        {
          title: 'The only one of its kind',
          text: 'The Netherlands has corporate mobility firms and it has visa desks. It has exactly one boutique expat concierge.',
        },
        {
          title: 'Packages built around lives',
          text: 'Couple, family, business or full concierge. Each package covers the whole arrival, not a slice of it.',
        },
      ],
      stats: [
        { value: 'Since 2016', label: 'Guiding arrivals in the Netherlands' },
        { value: '1200+', label: 'Expats and families helped' },
        { value: '98%', label: 'Client satisfaction score' },
        { value: 'Since 2009', label: 'Specialised in Dutch immigration' },
      ],
    },
    reviews: {
      eyebrow: 'Client stories',
      heading: 'Arrivals we are proud of',
      sub: 'Real clients, real routes into the Netherlands.',
      items: [
        {
          quote: 'Thanks to E & I, our family reunification was a stress-free process. Everything was arranged perfectly.',
          name: 'Anna',
          route: 'Russia to the Netherlands',
          tags: ['Relocation', 'Visa', 'Work permit', 'Housing support', 'Family'],
        },
        {
          quote: 'Johanna was there for us 24/7 during our first days. Truly a unique service!',
          name: 'Chinedu',
          route: 'Nigeria to the Netherlands',
          tags: ['Relocation', 'Visa', 'Business', 'Startup', 'Integration'],
        },
      ],
    },
    whatsappCta: {
      heading: 'One message. We take it from there.',
      text: 'Tell us where you are and where you need to be. You will be speaking with Johanna, not a chatbot.',
      label: 'Message us on WhatsApp',
    },
    contactBlock: {
      eyebrow: 'Start the conversation',
      heading: 'Tell us about your move',
      text: 'A few lines is enough. We reply within one business day.',
    },
  },

  about: {
    metaTitle: 'About E & I | Boutique Expat & Relocation Consultancy Netherlands',
    metaDescription:
      'E & I is the only boutique expat relocation and immigration consultancy in the Netherlands. Personal guidance by Johanna, from visa to housing to the day you feel at home.',
    eyebrow: 'The story behind E & I',
    title: 'A life shaped by international experience',
    intro: [
      'International living has been part of my life for as long as I can remember.',
      'Growing up in an internationally mobile family, I experienced firsthand what it means to leave familiar surroundings behind and establish a new life abroad. Each relocation brought new opportunities, unfamiliar cultures and the challenge of finding a sense of belonging somewhere new.',
      'Throughout my childhood, our international moves were carefully coordinated. Homes, schools and practical arrangements were organised before we arrived, allowing us to focus on settling into our new surroundings.',
      'It was only when my family returned to the Netherlands without that same professional support that I fully understood its value. Despite returning to a familiar country, the transition proved unexpectedly challenging.',
      'That experience shaped my belief that successful relocation requires more than arrangements and paperwork. It requires foresight, personal attention and someone who understands the experience behind the move.',
    ],
    image: '/images/about-joanna.jpg?v=20261026',
    imageAlt: 'Johanna, founder of E & I',
    sections: [
      {
        heading: 'From international experience to professional expertise',
        text: [
          'My international upbringing inspired a lasting interest in immigration and international mobility.',
          'I pursued studies in law and real estate, developing a multidisciplinary perspective on the legal, practical and property-related aspects of relocation.',
          'My professional background also includes working for embassies and government ministries, providing valuable insight into administrative procedures, international affairs and complex regulatory environments.',
          'Since 2009, I have specialised in Dutch immigration, assisting international professionals, families and employers with residence permits, family reunification, highly skilled migration and other immigration procedures.',
          'I founded E & I Expat Relocation & Immigration Services the Netherlands to combine this professional expertise with the personalised relocation support I had experienced and valued myself.',
        ],
      },
      {
        heading: 'A personal approach that goes beyond relocation',
        text: [
          'I believe exceptional service should feel personal, never procedural.',
          'Every client has different priorities, expectations and circumstances. Some require specialist assistance with an immigration application. Others need comprehensive support with the many details involved in relocating their professional and personal lives.',
          'My approach begins with understanding those individual needs.',
          'I remain personally involved throughout the journey, providing direct communication, continuity and a trusted point of contact. Rather than simply managing individual tasks, I consider the wider picture, anticipate potential challenges and coordinate additional expertise where required.',
          'For me, personal service means paying attention to the details that matter to each client, including those that may never appear on a standard relocation checklist.',
        ],
      },
      {
        heading: 'Bespoke relocation and VIP assistance',
        text: [
          'For clients seeking a more comprehensive experience, E & I offers tailored relocation assistance designed around their circumstances, lifestyle and professional commitments.',
          'This may include coordinating accommodation, family arrangements, local services and other aspects of settling into the Netherlands.',
          'For executives, international professionals and clients requiring additional discretion or flexibility, bespoke VIP arrangements can provide a more intensive level of personal coordination, including extended availability and, where specifically agreed, 24/7 assistance.',
          'The level of involvement is always tailored to the individual. Whether the assignment concerns a single immigration procedure or a comprehensive relocation, the same principles apply: discretion, careful preparation, reliability and personal attention.',
        ],
      },
      {
        heading: 'Your journey, personally guided',
        text: [
          'Today, E & I supports individuals, families and employers relocating to the Netherlands, with a particular focus on Rotterdam, Europoort, Botlek and the surrounding region.',
          'My ambition has never been to offer everyone the same relocation experience. It is to provide each client with the expertise, attention and level of guidance their circumstances deserve.',
          'Because exceptional relocation is not simply about reaching a destination. It is about feeling confident that every important detail is in capable hands.',
        ],
      },
    ],
    quote: 'For some, relocation is a service. For my clients, it is a personally guided experience.',
    reviews: {
      heading: 'Reviews & client experiences',
      sub: 'What clients say about arriving with E & I.',
    },
    cta: {
      title: 'Planning your move to the Netherlands?',
      text: 'Explore our immigration and relocation services or contact us to discuss how E & I can assist.',
      label: 'Book a relocation consultation',
    },
  },

  contact: {
    metaTitle: 'Contact E & I | Relocation & Immigration Support Netherlands',
    metaDescription:
      'Schedule a relocation consultation, message us on WhatsApp or send an immigration, relocation or VIP inquiry. Personal reply within one business day.',
    eyebrow: 'Contact',
    title: 'Start your relocation',
    intro: [
      'Choose the path that fits your situation and tell us a few lines. Your inquiry lands directly with Johanna, and you will have a personal reply within one business day.',
    ],
    tabs: [
      {
        key: 'immigration',
        label: 'Immigration',
        text: 'Visas, permits and IND applications.',
      },
      {
        key: 'relocation',
        label: 'Relocation & housing',
        text: 'Packages, housing, schools and settling in.',
      },
      {
        key: 'vip',
        label: 'VIP',
        text: 'Concierge relocations and fly-in visits.',
      },
    ],
    whatsapp: {
      heading: 'WhatsApp relocation support',
      text: 'The fastest way to reach us, and the channel our clients keep using long after they arrive.',
      label: 'Message us on WhatsApp',
    },
    emergency: {
      heading: 'Emergency relocation support',
      text: 'Deadline tomorrow, housing fallen through, appointment you cannot miss? Message us on WhatsApp with the word URGENT and Johanna gives it priority.',
    },
    details: {
      heading: 'Details',
    },
    personal: {
      heading: 'Your next chapter begins with a personal conversation',
      text: [
        'Every international move is unique, and exceptional guidance begins with understanding your individual circumstances, ambitions and expectations.',
        'Whether you require specialist immigration assistance, comprehensive relocation support or a bespoke VIP service, I welcome the opportunity to discuss your plans and explore how E & I can make your transition to the Netherlands as seamless as possible.',
      ],
      name: 'Johanna',
      role: 'CEO & Owner | Immigration & Relocation Consultant',
    },
    formCopy: {
      shared: {
        nationality: 'Nationality',
        costs: 'Who covers the relocation costs?',
        costsOptions: ['My employer', 'Myself or my family', 'Not sure yet'],
      },
      immigration: {
        heading: 'Immigration & relocation intake',
        text: 'Tell us your nationality and the route you have in mind. Not sure which visa fits? Say so, that assessment is exactly what we do.',
        service: 'Which service do you need?',
        serviceOptions: [
          'Highly skilled migrant visa',
          'EU Blue Card',
          'Orientation year visa',
          'Partner visa',
          'Family reunification',
          'Startup visa',
          'DAFT visa',
          'Business Schengen visa',
          'Residence permit',
          'Not sure yet',
        ],
        nationality: 'Nationality',
        currentLocation: 'Current country of residence',
        status: 'Current immigration status',
        statusOptions: [
          'Outside the EU, no Dutch permit yet',
          'Already in the Netherlands on a visa or permit',
          'EU or EEA citizen',
          'Other or not sure',
        ],
        timeline: 'When do you plan to move?',
        timelineOptions: ['As soon as possible', 'Within 3 months', '3 to 6 months', 'Exploring options'],
        message: 'Your situation',
        messagePlaceholder: 'For example: US citizen, offered a role in Rotterdam starting in March, partner and two children coming along.',
      },
      relocation: {
        heading: 'Relocation & housing intake',
        text: 'From a single service to a complete package. Tell us what your arrival should look like.',
        service: 'What do you need?',
        serviceOptions: [
          'Complete relocation package',
          'Housing search',
          'School search',
          'BSN and registrations',
          'Settling-in support',
          'Temporary housing',
          'Industrial region relocation',
          'Something else',
        ],
        movingFrom: 'Moving from',
        household: 'Who is relocating?',
        householdOptions: ['Just me', 'My partner and I', 'My family with children', 'Employees of my company', 'Other'],
        timeline: 'When do you arrive?',
        timelineOptions: ['As soon as possible', 'Within 3 months', '3 to 6 months', 'Exploring options'],
        message: 'Your move',
        messagePlaceholder: 'For example: family of four moving from Zürich in the summer, need housing near an international school.',
      },
      vip: {
        heading: 'VIP relocation inquiry',
        text: 'Discreet, fast and built around your schedule. Tell us the dates and we design the visit.',
        package: 'Which package interests you?',
        packageOptions: [
          'Couple VIP Package',
          'Family VIP Package',
          'Business VIP Package',
          'VIP Relocation Concierge',
          'Not sure yet',
        ],
        preferredContact: 'Preferred contact',
        preferredContactOptions: ['WhatsApp', 'Phone', 'Email'],
        arrival: 'Planned arrival',
        movingFrom: 'Moving from',
        message: 'Your relocation',
        messagePlaceholder: 'For example: relocating from Los Angeles in October, available for one preparation visit in September.',
      },
    },
  },

  privacy: {
    metaTitle: 'Privacy Policy | E & I Expat & Immigration Services',
    title: 'Privacy policy',
    intro: [
      'E & I: Expat, Relocation and Immigration Services The Netherlands processes personal data only to respond to your inquiry and to deliver relocation and immigration services you engage us for.',
    ],
    sections: [
      {
        heading: 'What we collect',
        paragraphs: [
          'When you contact us we receive the details you choose to share: your name, contact details and the description of your situation. For active clients we additionally process the documents required for applications, always with your knowledge.',
        ],
      },
      {
        heading: 'How we use it',
        paragraphs: [
          'Your data is used to answer you, to prepare and manage your relocation or immigration file, and for no other purpose. We do not sell data and we do not use it for advertising.',
        ],
      },
      {
        heading: 'Retention and your rights',
        paragraphs: [
          'Inquiry data is kept only as long as needed to serve you. You can request access, correction or deletion of your data at any time via the contact details below.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        paragraphs: [
          'With your consent we use Microsoft Clarity, an analytics service by Microsoft, to understand how visitors use this website (pages viewed, clicks, scrolling) so we can improve it. Clarity places first-party cookies (_clck, _clsk) for up to one year to recognise repeat visits; form fields are masked and we do not use this data for advertising. Without your consent Clarity sets no cookies. You can change your choice at any time by clearing this site\'s data in your browser. Microsoft processes this data under its privacy statement.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk. KvK 65768922.',
        ],
      },
    ],
  },

  notFound: {
    title: 'This page has moved on',
    text: 'The page you are looking for does not exist, or its address has changed. Let us guide you back.',
    label: 'Back to the homepage',
  },
};
