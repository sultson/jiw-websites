import type { CoreContent } from '../types';

export const core: CoreContent = {
  ui: {
    skipToContent: 'Saltar al contenido',
    nav: {
      home: 'Inicio',
      immigration: 'Inmigración',
      housing: 'Vivienda',
      relocation: 'Reubicación',
      business: 'Crear una empresa',
      vip: 'Servicios VIP',
      guides: 'Guías',
      about: 'Sobre nosotros',
      contact: 'Contacto',
    },
    cta: {
      whatsapp: 'WhatsApp',
      whatsappLong: 'Escríbanos por WhatsApp',
      consultation: 'Reserve una consulta de reubicación',
      startRelocation: 'Comience su reubicación',
      readMore: 'Leer más',
      allServices: 'Todos los servicios',
      backTo: 'Volver a',
      send: 'Enviar consulta',
      sending: 'Enviando…',
      explore: 'Explorar',
    },
    langBanner: {
      prompt: '¿Prefiere leer este sitio en {lang}?',
      switch: 'Cambiar',
      dismiss: 'No, gracias',
    },
    form: {
      firstName: 'Nombre',
      lastName: 'Apellidos',
      email: 'Correo electrónico',
      phone: 'Teléfono / WhatsApp',
      optional: 'opcional',
      successTitle: 'Gracias, su consulta ha sido enviada',
      successBody:
        'Johanna revisará personalmente su situación y le responderá en el plazo de un día laborable, normalmente mucho antes. Para cualquier urgencia, escríbanos por WhatsApp.',
      errorTitle: 'Algo ha salido mal',
      errorBody: 'No se pudo enviar su consulta. Inténtelo de nuevo o escríbanos por WhatsApp.',
      consent: 'Al enviar este formulario acepta nuestra política de privacidad.',
    },
    footer: {
      tagline: 'Servicios boutique de reubicación e inmigración para expatriados que se mudan a los Países Bajos.',
      services: 'Servicios',
      company: 'Empresa',
      contactHeading: 'Contacto',
      legalHeading: 'Legal',
      kvkLabel: 'KvK',
      rightsReserved: 'Todos los derechos reservados.',
      builtBy: 'Sitio web de',
    },
    misc: {
      from: 'desde',
      whatsIncluded: 'Qué incluye',
      otherServices: 'Otros servicios',
      relatedGuides: 'Guías relacionadas',
    },
  },

  home: {
    metaTitle: 'Servicios Boutique de Reubicación e Inmigración en los Países Bajos | E & I',
    metaDescription:
      'Acompañamiento personal de reubicación e inmigración para expatriados, familias y emprendedores que se mudan a Rotterdam, Europoort y la región industrial neerlandesa. Visados, vivienda, BSN, colegios y paquetes VIP.',
    hero: {
      h1: 'Servicios Boutique de Reubicación e Inmigración en los Países Bajos',
      sub: 'Acompañamiento personal de reubicación para expatriados, familias, emprendedores y profesionales internacionales que se mudan a Rotterdam, Europoort y la región industrial neerlandesa.',
      ctaPrimary: 'Reserve una consulta de reubicación',
      ctaWhatsapp: 'Escríbanos por WhatsApp',
      ctaSecondary: 'Comience su reubicación',
    },
    paths: {
      heading: '¿Cómo podemos ayudarle a llegar?',
      sub: 'Tres caminos de entrada. Una persona que conoce su nombre desde el primer mensaje hasta el día en que se siente en casa.',
      items: [
        {
          key: 'immigration',
          title: 'Servicios de inmigración',
          text: 'Visados y permisos para profesionales, parejas, familias y fundadores. Preparados con precisión y guiados personalmente, desde la evaluación hasta la aprobación.',
          label: 'Explorar inmigración',
          path: '/immigration',
          image: '/images/path-immigration.jpg',
          imageAlt: 'Asesora guiando a un cliente entre documentos de residencia',
        },
        {
          key: 'relocation',
          title: 'Reubicación y vivienda',
          text: 'Paquetes completos de reubicación o servicios contratados por separado: búsqueda de vivienda, colegios, BSN, seguros y todo lo que hay entre medias.',
          label: 'Explorar reubicación',
          path: '/relocation',
          image: '/images/path-relocation.jpg',
          imageAlt: 'Familia llegando a una casa junto a un canal neerlandés',
        },
        {
          key: 'vip',
          title: 'Reubicación VIP',
          text: 'Para artistas, deportistas, ejecutivos y visitas de fin de semana. Toda su mudanza orquestada en torno a una sola visita, con cada puerta ya abierta.',
          label: 'Explorar servicios VIP',
          path: '/vip-services',
          image: '/images/path-vip.jpg',
          imageAlt: 'Chófer abriendo la puerta de un coche frente al perfil urbano de Rotterdam',
        },
      ],
    },
    mostRequested: {
      heading: 'Los servicios más solicitados',
      sub: 'Las ocho cosas que los expatriados nos piden primero.',
      items: [
        { label: 'Visado de migrante altamente cualificado', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Asistencia en la búsqueda de vivienda', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Visado de pareja en los Países Bajos', path: '/immigration/partner-visa-netherlands' },
        { label: 'Registro del BSN', path: '/relocation/bsn-registration-netherlands' },
        { label: 'Visado startup en los Países Bajos', path: '/immigration/startup-visa-netherlands' },
        { label: 'Búsqueda de colegio', path: '/relocation/school-search-netherlands' },
        { label: 'Paquete de reubicación completo', path: '/vip-services' },
        { label: 'Servicios de reubicación en Rotterdam', path: '/relocation/relocation-services-rotterdam' },
      ],
    },
    vipBlock: {
      eyebrow: 'Servicios de reubicación VIP',
      heading: 'Llegue como está acostumbrado a llegar',
      text: [
        'Algunos clientes no pueden dedicar seis semanas al papeleo. Vienen un fin de semana, firman, se registran y vuelven a volar mientras nosotros terminamos el resto. Nuestros paquetes VIP comprimen una reubicación entera en una agenda construida en torno a usted: citas alineadas en una sola visita, viviendas preseleccionadas antes de aterrizar, un coche esperando en Schiphol.',
        'Parejas, familias y empresas tienen cada una su propio paquete, y el nivel concierge se diseña a la medida de lo que su vida requiera.',
      ],
      label: 'Descubra la reubicación VIP',
    },
    immigrationBlock: {
      eyebrow: 'Inmigración para expatriados',
      heading: 'El permiso adecuado, preparado de la forma adecuada',
      text: [
        'La inmigración neerlandesa premia la preparación. Evaluamos qué vía encaja realmente con su situación, preparamos la solicitud tal como el IND quiere verla y le acompañamos a las citas que importan.',
      ],
      label: 'Todos los servicios de inmigración',
      links: [
        { label: 'Migrante altamente cualificado', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Tarjeta Azul UE', path: '/immigration/eu-blue-card-netherlands' },
        { label: 'Visado de pareja', path: '/immigration/partner-visa-netherlands' },
        { label: 'Visado startup', path: '/immigration/startup-visa-netherlands' },
        { label: 'Visado DAFT', path: '/immigration/daft-visa-netherlands' },
        { label: 'Permisos de residencia', path: '/immigration/residence-permit-netherlands' },
      ],
    },
    housingBlock: {
      eyebrow: 'Vivienda e instalación',
      heading: 'Un hogar, no solo una dirección',
      text: [
        'El mercado de alquiler neerlandés se mueve en días, no en semanas. Buscamos, asistimos a las visitas con usted o por usted, revisamos cada cláusula del contrato antes de que firme y seguimos siendo el punto de contacto con su casero mucho después de que las llaves sean suyas.',
      ],
      label: 'Todos los servicios de vivienda',
      links: [
        { label: 'Búsqueda de vivienda', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Vivienda para expatriados en Rotterdam', path: '/housing/housing-for-expats-rotterdam' },
        { label: 'Acompañamiento en visitas', path: '/housing/viewing-assistance-netherlands' },
        { label: 'Vivienda temporal', path: '/housing/temporary-housing-for-expats-netherlands' },
      ],
    },
    businessBlock: {
      eyebrow: 'Crear una empresa',
      heading: 'Funde su empresa donde atraca el mundo',
      text: [
        'Visado startup, tratado DAFT, registro en la KvK, una dirección, un hogar, un colegio para sus hijos. La mayoría de las firmas se ocupa de una de esas cosas. Nosotros nos ocupamos de la secuencia, porque un fundador no se muda por etapas, un fundador muda una vida.',
      ],
      label: 'Servicios para empresas',
    },
    regionBlock: {
      eyebrow: 'Especialistas en Rotterdam y Europoort',
      heading: 'La región que conocemos calle por calle',
      text: [
        'El puerto más grande de Europa no aparece en los folletos de reubicación, y sin embargo decenas de miles de profesionales internacionales construyen allí su carrera. Somos la única agencia boutique especializada en Rotterdam, Europoort y la Maasvlakte, desde el ático en el Wilhelminapier hasta la casa familiar a veinte minutos de las terminales.',
      ],
      label: 'Servicios para expatriados del sector industrial',
      areas: [
        { title: 'Rotterdam', text: 'Vida con vistas al skyline, colegios internacionales y la ciudad que más rápido cambia de los Países Bajos.' },
        { title: 'Europoort y Maasvlakte', text: 'Reubicación práctica para profesionales del puerto, el offshore y las refinerías, y para sus familias.' },
        { title: 'La región industrial', text: 'Localidades tranquilas como Brielle y Rozenburg, a minutos de las terminales y a un mundo de distancia de ellas.' },
      ],
    },
    whyBoutique: {
      eyebrow: 'Por qué boutique',
      heading: 'Una agencia. Una persona. Su nombre.',
      text: [
        'Las grandes firmas de reubicación le asignan un número de expediente. Una agencia boutique le asigna una persona. Johanna construyó su reputación en el mundo de las embajadas, donde la discreción y la precisión no son cualidades, son la descripción del puesto.',
      ],
      points: [
        {
          title: 'Le acompañamos',
          text: 'Al ayuntamiento, al IND, al banco y a las visitas de vivienda. Nunca le entregamos una lista de tareas deseándole buena suerte.',
        },
        {
          title: '24/7, personalmente',
          text: 'Una línea de WhatsApp atendida por la persona que gestiona su expediente. De día o de noche, en la primera semana o en el primer año.',
        },
        {
          title: 'La única en su género',
          text: 'Los Países Bajos tienen firmas corporativas de movilidad y ventanillas de visados. Tienen exactamente un concierge boutique para expatriados.',
        },
        {
          title: 'Paquetes construidos en torno a vidas',
          text: 'Pareja, familia, empresa o concierge integral. Cada paquete cubre la llegada completa, no una parte de ella.',
        },
      ],
      stats: [
        { value: '1200+', label: 'Expatriados y familias acompañados' },
        { value: '98%', label: 'Índice de satisfacción de clientes' },
        { value: '24/7', label: 'Asistencia personal por WhatsApp' },
      ],
    },
    reviews: {
      eyebrow: 'Historias de clientes',
      heading: 'Llegadas de las que estamos orgullosos',
      sub: 'Clientes reales, rutas reales hacia los Países Bajos.',
      items: [
        {
          quote: 'Gracias a E & I, nuestra reagrupación familiar fue un proceso sin estrés. Todo estuvo perfectamente organizado.',
          name: 'Anna',
          route: 'De Rusia a los Países Bajos',
          tags: ['Reubicación', 'Visado', 'Permiso de trabajo', 'Apoyo con la vivienda', 'Familia'],
        },
        {
          quote: 'Johanna estuvo a nuestro lado 24/7 durante nuestros primeros días. ¡Un servicio verdaderamente único!',
          name: 'Chinedu',
          route: 'De Nigeria a los Países Bajos',
          tags: ['Reubicación', 'Visado', 'Empresa', 'Startup', 'Integración'],
        },
      ],
    },
    whatsappCta: {
      heading: 'Un mensaje. Nosotros nos encargamos del resto.',
      text: 'Díganos dónde está y dónde necesita estar. Hablará con Johanna, no con un chatbot.',
      label: 'Escríbanos por WhatsApp',
    },
    contactBlock: {
      eyebrow: 'Inicie la conversación',
      heading: 'Cuéntenos sobre su mudanza',
      text: 'Unas pocas líneas bastan. Respondemos en el plazo de un día laborable.',
    },
  },

  about: {
    metaTitle: 'Sobre E & I | Agencia Boutique de Expatriados e Inmigración en los Países Bajos',
    metaDescription:
      'E & I es la única agencia boutique de reubicación e inmigración para expatriados en los Países Bajos. Acompañamiento personal de Johanna, del visado a la vivienda y hasta el día en que se sienta en casa.',
    eyebrow: 'Sobre E & I',
    title: 'La boutique detrás de mil llegadas',
    intro: [
      'E & I: Expat, Relocation and Immigration Services The Netherlands nació de una observación sencilla desde dentro del mundo de las embajadas: las personas que mejor cambian de país son las que van acompañadas personalmente. No gestionadas como expedientes. Acompañadas.',
      'Hoy Johanna y su red guían hacia los Países Bajos a profesionales, parejas, familias y fundadores, con una especialización que nadie más reivindica: Rotterdam, Europoort y la región industrial en torno al puerto más grande de Europa.',
    ],
    image: '/images/about-Johanna.jpg',
    imageAlt: 'Johanna, fundadora de E & I, en su oficina',
    approach: {
      heading: 'Nuestro enfoque personal de reubicación',
      text: [
        'Cada cliente tiene un único punto de contacto que conoce el expediente completo. Cuando el ayuntamiento le necesita en persona, estamos en la silla de al lado. Cuando llama un casero, respondemos en neerlandés. Cuando algo ocurre a las once de la noche en su primera semana, la línea de WhatsApp es la misma persona que le recogió en el aeropuerto.',
        'Esa forma de trabajar no escala a miles de clientes al año. Ese es precisamente el punto.',
      ],
    },
    boutique: {
      heading: 'Por qué trabajar con una agencia boutique',
      text: [
        'Las firmas corporativas de movilidad están construidas para el volumen: portales, tickets, niveles de servicio. Una boutique está construida para resultados. Usted obtiene el criterio de alguien que ha acompañado a cientos de clientes ante el IND, la rapidez de un equipo que conoce cada ventanilla de la región y la discreción que exige una reputación forjada entre diplomáticos.',
      ],
      points: [
        { title: 'Raíces en el mundo de las embajadas', text: 'Precisión y discreción aprendidas donde los errores no son una opción.' },
        { title: 'Una región que nadie más atiende', text: 'Rotterdam, Europoort y la Maasvlakte, conocidas calle por calle.' },
        { title: 'Inmigración y reubicación en una sola mano', text: 'El permiso, el hogar y la vida alrededor, secuenciados por un solo equipo.' },
      ],
    },
    families: {
      heading: 'Apoyo para expatriados y familias',
      text: [
        'La mitad de una reubicación exitosa no tiene nada que ver con el papeleo. Colegios que encajan con sus hijos, un barrio que encaja con sus tardes, un médico, un gimnasio, una ruta al trabajo. Nuestro apoyo de instalación los trata con la misma seriedad que el visado, porque eso es lo que decide si una mudanza tiene éxito.',
      ],
    },
    reviews: {
      heading: 'Reseñas y experiencias de clientes',
      sub: 'Lo que dicen los clientes sobre llegar con E & I.',
    },
    cta: {
      title: 'Conózcanos antes de decidir',
      text: 'Una consulta no cuesta nada y le dice exactamente dónde está usted.',
      label: 'Reserve una consulta de reubicación',
    },
  },

  contact: {
    metaTitle: 'Contacto E & I | Apoyo de Reubicación e Inmigración en los Países Bajos',
    metaDescription:
      'Programe una consulta de reubicación, escríbanos por WhatsApp o envíe una consulta de inmigración, reubicación o VIP. Respuesta personal en el plazo de un día laborable.',
    eyebrow: 'Contacto',
    title: 'Comience su reubicación',
    intro: [
      'Elija el camino que encaja con su situación y cuéntenos unas líneas. Su consulta llega directamente a Johanna y recibirá una respuesta personal en el plazo de un día laborable.',
    ],
    tabs: [
      {
        key: 'immigration',
        label: 'Inmigración',
        text: 'Visados, permisos y solicitudes ante el IND.',
      },
      {
        key: 'relocation',
        label: 'Reubicación y vivienda',
        text: 'Paquetes, vivienda, colegios e instalación.',
      },
      {
        key: 'vip',
        label: 'VIP',
        text: 'Reubicaciones concierge y visitas relámpago.',
      },
    ],
    whatsapp: {
      heading: 'Asistencia de reubicación por WhatsApp',
      text: 'La forma más rápida de contactarnos, y el canal que nuestros clientes siguen usando mucho después de llegar.',
      label: 'Escríbanos por WhatsApp',
    },
    emergency: {
      heading: 'Asistencia de reubicación urgente',
      text: '¿Un plazo que vence mañana, una vivienda que se cae, una cita que no puede perder? Escríbanos por WhatsApp con la palabra URGENTE y respondemos de inmediato, de día o de noche.',
    },
    details: {
      heading: 'Datos de contacto',
    },
    formCopy: {
      immigration: {
        heading: 'Consulta de inmigración y reubicación',
        text: 'Indíquenos su nacionalidad y la vía que tiene en mente. ¿No sabe qué visado encaja? Dígalo, esa evaluación es exactamente lo que hacemos.',
        service: '¿Qué servicio necesita?',
        serviceOptions: [
          'Visado de migrante altamente cualificado',
          'Tarjeta Azul UE',
          'Visado de año de orientación',
          'Visado de pareja',
          'Reagrupación familiar',
          'Visado startup',
          'Visado DAFT',
          'Visado Schengen de negocios',
          'Permiso de residencia',
          'Aún no lo sé',
        ],
        nationality: 'Nacionalidad',
        timeline: '¿Cuándo planea mudarse?',
        timelineOptions: ['Lo antes posible', 'En menos de 3 meses', 'De 3 a 6 meses', 'Explorando opciones'],
        message: 'Su situación',
        messagePlaceholder: 'Por ejemplo: ciudadano estadounidense con una oferta de trabajo en Rotterdam a partir de marzo, vienen mi pareja y dos hijos.',
      },
      relocation: {
        heading: 'Consulta de reubicación y vivienda',
        text: 'Desde un servicio individual hasta un paquete completo. Cuéntenos cómo debería ser su llegada.',
        service: '¿Qué necesita?',
        serviceOptions: [
          'Paquete de reubicación completo',
          'Búsqueda de vivienda',
          'Búsqueda de colegio',
          'BSN y registros',
          'Apoyo de instalación',
          'Vivienda temporal',
          'Reubicación en la región industrial',
          'Otra cosa',
        ],
        movingFrom: 'Se muda desde',
        timeline: '¿Cuándo llega?',
        timelineOptions: ['Lo antes posible', 'En menos de 3 meses', 'De 3 a 6 meses', 'Explorando opciones'],
        message: 'Su mudanza',
        messagePlaceholder: 'Por ejemplo: familia de cuatro que se muda desde Zúrich en verano, necesitamos vivienda cerca de un colegio internacional.',
      },
      vip: {
        heading: 'Consulta de reubicación VIP',
        text: 'Discreta, rápida y construida en torno a su agenda. Díganos las fechas y diseñamos la visita.',
        package: '¿Qué paquete le interesa?',
        packageOptions: [
          'Paquete VIP para Parejas',
          'Paquete VIP para Familias',
          'Paquete VIP para Empresas',
          'Concierge de Reubicación VIP',
          'Aún no lo sé',
        ],
        preferredContact: 'Contacto preferido',
        preferredContactOptions: ['WhatsApp', 'Teléfono', 'Correo electrónico'],
        arrival: 'Llegada prevista',
        message: 'Su reubicación',
        messagePlaceholder: 'Por ejemplo: me reubico desde Los Ángeles en octubre, disponible para una visita de preparación en septiembre.',
      },
    },
  },

  privacy: {
    metaTitle: 'Política de Privacidad | E & I Expat & Immigration Services',
    title: 'Política de privacidad',
    intro: [
      'E & I: Expat, Relocation and Immigration Services The Netherlands trata datos personales únicamente para responder a su consulta y para prestar los servicios de reubicación e inmigración que usted nos encarga.',
    ],
    sections: [
      {
        heading: 'Qué recopilamos',
        paragraphs: [
          'Cuando nos contacta, recibimos los datos que usted decide compartir: su nombre, sus datos de contacto y la descripción de su situación. Para clientes activos tratamos además los documentos necesarios para las solicitudes, siempre con su conocimiento.',
        ],
      },
      {
        heading: 'Cómo los utilizamos',
        paragraphs: [
          'Sus datos se utilizan para responderle, para preparar y gestionar su expediente de reubicación o inmigración, y para ningún otro fin. No vendemos datos ni los usamos con fines publicitarios.',
        ],
      },
      {
        heading: 'Conservación y sus derechos',
        paragraphs: [
          'Los datos de las consultas se conservan solo el tiempo necesario para atenderle. Puede solicitar en cualquier momento el acceso, la corrección o la eliminación de sus datos a través de los datos de contacto indicados abajo.',
        ],
      },
      {
        heading: 'Contacto',
        paragraphs: [
          'E & I: Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk. KvK 65768922.',
        ],
      },
    ],
  },

  notFound: {
    title: 'Esta página se ha mudado',
    text: 'La página que busca no existe o su dirección ha cambiado. Permítanos guiarle de vuelta.',
    label: 'Volver a la página de inicio',
  },
};
