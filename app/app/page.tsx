// PANTALLA PRINCIPAL (M0) — Server Component: carga el perfil, el contenido
// de hoy, la novena activa y la última entrada del diario REALES de Supabase,
// y le pasa todo al componente cliente que solo maneja la interacción.

import { createClient } from '@/lib/supabase/server';
import { HoyCliente } from '@/components/app/hoy-cliente';
import { SincronizarOnboarding } from '@/components/app/sincronizar-onboarding';

// Contenido de respaldo honesto: la biblioteca de ~365 días todavía no está
// completa (pendiente en ESTADO.md) — si no hay fila sembrada para hoy, se
// usa el único día ya verificado en vez de romper la pantalla.
const CONTENIDO_RESPALDO = {
  santo_nombre: 'Carlo Acutis',
  pensamiento: 'La Eucaristía es mi autopista al cielo.',
  milagro_lugar: 'Lanciano, Italia',
  milagro_resumen: 'El pan y el vino consagrados en el siglo VIII que aún hoy se conservan.',
};

export default async function Hoy() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id; // garantizado por app/app/layout.tsx

  const hoy = new Date().toISOString().slice(0, 10);

  const [{ data: perfil }, { data: contenidoHoy }, { data: progresoHoy }, { data: participacion }, { data: ultimaEntrada }] =
    await Promise.all([
      supabase.from('profiles').select('nombre, racha_actual, santo_preferido').eq('id', userId).single(),
      supabase.from('daily_content').select('*').eq('fecha', hoy).limit(1).maybeSingle(),
      supabase.from('user_progress').select('fecha').eq('user_id', userId).eq('fecha', hoy).maybeSingle(),
      supabase
        .from('novena_participation')
        .select('dia_actual, novenas(nombre, dias_total)')
        .eq('user_id', userId)
        .eq('completada', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('diary_entries').select('texto').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ]);

  const contenido = contenidoHoy ?? CONTENIDO_RESPALDO;
  const novenaInfo = participacion?.novenas as unknown as { nombre: string; dias_total: number } | null;

  return (
    <>
      <SincronizarOnboarding tieneNovenaActiva={!!participacion} />
      <HoyCliente
        nombre={perfil?.nombre ?? 'Peregrino'}
        racha={perfil?.racha_actual ?? 0}
        hechoHoy={!!progresoHoy}
        santoNombre={contenido.santo_nombre}
        pensamiento={contenido.pensamiento}
        milagroLugar={contenido.milagro_lugar}
        milagroResumen={contenido.milagro_resumen}
        novena={
          participacion && novenaInfo
            ? { nombre: novenaInfo.nombre, diaActual: participacion.dia_actual, diasTotal: novenaInfo.dias_total }
            : null
        }
        ultimaEntradaDiario={ultimaEntrada?.texto ?? null}
      />
    </>
  );
}
