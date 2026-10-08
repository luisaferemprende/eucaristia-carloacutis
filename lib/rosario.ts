// Los 20 misterios del Santo Rosario: nombres y citas bíblicas son la
// estructura tradicional de la Iglesia. Las meditaciones se escriben de a una
// y SOLO se publican con fuente verificada y revisión doctrinal (ESTADO.md):
// un misterio sin `meditacion` muestra "próximamente", nunca texto inventado.

export type ConjuntoId = 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';

export interface Misterio {
  nombre: string;
  cita: string;
  meditacion?: string;
  santo?: string;
  /** Solo con licencia verificada (dominio público/Commons) y crédito de autor. */
  imagen?: { src: string; alt: string; credito: string };
}

export interface Conjunto {
  titulo: string;
  dias: string;
  misterios: Misterio[];
}

export const CONJUNTOS: Record<ConjuntoId, Conjunto> = {
  gozosos: {
    titulo: 'Misterios gozosos',
    dias: 'lunes y sábado',
    misterios: [
      {
        nombre: 'La Anunciación del Ángel a María',
        cita: 'Lucas 1, 26-38',
        meditacion:
          'María no lo entiende todo, pero dice «sí». Dios no le pidió entenderlo todo: le pidió confiar. Antes de empezar tu rosario, ofrécele eso que no entiendes de tu vida y repite con ella: «hágase».',
        santo: 'Carlo Acutis rezaba el rosario todos los días.',
      },
      { nombre: 'La Visitación de María a Isabel', cita: 'Lucas 1, 39-56' },
      { nombre: 'El Nacimiento de Jesús en Belén', cita: 'Lucas 2, 1-20' },
      { nombre: 'La Presentación del Niño Jesús en el Templo', cita: 'Lucas 2, 22-38' },
      { nombre: 'El Niño Jesús perdido y hallado en el Templo', cita: 'Lucas 2, 41-52' },
    ],
  },
  dolorosos: {
    titulo: 'Misterios dolorosos',
    dias: 'martes y viernes',
    misterios: [
      { nombre: 'La Agonía de Jesús en el Huerto', cita: 'Mateo 26, 36-46' },
      { nombre: 'La Flagelación del Señor', cita: 'Juan 19, 1' },
      { nombre: 'La Coronación de espinas', cita: 'Mateo 27, 27-31' },
      { nombre: 'Jesús con la cruz a cuestas', cita: 'Juan 19, 17' },
      { nombre: 'La Crucifixión y muerte de Jesús', cita: 'Lucas 23, 33-46' },
    ],
  },
  gloriosos: {
    titulo: 'Misterios gloriosos',
    dias: 'miércoles y domingo',
    misterios: [
      { nombre: 'La Resurrección del Señor', cita: 'Mateo 28, 1-10' },
      { nombre: 'La Ascensión de Jesús al cielo', cita: 'Hechos 1, 6-11' },
      { nombre: 'La Venida del Espíritu Santo', cita: 'Hechos 2, 1-13' },
      { nombre: 'La Asunción de María al cielo', cita: 'Apocalipsis 12, 1' },
      { nombre: 'La Coronación de María como Reina', cita: 'Apocalipsis 12, 1' },
    ],
  },
  luminosos: {
    titulo: 'Misterios luminosos',
    dias: 'jueves',
    misterios: [
      { nombre: 'El Bautismo de Jesús en el Jordán', cita: 'Mateo 3, 13-17' },
      { nombre: 'Las Bodas de Caná', cita: 'Juan 2, 1-12' },
      { nombre: 'El Anuncio del Reino de Dios', cita: 'Marcos 1, 14-15' },
      { nombre: 'La Transfiguración del Señor', cita: 'Lucas 9, 28-36' },
      { nombre: 'La Institución de la Eucaristía', cita: 'Lucas 22, 14-20' },
    ],
  },
};

export function conjuntoDeHoy(d: Date = new Date()): ConjuntoId {
  const porDia: ConjuntoId[] = ['gloriosos', 'gozosos', 'dolorosos', 'gloriosos', 'luminosos', 'dolorosos', 'gozosos'];
  return porDia[d.getDay()];
}
