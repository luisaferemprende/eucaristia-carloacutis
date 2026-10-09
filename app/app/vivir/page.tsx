// "VIVIR MIS 3 MINUTOS" — Server Component: trae el contenido del día, la racha
// y los últimos días hechos; la experiencia guiada vive en el componente cliente.

import { createClient } from '@/lib/supabase/server';
import { cargarContenidoDeHoy } from '@/lib/contenido-hoy';
import { VivirCliente } from '@/components/app/vivir-cliente';

export default async function Vivir() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id; // garantizado por app/app/layout.tsx

  const [contenido, { data: perfil }, { data: progreso }] = await Promise.all([
    cargarContenidoDeHoy(supabase),
    supabase.from('profiles').select('racha_actual').eq('id', userId).single(),
    supabase.from('user_progress').select('fecha').eq('user_id', userId).order('fecha', { ascending: false }).limit(3),
  ]);

  return (
    <VivirCliente
      contenido={contenido}
      rachaActual={perfil?.racha_actual ?? 0}
      fechasHechas={(progreso ?? []).map((p) => p.fecha as string)}
    />
  );
}
