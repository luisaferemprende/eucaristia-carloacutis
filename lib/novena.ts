// Tipos compartidos de la novena (servidor → cliente).

export interface DiaNovena {
  dia: number;
  titulo: string;
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
