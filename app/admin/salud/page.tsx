// SALUD — errores reales capturados por los Error Boundaries de la app,
// agrupados por frecuencia (los que más se repiten, primero = los que más urgen).

import { requireAdminPage } from '@/lib/admin-guard';
import { TarjetaMetrica, TituloSeccion } from '@/components/admin/ui';

function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export default async function AdminSalud() {
  const { supabase } = await requireAdminPage();

  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);

  const { data: errores } = await supabase
    .from('error_log')
    .select('message, context, created_at')
    .gte('created_at', hace7Dias.toISOString())
    .order('created_at', { ascending: false })
    .limit(200);

  const agrupados = new Map<string, { mensaje: string; contexto: string | null; veces: number; ultima: string }>();
  (errores ?? []).forEach((e) => {
    const clave = `${e.context ?? '—'}::${e.message}`;
    const fila = agrupados.get(clave);
    if (fila) {
      fila.veces += 1;
      if (e.created_at > fila.ultima) fila.ultima = e.created_at as string;
    } else {
      agrupados.set(clave, { mensaje: e.message as string, contexto: e.context as string | null, veces: 1, ultima: e.created_at as string });
    }
  });
  const ordenados = Array.from(agrupados.values()).sort((a, b) => b.veces - a.veces);

  return (
    <div>
      <TituloSeccion subtitulo="Lo que de verdad falló, en lenguaje simple.">Salud</TituloSeccion>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <TarjetaMetrica
          titulo="Estado general"
          valor={(errores ?? []).length === 0 ? '✅ Todo bien' : `⚠️ ${(errores ?? []).length} errores`}
          insight="Últimos 7 días."
        />
        <TarjetaMetrica titulo="Errores distintos" valor={String(ordenados.length)} insight="Tipos de error diferentes — el que más se repite va primero abajo." />
      </div>

      {ordenados.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] p-6 text-center text-[13px] text-[var(--text-tertiary)]">
          Ningún error registrado en los últimos 7 días.
        </p>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)]">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                <th className="px-4 py-2.5">Veces</th>
                <th className="px-4 py-2.5">Pantalla</th>
                <th className="px-4 py-2.5">Mensaje</th>
                <th className="px-4 py-2.5">Última vez</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((e, i) => (
                <tr key={i} className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">{e.veces}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{e.contexto ?? '—'}</td>
                  <td className="max-w-md truncate px-4 py-2.5 text-[var(--text-primary)]">{e.mensaje}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{fechaCorta(e.ultima)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
