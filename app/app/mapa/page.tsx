// EL MAPA SACRO — Server Component: trae todos los milagros reales ya
// escritos (hoy, uno solo; crece con el tiempo). Nunca se rellena con filas
// inventadas para que "se vea lleno".

import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { cargarTodosLosMilagros } from '@/lib/milagros';
import { MapaSacroCliente } from '@/components/app/mapa-sacro-cliente';

export default async function Mapa() {
  const supabase = await createClient();
  const milagros = await cargarTodosLosMilagros(supabase);
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <MapaSacroCliente milagros={milagros} />
    </Suspense>
  );
}
