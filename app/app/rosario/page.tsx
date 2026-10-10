// SANTO ROSARIO — Server Component: trae los días reales rezados (Corona de
// Rosas) de los últimos 7 días; el guiado misterio-por-misterio es del cliente.

import { createClient } from '@/lib/supabase/server';
import { RosarioCliente } from '@/components/app/rosario-cliente';

export default async function Rosario() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const desde = new Date();
  desde.setDate(desde.getDate() - 6);
  const { data: dias } = await supabase
    .from('rosario_dias')
    .select('fecha')
    .eq('user_id', userId)
    .gte('fecha', desde.toISOString().slice(0, 10));

  return <RosarioCliente diasRezados={(dias ?? []).map((d) => d.fecha as string)} />;
}
