// DATOS SEMILLA — mundo del avatar (32: "la app nunca se enseña vacía").
// Nombres reales, fechas relativas a HOY, contenido doctrinal solo con fuente
// verificada (Carlo Acutis / Lanciano, ya usados en la landing) — el resto de
// la biblioteca de ~365 días queda pendiente de la revisión doctrinal anotada
// en ESTADO.md, no se inventa aquí.

const HOY = new Date();
const diasAtras = (n: number) => {
  const d = new Date(HOY);
  d.setDate(d.getDate() - n);
  return d;
};

export const USUARIO_DEMO = {
  nombre: 'Camila',
  racha: 7,
  mejorRacha: 11,
};

export const CONTENIDO_HOY = {
  santo: {
    nombre: 'Carlo Acutis',
    cita: 'La Eucaristía es mi autopista al cielo.',
  },
  milagro: {
    lugar: 'Lanciano, Italia',
    resumen: 'El pan y el vino consagrados en el siglo VIII que aún hoy se conservan.',
  },
};

export const NOVENA_ACTUAL = {
  nombre: 'Novena a Carlo Acutis',
  diaActual: 5,
  diasTotal: 9,
  dias: Array.from({ length: 9 }, (_, i) => ({
    numero: i + 1,
    estado: i < 4 ? ('hecho' as const) : i === 4 ? ('hoy' as const) : ('pendiente' as const),
  })),
};

export interface EntradaDiario {
  id: string;
  fecha: Date;
  texto: string;
}

export const DIARIO_DEMO: EntradaDiario[] = [
  {
    id: 'd1',
    fecha: diasAtras(0),
    texto: 'Hoy sentí paz de verdad al comulgar, no solo costumbre.',
  },
  {
    id: 'd2',
    fecha: diasAtras(1),
    texto: 'Le pedí a Dios paciencia con los niños. Un día difícil pero lo sostuve.',
  },
  {
    id: 'd3',
    fecha: diasAtras(3),
    texto: 'Milagro de hoy me hizo llorar. Nunca había oído de Lanciano.',
  },
];
