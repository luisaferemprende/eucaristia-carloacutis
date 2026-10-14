// Catálogo de jaculatorias y oraciones breves para el minuto antes de
// comulgar (Paso 3 de "Vivir mis 3 minutos"). Rota por día del año — mismo
// mecanismo que el pensamiento y el milagro de hoy (lib/contenido-hoy.ts) —
// pero esta lista vive aquí, estática, porque es contenido fijo y corto que
// no necesita administrarse desde la base de datos (igual que lib/rosario.ts).

export interface Preparacion {
  texto: string;
  autor: string;
}

const PREPARACIONES: Preparacion[] = [
  {
    texto: 'Señor, no soy digno de que entres en mi casa, pero una palabra tuya bastará para sanarme.',
    autor: 'Oración de la Santa Misa',
  },
  {
    texto: 'Creo, Jesús mío, que estás realmente presente en esta Hostia, con tu Cuerpo, tu Sangre, tu Alma y tu Divinidad.',
    autor: 'Acto de Fe',
  },
  {
    texto: 'Reconozco, Señor, que soy polvo y ceniza ante ti; y aun así me invitas a tu mesa.',
    autor: 'Acto de Humildad',
  },
  {
    texto: 'Te adoro con devoción, Dios escondido de verdad, que bajo estas especies te ocultas en el altar.',
    autor: 'Santo Tomás de Aquino',
  },
  {
    texto: 'Recibid lo que sois, el Cuerpo de Cristo; sed lo que recibís, el Cuerpo de Cristo.',
    autor: 'San Agustín',
  },
  {
    texto: 'Jesús mío, te amo sobre todas las cosas, y deseo recibirte con todo el amor de que es capaz mi corazón.',
    autor: 'Acto de Amor',
  },
  {
    texto: 'Sería más fácil para el mundo vivir sin el sol que sin la Santa Misa.',
    autor: 'San Pío de Pietrelcina',
  },
  {
    texto: 'Espero en ti, Jesús sacramentado, que esta comunión me acerque cada día más a tu amor.',
    autor: 'Acto de Esperanza',
  },
  {
    texto: 'Que tu Cuerpo, Señor, que voy a recibir, sea para mí camino y vida, y no motivo de condena.',
    autor: 'Oración tradicional antes de comulgar',
  },
  {
    texto: 'Sin la Eucaristía diaria yo no podría seguir ni un día, ni una hora, en mi vida.',
    autor: 'Santa Teresa de Calcuta',
  },
];

// Siempre devuelve algo real (nunca vacío) — se usa como valor inicial antes
// de conocer la fecha local del dispositivo.
export const PREPARACION_POR_DEFECTO: Preparacion = PREPARACIONES[0];

export function preparacionDeHoy(d: Date = new Date()): Preparacion {
  const inicioDeAño = new Date(d.getFullYear(), 0, 0);
  const diaDelAño = Math.floor((d.getTime() - inicioDeAño.getTime()) / 86_400_000);
  return PREPARACIONES[diaDelAño % PREPARACIONES.length];
}
