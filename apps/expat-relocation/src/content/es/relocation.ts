import type { SectionContent } from '../types';

export const relocation: SectionContent = {
  title: 'Servicios de reubicación Países Bajos',
  metaTitle: 'Servicios de reubicación Países Bajos | E & I Expat Services',
  metaDescription:
    'Servicios de reubicación boutique en los Países Bajos. Una guía personal para su BSN, empadronamiento municipal, seguro médico, colegios e instalación, que le acompaña a cada cita.',
  eyebrow: 'Reubicación',
  intro: [
    'Mudarse de país son mil pequeñas tareas disfrazadas de una sola grande. El BSN, el municipio, el seguro, el colegio, el banco, cada uno con su propia ventanilla, sus propios formularios y su propia idea de un tiempo de espera razonable. La mayoría de las agencias le entrega una lista de tareas. Nosotros somos la única agencia boutique para expatriados en los Países Bajos, y hacemos algo distinto: una persona aprende su nombre, su familia y su situación, y sencillamente se ocupa de todo.',
    'Esa persona no dirige su reubicación desde detrás de un escritorio. Reserva las citas, prepara la documentación, conduce con usted hasta el municipio y se sienta a su lado en la ventanilla. Desde el momento en que aterriza hasta el momento en que los Países Bajos se sienten como su hogar, tiene aquí a alguien que ya conoce la respuesta a su próxima pregunta.',
  ],
  image: '/images/relocation-hub.jpg',
  imageAlt: 'Operarios de mudanza llevando cajas a una vivienda familiar neerlandesa',
  services: [
    {
      slug: 'bsn-registration-netherlands',
      menuLabel: 'Registro BSN',
      title: 'Registro BSN Países Bajos',
      metaTitle: 'Registro BSN Países Bajos | E & I Expat Services',
      metaDescription:
        'Obtenga su BSN con rapidez y sin errores. Preparamos sus documentos, reservamos la cita y le acompañamos a la ventanilla del municipio.',
      eyebrow: 'BSN',
      intro: [
        'El BSN, su número de servicio ciudadano neerlandés, es la llave que abre todo lo demás aquí: su salario, su seguro médico, su cuenta bancaria, incluso su contrato de teléfono. Hasta que lo tiene, está oficialmente en el limbo. Por eso debe ser lo primero que se resuelva tras su llegada, y resolverse bien a la primera.',
        'Preparamos la cita, verificamos que sus partidas de nacimiento y apostillas serán aceptadas, y Johanna le acompaña en persona a la ventanilla. Si el funcionario plantea una duda sobre un documento extranjero, tiene a su lado a alguien que ha oído esa pregunta cien veces y conoce la respuesta.',
      ],
      cardText: 'Su número de servicio ciudadano gestionado rápido, con nosotros a su lado en la ventanilla.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Recién llegados que necesitan un BSN antes de poder cobrar su primer salario',
          'Familias que empadronan a varios miembros, incluidos niños, en una sola visita',
          'Expatriados cuyos documentos extranjeros necesitan apostillas o traducciones juradas',
          'Cualquiera que intentó reservar cita y chocó con un muro de tiempos de espera',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'Comprobación de documentos antes de volar',
            text: 'Revisamos con antelación sus partidas de nacimiento, acta de matrimonio y legalizaciones, para que nada sea rechazado en la ventanilla.',
          },
          {
            title: 'Estrategia de cita',
            text: 'Sabemos qué municipios y ventanillas para expatriados tienen las esperas más cortas y reservamos el primer hueco realista para su situación.',
          },
          {
            title: 'Acompañamiento personal',
            text: 'Asistimos a la cita con usted, traducimos cuando hace falta y resolvemos las dudas en el momento.',
          },
          {
            title: 'Después de la cita',
            text: 'Seguimos la confirmación, le explicamos su certificado de empadronamiento y nos aseguramos de que su BSN llegue correctamente a su empleador y su aseguradora.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Revisión de documentos',
            text: 'Envíenos escaneados sus documentos civiles y le decimos exactamente qué necesita apostilla o traducción.',
          },
          {
            title: 'Cita reservada',
            text: 'Programamos su empadronamiento en la mejor ventanilla disponible para su dirección y sus plazos.',
          },
          {
            title: 'Día del empadronamiento',
            text: 'Vamos juntos, completamos el registro y salimos con todo confirmado.',
          },
        ],
      },
      note: 'El BSN se emite mediante la inscripción en la Base de Datos de Registros Personales, ya sea como residente o, para estancias cortas, como no residente a través de una ventanilla RNI. Le aconsejamos qué vía encaja con su situación durante la entrevista inicial.',
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Con qué rapidez puedo obtener el BSN tras llegar?',
            a: 'Con los documentos preparados de antemano, a menudo en pocos días tras la llegada; el número suele emitirse en la propia cita o poco después. Los retrasos reales vienen de apostillas que faltan y de colas de citas, que es precisamente lo que eliminamos.',
          },
          {
            q: '¿Necesito una dirección permanente para obtener el BSN?',
            a: 'Necesita una dirección en la que pueda empadronarse, que puede ser temporal si el proveedor lo permite. Si aún no la tiene, estudiamos la vía RNI u organizamos una vivienda de corta estancia donde el empadronamiento esté permitido.',
          },
          {
            q: '¿Puede empadronarse toda mi familia a la vez?',
            a: 'Sí, y merece la pena. Reservamos una cita familiar, preparamos cada certificado con antelación y nos aseguramos de que los niños queden registrados correctamente, algo que importa después para la matrícula escolar y la sanidad.',
          },
        ],
      },
      cta: {
        title: 'Consiga su BSN sin dar vueltas',
        text: 'Envíenos su fecha de llegada y tendremos lista la cita, la documentación y un asiento a su lado.',
        label: 'Gestionar mi BSN',
      },
      form: 'relocation',
      image: '/images/bsn-registration.jpg',
      imageAlt: 'Recibiendo un documento de empadronamiento en una ventanilla municipal',
    },
    {
      slug: 'municipality-registration-netherlands',
      menuLabel: 'Empadronamiento municipal',
      title: 'Empadronamiento municipal Países Bajos',
      metaTitle: 'Empadronamiento municipal Países Bajos | E & I Expat Services',
      metaDescription:
        'Empadrónese en su municipio neerlandés sin estrés. Preparación de documentos, reserva de cita y acompañamiento personal en el proceso ante la gemeente.',
      eyebrow: 'Gemeente',
      intro: [
        'Todo residente en los Países Bajos debe estar empadronado en su gemeente, el municipio, y ese registro le sigue a todas partes: impuestos, prestaciones, voto, permisos de aparcamiento, plazas escolares. Si sale mal, o caduca tras una mudanza, los pequeños errores administrativos crecen en silencio hasta convertirse en problemas reales.',
        'Gestionamos toda la relación con su municipio. Primer empadronamiento al llegar, nuevo registro cuando se muda dentro de los Países Bajos, baja si se marcha y correcciones cuando los registros no coinciden con la realidad. Años de trabajo junto a embajadas y consulados nos enseñaron cómo piensa la administración neerlandesa, y ponemos esa fluidez a trabajar en su ventanilla local.',
      ],
      cardText: 'Primer empadronamiento, mudanzas y correcciones en la gemeente, todo gestionado por usted.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Recién llegados que hacen su primera inscripción en la Base de Datos de Registros Personales',
          'Expatriados que se mudan entre ciudades neerlandesas y deben reempadronarse',
          'Residentes cuyos registros municipales contienen errores que siguen causando problemas',
          'Expatriados que se marchan y necesitan una baja limpia',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'La ventanilla correcta, la vía correcta',
            text: 'Los municipios difieren más de lo que imagina. Determinamos dónde y cómo debe presentarse su caso, incluidas las opciones de los centros para expatriados.',
          },
          {
            title: 'Expediente documental completo',
            text: 'Justificante de domicilio, documentos de identidad, autorización del arrendador y certificados extranjeros reunidos y comprobados antes de la cita.',
          },
          {
            title: 'Cita y acompañamiento',
            text: 'Reservamos el hueco, le explicamos qué va a ocurrir y le acompañamos para traducir y resolver imprevistos.',
          },
          {
            title: 'Verificación del registro',
            text: 'Después comprobamos su extracto de la base de datos, porque una errata en su nombre o dirección hoy es una hipoteca rechazada mañana.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Análisis de la situación',
            text: '¿Llegada, mudanza o corrección? Mapeamos su caso y los documentos que su gemeente le pedirá.',
          },
          {
            title: 'Expediente y cita',
            text: 'Reunimos el expediente y aseguramos la cita viable más temprana.',
          },
          {
            title: 'Empadronado y verificado',
            text: 'Completamos el registro juntos y confirmamos que la base de datos muestra exactamente lo que debe.',
          },
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Y si mi arrendador no ha dado permiso para empadronarme?',
            a: 'Tiene derecho a empadronarse donde realmente vive, y un arrendador no puede prohibirlo legalmente. Primero nos dirigimos al arrendador para resolverlo de forma amistosa, y si hace falta le guiamos por la vía de investigación de domicilio del municipio.',
          },
          {
            q: 'Me mudé dentro de los Países Bajos. ¿De verdad tengo que reempadronarme?',
            a: 'Sí, dentro de los cinco días siguientes a la mudanza, y no es una formalidad. Su aseguradora médica, la agencia tributaria y su empleador leen todos de ese registro. Presentamos el cambio en línea o en la ventanilla y confirmamos que se ha procesado.',
          },
          {
            q: '¿Tienen que venir mis hijos a la cita?',
            a: 'Para un primer empadronamiento, los municipios generalmente quieren ver en persona a cada miembro de la familia, niños incluidos. Planificamos una única cita familiar eficiente para que no tenga que volver tres veces.',
          },
        ],
      },
      cta: {
        title: 'Haga fácil la gemeente',
        text: 'Sea lo que sea lo que su municipio necesite de usted, ya lo hemos hecho antes. Cuéntenos su situación y delo por gestionado.',
        label: 'Gestionar mi empadronamiento',
      },
      form: 'relocation',
      image: '/images/immigration-desk.jpg?v=20260728',
      imageAlt: 'Trámites completándose en un mostrador de servicios municipales',
    },
    {
      slug: 'health-insurance-guidance-netherlands',
      menuLabel: 'Seguro médico',
      title: 'Asesoramiento en seguro médico Países Bajos',
      metaTitle: 'Asesoramiento en seguro médico Países Bajos | E & I Expat Services',
      metaDescription:
        'El seguro médico neerlandés, explicado y contratado. Ayudamos a los expatriados a elegir la póliza adecuada, registrarse con un médico de cabecera y evitar multas por afiliación tardía.',
      eyebrow: 'Sanidad',
      intro: [
        'El seguro médico neerlandés es obligatorio, excelente y genuinamente confuso. Debe contratar una póliza básica en los cuatro meses siguientes a quedar asegurado aquí, las primas y franquicias varían de formas difíciles de comparar desde fuera, y pasarse del plazo acarrea multas y primas con efecto retroactivo. Mientras tanto, la web de cada aseguradora da por hecho que usted ya entiende el sistema.',
        'Se lo explicamos en una conversación honesta: qué cubre siempre el paquete básico, cuándo merece la pena un seguro complementario para su familia y cómo funciona realmente la franquicia. Después le ayudamos a afiliarse, registrarse con un médico de familia y saber qué hacer la primera vez que usted o su hijo se pongan enfermos.',
      ],
      cardText: 'La póliza de salud neerlandesa adecuada, elegida, contratada y explicada con claridad.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Recién llegados ante el plazo de cuatro meses del seguro',
          'Familias que sopesan coberturas complementarias de dental, fisioterapia o necesidades infantiles',
          'Expatriados que no saben si su seguro extranjero o de empresa sigue siendo válido',
          'Cualquiera que recibió una carta del CAK y no sabe por qué',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'El sistema bien explicado',
            text: 'Paquete básico, franquicia, aportaciones propias, subsidio sanitario: toda la maquinaria explicada una vez, con claridad, con sus cifras.',
          },
          {
            title: 'Comparación de pólizas y afiliación',
            text: 'Preseleccionamos pólizas que encajan con su familia y su presupuesto, explicamos las ventajas y desventajas con honestidad y le acompañamos en la contratación.',
          },
          {
            title: 'Registro con médico y farmacia',
            text: 'Encontramos un huisarts que acepte nuevos pacientes cerca de usted, gestionamos su registro y le explicamos cómo funcionan las derivaciones a especialistas.',
          },
          {
            title: 'Comprobación del subsidio',
            text: 'Si sus ingresos le dan derecho al zorgtoeslag, el subsidio sanitario mensual, le ayudamos a solicitarlo.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Conversación sobre coberturas',
            text: 'Evaluamos su familia, sus necesidades de salud y su fecha de inicio, y comprobamos qué ofrece ya su empleador.',
          },
          {
            title: 'Elegir y contratar',
            text: 'Usted elige de una preselección clara y nosotros completamos la afiliación con su BSN.',
          },
          {
            title: 'Red de atención montada',
            text: 'Médico de cabecera, dentista y farmacia registrados, para que su primer día de enfermedad sea una molestia, no una crisis.',
          },
        ],
      },
      note: 'El seguro entra en vigor con efecto retroactivo desde la fecha en que comenzó su obligación, así que las primas se deben desde esa fecha aunque se afilie más tarde. Afiliarse pronto no cuesta nada extra y evita multas.',
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: 'Tengo un seguro de viaje o internacional. ¿Es suficiente?',
            a: 'Normalmente no. En cuanto vive o trabaja aquí y queda cubierto por el sistema neerlandés, la póliza básica neerlandesa es legalmente obligatoria con independencia de otras coberturas. Comprobamos su situación concreta, incluidas las excepciones para ciertos destinos laborales y estudiantes.',
          },
          {
            q: '¿Por qué necesito un médico de cabecera antes incluso de enfermar?',
            a: 'El huisarts es la puerta de entrada a toda la sanidad neerlandesa; los hospitales esperan una derivación. Las consultas cercanas pueden tener listas de pacientes cerradas, así que registrarse pronto, mientras está sano, es la mejor decisión sanitaria que toma un recién llegado.',
          },
          {
            q: '¿Qué pasa si surge una cuestión de salud fuera del horario de oficina?',
            a: 'Los Países Bajos tienen un servicio de guardia del médico de cabecera, el huisartsenpost, para casos urgentes. Y nuestros clientes siempre pueden escribirnos a la línea personal de WhatsApp a cualquier hora; hemos acompañado a más de un padre preocupado durante su primera fiebre nocturna neerlandesa.',
          },
        ],
      },
      cta: {
        title: 'Asegúrese antes de que el plazo haga de las suyas',
        text: 'Una conversación y su sanidad neerlandesa queda elegida, contratada y lista para usar.',
        label: 'Resolver mi seguro',
      },
      form: 'relocation',
      image: '/images/health-insurance.jpg',
      imageAlt: 'Comparando opciones de seguro médico neerlandés en la mesa de la cocina',
    },
    {
      slug: 'school-search-netherlands',
      menuLabel: 'Búsqueda de colegio',
      title: 'Búsqueda de colegio Países Bajos',
      metaTitle: 'Búsqueda de colegio Países Bajos | E & I Expat Services',
      metaDescription:
        'Encuentre el colegio neerlandés, internacional o bilingüe adecuado para sus hijos. Preselecciones, visitas y apoyo en la matrícula para familias expatriadas.',
      eyebrow: 'Colegios',
      intro: [
        'Pregunte a unos padres que se mudan qué les quita el sueño y rara vez es el visado. Es el colegio. ¿Internacional o neerlandés? ¿Bilingüe? ¿Cuánto duran las listas de espera, y qué le ocurre a una niña de nueve años que no habla neerlandés en su primer lunes? Estas preguntas merecen mejores respuestas que un hilo de foro.',
        'Le guiamos por el panorama real: colegios internacionales, colegios neerlandeses con clases de acogida, programas bilingües y la realidad de las listas de espera de cada uno. Preseleccionamos colegios que encajan con su hijo, organizamos las visitas y le acompañamos a ellas, y conducimos el papeleo de matrícula hasta una plaza confirmada.',
      ],
      cardText: 'El colegio adecuado para su hijo, de la preselección a la matrícula confirmada.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Familias que eligen entre educación internacional y neerlandesa',
          'Padres de niños que llegarán sin hablar neerlandés',
          'Expatriados cuya duración de destino complica la elección de colegio',
          'Familias que se mudan a mitad de curso y temen por la plaza',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'Panorama educativo explicado',
            text: 'Cómo funciona el sistema neerlandés, cuánto cuestan los colegios internacionales, cómo las clases de acogida salvan la brecha del idioma y qué encaja con la duración de su destino.',
          },
          {
            title: 'Preselección personal de colegios',
            text: 'Colegios seleccionados según la edad, los idiomas y las necesidades de su hijo, ajustados a donde vivirá, con notas honestas sobre cada uno.',
          },
          {
            title: 'Visitas organizadas y acompañadas',
            text: 'Reservamos los recorridos, preparamos las preguntas que merece la pena hacer y le acompañamos en las visitas.',
          },
          {
            title: 'De la matrícula a la confirmación',
            text: 'Formularios de solicitud, expedientes escolares previos y seguimiento de listas de espera gestionados hasta que su hijo tiene una plaza confirmada.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Entrevista familiar',
            text: 'Hablamos de sus hijos, sus idiomas, sus necesidades y sus planes en los Países Bajos.',
          },
          {
            title: 'Preseleccionar y visitar',
            text: 'Recibe una preselección enfocada y recorremos juntos los colegios prometedores.',
          },
          {
            title: 'Matricular y empezar',
            text: 'Completamos la matrícula y ayudamos a que su hijo llegue a un colegio que le espera.',
          },
        ],
      },
      note: 'La elección de colegio y la de vivienda son una sola decisión, no dos; la dirección determina las opciones. Si también llevamos su búsqueda de vivienda, las planificamos juntas.',
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Debemos elegir educación internacional o neerlandesa?',
            a: 'Para destinos de menos de unos tres años, los colegios internacionales ofrecen continuidad. Para familias que se quedan más tiempo, los colegios neerlandeses con programa de acogida suelen integrar a los niños más rápido y cuestan mucho menos. Le ayudamos a decidir según sus planes, no según una regla general.',
          },
          {
            q: 'Mi hijo no habla neerlandés. ¿Cómo lo gestionan los colegios neerlandeses?',
            a: 'Muchas regiones tienen clases de acogida dedicadas donde los niños reciben neerlandés intensivo durante alrededor de un año antes de incorporarse a las clases regulares. La plaza depende de la edad y la región, y encontramos las opciones reales cerca de su casa.',
          },
          {
            q: '¿Cómo son de graves las listas de espera realmente?',
            a: 'Varía enormemente según la ciudad y el colegio. Los colegios internacionales populares pueden tener listas largas mientras un colegio igual de bueno cerca tiene plazas. Solicitar pronto y a la combinación correcta de colegios es la mayor parte de la batalla, y eso es lo que gestionamos.',
          },
        ],
      },
      cta: {
        title: 'Dé a sus hijos un aterrizaje suave',
        text: 'Cuéntenos cómo son sus hijos y encontraremos el colegio donde florecerán, y después los matricularemos en él.',
        label: 'Encontrar nuestro colegio',
      },
      form: 'relocation',
      image: '/images/school-search.jpg',
      imageAlt: 'Padres e hijo hablando con una profesora en un colegio neerlandés',
    },
    {
      slug: 'settling-in-services-netherlands',
      menuLabel: 'Servicios de instalación',
      title: 'Servicios de instalación Países Bajos',
      metaTitle: 'Servicios de instalación Países Bajos | E & I Expat Services',
      metaDescription:
        'Apoyo en la instalación para expatriados en los Países Bajos: banca, suministros, teléfono, transporte, orientación por el barrio y las cien pequeñas cosas que convierten una casa en una vida.',
      eyebrow: 'Instalación',
      intro: [
        'El papeleo termina y entonces empiezan las preguntas de verdad. ¿Qué banco le abrirá una cuenta esta semana? ¿Por qué hay tres tipos de contenedor de basura? ¿Cómo funciona el sistema de médicos de cabecera, dónde se compra una bicicleta que no le roben antes del viernes, y qué demonios es el eigen risico? Instalarse son cien pequeños rompecabezas, y resolverlos solo lleva meses.',
        'Nosotros comprimimos esos meses en semanas. Banca, suministros, internet, teléfono, tarjetas de transporte, seguros básicos y una orientación de verdad por su nuevo barrio, todo organizado con usted y explicado sobre la marcha. Esta instalación cercana y personal es exactamente la razón por la que nuestros clientes nos llaman conserjería y no agencia.',
      ],
      cardText: 'Banca, suministros, transporte y el saber hacer del barrio, organizados en semanas, no en meses.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Recién llegados que quieren su vida práctica en marcha en las primeras semanas',
          'Profesionales ocupados sin tiempo para investigar proveedores neerlandeses',
          'Parejas y familias que aterrizan mientras el cónyuge que trabaja ya está en la oficina',
          'Cualquiera que se mudó hace meses y aún se siente a medio llegar',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'Banca resuelta',
            text: 'Ayuda para elegir y abrir una cuenta bancaria neerlandesa, más la configuración de iDEAL y las apps de pago con las que funciona la vida diaria aquí.',
          },
          {
            title: 'Casa conectada',
            text: 'Contratos de energía, agua, internet y teléfono comparados, contratados y programados en torno a su fecha de entrada.',
          },
          {
            title: 'Moverse por el país',
            text: 'Tarjetas de transporte público OV, consejo para comprar bicicleta, permisos de aparcamiento y, si conduce, orientación sobre su carné y la propiedad de un coche neerlandés.',
          },
          {
            title: 'Orientación por el barrio',
            text: 'Un recorrido personal por su zona: el mercado, el buen supermercado, la farmacia, los clubes deportivos, los atajos que usan los locales.',
          },
          {
            title: 'Las pequeñas grandes cosas',
            text: 'Calendarios de basuras, alta en DigiD, seguro de responsabilidad civil, opciones de guardería: los pequeños asuntos que nadie menciona hasta que fallan.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Plan de instalación',
            text: 'Listamos lo que su hogar necesita, en el orden que desbloquea el resto.',
          },
          {
            title: 'Organizar juntos',
            text: 'En unas cuantas sesiones montamos cuentas, contratos y tarjetas, explicando cada uno para que usted mantenga el control.',
          },
          {
            title: 'Día de orientación',
            text: 'Pasamos tiempo juntos en su barrio hasta que empieza a sentirlo suyo.',
          },
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Puedo abrir una cuenta bancaria neerlandesa antes de tener el BSN?',
            a: 'Algunos bancos lo permiten y dejan aportar el BSN después; las políticas cambian a menudo. Conocemos la situación actual y le dirigimos a la vía más rápida para que su salario tenga dónde aterrizar.',
          },
          {
            q: '¿Qué es DigiD y de verdad lo necesito?',
            a: 'DigiD es su identidad digital ante la administración neerlandesa: impuestos, sanidad, subsidios y servicios municipales lo usan. Lo necesitará constantemente, y lo configuramos con usted desde el principio.',
          },
          {
            q: 'Llegamos hace meses pero nunca terminamos de instalarnos. ¿Esto sigue siendo para nosotros?',
            a: 'Por supuesto, y es más común de lo que cree. Auditamos lo que falta o quedó mal configurado, lo arreglamos y completamos el aterrizaje que nunca tuvo tiempo de hacer.',
          },
        ],
      },
      cta: {
        title: 'Siéntase en casa antes',
        text: 'Denos unas semanas y los Países Bajos dejarán de ser un país extranjero para convertirse en el lugar donde vive.',
        label: 'Ayúdenme a instalarme',
      },
      form: 'relocation',
      image: '/images/relocation-settling.jpg?v=20260728',
      imageAlt: 'Un recién llegado orientándose en su nuevo barrio neerlandés',
    },
    {
      slug: 'airport-pickup-for-expats-netherlands',
      menuLabel: 'Recogida en el aeropuerto',
      title: 'Recogida en el aeropuerto para expatriados Países Bajos',
      metaTitle: 'Recogida en el aeropuerto para expatriados Países Bajos | E & I Expat Services',
      metaDescription:
        'Una cálida bienvenida en Schiphol o el aeropuerto de Rotterdam: recogida personal, traslado a su nuevo hogar y una orientación del primer día para que su reubicación empiece con calma.',
      eyebrow: 'Llegada',
      intro: [
        'Toda reubicación tiene un momento cero: las puertas de la sala de llegadas se abren y su nueva vida comienza con jet lag, equipaje y un país que aún no conoce. Cómo transcurre esa primera hora tiñe toda la mudanza. No debería incluir arrastrar maletas por transbordos de tren ni explicar una dirección a un taxista a medianoche.',
        'Le esperamos en la sala, cartel con su nombre incluido, y le llevamos directo a su nueva puerta. Por el camino recibe lo esencial del primer día: cómo funciona la casa, dónde está la compra de mañana, qué ocurre esta semana. Y como los vuelos aterrizan cuando aterrizan, nuestra línea de WhatsApp le acompaña a todas horas desde el momento del despegue.',
      ],
      cardText: 'Recibido en llegadas, llevado a casa y orientado para su primera mañana neerlandesa.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Familias que aterrizan con niños, equipaje y sin energía para la logística',
          'Quienes llegan por primera vez y quieren una cara conocida en la sala de llegadas',
          'Profesionales que aterrizan de madrugada o en vuelos de fin de semana',
          'Empleadores que quieren recibir a su nuevo empleado como es debido',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'Seguimiento del vuelo',
            text: 'Monitorizamos su vuelo, así que un retraso o un aterrizaje adelantado no cambian nada de su bienvenida.',
          },
          {
            title: 'Recibimiento personal',
            text: 'Un contacto conocido esperando en la sala de llegadas de Schiphol, Rotterdam The Hague o Eindhoven, listo para ayudar con el equipaje y los niños.',
          },
          {
            title: 'Traslado directo a casa',
            text: 'Un trayecto cómodo hasta su nuevo hogar o apartamento temporal, con sillas infantiles preparadas cuando hacen falta.',
          },
          {
            title: 'Orientación del primer día',
            text: 'Llaves, calefacción, wifi y electrodomésticos explicados, un plan para la primera compra y una imagen clara de las citas de su primera semana.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Comparta su vuelo',
            text: 'Envíe los datos de su vuelo y su dirección; confirmamos el plan y seguimos localizables mientras viaja.',
          },
          {
            title: 'Aterrice y sea recibido',
            text: 'Sale de llegadas y su reubicación ya está allí de pie, esperándole.',
          },
          {
            title: 'Llegue a casa',
            text: 'Se acuesta en una casa que funciona, sabiendo exactamente cómo será mañana.',
          },
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Y si mi vuelo aterriza a las 2 de la madrugada?',
            a: 'Entonces estamos en la sala de llegadas a las 2 de la madrugada. Las llegadas no respetan horarios de oficina y nosotros tampoco; esa promesa es el corazón de cómo trabajamos.',
          },
          {
            q: '¿Pueden con una familia con mucho equipaje y una mascota?',
            a: 'Sí. Díganos con antelación cuántas personas, cuántas maletas y el tamaño del transportín y organizamos un vehículo donde quepa todo, mascota incluida.',
          },
          {
            q: '¿La recogida es solo para clientes con un paquete de reubicación completo?',
            a: 'Puede reservarse por separado, aunque la mayoría de los clientes la combina con el apoyo de instalación para que la primera semana continúe tan fluida como la primera hora. El precio para su situación se confirma durante la entrevista inicial.',
          },
        ],
      },
      cta: {
        title: 'Empiece su nueva vida recibido, no perdido',
        text: 'Envíenos su número de vuelo y la primera cara que vea en los Países Bajos será una amiga.',
        label: 'Reservar mi llegada',
      },
      form: 'relocation',
      image: '/images/relocation-arrival.jpg?v=20260728',
      imageAlt: 'Una cálida bienvenida en la sala de llegadas del aeropuerto',
    },
    {
      slug: 'family-relocation-netherlands',
      menuLabel: 'Reubicación familiar',
      title: 'Reubicación familiar Países Bajos',
      metaTitle: 'Reubicación familiar Países Bajos | E & I Expat Services',
      metaDescription:
        'Traslade a toda su familia a los Países Bajos con una sola guía personal: vivienda, colegios, empadronamientos, sanidad y un aterrizaje suave para cada miembro de la familia.',
      eyebrow: 'Familias',
      intro: [
        'Mudarse solo es un proyecto. Mudar una familia son cinco proyectos a la vez: una casa donde quepan todos, colegios con plazas reales, empadronamientos para cada pasaporte del hogar, sanidad para el bebé y el adolescente, y una pareja cuya carrera y vida social merecen más que una nota al pie. Suelte un hilo y toda la mudanza se deshilacha.',
        'Nosotros sostenemos todos los hilos. Una guía planifica la mudanza familiar completa como un único calendario, secuencia las citas para que nada bloquee lo demás y atiende el lado humano: cómo aterrizan los niños, cómo la pareja acompañante construye una vida, cómo el hogar empieza a sentirse hogar. Nuestra reputación en esto se forjó en el mundo de las embajadas, donde los destinos familiares son la norma y el fracaso no es una opción.',
      ],
      cardText: 'Un calendario, una guía y un aterrizaje suave para cada miembro de la familia.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Familias que se mudan a los Países Bajos por un nuevo puesto o destino',
          'Padres que hacen malabares entre plazos de colegio y plazos de vivienda',
          'Hogares con nacionalidades mixtas y papeleo mixto',
          'Parejas acompañantes que quieren su propio plan de aterrizaje, no uno de sobras',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'Un plan maestro familiar',
            text: 'Vivienda, colegios, empadronamientos, seguros y llegada secuenciados en un único calendario con las dependencias resueltas en el orden correcto.',
          },
          {
            title: 'Casa y colegio en tándem',
            text: 'Llevamos la búsqueda de vivienda y la de colegio como una sola decisión, para que nunca gane una casa y pierda la plaza escolar.',
          },
          {
            title: 'Empadronamientos para todos',
            text: 'BSN y registro municipal para cada miembro de la familia, con los certificados y traducciones de los niños preparados con antelación.',
          },
          {
            title: 'Sanidad para el hogar',
            text: 'Seguro para la familia, un médico de cabecera que acepte nuevos pacientes, y la atención pediátrica y dental localizadas antes de que nadie las necesite.',
          },
          {
            title: 'Integración de la pareja y la familia',
            text: 'Orientación por el barrio, clubes, guarderías, opciones de idioma y las presentaciones que convierten una ciudad nueva en una comunidad.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Entrevista familiar',
            text: 'Conocemos a toda la familia, por vídeo o en persona, y volcamos las necesidades de cada miembro en un solo plan.',
          },
          {
            title: 'Preparar y asegurar',
            text: 'Antes de que vuele, la vía de la vivienda, la del colegio y la del papeleo ya están en marcha.',
          },
          {
            title: 'Aterrizar juntos',
            text: 'Llegada, empadronamientos e inicios escolares ocurren según lo previsto, con nosotros al lado en cada paso.',
          },
          {
            title: 'Instalarse y hacer balance',
            text: 'Seguimos implicados durante los primeros meses, porque las preguntas no se detienen en la puerta de casa.',
          },
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Con cuánta antelación debería empezar a planificar una familia?',
            a: 'De tres a seis meses antes de la mudanza es cómodo, sobre todo porque las plazas escolares y los alquileres de tamaño familiar son las piezas más escasas. Con menos tiempo también se puede; simplemente significa priorizar más fuerte desde el primer día.',
          },
          {
            q: '¿Pueden apoyar también la parte de visados de una mudanza familiar?',
            a: 'Sí. La reagrupación familiar y los visados de pareja se gestionan a través de nuestros servicios de inmigración, y coordinar las dos vías bajo un mismo techo es exactamente lo que mantiene coherente una mudanza familiar.',
          },
          {
            q: '¿Y nuestros hijos que aún no están en edad escolar?',
            a: 'Las guarderías en los Países Bajos suelen tener listas de espera más largas que los colegios, así que tratamos el cuidado infantil con la misma urgencia: preselecciones, solicitudes y una explicación del subsidio de guardería al que puede tener derecho.',
          },
        ],
      },
      cta: {
        title: 'Mude a toda la familia con una llamada',
        text: 'Díganos quién viene y cuándo, y construiremos el plan que deje a todos aterrizados, escolarizados y sonriendo.',
        label: 'Planificar nuestra mudanza familiar',
      },
      form: 'relocation',
      image: '/images/family-relocation.jpg',
      imageAlt: 'Familia paseando con bicicletas por su nuevo barrio',
    },
    {
      slug: 'relocation-services-rotterdam',
      menuLabel: 'Reubicación Rotterdam',
      title: 'Servicios de reubicación Rotterdam',
      metaTitle: 'Servicios de reubicación Rotterdam | E & I Expat Services',
      metaDescription:
        'Apoyo integral de reubicación en Rotterdam por una especialista local: vivienda, empadronamientos, colegios e instalación, para la ciudad y la región portuaria.',
      eyebrow: 'Rotterdam',
      intro: [
        'Rotterdam premia a quien llega con un local de su lado. Es una ciudad trabajadora, directa y de ritmo rápido, con un mercado de vivienda que se ha tensado con fuerza y una economía portuaria que atrae profesionales de todos los continentes. Las listas de reubicación nacionales solo llegan hasta cierto punto aquí; lo que importa es conocer las ventanillas, los distritos y los ritmos de esta ciudad.',
        'Este es nuestro territorio. Somos la especialista de Rotterdam y su corredor industrial, del centro de la ciudad a través de Europoort hasta la Maasvlakte, y todo lo que organizamos, vivienda, empadronamiento en la gemeente de Rotterdam, colegios, sanidad, se apoya en esa profundidad local. Recibe el servicio de reubicación completo, afinado con precisión para esta ciudad.',
      ],
      cardText: 'El servicio de reubicación completo, afinado para Rotterdam por gente que la vive.',
      forWho: {
        title: 'Para quién es',
        items: [
          'Profesionales que empiezan en empresas de Rotterdam, el puerto o el clúster industrial',
          'Familias que se trasladan a Rotterdam y sus municipios cercanos',
          'Empleados internacionales cuyos empleadores quieren un aterrizaje fluido y rápido',
          'Expatriados ya en los Países Bajos que se mudan a Rotterdam',
        ],
      },
      included: {
        title: 'Qué incluye',
        blocks: [
          {
            title: 'Apoyo de vivienda en Rotterdam',
            text: 'Una búsqueda construida sobre conocimiento a nivel de barrio y relaciones con agentes locales, con visitas y revisión de contrato incluidas.',
          },
          {
            title: 'Empadronamientos hechos localmente',
            text: 'BSN y registro municipal a través de las ventanillas de Rotterdam con las que trabajamos cada semana, preparados para que una visita baste.',
          },
          {
            title: 'Colegios y guarderías en la región',
            text: 'Opciones internacionales y neerlandesas por todo Rotterdam y los suburbios, ajustadas a su casa y su trayecto.',
          },
          {
            title: 'Instalarse en la ciudad',
            text: 'Banca, transporte, sanidad y una orientación personal por su distrito, de los mercados al Mosa.',
          },
        ],
      },
      process: {
        title: 'Cómo funciona',
        steps: [
          {
            title: 'Entrevista sobre Rotterdam',
            text: 'Volcamos su lugar de trabajo, su familia y sus plazos sobre la ciudad que conocemos calle a calle.',
          },
          {
            title: 'Todo en marcha',
            text: 'Vivienda, empadronamientos y colegios avanzan en paralelo, coordinados por una sola persona.',
          },
          {
            title: 'Aterrizado y viviendo',
            text: 'Está empadronado, alojado y orientado, con un número local al que escribir siempre que surja una pregunta.',
          },
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        items: [
          {
            q: '¿Cubren solo Rotterdam ciudad?',
            a: 'Cubrimos toda la región: Schiedam, Vlaardingen, Capelle, Barendrecht, el Hoeksche Waard y el corredor portuario hasta Hoek van Holland. A menudo la mejor casa para su presupuesto está un municipio más allá, y se lo diremos.',
          },
          {
            q: 'Mi empleador está en la zona portuaria. ¿Dónde debería vivir?',
            a: 'Depende de su patrón de turnos y de su tolerancia a la A15. Muchos profesionales del puerto viven en el centro y salen a contracorriente del tráfico; otros prefieren Voorne-Putten o Westland por cercanía. Modelamos su trayecto real antes de que elija.',
          },
          {
            q: '¿Pueden trabajar directamente con mi empleador o con recursos humanos?',
            a: 'Con mucho gusto. Coordinamos con regularidad con recursos humanos fechas de inicio, contratos y papeleo, y podemos actuar como punto de contacto único para que el empleado simplemente llegue y todo funcione.',
          },
        ],
      },
      cta: {
        title: 'Llegue a Rotterdam como un local',
        text: 'Una conversación con alguien que conoce esta ciudad, y su mudanza deja de ser un rompecabezas.',
        label: 'Iniciar mi mudanza a Rotterdam',
      },
      form: 'relocation',
      image: '/images/rotterdam.jpg?v=20260728',
      imageAlt: 'Centro de Rotterdam con arquitectura moderna junto al Mosa',
    },
  ],
  crossLinks: [
    {
      label: 'Reubicación Europoort',
      path: '/industrial-expat-services/europoort-relocation-services-netherlands',
      text: '¿Se traslada por trabajo a la zona industrial de Europoort? Vea nuestro servicio dedicado a la región portuaria.',
    },
  ],
  cta: {
    title: 'Una sola guía para toda su reubicación',
    text: 'De su BSN al colegio de sus hijos, una persona que conoce su nombre se ocupa de todo, y le acompaña en cada paso.',
    label: 'Iniciar mi reubicación',
  },
};
