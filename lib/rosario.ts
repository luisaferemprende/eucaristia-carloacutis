// Los 20 misterios del Santo Rosario. Nombres y citas bíblicas son la estructura
// tradicional de la Iglesia (los luminosos los añadió san Juan Pablo II en 2002).
// Cada misterio lleva: la escena, resumida del pasaje bíblico que se cita; una
// meditación (texto propio de EucaristíaViva, pendiente de revisión doctrinal);
// lo que se puede pedir; y una pintura de dominio público con su crédito.

export type ConjuntoId = 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';

export interface Misterio {
  nombre: string;
  cita: string;
  escena: string;
  meditacion: string;
  pide: string;
  imagen: { src: string; alt: string; credito: string };
}

export interface Conjunto {
  titulo: string;
  dias: string;
  misterios: Misterio[];
}

const img = (src: string, alt: string, autor: string): Misterio['imagen'] => ({
  src,
  alt,
  credito: `${autor} · dominio público · Wikimedia Commons`,
});

export const CONJUNTOS: Record<ConjuntoId, Conjunto> = {
  gozosos: {
    titulo: 'Misterios gozosos',
    dias: 'lunes y sábado',
    misterios: [
      {
        nombre: 'La Anunciación del Ángel a María',
        cita: 'Lucas 1, 26-38',
        escena:
          'El ángel Gabriel anuncia a María que será madre del Hijo de Dios. Ella pregunta cómo será posible y responde: «Aquí está la esclava del Señor; hágase en mí según tu palabra».',
        meditacion:
          'María no lo entiende todo, pero confía y dice sí. ¿Qué «sí» te está pidiendo Dios hoy, aunque no lo entiendas del todo? Ofrécele eso que no comprendes de tu vida y repite con ella: «hágase».',
        pide: 'Humildad y confianza en Dios.',
        imagen: img('/rosario/gozosos-1.jpg', 'La Anunciación, pintura de Fra Angelico', 'Fra Angelico, h. 1430'),
      },
      {
        nombre: 'La Visitación de María a Isabel',
        cita: 'Lucas 1, 39-56',
        escena:
          'María, recién embarazada, va de prisa a visitar a su prima Isabel, que también espera un hijo. Isabel la bendice, el niño salta en su vientre, y María responde con el canto del Magníficat.',
        meditacion:
          'María no se queda con su gran noticia: sale a servir a su prima. El amor se pone en camino. ¿A quién puedes visitar, llamar o ayudar esta semana, aunque estés ocupada con lo tuyo?',
        pide: 'Amor y servicio al prójimo.',
        imagen: img('/rosario/gozosos-2.jpg', 'La Visitación, pintura de Domenico Ghirlandaio', 'Domenico Ghirlandaio, 1491'),
      },
      {
        nombre: 'El Nacimiento de Jesús en Belén',
        cita: 'Lucas 2, 1-20',
        escena:
          'Jesús nace en Belén y su madre lo acuesta en un pesebre, porque no había lugar en la posada. Los ángeles anuncian la noticia a unos pastores, que van con prisa a verlo.',
        meditacion:
          'Dios elige llegar pobre y pequeño, y avisa primero a los más sencillos. ¿Qué te estorba hoy para acercarte a Él con sencillez? Mira al Niño del pesebre y deja a un lado lo que no necesitas.',
        pide: 'Sencillez y desprendimiento.',
        imagen: img('/rosario/gozosos-3.jpg', 'La adoración de los pastores, pintura de Gerard van Honthorst', 'Gerard van Honthorst, 1622'),
      },
      {
        nombre: 'La Presentación del Niño Jesús en el Templo',
        cita: 'Lucas 2, 22-38',
        escena:
          'José y María llevan a Jesús al Templo para presentarlo al Señor. Simeón, un anciano justo, lo toma en brazos y lo llama «luz para alumbrar a las naciones». También la profetisa Ana da gracias a Dios.',
        meditacion:
          'Simeón esperó toda la vida y reconoció a Jesús cuando llegó. María y José ofrecen lo más querido que tienen. ¿Qué puedes ofrecerle hoy a Dios que te cueste un poco: tu tiempo, tu orgullo, una preocupación?',
        pide: 'Obediencia y pureza de corazón.',
        imagen: img('/rosario/gozosos-4.jpg', 'La Presentación en el Templo, pintura de Giotto', 'Giotto, h. 1305'),
      },
      {
        nombre: 'El Niño Jesús perdido y hallado en el Templo',
        cita: 'Lucas 2, 41-52',
        escena:
          'Cuando Jesús tiene doce años, se queda en el Templo sin que lo sepan sus padres. María y José lo buscan angustiados durante tres días y lo encuentran entre los maestros. Jesús les dice que debía ocuparse de las cosas de su Padre.',
        meditacion:
          'María y José buscaron a Jesús hasta encontrarlo. Si hoy sientes que lo has perdido de vista, búscalo donde siempre está: en la oración, en su Palabra y en la Eucaristía.',
        pide: 'El don de buscar siempre a Jesús.',
        imagen: img('/rosario/gozosos-5.jpg', 'El hallazgo del Salvador en el Templo, pintura de William Holman Hunt', 'William Holman Hunt, 1860'),
      },
    ],
  },
  dolorosos: {
    titulo: 'Misterios dolorosos',
    dias: 'martes y viernes',
    misterios: [
      {
        nombre: 'La Agonía de Jesús en el Huerto',
        cita: 'Mateo 26, 36-46',
        escena:
          'En Getsemaní, Jesús siente tristeza y angustia. Pide a sus discípulos que velen con Él y reza: «Padre, si es posible, que pase de mí este cáliz; pero no se haga como yo quiero, sino como quieres tú». Los discípulos se quedan dormidos.',
        meditacion:
          'Jesús también sintió miedo, y lo dijo al Padre. Cuando algo te angustie, no lo escondas: preséntaselo como Él y termina con sus palabras: «que se haga tu voluntad».',
        pide: 'Arrepentimiento sincero y fortaleza ante el miedo.',
        imagen: img('/rosario/dolorosos-1.jpg', 'Cristo en Getsemaní, pintura de Carl Bloch', 'Carl Bloch, 1873'),
      },
      {
        nombre: 'La Flagelación del Señor',
        cita: 'Juan 19, 1',
        escena: 'Pilato manda azotar a Jesús, que acepta el sufrimiento sin defenderse.',
        meditacion:
          'Jesús aceptó sufrir por amor, sin devolver mal por mal. Piensa hoy en alguien que sufre injustamente y reza por esa persona. ¿Qué pequeño sacrificio puedes ofrecer por ella?',
        pide: 'Pureza de corazón y compasión por los que sufren.',
        imagen: img('/rosario/dolorosos-2.jpg', 'La flagelación de Cristo, pintura de Caravaggio', 'Caravaggio, 1607'),
      },
      {
        nombre: 'La Coronación de espinas',
        cita: 'Mateo 27, 27-31',
        escena:
          'Los soldados visten a Jesús con un manto, le colocan una corona de espinas en la cabeza y se burlan de Él como «rey de los judíos».',
        meditacion:
          'Se burlaron del Rey y Él calló. ¿Cuándo te cuesta soportar una burla, una crítica o una humillación? Pídele su humildad y su paz, y no pagues con la misma moneda.',
        pide: 'Humildad y paciencia ante las humillaciones.',
        imagen: img('/rosario/dolorosos-3.jpg', 'La coronación de espinas, pintura de Caravaggio', 'Caravaggio, h. 1603'),
      },
      {
        nombre: 'Jesús con la cruz a cuestas',
        cita: 'Juan 19, 17',
        escena: 'Jesús sale cargando su propia cruz hacia el lugar llamado Calvario, en hebreo Gólgota.',
        meditacion:
          'Jesús carga la cruz sin soltarla. ¿Cuál es tu cruz de hoy: una enfermedad, una preocupación, una persona difícil? No la cargues sola: ponla junto a la de Jesús y camina con Él.',
        pide: 'Paciencia para llevar las cruces de cada día.',
        imagen: img('/rosario/dolorosos-4.jpg', 'Cristo con la cruz a cuestas, pintura de El Greco', 'El Greco, h. 1592'),
      },
      {
        nombre: 'La Crucifixión y muerte de Jesús',
        cita: 'Lucas 23, 33-46',
        escena:
          'Jesús es crucificado en el Calvario. Dice: «Padre, perdónalos, porque no saben lo que hacen», promete el paraíso al ladrón arrepentido y muere diciendo: «Padre, en tus manos encomiendo mi espíritu».',
        meditacion:
          'Desde la cruz, Jesús perdona y promete el cielo. Nunca es tarde para volver a Dios. ¿A quién necesitas perdonar? ¿Qué necesitas dejar hoy en manos del Padre?',
        pide: 'La gracia de perdonar y de confiar en Dios hasta el final.',
        imagen: img('/rosario/dolorosos-5.jpg', 'Cristo crucificado, pintura de Diego Velázquez', 'Diego Velázquez, h. 1632'),
      },
    ],
  },
  gloriosos: {
    titulo: 'Misterios gloriosos',
    dias: 'miércoles y domingo',
    misterios: [
      {
        nombre: 'La Resurrección del Señor',
        cita: 'Mateo 28, 1-10',
        escena:
          'Al amanecer, María Magdalena y la otra María van al sepulcro. Un ángel les anuncia que Jesús ha resucitado, y Jesús mismo les sale al encuentro y les dice: «No tengan miedo».',
        meditacion:
          'La tumba vacía lo cambia todo: la muerte no tiene la última palabra. ¿Qué miedo necesitas entregarle hoy a Jesús resucitado? Él te dice lo mismo que a las mujeres: «No tengas miedo».',
        pide: 'Fe firme en Jesús resucitado.',
        imagen: img('/rosario/gloriosos-1.jpg', 'La Resurrección, pintura de Carl Bloch', 'Carl Bloch, 1881'),
      },
      {
        nombre: 'La Ascensión de Jesús al cielo',
        cita: 'Hechos 1, 6-11',
        escena:
          'Jesús promete a los apóstoles que recibirán el Espíritu Santo y serán sus testigos. Después es elevado al cielo ante sus ojos, y dos hombres vestidos de blanco les dicen que volverá.',
        meditacion:
          'Jesús sube al cielo, pero no abandona a los suyos: nos deja una misión. ¿De qué puedes ser testigo hoy, con una palabra o con tu ejemplo? Mira hacia el cielo, pero sigue con los pies en la tierra.',
        pide: 'Esperanza y deseo del cielo.',
        imagen: img('/rosario/gloriosos-2.jpg', 'La Ascensión, pintura de Giotto', 'Giotto, h. 1305'),
      },
      {
        nombre: 'La Venida del Espíritu Santo',
        cita: 'Hechos 2, 1-13',
        escena:
          'El día de Pentecostés, los discípulos están reunidos. Se oye un viento fuerte, aparecen lenguas como de fuego sobre cada uno, quedan llenos del Espíritu Santo y empiezan a hablar de modo que cada persona los entiende en su propio idioma.',
        meditacion:
          'El Espíritu Santo convierte el miedo en valentía. Los discípulos estaban encerrados, y salieron a anunciar a Jesús. Pídele hoy el don que más necesitas: paz, valor, sabiduría, alegría.',
        pide: 'Amor a Dios y los dones del Espíritu Santo.',
        imagen: img('/rosario/gloriosos-3.jpg', 'Pentecostés, pintura de El Greco', 'El Greco, h. 1600'),
      },
      {
        nombre: 'La Asunción de María al cielo',
        cita: 'Apocalipsis 12, 1',
        escena:
          'La Iglesia cree que María, al terminar su vida en la tierra, fue llevada en cuerpo y alma a la gloria del cielo, verdad que el papa Pío XII proclamó en 1950. La imagen de la «mujer vestida del sol» del Apocalipsis suele leerse como signo de esa gloria.',
        meditacion:
          'María ya vive lo que Dios prepara para todos: estar con Él para siempre. ¿Vives con la esperanza del cielo o solo con las prisas de la tierra? Pídele que te acompañe hoy y en tu último día.',
        pide: 'Esperanza del cielo y una buena muerte.',
        imagen: img('/rosario/gloriosos-4.jpg', 'La Asunción de la Virgen, pintura de Tiziano', 'Tiziano, 1516-1518'),
      },
      {
        nombre: 'La Coronación de María como Reina',
        cita: 'Apocalipsis 12, 1',
        escena:
          'La Iglesia honra a María como Reina del cielo y de la tierra. El Apocalipsis habla de una mujer con una corona de doce estrellas, imagen que la tradición aplica a María.',
        meditacion:
          'Una reina que es también madre: puedes pedirle cualquier cosa con confianza. ¿Qué situación, persona o preocupación quieres encomendarle hoy? Ponla en sus manos antes de terminar el rosario.',
        pide: 'Confianza en la intercesión de María.',
        imagen: img('/rosario/gloriosos-5.jpg', 'La Coronación de la Virgen, pintura de Diego Velázquez', 'Diego Velázquez, h. 1635'),
      },
    ],
  },
  luminosos: {
    titulo: 'Misterios luminosos',
    dias: 'jueves',
    misterios: [
      {
        nombre: 'El Bautismo de Jesús en el Jordán',
        cita: 'Mateo 3, 13-17',
        escena:
          'Jesús es bautizado por Juan en el Jordán. Se abre el cielo, el Espíritu desciende como una paloma y se oye una voz: «Este es mi Hijo amado, en quien me complazco».',
        meditacion:
          'Desde tu bautismo, también tú eres hija amada de Dios. Él se complace en ti, incluso con tus fallos. ¿Recuerdas hoy quién eres a sus ojos? Da gracias por tu bautismo.',
        pide: 'Gratitud por el bautismo y fidelidad a Dios.',
        imagen: img('/rosario/luminosos-1.jpg', 'El Bautismo de Cristo, pintura de Piero della Francesca', 'Piero della Francesca, h. 1450'),
      },
      {
        nombre: 'Las Bodas de Caná',
        cita: 'Juan 2, 1-12',
        escena:
          'En una boda en Caná se acaba el vino. María se lo hace notar a Jesús y dice a los sirvientes: «Hagan lo que Él les diga». Jesús convierte el agua en vino, su primer signo.',
        meditacion:
          'María se da cuenta de lo que falta y se lo lleva a Jesús. ¿Qué «vino» falta hoy en tu vida o en tu familia: alegría, paz, unión? Preséntaselo a María, y haz lo que Jesús te diga.',
        pide: 'Confianza en la intercesión de María.',
        imagen: img('/rosario/luminosos-2.jpg', 'Las Bodas de Caná, pintura de Giotto', 'Giotto, h. 1305'),
      },
      {
        nombre: 'El Anuncio del Reino de Dios',
        cita: 'Marcos 1, 14-15',
        escena:
          'Jesús comienza a predicar en Galilea: «El tiempo se ha cumplido, el Reino de Dios está cerca: conviértanse y crean en el Evangelio».',
        meditacion:
          'Convertirse es volver a empezar, cada día, sin cansarse. ¿Qué paso pequeño de conversión puedes dar hoy: una palabra que no dirás, una oración que sí harás, una reconciliación pendiente?',
        pide: 'Conversión del corazón.',
        imagen: img('/rosario/luminosos-3.jpg', 'El Sermón de la Montaña, pintura de Carl Bloch', 'Carl Bloch, 1877'),
      },
      {
        nombre: 'La Transfiguración del Señor',
        cita: 'Lucas 9, 28-36',
        escena:
          'Jesús sube a un monte con Pedro, Santiago y Juan. Su rostro cambia, su ropa resplandece, aparecen Moisés y Elías, y una voz dice: «Este es mi Hijo, el escogido; escúchenlo».',
        meditacion:
          'Pedro quería quedarse en el monte, pero había que bajar. Los momentos de luz con Dios nos dan fuerza para el día a día. ¿Escuchas a Jesús o solo hablas tú cuando rezas?',
        pide: 'Deseo de santidad y de escuchar a Jesús.',
        imagen: img('/rosario/luminosos-4.jpg', 'La Transfiguración, pintura de Rafael', 'Rafael, 1516-1520'),
      },
      {
        nombre: 'La Institución de la Eucaristía',
        cita: 'Lucas 22, 14-20',
        escena:
          'En la última cena, Jesús toma el pan y dice: «Esto es mi cuerpo, que se entrega por ustedes». Luego toma la copa: «Esta copa es la Nueva Alianza en mi sangre».',
        meditacion:
          'Jesús se queda con nosotros en la Eucaristía. Carlo Acutis la llamaba su «autopista al cielo». ¿Con qué actitud te acercas a ella: por costumbre, con prisa o con amor? Pídele hambre de Jesús.',
        pide: 'Amor a Jesús en la Eucaristía.',
        imagen: img('/rosario/luminosos-5.jpg', 'La Última Cena, pintura de Juan de Juanes', 'Juan de Juanes, h. 1562'),
      },
    ],
  },
};

export function conjuntoDeHoy(d: Date = new Date()): ConjuntoId {
  const porDia: ConjuntoId[] = ['gloriosos', 'gozosos', 'dolorosos', 'gloriosos', 'luminosos', 'dolorosos', 'gozosos'];
  return porDia[d.getDay()];
}
