// PANTALLA SECUNDARIA — Novena. Server Component: trae la participación
// activa del usuario o, si no tiene ninguna, el catálogo real para elegir.

import { createClient } from '@/lib/supabase/server';
import { NovenaCliente } from '@/components/app/novena-cliente';

export default async function Novena() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const { data: participacion } = await supabase
    .from('novena_participation')
    .select('dia_actual, novenas(nombre, dias_total)')
    .eq('user_id', userId)
    .eq('completada', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (participacion) {
    const novenaInfo = participacion.novenas as unknown as { nombre: string; dias_total: number };
    return (
      <NovenaCliente
        activa={{ nombre: novenaInfo.nombre, diaActual: participacion.dia_actual, diasTotal: novenaInfo.dias_total }}
        disponibles={[]}
      />
    );
  }

  const { data: novenas } = await supabase.from('novenas').select('id, nombre, dias_total');
  return (
    <NovenaCliente
      activa={null}
      disponibles={(novenas ?? []).map((n) => ({ id: n.id, nombre: n.nombre, diasTotal: n.dias_total }))}
    />
  );
}
