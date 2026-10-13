import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContenidoDiario {
  santo_nombre: string;
  pensamiento: string;
  pregunta_dia: string | null;
  milagro_lugar: string;
  milagro_epoca: string | null;
  milagro_resumen: string;
  milagro_historia: string | null;
  milagro_contexto: string | null;
  milagro_hecho: string | null;
  milagro_iglesia: string | null;
  milagro_fuente: string | null;
  milagro_lat: number | null;
  milagro_lng: number | null;
  preparacion: string | null;
  santo_imagen_url: string | null;
  santo_imagen_alt: string | null;
  santo_imagen_credito: string | null;
}

const COLUMNAS =
  'santo_nombre, pensamiento, pregunta_dia, milagro_lugar, milagro_epoca, milagro_resumen, milagro_historia, milagro_contexto, milagro_hecho, milagro_iglesia, milagro_fuente, milagro_lat, milagro_lng, preparacion, santo_imagen_url, santo_imagen_alt, santo_imagen_credito';

// El contenido de hoy: rota entre TODO lo que ya está escrito, un día distinto
// cada vez, según el día del año — así nunca se repite el mismo pensamiento ni
// el mismo milagro dos días seguidos (mientras la biblioteca crece hacia los
// ~365 días, ver ESTADO.md). Cuando se escriba un día más, esta función ya lo
// incluye solo con sembrarlo en `daily_content` — no hay que tocar código.
export async function cargarContenidoDeHoy(supabase: SupabaseClient): Promise<ContenidoDiario | null> {
  const { data } = await supabase.from('daily_content').select(COLUMNAS).order('fecha', { ascending: true });
  const filas = (data ?? []) as ContenidoDiario[];
  if (filas.length === 0) return null;
  const inicioDeAño = Date.UTC(new Date().getUTCFullYear(), 0, 0);
  const diaDelAño = Math.floor((Date.now() - inicioDeAño) / 86_400_000);
  return filas[diaDelAño % filas.length];
}

// Fecha LOCAL de la persona (YYYY-MM-DD): el servidor corre en UTC y de noche
// en LATAM su "hoy" ya es mañana.
export function fechaLocalISO(d: Date = new Date()): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
