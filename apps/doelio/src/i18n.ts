export type Lang = 'nl' | 'en';

export type Capability = {
  id: string;
  title: string;
  body: string;
  points: string[];
};

export type Step = {
  no: string;
  title: string;
  body: string;
};

export type Member = {
  name: string;
  role: string;
  body: string;
};

export type SiteContent = {
  nav: { links: { href: string; label: string }[]; cta: string };
  hero: {
    label: string;
    titleA: string;
    titleB: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ecosystemLabel: string;
  };
  capabilities: { label: string; title: string; intro: string; items: Capability[] };
  approach: { label: string; title: string; intro: string; steps: Step[] };
  team: { label: string; title: string; intro: string; members: Member[] };
  cta: { title: string; body: string; button: string };
  footer: { tagline: string; rights: string; contact: string; legal: string };
};

export const content: Record<Lang, SiteContent> = {
  nl: {
    nav: {
      links: [
        { href: '#diensten', label: 'Diensten' },
        { href: '#aanpak', label: 'Aanpak' },
        { href: '#team', label: 'Team' },
      ],
      cta: 'Plan een gesprek',
    },
    hero: {
      label: 'AI-consultancy uit Nederland',
      titleA: 'AI met',
      titleB: 'een doel.',
      body: 'De beste tools, minder handwerk, maximale efficiëntie. Daar zorgen wij voor.',
      ctaPrimary: 'Plan een gesprek',
      ctaSecondary: 'Bekijk wat we doen',
      ecosystemLabel: 'Werkt met',
    },
    capabilities: {
      label: 'Wat we doen',
      title: 'Vier plekken waar AI direct verschil maakt.',
      intro: 'Geen losse experimenten. We zoeken waar tijd en geld weglekken en zetten daar AI in die blijft werken.',
      items: [
        {
          id: 'stack',
          title: 'De juiste AI-stack',
          body: 'Claude, ChatGPT, veilige cloud via Google en Microsoft, on-premise of een model op maat. We kiezen de combinatie die bij uw werk en uw data past.',
          points: ['Publieke en veilige cloud', 'On-premise opzet', 'Modellen op maat'],
        },
        {
          id: 'time',
          title: 'Minder handwerk',
          body: 'Workflows die offertes en advertenties opstellen, lead generation van begin tot eind, en voice- en supportagents die meedraaien.',
          points: ['Offertes en advertenties', 'Lead generation', 'Voice- en supportagents'],
        },
        {
          id: 'cost',
          title: 'Lagere toolkosten',
          body: 'Eigen interne tools die dure abonnementen vervangen. U houdt het in eigen hand en kunt het zelf beheren.',
          points: [],
        },
        {
          id: 'geo',
          title: 'Vindbaar in het AI-tijdperk',
          body: 'GEO en SEO afgestemd op AI, zodat uw bedrijf naar voren komt wanneer mensen het aan AI vragen.',
          points: [],
        },
      ],
    },
    approach: {
      label: 'Aanpak',
      title: 'Van gesprek naar iets dat draait.',
      intro: 'Drie stappen. Helder, en zonder verrassingen achteraf.',
      steps: [
        { no: '01', title: 'Gesprek', body: 'We luisteren naar waar tijd en geld weglekken. Geen verkooppraatje.' },
        { no: '02', title: 'Plan', body: 'U krijgt een helder plan: wat we doen, waarom, en wat het oplevert.' },
        { no: '03', title: 'Bouwen', body: 'We bouwen het en zetten het live. Daarna kunt u het zelf beheren.' },
      ],
    },
    team: {
      label: 'Team',
      title: 'Twee mensen, korte lijnen.',
      intro: 'U praat met de mensen die het ook echt bouwen.',
      members: [
        { name: 'Armando', role: 'Uitvoering', body: 'Vertaalt techniek naar resultaat voor uw bedrijf en houdt de vaart erin.' },
        { name: 'Alfred', role: 'Techniek', body: 'Bouwt de modellen, workflows en tools die het werk doen.' },
      ],
    },
    cta: {
      title: 'Klaar om te beginnen?',
      body: 'Stuur ons een bericht via WhatsApp. We denken vrijblijvend met u mee.',
      button: 'Start een gesprek',
    },
    footer: {
      tagline: 'AI met een doel.',
      rights: 'Alle rechten voorbehouden.',
      contact: 'Contact',
      legal: 'Handelsnaam van AW Investments B.V. · KVK 66842883 · Rotterdam',
    },
  },

  en: {
    nav: {
      links: [
        { href: '#diensten', label: 'Services' },
        { href: '#aanpak', label: 'Approach' },
        { href: '#team', label: 'Team' },
      ],
      cta: 'Book a call',
    },
    hero: {
      label: 'AI consultancy from the Netherlands',
      titleA: 'AI with',
      titleB: 'a purpose.',
      body: 'We pick the right tools, automate the busywork and keep you visible now that people ask AI. Concrete, and built to fit.',
      ctaPrimary: 'Book a call',
      ctaSecondary: 'See what we do',
      ecosystemLabel: 'Works with',
    },
    capabilities: {
      label: 'What we do',
      title: 'Four places where AI makes an immediate difference.',
      intro: 'No scattered experiments. We find where time and money leak and put AI there that keeps working.',
      items: [
        {
          id: 'stack',
          title: 'The right AI stack',
          body: 'Claude, ChatGPT, secure cloud via Google and Microsoft, on-premise or a tailored model. We pick the mix that fits your work and your data.',
          points: ['Public and secure cloud', 'On-premise setup', 'Tailored models'],
        },
        {
          id: 'time',
          title: 'Less busywork',
          body: 'Workflows that draft quotes and ads, end-to-end lead generation, and voice and support agents that pull their weight.',
          points: ['Quotes and ads', 'Lead generation', 'Voice and support agents'],
        },
        {
          id: 'cost',
          title: 'Lower tool costs',
          body: 'Internal tools that replace expensive subscriptions. You stay in control and can maintain them yourself.',
          points: [],
        },
        {
          id: 'geo',
          title: 'Visible in the age of AI',
          body: 'GEO and SEO tuned for AI, so your company shows up when people ask AI instead of searching.',
          points: [],
        },
      ],
    },
    approach: {
      label: 'Approach',
      title: 'From a conversation to something that runs.',
      intro: 'Three steps. Clear, with no surprises afterwards.',
      steps: [
        { no: '01', title: 'Talk', body: 'We listen for where time and money leak. No sales pitch.' },
        { no: '02', title: 'Plan', body: 'You get a clear plan: what we do, why, and what it returns.' },
        { no: '03', title: 'Build', body: 'We build it and ship it live. After that you can maintain it yourself.' },
      ],
    },
    team: {
      label: 'Team',
      title: 'Two people, short lines.',
      intro: 'You talk to the people who actually build it.',
      members: [
        { name: 'Armando', role: 'Execution', body: 'Turns the tech into results for your business and keeps things moving.' },
        { name: 'Alfred', role: 'Technical', body: 'Builds the models, workflows and tools that do the work.' },
      ],
    },
    cta: {
      title: 'Ready to start?',
      body: 'Send us a message on WhatsApp. We will think along with you, no strings attached.',
      button: 'Start a conversation',
    },
    footer: {
      tagline: 'AI with a purpose.',
      rights: 'All rights reserved.',
      contact: 'Contact',
      legal: 'Trade name of AW Investments B.V. · KVK 66842883 · Rotterdam',
    },
  },
};
