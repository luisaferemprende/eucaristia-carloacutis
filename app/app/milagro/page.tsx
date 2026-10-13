// MILAGRO EUCARÍSTICO DE HOY — historia completa. Server Component: lee el
// contenido del día; la presentación animada vive en el componente cliente.

import { createClient } from '@/lib/supabase/server';
import { cargarContenidoDeHoy } from '@/lib/contenido-hoy';
import { MilagroCliente } from '@/components/app/milagro-cliente';

export default async function Milagro() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const contenido = await cargarContenidoDeHoy(supabase);

  let guardado = false;
  if (contenido && userData.user) {
    const { data } = await supabase
      .from('reflexiones_guardadas')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('milagro_lugar', contenido.milagro_lugar)
      .maybeSingle();
    guardado = !!data;
  }

  return <MilagroCliente contenido={contenido} guardadoInicial={guardado} />;
}
