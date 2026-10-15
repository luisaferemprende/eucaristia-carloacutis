'use client';

// Barras de sesiones por día (17-VISUALIZACION-DATOS): sin grid, sin 3D, color
// con significado único (acento), insight en vez de solo números crudos.

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export function GraficoActividad({ datos }: { datos: { fecha: string; sesiones: number }[] }) {
  const total = datos.reduce((s, d) => s + d.sesiones, 0);

  if (total === 0) {
    return <p className="py-10 text-center text-[13px] text-[var(--text-tertiary)]">Todavía no hay sesiones registradas en estos 14 días.</p>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={datos} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <XAxis
            dataKey="fecha"
            tickFormatter={(f: string) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(new Date(f))}
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <Tooltip
            formatter={(v) => [`${v} ${v === 1 ? 'sesión' : 'sesiones'}`, '']}
            labelFormatter={(f) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' }).format(new Date(String(f)))}
            contentStyle={{ borderRadius: 10, border: 'none', boxShadow: 'var(--shadow-2)', fontSize: 13 }}
          />
          <Bar dataKey="sesiones" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-3 text-[13px] text-[var(--text-secondary)]">{total} sesiones en los últimos 14 días.</p>
    </div>
  );
}
