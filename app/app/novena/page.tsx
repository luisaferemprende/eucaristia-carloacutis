// PANTALLA SECUNDARIA — Novena. Server Component: trae la novena activa con sus
// 9 días, las novenas ya completadas (tarjetas-premio) y el catálogo real.

import { createClient } from '@/lib/supabase/server';
import { NovenaCliente } from '@/components/app/novena-cliente';
import type { DiaNovena, NovenaActiva, NovenaCompletada, NovenaDisponible, SantoNovena } from '@/lib/novena';

interface FilaNovena {
  id: string;
  nombre: string;
  santo_nombre: string;
  dias_total: number;
  por_que: string | null;
  santo_datos: string[] | null;
  imagen_url: string | null;
  imagen_alt: string | null;
  imagen_credito: string | null;
  frase_tarjeta: string | null;
  nombre_tarjeta: string | null;
}

const COLUMNAS_NOVENA =
  'id, nombre, santo_nombre, dias_total, por_que, santo_datos, imagen_url, imagen_alt, imagen_credito, frase_tarjeta, nombre_tarjeta';

const aSanto = (n: FilaNovena): SantoNovena => ({
  nombre: n.nombre_tarjeta ?? n.santo_nombre,
  imagenUrl: n.imagen_url,
  imagenAlt: n.imagen_alt,
  imagenCredito: n.imagen_credito,
  frase: n.frase_tarjeta,
});

export default async function Novena() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const [{ data: activaFila }, { data: completadasFilas }, { data: perfil }, { data: catalogo }, { data: conDias }] =
    await Promise.all([
      supabase
        .from('novena_participation')
        .select(`dia_actual, dias_hechos, ultimo_dia_marcado, novena_id, novenas(${COLUMNAS_NOVENA})`)
        .eq('user_id', userId)
        .eq('completada', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('novena_participation')
        .select(`id, completada_en, novenas(${COLUMNAS_NOVENA})`)
        .eq('user_id', userId)
        .eq('completada', true)
        .order('completada_en', { ascending: false }),
      supabase.from('profiles').select('nombre').eq('id', userId).single(),
      supabase.from('novenas').select('id, nombre, dias_total'),
      supabase.from('novena_dias').select('novena_id'),
    ]);

  const completadas: NovenaCompletada[] = (completadasFilas ?? []).map((f) => {
    const n = f.novenas as unknown as FilaNovena;
    return { id: f.id as string, nombre: n.nombre, santo: aSanto(n), diasTotal: n.dias_total, fecha: f.completada_en as string | null };
  });

  let activa: NovenaActiva | null = null;
  if (activaFila) {
    const n = activaFila.novenas as unknown as FilaNovena;
    const { data: dias } = await supabase
      .from('novena_dias')
      .select('dia, titulo, entrada, reflexion, oracion, proposito')
      .eq('novena_id', activaFila.novena_id)
      .order('dia');
    activa = {
      nombre: n.nombre,
      santo: aSanto(n),
      diaActual: activaFila.dia_actual as number,
      diasHechos: activaFila.dias_hechos as number,
      diasTotal: n.dias_total,
      ultimoDiaMarcado: activaFila.ultimo_dia_marcado as string | null,
      porQue: n.por_que,
      datos: n.santo_datos ?? [],
      dias: (dias ?? []) as DiaNovena[],
    };
  }

  const idsConContenido = new Set((conDias ?? []).map((d) => d.novena_id as string));
  const disponibles: NovenaDisponible[] = (catalogo ?? []).map((n) => ({
    id: n.id as string,
    nombre: n.nombre as string,
    diasTotal: n.dias_total as number,
    conContenido: idsConContenido.has(n.id as string),
  }));

  return (
    <NovenaCliente
      nombrePersona={perfil?.nombre ?? 'Peregrino'}
      activa={activa}
      completadas={completadas}
      disponibles={disponibles}
    />
  );
}
