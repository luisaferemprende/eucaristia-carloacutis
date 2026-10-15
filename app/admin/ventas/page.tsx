// VENTAS Y NEGOCIO — hoy casi todo dice "Sin datos" a propósito: Hotmart
// todavía no está conectado (ver ESTADO.md). Lo que SÍ se puede calcular ya
// (si hay filas reales) usa el precio real de la app ($3.99/mes · $29.99/año).

import { requireAdminPage } from '@/lib/admin-guard';
import { TarjetaMetrica, TituloSeccion } from '@/components/admin/ui';
import { agregarGastoAdquisicion } from './acciones';

const PRECIO: Record<string, number> = { mensual: 3.99, anual: 29.99 / 12 };

export default async function AdminVentas() {
  const { supabase } = await requireAdminPage();

  const [{ data: suscripciones }, { data: gastos }] = await Promise.all([
    supabase.from('subscriptions').select('plan, estado, created_at').order('created_at', { ascending: false }),
    supabase.from('acquisition_spend').select('*').order('period_start', { ascending: false }),
  ]);

  const activas = (suscripciones ?? []).filter((s) => s.estado === 'activa' || s.estado === 'trial');
  const mrr = activas.reduce((suma, s) => suma + (PRECIO[s.plan as string] ?? 0), 0);
  const canceladas = (suscripciones ?? []).filter((s) => s.estado === 'cancelada').length;
  const hayVentas = (suscripciones ?? []).length > 0;

  return (
    <div>
      <TituloSeccion subtitulo="Lo que entra, lo que sale, y lo que de verdad te queda.">Ventas y negocio</TituloSeccion>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <TarjetaMetrica
          titulo="MRR (ingreso mensual)"
          valor={`$${mrr.toFixed(2)}`}
          sinDatos={!hayVentas}
          insight="Suma de planes activos/en prueba al precio real de hoy."
        />
        <TarjetaMetrica titulo="Suscripciones activas" valor={String(activas.length)} sinDatos={!hayVentas} />
        <TarjetaMetrica titulo="Cancelaciones" valor={String(canceladas)} sinDatos={!hayVentas} />
        <TarjetaMetrica
          titulo="Ganancia real del mes"
          valor="—"
          sinDatos
          insight="Necesita Hotmart conectado (comisión real, impuestos, infra) — no se muestra un número sin conciliar."
        />
      </div>

      <div className="mb-8 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-5">
        <p className="text-[14px] font-semibold text-[var(--text-primary)]">LTV, CAC y canal de venta</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
          Sin datos todavía. Estos números necesitan Hotmart conectado y varias semanas de ventas reales de distintos
          canales — antes de eso, mostrar un número aquí sería un gráfico vacío disfrazado de dato real.
        </p>
      </div>

      <div>
        <p className="mb-3 text-[16px] font-semibold text-[var(--text-primary)]">Gasto de adquisición (lo llenas tú)</p>
        <p className="mb-4 text-[13px] text-[var(--text-secondary)]">
          Hotmart no sabe cuánto gastas en ads o afiliados — anótalo aquí para que, cuando ya haya ventas, el panel
          pueda calcular si cada canal te deja ganancia o te la quita.
        </p>
        <form action={agregarGastoAdquisicion} className="mb-4 grid grid-cols-2 gap-3 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] p-4 lg:grid-cols-5">
          <input name="channel" placeholder="Canal (ej. meta_ads)" required className="h-10 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--bg)] px-3 text-[13px]" />
          <input name="amount" type="number" step="0.01" placeholder="Monto" required className="h-10 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--bg)] px-3 text-[13px]" />
          <input name="currency" defaultValue="USD" maxLength={3} className="h-10 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--bg)] px-3 text-[13px] uppercase" />
          <input name="period_start" type="date" required className="h-10 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--bg)] px-3 text-[13px]" />
          <input name="period_end" type="date" required className="h-10 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--bg)] px-3 text-[13px]" />
          <button type="submit" className="col-span-2 h-10 rounded-[var(--radius-button)] bg-[var(--accent)] text-[13px] font-semibold text-[var(--on-accent-fill)] lg:col-span-5">
            Agregar gasto
          </button>
        </form>

        {gastos && gastos.length > 0 ? (
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)]">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                  <th className="px-4 py-2.5">Canal</th>
                  <th className="px-4 py-2.5">Monto</th>
                  <th className="px-4 py-2.5">Período</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((g) => (
                  <tr key={g.id as string} className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] last:border-0">
                    <td className="px-4 py-2.5">{g.channel as string}</td>
                    <td className="px-4 py-2.5">
                      {g.currency as string} {Number(g.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--text-secondary)]">
                      {g.period_start as string} → {g.period_end as string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-[13px] text-[var(--text-tertiary)]">Todavía no anotaste ningún gasto.</p>
        )}
      </div>
    </div>
  );
}
