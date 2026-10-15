// USO Y RETENCIÓN — activación y actividad reales desde event_log. D1/D7/D30
// necesitan una base de usuarios más grande para significar algo; con pocos
// usuarios el panel lo dice en vez de mostrar un 0% o 100% engañoso.

import { requireAdminPage } from '@/lib/admin-guard';
import { TarjetaMetrica, TituloSeccion } from '@/components/admin/ui';
import { GraficoActividad } from '@/components/admin/grafico-actividad';

const UMBRAL_MINIMO_PARA_RETENCION = 10;

export default async function AdminUso() {
  const { supabase } = await requireAdminPage();

  const hace14Dias = new Date();
  hace14Dias.setDate(hace14Dias.getDate() - 14);

  const [{ count: totalUsuarios }, { data: conAccionCore }, { data: sesiones }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('event_log').select('user_id').eq('type', 'accion_core'),
    supabase.from('event_log').select('created_at').eq('type', 'sesion_iniciada').gte('created_at', hace14Dias.toISOString()),
  ]);

  const usuariosActivados = new Set((conAccionCore ?? []).map((e) => e.user_id)).size;
  const activacionPct = totalUsuarios && totalUsuarios > 0 ? Math.round((usuariosActivados / totalUsuarios) * 100) : null;

  const porDia = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    porDia.set(d.toISOString().slice(0, 10), 0);
  }
  (sesiones ?? []).forEach((s) => {
    const dia = (s.created_at as string).slice(0, 10);
    if (porDia.has(dia)) porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
  });
  const datosGrafico = Array.from(porDia.entries()).map(([fecha, sesiones]) => ({ fecha, sesiones }));

  const hayMuestraSuficiente = (totalUsuarios ?? 0) >= UMBRAL_MINIMO_PARA_RETENCION;

  return (
    <div>
      <TituloSeccion subtitulo="¿La app retiene? Medido, no supuesto.">Uso y retención</TituloSeccion>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <TarjetaMetrica
          titulo="Activación"
          valor={activacionPct !== null ? `${activacionPct}%` : '—'}
          sinDatos={activacionPct === null}
          insight="Usuarios que ya vivieron sus 3 minutos al menos una vez."
        />
        <TarjetaMetrica titulo="Retención D1" valor="—" sinDatos insight={hayMuestraSuficiente ? undefined : `Necesita al menos ${UMBRAL_MINIMO_PARA_RETENCION} usuarios para que el número signifique algo.`} />
        <TarjetaMetrica titulo="Retención D7" valor="—" sinDatos insight={hayMuestraSuficiente ? undefined : `Necesita al menos ${UMBRAL_MINIMO_PARA_RETENCION} usuarios para que el número signifique algo.`} />
      </div>

      <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-5">
        <p className="mb-4 text-[14px] font-semibold text-[var(--text-primary)]">Sesiones de los últimos 14 días</p>
        <GraficoActividad datos={datosGrafico} />
      </div>
    </div>
  );
}
