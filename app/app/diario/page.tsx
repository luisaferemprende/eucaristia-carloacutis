// PANTALLA SECUNDARIA — Diario. Server Component: trae las entradas reales
// del usuario (RLS garantiza que solo ve las suyas).

import { createClient } from '@/lib/supabase/server';
import { DiarioCliente } from '@/components/app/diario-cliente';

export default async function Diario() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const { data: entradas } = await supabase
    .from('diary_entries')
    .select('id, created_at, texto')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (
    <DiarioCliente
      entradas={(entradas ?? []).map((e) => ({ id: e.id, fecha: e.created_at, texto: e.texto }))}
    />
  );
}
