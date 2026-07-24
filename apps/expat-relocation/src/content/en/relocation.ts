import type { SectionContent } from '../types';

export const relocation: SectionContent = {
  title: 'Relocation Services Netherlands',
  metaTitle: 'Relocation Services Netherlands | E & I Expat Services',
  metaDescription:
    'Boutique relocation services in the Netherlands. One personal guide for your BSN, municipality registration, health insurance, schools and settling in, who goes with you to every appointment.',
  eyebrow: 'Relocation',
  intro: [
    'Moving countries is a thousand small tasks wearing the disguise of one big one. The BSN, the municipality, the insurance, the school, the bank, each with its own counter, its own forms and its own idea of a reasonable waiting time. Most agencies hand you a checklist. We are the only boutique expat agency in the Netherlands, and we do something different: one person learns your name, your family and your situation, and then simply takes care of it.',
    'That person does not manage your relocation from behind a desk. She books the appointments, prepares the paperwork, drives to the municipality with you and sits beside you at the counter. From the moment you land until the moment the Netherlands feels like home, you have someone here who already knows the answer to your next question.',
  ],
  image: '/images/relocation-family.jpg',
  imageAlt: 'A family arriving at their new home in the Netherlands',
  services: [
    {
      slug: 'bsn-registration-netherlands',
      menuLabel: 'BSN registration',
      title: 'BSN Registration Netherlands',
      metaTitle: 'BSN Registration Netherlands | E & I Expat Services',
      metaDescription:
        'Get your BSN quickly and correctly. We prepare your documents, book the appointment and accompany you to the municipality desk.',
      eyebrow: 'BSN',
      intro: [
        'The BSN, your Dutch citizen service number, is the key that unlocks everything else here: your salary, your health insurance, your bank account, even your phone contract. Until you have it, you are officially in limbo. Which is why it should be the very first thing handled after you arrive, and handled right the first time.',
        'We prepare the appointment, verify that your birth certificates and apostilles will be accepted, and Johanna comes with you to the desk in person. If the clerk raises a question about a foreign document, you have someone beside you who has heard that question a hundred times and knows the answer.',
      ],
      cardText: 'Your citizen service number arranged fast, with us beside you at the desk.',
      forWho: {
        title: 'Who this is for',
        items: [
          'New arrivals who need a BSN before their first salary can be paid',
          'Families registering several members, including children, in one visit',
          'Expats whose foreign documents need apostilles or sworn translations',
          'Anyone who tried to book an appointment and hit a wall of waiting times',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'Document check before you fly',
            text: 'We review your birth certificates, marriage certificate and legalizations in advance, so nothing is rejected at the counter.',
          },
          {
            title: 'Appointment strategy',
            text: 'We know which municipalities and expat desks have the shortest waits and book the earliest realistic slot for your situation.',
          },
          {
            title: 'Personal accompaniment',
            text: 'We attend the appointment with you, translate where needed and resolve questions on the spot.',
          },
          {
            title: 'After the appointment',
            text: 'We track the confirmation, explain your registration extract and make sure your BSN reaches your employer and insurer correctly.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Document review',
            text: 'Send us scans of your civil documents and we tell you exactly what needs an apostille or translation.',
          },
          {
            title: 'Appointment booked',
            text: 'We schedule your registration at the best available desk for your address and timeline.',
          },
          {
            title: 'Registration day',
            text: 'We go together, complete the registration and leave with everything confirmed.',
          },
        ],
      },
      note: 'A BSN is issued through registration in the Personal Records Database, either as a resident or, for short stays, as a non-resident via an RNI desk. We advise which route fits your situation during intake.',
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'How fast can I get a BSN after arriving?',
            a: 'With documents prepared in advance, often within days of arrival; the number is usually issued at or shortly after the appointment itself. The real delays come from missing apostilles and appointment backlogs, which is precisely what we eliminate.',
          },
          {
            q: 'Do I need a permanent address to get a BSN?',
            a: 'You need a registerable address, which can be a temporary one if the provider permits registration. If you do not have that yet, we look at the RNI route or arrange short-stay housing where registration is allowed.',
          },
          {
            q: 'Can my whole family be registered at once?',
            a: 'Yes, and it is worth doing. We book a family appointment, prepare every certificate in advance and make sure children are registered correctly, which matters later for school enrollment and healthcare.',
          },
        ],
      },
      cta: {
        title: 'Get your BSN without the runaround',
        text: 'Send us your arrival date and we will have the appointment, the paperwork and a seat beside you ready.',
        label: 'Arrange my BSN',
      },
      form: 'relocation',
      image: '/images/immigration-desk.jpg',
      imageAlt: 'A registration appointment at a Dutch municipality desk',
    },
    {
      slug: 'municipality-registration-netherlands',
      menuLabel: 'Municipality registration',
      title: 'Municipality Registration Netherlands',
      metaTitle: 'Municipality Registration Netherlands | E & I Expat Services',
      metaDescription:
        'Register with your Dutch municipality without stress. Document preparation, appointment booking and personal guidance through the gemeente process.',
      eyebrow: 'Gemeente',
      intro: [
        'Every resident of the Netherlands must be registered with their gemeente, the municipality, and that registration follows you everywhere: taxes, benefits, voting, parking permits, school places. Get it wrong, or let it lapse after a move, and small administrative errors quietly grow into real problems.',
        'We handle the whole relationship with your municipality. First registration when you arrive, re-registration when you move within the Netherlands, deregistration if you leave, and corrections when the records do not match reality. Years of working alongside embassies and consulates taught us how Dutch officialdom thinks, and we put that fluency to work at your local counter.',
      ],
      cardText: 'First registration, moves and corrections at the gemeente, all handled for you.',
      forWho: {
        title: 'Who this is for',
        items: [
          'Newcomers making their first registration in the Personal Records Database',
          'Expats moving between Dutch cities who must re-register',
          'Residents whose municipal records contain errors that keep causing trouble',
          'Departing expats who need a clean deregistration',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'The right desk, the right route',
            text: 'Municipalities differ more than you would expect. We determine where and how your case should be filed, including expat center options.',
          },
          {
            title: 'Complete document file',
            text: 'Proof of address, identity documents, tenancy permission and foreign certificates compiled and checked before the appointment.',
          },
          {
            title: 'Appointment and attendance',
            text: 'We book the slot, brief you on what will happen and come along to translate and troubleshoot.',
          },
          {
            title: 'Record verification',
            text: 'Afterwards we check your extract from the database, because a typo in your name or address today is a rejected mortgage tomorrow.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Situation check',
            text: 'Arriving, moving or correcting? We map your case and the documents your gemeente will ask for.',
          },
          {
            title: 'File and appointment',
            text: 'We assemble the file and secure the earliest workable appointment.',
          },
          {
            title: 'Registered and verified',
            text: 'We complete the registration together and confirm the database shows exactly what it should.',
          },
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'What if my landlord has not given permission to register?',
            a: 'You have the right to register where you actually live, and a landlord cannot lawfully forbid it. We approach the landlord first to resolve it amicably, and if needed we guide you through the municipality’s address investigation route.',
          },
          {
            q: 'I moved within the Netherlands. Do I really need to re-register?',
            a: 'Yes, within five days of moving, and it is not a formality. Your health insurer, tax office and employer all read from that record. We file the change online or at the desk and confirm it processed.',
          },
          {
            q: 'Do my children need to come to the appointment?',
            a: 'For a first registration, municipalities generally want to see every family member in person, children included. We plan one efficient family appointment so you are not returning three times.',
          },
        ],
      },
      cta: {
        title: 'Make the gemeente easy',
        text: 'Whatever your municipality needs from you, we have done it before. Tell us your situation and consider it handled.',
        label: 'Handle my registration',
      },
      form: 'relocation',
      image: '/images/immigration-desk.jpg',
      imageAlt: 'Paperwork being completed at a municipal service counter',
    },
    {
      slug: 'health-insurance-guidance-netherlands',
      menuLabel: 'Health insurance',
      title: 'Health Insurance Guidance Netherlands',
      metaTitle: 'Health Insurance Guidance Netherlands | E & I Expat Services',
      metaDescription:
        'Dutch health insurance explained and arranged. We help expats choose the right policy, register with a GP and avoid fines for late enrollment.',
      eyebrow: 'Healthcare',
      intro: [
        'Dutch health insurance is mandatory, excellent and genuinely confusing. You must take out a basic policy within four months of becoming insured here, the premiums and deductibles vary in ways that are hard to compare from outside, and missing the deadline brings fines and backdated premiums. Meanwhile every insurer’s website assumes you already understand the system.',
        'We explain it in one honest conversation: what the basic package always covers, when supplementary insurance is worth it for your family, and how the deductible really works. Then we help you enroll, register with a family doctor and understand what to do the first time you or your child is ill.',
      ],
      cardText: 'The right Dutch health policy chosen, enrolled and explained in plain English.',
      forWho: {
        title: 'Who this is for',
        items: [
          'New arrivals facing the four-month insurance deadline',
          'Families weighing supplementary cover for dental, physio or children’s needs',
          'Expats unsure whether their foreign or employer insurance still applies',
          'Anyone who received a letter from CAK and does not know why',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'System explained properly',
            text: 'Basic package, deductible, own contributions, healthcare allowance: the whole machine explained once, clearly, with your numbers.',
          },
          {
            title: 'Policy comparison and enrollment',
            text: 'We shortlist policies that fit your family and budget, explain the trade-offs honestly and walk you through enrollment.',
          },
          {
            title: 'GP and pharmacy registration',
            text: 'We find a huisarts accepting new patients near you, arrange your registration and explain how referrals to specialists work.',
          },
          {
            title: 'Allowance check',
            text: 'If your income qualifies for zorgtoeslag, the monthly healthcare allowance, we help you apply for it.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Coverage conversation',
            text: 'We assess your family, health needs and start date, and check what your employer already provides.',
          },
          {
            title: 'Choose and enroll',
            text: 'You pick from a clear shortlist and we complete the enrollment with your BSN.',
          },
          {
            title: 'Care network set up',
            text: 'GP, dentist and pharmacy registered, so your first sick day is an inconvenience, not a crisis.',
          },
        ],
      },
      note: 'Insurance takes effect retroactively from the date your obligation began, so premiums are owed from that date even if you enroll later. Enrolling promptly costs nothing extra and avoids fines.',
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'I have travel or international insurance. Is that enough?',
            a: 'Usually not. Once you live or work here and are covered by the Dutch system, the basic Dutch policy is legally required regardless of other coverage. We check your specific situation, including exceptions for certain postings and students.',
          },
          {
            q: 'Why do I need a GP before I am even sick?',
            a: 'The huisarts is the gateway to all Dutch healthcare; hospitals expect a referral. Practices near you can have closed patient lists, so registering early, while you are healthy, is the single best healthcare decision a newcomer makes.',
          },
          {
            q: 'What happens if a health question comes up outside office hours?',
            a: 'The Netherlands has an after-hours GP service, the huisartsenpost, for urgent cases. And our clients can always message us on the personal WhatsApp line at any hour; we have talked more than one worried parent through their first Dutch night-time fever.',
          },
        ],
      },
      cta: {
        title: 'Get insured before the deadline does its thing',
        text: 'One conversation and your Dutch healthcare is chosen, enrolled and ready to use.',
        label: 'Sort my insurance',
      },
      form: 'relocation',
      image: '/images/relocation-settling.jpg',
      imageAlt: 'A newcomer reviewing Dutch health insurance options with a guide',
    },
    {
      slug: 'school-search-netherlands',
      menuLabel: 'School search',
      title: 'School Search Netherlands',
      metaTitle: 'School Search Netherlands | E & I Expat Services',
      metaDescription:
        'Find the right Dutch, international or bilingual school for your children. School shortlists, visits and enrollment support for expat families.',
      eyebrow: 'Schools',
      intro: [
        'Ask relocating parents what keeps them awake and it is rarely the visa. It is the school. International or Dutch? Bilingual? How long are the waiting lists, and what happens to a nine-year-old who speaks no Dutch on her first Monday? These questions deserve better answers than a forum thread.',
        'We guide you through the real landscape: international schools, Dutch schools with newcomer classes, bilingual programs and the waiting-list realities of each. We shortlist schools that fit your child, arrange the visits and come along to them, and steer the enrollment paperwork through to a confirmed place.',
      ],
      cardText: 'The right school for your child, from shortlist to confirmed enrollment.',
      forWho: {
        title: 'Who this is for',
        items: [
          'Families choosing between international and Dutch education',
          'Parents of children who will arrive speaking no Dutch',
          'Expats whose posting length makes the school choice complicated',
          'Families relocating mid-school-year and worried about placement',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'Education landscape briefing',
            text: 'How the Dutch system works, what international schools cost, how newcomer classes bridge the language gap, and what fits your posting length.',
          },
          {
            title: 'Personal school shortlist',
            text: 'Schools selected for your child’s age, languages and needs, matched to where you will live, with honest notes on each.',
          },
          {
            title: 'Visits arranged and attended',
            text: 'We book the tours, prepare the questions worth asking and join you on the visits.',
          },
          {
            title: 'Enrollment to confirmation',
            text: 'Application forms, prior school records and waiting-list follow-up managed until your child has a confirmed place.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Family intake',
            text: 'We talk about your children, their languages, their needs and your plans in the Netherlands.',
          },
          {
            title: 'Shortlist and visit',
            text: 'You receive a focused shortlist and we tour the promising schools together.',
          },
          {
            title: 'Enroll and start',
            text: 'We complete the enrollment and help your child arrive at a school that expects them.',
          },
        ],
      },
      note: 'School choice and housing choice are one decision, not two; the address determines the options. If we are also running your housing search, we plan them together.',
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'Should we choose international or Dutch education?',
            a: 'For postings under about three years, international schools offer continuity. For families staying longer, Dutch schools with a newcomer program often integrate children faster and cost far less. We help you decide based on your plans, not a general rule.',
          },
          {
            q: 'My child does not speak Dutch. How do Dutch schools handle that?',
            a: 'Many regions have dedicated newcomer classes where children get intensive Dutch for around a year before joining regular classes. Placement depends on age and region, and we find the actual options near your home.',
          },
          {
            q: 'How bad are the waiting lists really?',
            a: 'It varies enormously by city and school. Popular international schools can have long lists while an equally strong school nearby has places. Applying early and to the right mix of schools is most of the battle, and that is what we manage.',
          },
        ],
      },
      cta: {
        title: 'Give your children a soft landing',
        text: 'Tell us about your kids and we will find the school where they will thrive, then get them enrolled in it.',
        label: 'Find our school',
      },
      form: 'relocation',
      image: '/images/relocation-family.jpg',
      imageAlt: 'Parents and children visiting a school in the Netherlands',
    },
    {
      slug: 'settling-in-services-netherlands',
      menuLabel: 'Settling-in services',
      title: 'Settling-in Services Netherlands',
      metaTitle: 'Settling-in Services Netherlands | E & I Expat Services',
      metaDescription:
        'Settling-in support for expats in the Netherlands: banking, utilities, phone, transport, neighborhood orientation and the hundred small things that make a house a life.',
      eyebrow: 'Settling in',
      intro: [
        'The paperwork ends and then the real questions begin. Which bank will open an account this week? Why are there three kinds of waste container? How does the GP system work, where do you buy a bike that will not be stolen by Friday, and what on earth is eigen risico? Settling in is a hundred small puzzles, and solving them alone takes months.',
        'We compress those months into weeks. Banking, utilities, internet, phone, transport cards, insurance basics and a proper orientation of your new neighborhood, arranged with you and explained as we go. This kind of hands-on, personal settling-in is exactly why our clients call us a concierge rather than an agency.',
      ],
      cardText: 'Banking, utilities, transport and neighborhood know-how, arranged in weeks not months.',
      forWho: {
        title: 'Who this is for',
        items: [
          'New arrivals who want their practical life running within the first weeks',
          'Busy professionals with no time to research Dutch providers',
          'Partners and families landing while the working spouse is already at the office',
          'Anyone who moved months ago and still feels half-arrived',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'Banking arranged',
            text: 'Help choosing and opening a Dutch bank account, plus setting up iDEAL and the payment apps daily life here runs on.',
          },
          {
            title: 'Home connected',
            text: 'Energy, water, internet and phone contracts compared, arranged and scheduled around your move-in date.',
          },
          {
            title: 'Getting around',
            text: 'OV public transport cards, bike buying advice, parking permits and, if you drive, guidance on your license and Dutch car ownership.',
          },
          {
            title: 'Neighborhood orientation',
            text: 'A personal tour of your area: the market, the good supermarket, the pharmacy, the sports clubs, the shortcuts locals use.',
          },
          {
            title: 'The little big things',
            text: 'Waste calendars, DigiD setup, liability insurance, childcare options: the small items nobody mentions until they go wrong.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Settling-in plan',
            text: 'We list what your household needs, in the order that unblocks the rest.',
          },
          {
            title: 'Arrange together',
            text: 'Over a handful of sessions we set up accounts, contracts and cards, explaining each so you stay in control.',
          },
          {
            title: 'Orientation day',
            text: 'We spend time in your neighborhood together until it starts feeling like yours.',
          },
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'Can I open a Dutch bank account before I have a BSN?',
            a: 'Some banks allow it and let you supply the BSN afterwards; policies change often. We know the current state of play and steer you to the fastest route so your salary has somewhere to land.',
          },
          {
            q: 'What is DigiD and do I really need it?',
            a: 'DigiD is your digital identity for the Dutch government: taxes, healthcare, allowances and municipal services all use it. You will need it constantly, and we set it up with you early.',
          },
          {
            q: 'We arrived months ago but never really settled. Is this still for you?',
            a: 'Absolutely, and it is more common than you think. We audit what is missing or set up wrongly, fix it, and finish the landing you never had time for.',
          },
        ],
      },
      cta: {
        title: 'Feel at home faster',
        text: 'Give us a few weeks and the Netherlands stops being a foreign country and starts being where you live.',
        label: 'Help me settle in',
      },
      form: 'relocation',
      image: '/images/relocation-settling.jpg',
      imageAlt: 'A newcomer getting oriented in their new Dutch neighborhood',
    },
    {
      slug: 'airport-pickup-for-expats-netherlands',
      menuLabel: 'Airport pickup',
      title: 'Airport Pickup for Expats Netherlands',
      metaTitle: 'Airport Pickup for Expats Netherlands | E & I Expat Services',
      metaDescription:
        'A warm welcome at Schiphol or Rotterdam airport: personal pickup, transfer to your new home and a first-day briefing so your relocation starts calmly.',
      eyebrow: 'Arrival',
      intro: [
        'Every relocation has a moment zero: the doors of the arrivals hall slide open and your new life begins with jet lag, luggage and a country you do not know yet. How that first hour goes colors the whole move. It should not involve dragging suitcases through train transfers or explaining an address to a taxi driver at midnight.',
        'We meet you in the hall, name sign and all, and drive you straight to your new front door. Along the way you get the first-day essentials: how the house works, where tomorrow’s groceries are, what happens this week. And because flights land when they land, our WhatsApp line is with you around the clock from the moment you take off.',
      ],
      cardText: 'Met at arrivals, driven home, and briefed for your first Dutch morning.',
      forWho: {
        title: 'Who this is for',
        items: [
          'Families landing with children, luggage and no energy for logistics',
          'First-time arrivals who want a familiar face in the arrivals hall',
          'Professionals landing late at night or on weekend flights',
          'Employers who want their new hire welcomed properly',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'Flight tracking',
            text: 'We monitor your flight, so a delay or an early landing changes nothing about your welcome.',
          },
          {
            title: 'Personal meet and greet',
            text: 'A familiar contact waiting in the arrivals hall at Schiphol, Rotterdam The Hague or Eindhoven, ready to help with luggage and children.',
          },
          {
            title: 'Direct transfer home',
            text: 'A comfortable ride to your new home or temporary apartment, with child seats arranged when needed.',
          },
          {
            title: 'First-day briefing',
            text: 'Keys, heating, wifi and appliances explained, a first-groceries plan, and a clear picture of your first week’s appointments.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Share your flight',
            text: 'Send your flight details and address; we confirm the plan and stay reachable while you travel.',
          },
          {
            title: 'Land and be met',
            text: 'You walk out of arrivals and your relocation is already standing there waiting.',
          },
          {
            title: 'Arrive home',
            text: 'You go to sleep in a working home, knowing exactly what tomorrow looks like.',
          },
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'What if my flight lands at 2 a.m.?',
            a: 'Then we are in the arrivals hall at 2 a.m. Arrivals do not keep office hours and neither do we; that promise is the heart of how we work.',
          },
          {
            q: 'Can you handle a family with a lot of luggage and a pet?',
            a: 'Yes. Tell us the headcount, the suitcase count and the crate size in advance and we arrange a vehicle that swallows it all, pet included.',
          },
          {
            q: 'Is the pickup only for clients on a full relocation package?',
            a: 'It is bookable on its own, though most clients combine it with settling-in support so the first week continues as smoothly as the first hour. Pricing for your situation is confirmed during intake.',
          },
        ],
      },
      cta: {
        title: 'Start your new life met, not lost',
        text: 'Send us your flight number and the first face you see in the Netherlands will be a friendly one.',
        label: 'Book my arrival',
      },
      form: 'relocation',
      image: '/images/relocation-arrival.jpg',
      imageAlt: 'A warm welcome at the airport arrivals hall',
    },
    {
      slug: 'family-relocation-netherlands',
      menuLabel: 'Family relocation',
      title: 'Family Relocation Netherlands',
      metaTitle: 'Family Relocation Netherlands | E & I Expat Services',
      metaDescription:
        'Relocate your whole family to the Netherlands with one personal guide: housing, schools, registrations, healthcare and a soft landing for every family member.',
      eyebrow: 'Families',
      intro: [
        'Relocating alone is a project. Relocating a family is five projects running at once: a home that fits everyone, schools with actual places, registrations for every passport in the household, healthcare for the baby and the teenager, and a partner whose career and social life deserve more than an afterthought. Drop one thread and the whole move frays.',
        'We hold all the threads. One guide plans the entire family move as a single timeline, sequences the appointments so nothing blocks anything else, and pays attention to the human side: how the children land, how the trailing partner builds a life, how home starts to feel like home. Our reputation for this was built in the embassy world, where family postings are the norm and failure is not an option.',
      ],
      cardText: 'One timeline, one guide, and a soft landing for every member of the family.',
      forWho: {
        title: 'Who this is for',
        items: [
          'Families moving to the Netherlands for a new position or posting',
          'Parents juggling school deadlines against housing deadlines',
          'Households with mixed nationalities and mixed paperwork',
          'Trailing partners who want their own landing plan, not a leftover one',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'One family master plan',
            text: 'Housing, schools, registrations, insurance and arrival sequenced into a single timeline with the dependencies handled in the right order.',
          },
          {
            title: 'Home and school in tandem',
            text: 'We run the housing search and school search as one decision, so you never win a house and lose the school place.',
          },
          {
            title: 'Registrations for everyone',
            text: 'BSN and municipal registration for every family member, with children’s certificates and translations prepared in advance.',
          },
          {
            title: 'Healthcare for the household',
            text: 'Insurance for the family, a GP taking new patients, and pediatric and dental care mapped before anyone needs it.',
          },
          {
            title: 'Partner and family integration',
            text: 'Neighborhood orientation, clubs, childcare, language options and the introductions that turn a new city into a community.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Family intake',
            text: 'We meet the whole family, on video or in person, and map every member’s needs into one plan.',
          },
          {
            title: 'Prepare and secure',
            text: 'Before you fly, the home track, school track and paperwork track are already moving.',
          },
          {
            title: 'Land together',
            text: 'Arrival, registrations and school starts happen on schedule, with us alongside at each step.',
          },
          {
            title: 'Settle and check in',
            text: 'We stay involved through the first months, because the questions do not stop at the front door.',
          },
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'How far in advance should a family start planning?',
            a: 'Three to six months before the move is comfortable, mainly because school places and family-sized rentals are the scarcest pieces. Less time than that is workable too; it simply means we prioritize harder from day one.',
          },
          {
            q: 'Can you support the visa side of a family move as well?',
            a: 'Yes. Family reunification and partner visas are handled through our immigration services, and coordinating the two tracks under one roof is exactly what keeps a family move coherent.',
          },
          {
            q: 'What about our children who are not school-age yet?',
            a: 'Daycare in the Netherlands often has longer waiting lists than schools do, so we treat childcare with the same urgency: shortlists, applications and an explanation of the childcare allowance you may be entitled to.',
          },
        ],
      },
      cta: {
        title: 'Move the whole family with one call',
        text: 'Tell us who is coming and when, and we will build the plan that gets everyone landed, schooled and smiling.',
        label: 'Plan our family move',
      },
      form: 'relocation',
      image: '/images/vip-family.jpg',
      imageAlt: 'A family settling happily into life in the Netherlands',
    },
    {
      slug: 'relocation-services-rotterdam',
      menuLabel: 'Relocation Rotterdam',
      title: 'Relocation Services Rotterdam',
      metaTitle: 'Relocation Services Rotterdam | E & I Expat Services',
      metaDescription:
        'Full relocation support in Rotterdam from a local specialist: housing, registrations, schools and settling in, for the city and the port region.',
      eyebrow: 'Rotterdam',
      intro: [
        'Rotterdam rewards people who arrive with a local on their side. It is a working city, direct and fast-moving, with a housing market that has tightened sharply and a port economy that pulls in professionals from every continent. National relocation checklists only get you so far here; what matters is knowing this city’s desks, districts and rhythms.',
        'This is our home turf. We are the specialist for Rotterdam and its industrial corridor, from the city center out through Europoort to the Maasvlakte, and everything we arrange, housing, registration at the Rotterdam gemeente, schools, healthcare, is grounded in that local depth. You get the full relocation service, tuned precisely to this city.',
      ],
      cardText: 'The full relocation service, tuned to Rotterdam by people who live it.',
      forWho: {
        title: 'Who this is for',
        items: [
          'Professionals starting at Rotterdam companies, the port or the industrial cluster',
          'Families relocating to Rotterdam and its surrounding towns',
          'International hires whose employers want a smooth, fast landing',
          'Expats already in the Netherlands who are moving to Rotterdam',
        ],
      },
      included: {
        title: 'What is included',
        blocks: [
          {
            title: 'Rotterdam housing support',
            text: 'A search built on neighborhood-level knowledge and local agent relationships, with viewings and contract review included.',
          },
          {
            title: 'Registrations done locally',
            text: 'BSN and municipal registration through the Rotterdam desks we work with weekly, prepared so one visit is enough.',
          },
          {
            title: 'Schools and childcare in the region',
            text: 'International and Dutch school options across Rotterdam and the suburbs, matched to your home and commute.',
          },
          {
            title: 'Settling into the city',
            text: 'Banking, transport, healthcare and a personal orientation of your district, from the markets to the Maas.',
          },
        ],
      },
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Rotterdam intake',
            text: 'We map your work location, family and timeline onto the city we know street by street.',
          },
          {
            title: 'Everything in motion',
            text: 'Housing, registrations and schools proceed in parallel, coordinated by one person.',
          },
          {
            title: 'Landed and living',
            text: 'You are registered, housed and oriented, with a local number to message whenever a question comes up.',
          },
        ],
      },
      faq: {
        title: 'Frequently asked questions',
        items: [
          {
            q: 'Do you only cover Rotterdam itself?',
            a: 'We cover the whole region: Schiedam, Vlaardingen, Capelle, Barendrecht, the Hoeksche Waard and the port corridor out to Hoek van Holland. Often the best home for your budget is one town over, and we will tell you so.',
          },
          {
            q: 'My employer is in the port area. Where should I live?',
            a: 'It depends on your shift pattern and tolerance for the A15. Plenty of port professionals live centrally and commute out against traffic; others prefer Voorne-Putten or Westland for proximity. We model your actual commute before you choose.',
          },
          {
            q: 'Can you work directly with my employer or HR department?',
            a: 'Gladly. We regularly coordinate with HR on start dates, contracts and paperwork, and can act as the single point of contact so the employee simply arrives and everything works.',
          },
        ],
      },
      cta: {
        title: 'Arrive in Rotterdam like a local',
        text: 'One conversation with someone who knows this city, and your move stops being a puzzle.',
        label: 'Start my Rotterdam move',
      },
      form: 'relocation',
      image: '/images/rotterdam.jpg',
      imageAlt: 'Rotterdam city center with modern architecture along the Maas',
    },
  ],
  crossLinks: [
    {
      label: 'Europoort relocation',
      path: '/industrial-expat-services/europoort-relocation-services-netherlands',
      text: 'Relocating for work in the Europoort industrial area? See our dedicated port-region service.',
    },
  ],
  cta: {
    title: 'One guide for your entire relocation',
    text: 'From your BSN to your children’s school, one person who knows your name takes care of it all, and comes with you every step.',
    label: 'Start my relocation',
  },
};
