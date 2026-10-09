// MILAGRO EUCARÍSTICO DE HOY — historia completa. Server Component: lee el
// contenido del día; la presentación animada vive en el componente cliente.

import { createClient } from '@/lib/supabase/server';
import { cargarContenidoDeHoy } from '@/lib/contenido-hoy';
import { MilagroCliente } from '@/components/app/milagro-cliente';

export default async function Milagro() {
  const supabase = await createClient();
  const contenido = await cargarContenidoDeHoy(supabase);
  return <MilagroCliente contenido={contenido} />;
}
