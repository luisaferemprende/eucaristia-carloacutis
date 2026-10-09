import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContenidoDiario {
  santo_nombre: string;
  pensamiento: string;
  pregunta_dia: string | null;
  milagro_lugar: string;
  milagro_resumen: string;
  milagro_historia: string | null;
  milagro_fuente: string | null;
  preparacion: string | null;
  santo_imagen_url: string | null;
  santo_imagen_alt: string | null;
  santo_imagen_credito: string | null;
}

const COLUMNAS =
  'santo_nombre, pensamiento, pregunta_dia, milagro_lugar, milagro_resumen, milagro_historia, milagro_fuente, preparacion, santo_imagen_url, santo_imagen_alt, santo_imagen_credito';

// El contenido de hoy; si todavía no hay uno sembrado para la fecha, el más
// reciente (la biblioteca de ~365 días aún está en construcción — ESTADO.md).
export async function cargarContenidoDeHoy(supabase: SupabaseClient): Promise<ContenidoDiario | null> {
  const hoy = new Date().toISOString().slice(0, 10);
  const { data: delDia } = await supabase.from('daily_content').select(COLUMNAS).eq('fecha', hoy).limit(1).maybeSingle();
  if (delDia) return delDia as ContenidoDiario;
  const { data: reciente } = await supabase
    .from('daily_content')
    .select(COLUMNAS)
    .order('fecha', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (reciente as ContenidoDiario | null) ?? null;
}

// Fecha LOCAL de la persona (YYYY-MM-DD): el servidor corre en UTC y de noche
// en LATAM su "hoy" ya es mañana.
export function fechaLocalISO(d: Date = new Date()): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
