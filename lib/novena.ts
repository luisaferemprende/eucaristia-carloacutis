// Tipos compartidos de la novena (servidor → cliente).

// Oraciones de siempre (texto litúrgico tradicional): cierran cada día de toda novena.
export const ORACIONES_DE_SIEMPRE = [
  {
    nombre: 'Padre Nuestro',
    texto:
      'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
  },
  {
    nombre: 'Ave María',
    texto:
      'Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
  },
  {
    nombre: 'Gloria',
    texto:
      'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
  },
] as const;

export interface DiaNovena {
  dia: number;
  titulo: string;
  entrada: string | null;
  reflexion: string;
  oracion: string;
  proposito: string;
}

export interface SantoNovena {
  nombre: string;
  imagenUrl: string | null;
  imagenAlt: string | null;
  imagenCredito: string | null;
  frase: string | null;
}

export interface NovenaActiva {
  nombre: string;
  santo: SantoNovena;
  diaActual: number;
  diasHechos: number;
  diasTotal: number;
  ultimoDiaMarcado: string | null;
  porQue: string | null;
  datos: string[];
  dias: DiaNovena[];
}

export interface NovenaCompletada {
  id: string;
  nombre: string;
  santo: SantoNovena;
  diasTotal: number;
  fecha: string | null;
}

export interface NovenaDisponible {
  id: string;
  nombre: string;
  diasTotal: number;
  conContenido: boolean;
}

export function fechaLarga(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d));
}
