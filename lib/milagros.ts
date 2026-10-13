import type { SupabaseClient } from '@supabase/supabase-js';

export interface MilagroResumen {
  lugar: string;
  epoca: string | null;
  resumen: string;
  lat: number | null;
  lng: number | null;
  fecha: string;
}

// Todos los milagros ya escritos (con coordenadas o no) — alimenta el Mapa
// Sacro y su vista en lista. Hoy es un solo día real; crece según se escriban
// más (nunca se inventan filas de más para que "se vea lleno").
export async function cargarTodosLosMilagros(supabase: SupabaseClient): Promise<MilagroResumen[]> {
  const { data } = await supabase
    .from('daily_content')
    .select('milagro_lugar, milagro_epoca, milagro_resumen, milagro_lat, milagro_lng, fecha')
    .order('fecha', { ascending: true });
  return (data ?? []).map((d) => ({
    lugar: d.milagro_lugar as string,
    epoca: d.milagro_epoca as string | null,
    resumen: d.milagro_resumen as string,
    lat: d.milagro_lat as number | null,
    lng: d.milagro_lng as number | null,
    fecha: d.fecha as string,
  }));
}
